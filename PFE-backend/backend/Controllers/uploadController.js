const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra'); // npm install fs-extra
const unzipper = require('unzipper');

const Projet = require('../Models/projet');
const { setActiveProjectPath } = require('../utils/projectPathHelper');

// === UPLOAD CONFIG ===
const uploadPath = path.join(__dirname, '../uploads/projects');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${safeName}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 1000 * 1024 * 1024 } });

exports.uploadMiddleware = upload.single('projectZip');

// === HANDLE PROJECT UPLOAD ===
exports.handleUpload = async (req, res) => {
  const file = req.file;
  const userId = req.user?.id || null;
  const username = req.user?.username || "inconnu";

  if (!file) return res.status(400).json({ error: "Fichier non fourni." });

  const projectName = path.parse(file.filename).name;

  // === BACKEND PATH ===
  const userDir = path.join(__dirname, '../uploads', `user_${userId}`);
  const backendProjectDir = path.join(userDir, 'projects');
  const backendExtractDir = path.join(backendProjectDir, projectName);

  // === FRONTEND PATH ===
  const frontendExtractDir = path.join(__dirname, '../../../PFE-frontend/src/importedproject', `user_${userId}`, 'projects', projectName);

  // Create necessary directories
  fs.mkdirSync(backendProjectDir, { recursive: true });
  fs.mkdirSync(frontendExtractDir, { recursive: true });

  try {
    // 1. Extract to backend
    await fs.createReadStream(file.path)
      .pipe(unzipper.Extract({ path: backendExtractDir }))
      .promise();

    // 2. Copy to frontend (excluding unwanted files)
    await fse.copy(backendExtractDir, frontendExtractDir, {
      filter: (src) => {
        const base = path.basename(src).toLowerCase();
        return ![
          'node_modules',
          'package.json',
          'package-lock.json',
          'yarn.lock',
          '.eslintrc',
          '.eslintrc.js',
          '.babelrc',
          'babel.config.js',
          'tsconfig.json',
          'jsconfig.json',
          'README.md',
          'public'
        ].includes(base);
      }
    });

    // 3. Delete zip file
    fs.unlinkSync(file.path);

    // 4. Check if src/pages exists
    const pagesFolder = path.join(backendExtractDir, 'src', 'pages');
    if (!fs.existsSync(pagesFolder)) {
      return res.status(400).json({ error: "Le dossier 'src/pages' est manquant dans le projet." });
    }

    // 5. Save project info in DB
    const createdProject = await Projet.create({
      name: projectName,
      path: backendExtractDir,
      uploadedBy: username,
      userId: userId,
    });

    res.json({ message: "Projet uploadé et copié avec succès. Dossier 'src/pages' détecté." });
  } catch (error) {
    console.error("Erreur traitement projet:", error);
    res.status(500).json({ error: "Erreur lors du traitement du projet." });
  }
};
