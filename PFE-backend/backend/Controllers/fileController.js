const fs = require('fs');
const path = require('path');
const File = require('../Models/file');
const { default: axios } = require('axios');
const Operation = require('../Models/operationModel');
const { getPagesPath, getProjectDetails } = require('../utils/projectPathHelper');
const { updateRoutesFile } = require('../utils/routeUpdater');
const Projet = require('../Models/projet');

//liste les noms des fichiers du dossier pages
exports.listPages = async (req, res) => {
  try {
    const userId = req.user?.id;
    const pagesPath = await getPagesPath(userId);
    console.log(pagesPath);

    if (!pagesPath || !fs.existsSync(pagesPath)) {
      return res.status(404).json({ error: "Dossier pages introuvable" });
    }

    const files = fs.readdirSync(pagesPath);
    const jsFiles = files.filter(f => f.endsWith(".js"));
    res.json(jsFiles.map(f => f.replace(".js", "")));

  } catch (error) {
    console.error("Erreur dans listPages:", error);
    res.status(500).json({ error: "Erreur lecture dossier" });
  }
};

// Nouvelle fonction pour retourner { name, path }
exports.listPagePaths = async (req, res) => {
  try {
    const userId = req.user?.id;
    const pagesPath = await getPagesPath(userId);

    if (!pagesPath || !fs.existsSync(pagesPath)) {
      return res.status(404).json({ error: "Dossier pages introuvable" });
    }

    const files = fs.readdirSync(pagesPath);
    const jsFiles = files.filter(f => f.endsWith(".js"));

    const result = jsFiles.map(file => ({
      name: file.replace('.js', ''),
      path: `${pagesPath}/${file}` // or any format you want to return
    }));

    res.json(result);
  } catch (error) {
    console.error("Erreur dans listPagePaths:", error);
    res.status(500).json({ error: "Erreur lecture dossier" });
  }
};

// Fonction pour écrire dans le frontend à chaque modification
exports.writeToFrontendProject = async (req, res) => {
  let { relativePath, content } = req.body;
  const userId = req.user?.id;

  console.log(" Reçu du frontend :");
  console.log(" userId:", userId);
  console.log(" relativePath (raw):", relativePath);
  console.log(" content (début):", content?.slice(0, 100));

  if (!userId || !relativePath || !content) {
    console.warn(" Champs manquants (userId, relativePath, content)");
    return res.status(400).json({ error: 'Champs manquants (userId, relativePath, content)' });
  }

  try {
    const normalizedPath = relativePath.replace(/\\/g, "/");

    const uploadsIndex = normalizedPath.indexOf("uploads/");
    if (uploadsIndex === -1) {
      return res.status(400).json({ error: "Le chemin ne contient pas 'uploads/'" });
    }

    const pathAfterUploads = normalizedPath.substring(uploadsIndex + "uploads/".length);

    const projectDir = path.dirname(pathAfterUploads);
    const frontendFullPath = path.join(
      __dirname,
      "..", "..", "..",
      "PFE-frontend", "src", "importedproject",
      projectDir,
      "filecontent3.js"
    );

    console.log(" Chemin complet où on va écrire :", frontendFullPath);

    // === 🛠️ Correction des chemins d’assets : import dynamiques
    const assetImportRegex = /src=["']\/assets\/([^"']+)["']/g;
    let assetIndex = 1;
    let importStatements = [];

    content = content.replace(assetImportRegex, (match, assetPath) => {
      const importName = `imageAsset${assetIndex++}`;
      const relativePath = `../assets/${assetPath}`;
      importStatements.push(`import ${importName} from "${relativePath}";`);
      return `src={${importName}}`;
    });

    // Ajouter les imports juste après les imports React
    if (importStatements.length > 0) {
      const importReactRegex = /import .* from .+;\n*/g;
      const match = content.match(importReactRegex);
      const lastImportMatch = match ? match[match.length - 1] : '';
      const lastImportIndex = match ? content.lastIndexOf(lastImportMatch) + lastImportMatch.length : 0;

      const importBlock = importStatements.join("\n") + "\n";
      content = content.slice(0, lastImportIndex) + importBlock + content.slice(lastImportIndex);
    }

    //  Remplacer tous les "/assets/..." restants par "../assets/..."
    content = content.replace(/(["'])\/assets\/([^"']+)["']/g, (match, quote, path) => {
      return `${quote}../assets/${path}${quote}`;
    });

    fs.mkdirSync(path.dirname(frontendFullPath), { recursive: true });
    fs.writeFileSync(frontendFullPath, content, "utf8");
    console.log(" Écriture réussie dans le fichier.");

    //  MISE À JOUR DE AppRoutes.js
    const appRoutesPath = path.join(
      __dirname,
      "..", "..", "..",
      "PFE-frontend", "src", "routes", "AppRoutes.js"
    );

    let appRoutesContent = fs.readFileSync(appRoutesPath, "utf8");

    // === 1. Générer le chemin d'import propre
    const importPathFrom = pathAfterUploads
      .replace(/\\/g, "/")
      .split("frontend/src/")[1] || `importedproject/${projectDir}/filecontent3`;
    const cleanedImportPath = importPathFrom.replace(/\.js$/, "");
    const newImportLine = `import FileContent3 from '../${cleanedImportPath}';\n`;

    // Ajouter l'import seulement s'il n'existe pas déjà
    if (!appRoutesContent.includes(newImportLine.trim())) {
      const importRegex = /import .*? from '.*?';\n/g;
      const importMatches = appRoutesContent.match(importRegex);
      const lastImportIndex = importMatches
        ? appRoutesContent.lastIndexOf(importMatches[importMatches.length - 1]) + importMatches[importMatches.length - 1].length
        : 0;

      appRoutesContent =
        appRoutesContent.slice(0, lastImportIndex) +
        newImportLine +
        appRoutesContent.slice(lastImportIndex);
      console.log(" Ligne d'import ajoutée.");
    } else {
      console.log(" L'import existe déjà, non ajouté.");
    }

    // === 2. Ajouter le <Route> seulement s'il n'existe pas
    const newRouteLine = `\n            <Route path="/filecontent3" element={<FileContent3 />} />`;
    if (!appRoutesContent.includes(`<Route path="/filecontent3"`)) {
      const routesCloseTag = "</Routes>";
      const routesIndex = appRoutesContent.indexOf(routesCloseTag);
      if (routesIndex !== -1) {
        appRoutesContent =
          appRoutesContent.slice(0, routesIndex) +
          newRouteLine +
          "\n" +
          appRoutesContent.slice(routesIndex);
        console.log(" Route ajoutée dans AppRoutes.");
      } else {
        console.warn(" Balise </Routes> non trouvée, insertion impossible.");
      }
    } else {
      console.log(" La route existe déjà, non ajoutée.");
    }

    fs.writeFileSync(appRoutesPath, appRoutesContent, "utf8");
    console.log(" AppRoutes.js mis à jour.");

    return res.json({ message: "Fichier et AppRoutes mis à jour avec succès" });

  } catch (error) {
    console.error(" Erreur lors de l'écriture :", error);
    return res.status(500).json({ error: "Erreur d'écriture dans le frontend" });
  }
};



exports.uploadImage = async (req, res) => {
  try {
    const userId = req.user?.id?.toString();
    const file = req.file;
    const projectName = req.body.projectName;
    const pageName = req.body.pageName;

    if (!userId || !projectName || !pageName || !file) {
      console.log("❌ Champs manquants :", { userId, projectName, pageName, file });
      return res.status(400).json({
        error: "Champs manquants : userId (via token), projectName, pageName ou fichier",
      });
    }

    const userFolderName = `user_${userId}`;
    const fileName = file.originalname;

    const backendPath = path.join(
      __dirname,
      "..",
      "uploads",
      userFolderName,
      "projects",
      projectName,
      "src",
      "assets",
    );

    const frontendPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "PFE-frontend",
      "src",
      "importedproject",
      userFolderName,
      "projects",
      projectName,
      "src",
      "assets",
    );

    fs.mkdirSync(backendPath, { recursive: true });
    fs.mkdirSync(frontendPath, { recursive: true });

    const fileData = fs.readFileSync(file.path);
    fs.writeFileSync(path.join(backendPath, fileName), fileData);
    fs.writeFileSync(path.join(frontendPath, fileName), fileData);
    fs.unlinkSync(file.path);

    // Relative path to return
    const relativePath = `../assets/${fileName}`;

    res.status(200).json({
  path: `"../assets/${fileName}"`,
});


  } catch (err) {
    console.error("❌ Erreur lors de l'enregistrement de l'image :", err);
    res.status(500).json({
      error: "Erreur serveur lors de l'enregistrement de l'image",
    });
  }
};



exports.removeFromFrontendRoutes = async (req, res) => {
  const componentName = "FileContent3";
  const routePath = "/filecontent3";

  try {
    const appRoutesPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "PFE-frontend",
      "src",
      "routes",
      "AppRoutes.js"
    );

    let appRoutesContent = fs.readFileSync(appRoutesPath, "utf8");

    const lines = appRoutesContent.split("\n");

    // Filter out the import and route line
    const updatedLines = lines.filter((line) => {
      const trimmed = line.trim();

      // Remove import line like: import FileContent3 from ...
      if (trimmed.startsWith(`import ${componentName} from`)) return false;

      // Remove route line like: <Route path="/filecontent3" element={<FileContent3 />} />
      if (trimmed === `<Route path="${routePath}" element={<${componentName} />} />`) return false;

      return true;
    });

    // Join back and write to file
    fs.writeFileSync(appRoutesPath, updatedLines.join("\n"), "utf8");

    console.log(" Import et route supprimés avec succès.");
    return res.json({ message: `Import et route de ${componentName} supprimés.` });

  } catch (error) {
    console.error(" Erreur lors de la suppression :", error);
    return res.status(500).json({ error: "Erreur lors de la modification de AppRoutes.js" });
  }
};



//lit le code d'un ficher 
exports.readPage = async (req, res) => {
  const pagesPath = await getPagesPath(req.user.id);
  const filePath = path.join(pagesPath, `${req.params.pageName}.js`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Fichier non trouvé' });

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erreur lecture fichier' });
    res.json({ content: data });
  });
};

exports.updatePage = async (req, res) => {
  const pagesPath = await getPagesPath(req.user.id);
  const filePath = path.join(pagesPath, `${req.params.pageName}.js`);
  const { content } = req.body;

  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Fichier non trouvé' });

  fs.writeFile(filePath, content, (err) => {
    if (err) return res.status(500).json({ error: 'Erreur écriture fichier' });
    res.json({ success: true, message: 'Fichier mis à jour avec succès' });
  });

};

//sauvegarde apres modif
exports.savePageCode = async (req, res) => {
  const { pageName, code } = req.body;
  const userId = req.user?.id || null;
  const userName = req.user?.username || "Inconnu";

  if (!pageName || !code) {
    return res.status(400).json({ error: 'Nom de la page ou code manquant.' });
  }

  //const pagesPath = await getPagesPath(userId);
  const projectDetails = await getProjectDetails(userId);
  if (!projectDetails) {
    return res.status(400).json({ error: 'Aucun projet actif trouvé pour cet utilisateur.' });
  }

  const { projectId, path: projectPath } = projectDetails;
  //const filePath = path.join(pagesPath, `${pageName}.js`);
  const filePath = path.join(projectPath, "src", "pages", `${pageName}.js`);
  fs.writeFile(filePath, code, 'utf8', async (err) => {
    if (err) {
      console.error('Erreur lors de la sauvegarde du fichier:', err);
      return res.status(500).json({ error: 'Erreur lors de la sauvegarde du fichier.' });
    }
    try {
      await Operation.create({
        operationType: 'modification',
        userId: userId,
        username: userName,
        fileName: `${pageName}.js`,
        projectId: projectId,
      });
      return res.json({ message: 'Code mis à jour avec succès et operation enregistré !' });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'opération:', error);
      return res.status(500).json({ error: 'Code mis à jour mais erreur lors de l\'enregistrement de l\'opération.' });
    }
  });
};


//pour la modification
exports.generateCode = async (req, res) => {
  const { prompt } = req.body;
  console.log("Reçu pour génération IA:", { prompt });

  if (!prompt) {
    return res.status(400).json({ error: 'Le prompt est requis.' });
  }
  try {
    // Appeler l'API du modèle pour générer le code à partir du prompt
    const response = await axios.post('https://coder-api.onrender.com/generate', { prompt });

    const generatedCode = response.data.code;

    if (!generatedCode) {
      return res.status(500).json({ error: 'Aucun code généré par l\'IA.' });
    }

    return res.json({ code: generatedCode });
  } catch (err) {
    console.error('Erreur lors de la génération du code:', err);
    return res.status(500).json({ error: 'Erreur lors de la génération du code.' });
  }
};


exports.createFile = async (req, res) => {
  const { pageName, code, projectId } = req.body;
  const userId = req.user?.id;
  console.log("Utilisateur connecté :", userId);
  const userName = req.user?.username || "Inconnu";

  if (!pageName || !code || !projectId) {
    return res.status(400).json({ error: 'pageName et code sont requis' });
  }
  const pageDir = await getPagesPath(userId);
  const filePath = path.join(pageDir, `${pageName}.js`);
  console.log("Chemin final du fichier :", filePath);

  try {
    fs.mkdirSync(pageDir, { recursive: true });
    fs.writeFileSync(filePath, code);

    //l ajout de la route:
    updateRoutesFile(pageName, userId);

    await File.create({
      fileName: `${pageName}.js`,
      route: `/pages/${pageName}`,
      userId: userId,
      username: userName,
      projectId: projectId,

    });

    await Operation.create({
      operationType: 'creation',
      userId: userId,
      username: userName,
      fileName: `${pageName}.js`,
      projectId: projectId,
    });

    res.status(200).json({ message: 'Page créée avec succès.' });
  } catch (err) {
    console.error('Erreur création fichier :', err);
    res.status(500).json({ error: 'Erreur lors de la création de la page.' });
  }
};

exports.listFormattedPages = async (req, res) => {
  try {
    const pagesPath = await getPagesPath(req.user.id);

    const files = fs.readdirSync(pagesPath);

    const jsFiles = files.filter(f => f.endsWith('.js'));

    const formattedFiles = jsFiles.map(f => {
      const fileNameWithoutExt = f.replace('.js', '');
      return {
        name: fileNameWithoutExt.charAt(0).toUpperCase() + fileNameWithoutExt.slice(1),
        route: `/${fileNameWithoutExt.toLowerCase()}`
      };
    });

    res.json(formattedFiles);
  } catch (err) {
    console.error("Erreur listFormattedPages:", err);
    res.status(500).json({ error: "Erreur lecture dossier." });
  }
};



