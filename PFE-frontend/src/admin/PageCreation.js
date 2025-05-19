import React, { useState, useEffect } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import CustomTreeView from "../components/CustomTreeView";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { createPage, fetchPages } from "../services/api";

const PageCreation = () => {
  const [pageData, setPageData] = useState({
    name: "",
    route: "",
    parentId: null,
  });
  const [treeData, setTreeData] = useState([]);
  const navigate = useNavigate();

  // c est une fonc récursive pour rechercher un nœud par son id dans l'arbre
  const findNodeById = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const getParentRoute = () => {
    const parentNode = findNodeById(treeData, pageData.parentId);
    return parentNode ? parentNode.route : "";
  };

  // Construit l'aperçu du chemin (ex : "/routeParent/nom-de-la-page")
  const getRoutePreview = () => {
    const parentRoute = getParentRoute();
    const formattedRoute = pageData.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return parentRoute
      ? `/${parentRoute}/${formattedRoute}`
      : `/${formattedRoute}`;
  };

  // sélection du parent depuis CustomTreeView
  const handleSelect = (node) => {
    setPageData((prev) => ({
      ...prev,
      parentId: node ? node.id : null,
    }));
    console.log("Parent sélectionné :", node);
  };

  // Mise à jour de l'état en fonction du nom de la page saisi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPageData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!pageData.name) {
      alert("Le nom de la page est obligatoire !");
      return;
    }
    const formattedRoute = pageData.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    try {
      //au debut avec content vide
      const newPage = await createPage({ ...pageData, route: formattedRoute, content: "" });
      console.log("Page ajoutée :", newPage);
      navigate(`/admin/SultanChatbot/${newPage.page.id}`);
    } catch (error) {
      console.error("Erreur lors de la création de la page :", error);
    }
};

  // Chargement des pages depuis la base de données
  useEffect(() => {
    const loadPages = async () => {
      try {
        const pages = await fetchPages();
        const tree = buildTree(pages);
        setTreeData(tree);
      } catch (error) {
        console.error("Erreur lors du chargement des pages :", error);
      }
    };
    loadPages();
  }, []);

  // transformer une liste plate en arbre hiérarchique
  const buildTree = (flatData) => {
    const map = {};
    const tree = [];

    // On ajoute chaque élément dans un map temporaire
    flatData.forEach((item) => {
      map[item.id] = { ...item, label: item.name, children: [], route: item.route };
    });

    // construire treeView 
    flatData.forEach((item) => {
      if (item.parentId) {
        if (map[item.parentId]) {
          map[item.parentId].children.push(map[item.id]);
        }
      } else {
        tree.push(map[item.id]);
      }
    });

    return tree;
  };

  return (
    <Paper sx={{ p: 3, mt: 10, mx: "auto", width: "75%" }}>
      <Typography variant="h6" gutterBottom color="#F39325">
        Créer une nouvelle page
      </Typography>
      <TextField
        fullWidth
        label="Nom de la page"
        name="name"
        variant="outlined"
        sx={{ mt: 2 }}
        value={pageData.name}
        onChange={handleChange}
      />
      <Typography variant="body2" sx={{ mt: 3 }}>
        Sélectionnez l'emplacement de la page
      </Typography>
      <CustomTreeView data={treeData} onSelect={handleSelect} />
      <TextField
        fullWidth
        variant="outlined"
        value={getRoutePreview()}
        InputProps={{ readOnly: true }}
        sx={{ mt: 2 }}
      />
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: "#F5F5F5",
            color: "#000",
            borderColor: "#1B374C",
            height: "40px",
            borderRadius: 5,
            "&:active": {
              backgroundColor: "#1B374C",
              color: "#FFF",
              borderColor: "#1B374C",
            },
          }}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon /> Annuler
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1B374C",
            color: "#FFF",
            height: "40px",
            borderRadius: 5,
          }}
          onClick={handleSubmit}
        >
          Suivant <ArrowForwardIcon />
        </Button>
      </Box>
    </Paper>
  );
};

export default PageCreation;
