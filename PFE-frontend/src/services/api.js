import { Password } from "@mui/icons-material";
import axios from "axios";

const API_URL = "http://localhost:5000";

export const generatePageFromPrompt = async (prompt) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/ai/generate`, { prompt }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.content;
  } catch (error) {
    console.error("Erreur lors de la génération de la page par prompt :", error);
    throw error;
  }
};


export const uploadImage = async (formData) => {
  try {
    const token = localStorage.getItem('token'); // or your auth method

    const response = await axios.post(
      `${API_URL}/api/upload-image`, // replace with your correct route
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // If your backend requires auth
        },
      }
    );

    console.log("📡 Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API uploadImage error:", error);
    throw error;
  }
};




export const getPages = async () => {
  try {
    const response = await axios.get(`${API_URL}/pages`);
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des pages");
  }
};

export const getPageByRoute = async (route) => {
  try {
    const response = await axios.get(`${API_URL}/pages/byroute/${route}`);
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la récupération de la page");
  }
};


export const getPageById = async (id) => {
  console.log(`FRONTEND: Récupération de la page avec ID: ${id}`);
  try {
    const response = await axios.get(`${API_URL}/pages/${id}`);
    console.log(" FRONTEND: Réponse reçue pour getPageById :", response.data);
    // Si le contenu est une chaîne, on le parse
    const content = typeof response.data.content === "string" ? JSON.parse(response.data.content) : response.data.content;
    return { ...response.data, content };
  } catch (error) {
    console.error("FRONTEND: Erreur dans getPageById :", error);
    throw error;
  }
};

export const updatePage = async (id, pageData) => {
  try {
    const response = await axios.put(`${API_URL}/pages/${id}`, pageData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("[API] Erreur dans getPageById:", error);
    throw error;
  }
};

export const createPage = async (pageData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/pages/create`, pageData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Erreur lors de la création de la page";
    console.error("Erreur:", error);
    throw new Error(errorMessage);
  }
};

export const fetchPages = async () => {
  try {
    const response = await axios.get(`${API_URL}/pages`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des pages:", error);
    return [];
  }
};

export const getPageContent = async (id) => {
  try {
    //const response = await axios.get(`${API_URL}/pages/${id}`);
    const response = await axios.get(`${API_URL}/pages/content/${id}`);

    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement du contenu de la page :", error);
    throw error;
  }
};

// export const updatePageContent = async (pageId, contentData) => {
//   try {
//     const payload = { content: JSON.stringify(contentData) };
//     const response = await axios.put(`${API_URL}/pages/update/${pageId}`, payload);
//     return response.data;
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour du contenu de la page :", error);
//     throw error;
//   }
// };

export const updatePageContent = async (pageId, contentData, operationType) => {
  try {
    const token = localStorage.getItem("token");
    const payload = {
      //content: JSON.stringify(contentData),
      content: contentData,
      operationType,
    };
    console.log(` FRONTEND : Mise à jour de la page avec ID: ${pageId}`);
    console.log(" FRONTEND : Payload envoyé :", payload);
    const response = await axios.put(`${API_URL}/pages/update/${pageId}`, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    console.log(" FRONTEND : Réponse :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du contenu :", error);
    throw error;
  }
};


export const getAllPagesWithChildren = async () => {
  try {
    const response = await axios.get(`${API_URL}/pages/withchildren`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des pages :", error);
    return [];
  }
};

export const fetchPage = async (route) => {
  try {
    const response = await axios.get(`${API_URL}/pages/${route}`);
    return response.data;
  } catch (error) {
    console.log("erreur lors de la recuperation de la page avec fetchPage;", error);
    return null;
  }
};

export const getPageContentByRoute = async (route) => {
  try {
    const response = await axios.get(`${API_URL}/pages/contentbyroute/${route}`);
    console.log("Réponse complète de l'API :", response);

    if (!Array.isArray(response.data) || response.data.length === 0) {
      throw new Error("Réponse API invalide ou vide");
    }
    console.log("Réponse API :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du contenu :", error);
    throw error;
  }
};

export const getModificationHistory = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/modification/history`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log("historique récupéré: ", response.data)
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique :", error);
    throw error;
  }
};

export const getMyModificationHistory = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/modification/my-history`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log("Historique personnel récupéré :", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique personnel :", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const payload = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    };

    // if (userData.role === "admin" && userData.superadminKey?.trim()) {
    //   payload.superadminKey = userData.superadminKey;
    // }
    // console.log("Payload envoyé:", payload);

    const response = await axios.post(`${API_URL}/auth/register`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error.response?.data || error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la connexion :", error.response?.data || error);
    throw error;
  }
};

// Fonction pour enregistrer une visite 
// export const trackVisit = async (data) => {
//   const response = await axios.post(`${API_URL}/statistics/track-visit`, data);
//   return response.data;
// };

export const getPageList = async () => {
  const response = await axios.get(`${API_URL}/pages/list`);
  return response.data;
};

// Fonction pour récupérer les statistiques d'une page 
export const getStatsByPage = async (pageRoute) => {
  const response = await axios.get(`${API_URL}/statistics/stats-by-page`, {
    params: { pageRoute },
  });
  return response.data;
};

// export const getAllStats = async (params = {}) => {
//   const response = await axios.get(`${API_URL}/statistics/stats-all`, { params });
//   return response.data;
// };

// export const getHourlyStatsByPage = async (pageRoute) => {
//   const response = await axios.get(`${API_URL}/statistics/hourly?pageRoute=${pageRoute}`);
//   return response.data;
// };

export const deletePage = async (pageId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/pages/delete/${pageId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la suppression de la page");
  }
};

export const restorePage = async (pageId) => {
  const token = localStorage.getItem("token");
  console.log("Token récupéré : ", token);

  try {
    const response = await axios.put(`${API_URL}/pages/restore/${pageId}`, {}, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la restauration :", error);
    throw error;
  }

};

export const getPageVersions = async (pageId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/pages/${pageId}/versions`, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

export const restoreVersion = async (pageId, versionId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token manquant");

  const response = await axios.put(
    `${API_URL}/pages/${pageId}/versions/${versionId}/restore`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const logOut = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const getClients = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/clients`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getPendingClients = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/clients/pending`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createClient = async (payload) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_URL}/clients/create`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateClient = async (id, payload) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/clients/update/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteClient = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API_URL}/clients/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const approveClient = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(
    `${API_URL}/clients/approve/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/////////////////////////////////////////////////////////////////////////////////////////
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Liste des fichiers JS (sans .js)
export const fetchFileList = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/api/files/list`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste :", error);
    throw new Error("Impossible de charger la liste des fichiers.");
  }
};

export const fetchFilePaths = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/api/files/paths`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // [{ name, path }]
  } catch (error) {
    console.error("Erreur récupération chemins:", error);
    throw new Error("Impossible de charger les chemins.");
  }
};

export const syncToFrontend = async ({ relativePath, content }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/api/files/syncToFrontend`,
      { relativePath, content },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la synchronisation avec le frontend :", error);
    throw new Error("Échec de la synchronisation frontend.");
  }
};




// Lire un fichier
export const getPageCode = async (pageName) => {
  try {
    const response = await axios.get(`${API_URL}/api/files/${pageName}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur lecture fichier :", error);
    throw new Error("Impossible de lire le fichier.");
  }
};

// Sauvegarder un fichier
export const updatePageCode = async (pageName, content) => {
  try {
    const response = await axios.post(`${API_URL}/api/files/${pageName}`, { content }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur mise à jour fichier :", error);
    throw new Error("Échec de la sauvegarde.");
  }
};

export const generateCodeFromPrompt = async (prompt) => {
  try {
    const response = await axios.post(`${API_URL}/api/files/generate`, { prompt }, getAuthHeaders());
    console.log("Réponse complète de l'API :", response);

    console.log("Code généré :", response.data.code);
    return response.data.code;
  } catch (error) {
    console.error("Erreur lors de la génération du code :", error);
    throw new Error("Impossible de générer le code.");
  }
};


export const generateEdit = async ({ fileName, fileContent, instruction }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/api/files/ai/generate`,
      { fileName, fileContent, instruction },
      {
        headers: {
          "Content-Type": "application/json", "Authorization": `Bearer ${token}`,
        },
      }
    );
    return response.data.newCode;
  } catch (err) {
    console.error("Erreur generateEdit:", err);
    throw new Error(err.response?.data?.error || "Échec de la génération IA.");
  }
};

export const saveEdit = async ({ fileName, oldCode, newCode, instruction }) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/api/files/ai/save`,
      { fileName, oldCode, newCode, instruction },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Erreur saveEdit:", err);
    throw new Error(err.response?.data?.error || "Échec de la sauvegarde.");
  }
};

export const savePageCode = async (pageName, code) => {
  try {
    const response = await axios.post(`${API_URL}/api/files/savePageCode`, { pageName, code }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du code :", error);
    throw new Error("Impossible de sauvegarder le code.");
  }
};



export const removeFromFrontend = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/api/files/removeFromFrontend`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du composant frontend :", error);
    throw new Error("Échec de la suppression.");
  }
};





//api ia creation

export const createFile = async ({ pageName, code, projectId }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/api/files/createFile`, { pageName, code, projectId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du fichier :', error);
    throw error;
  }
};

//ai creation
export const generateCode = async (prompt) => {
  try {
    const response = await axios.post(`${API_URL}/ai/generateCode`, { prompt }, getAuthHeaders());
    return response.data.code;
  } catch (error) {
    console.error('Erreur lors de la génération du code par l’IA :', error);
    throw error;
  }
};

//histo
export const getAllOperations = async () => {
  try {
    const response = await axios.get(`${API_URL}/operations`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les opérations:', error);
    throw error;
  }
};

//journal
export const getMyOperations = async () => {
  try {
    const response = await axios.get(`${API_URL}/operations/myOperations`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur lors de laffichage de mon journal:", error);
    throw error;
  }
};

//trackVisit
export const trackVisit = async ({ pageName, startTime, endTime }) => {
  try {
    const response = await axios.post(`${API_URL}/visites/trackVisit/${pageName}`, { startTime, endTime }, getAuthHeaders());
    return response.data; // Retourne la réponse, si nécessaire
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la visite:', error);
    throw error; // Propager l'erreur pour être traitée ailleurs
  }
};

// Fonction pour obtenir les statistiques par fichier (page)
// export const getStatsByFile = async (pageName) => {
//   try {
//     const response = await axios.get(`${API_URL}/visits/statsByFile/${pageName}`);
//     return response.data;
//   } catch (error) {
//     console.error('Erreur lors de la récupération des statistiques par fichier', error);
//     throw error;
//   }
// };
export const getStatsByFile = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/visites/stats`, { params });  // Passe les params dans la requête
    return response.data;  // Retourne les données récupérées
  } catch (error) {
    console.error('Erreur récupération stats par fichier:', error);
    throw error;  // Gère l'erreur
  }
};

// Fonction pour obtenir toutes les statistiques
// export const getAllStats = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/visits/allStats`);
//     return response.data;
//   } catch (error) {
//     console.error('Erreur lors de la récupération des statistiques globales', error);
//     throw error;
//   }
// };

export const getAllStats = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/visites/allStats`, { params });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques par page:', error);
    throw error;
  }
};

// // Fonction pour obtenir les statistiques horaires par fichier (page)
// export const getHourlyStatsByFile = async (pageName) => {
//   try {
//     const response = await axios.get(`${API_URL}/visits/hourly/${pageName}`);
//     return response.data;
//   } catch (error) {
//     console.error('Erreur lors de la récupération des statistiques horaires par fichier', error);
//     throw error;
//   }
// };
export const getHourlyStatsByPage = async (pageName) => {
  const response = await axios.get(`${API_URL}/visites/hourlyStats/${pageName}`, getAuthHeaders());
  return response.data;
};

export const getVisitTimes = async (pageName) => {
  try {
    const response = await axios.get(`${API_URL}/visites/${pageName}`);
    return response.data.visitTimes;  // Retourner uniquement les horaires de visite
  } catch (err) {
    console.error('Erreur lors de la récupération des horaires de visite', err);
    throw err;  // Propager l'erreur
  }
};

export const fetchFileListDash = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/files/listDash`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste :", error);
    throw new Error("Impossible de charger la liste des fichiers.");
  }
};

//pour l upload 
export const uploadProjectZip = async (file) => {
  const formData = new FormData();
  formData.append('projectZip', file);
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}/api/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  return response.data;
};

//getUserProjects
export const getAllProjects = async () => {
  const res = await axios.get(`${API_URL}/api/projets/my-projects`, getAuthHeaders());
  return res.data.projets;
};

export const getActiveProject = async () => {
  const res = await axios.get(`${API_URL}/api/projets/active`, getAuthHeaders());
  return res.data.projet;
};

export const setActiveProject = async (projectId) => {
  const res = await axios.post(`${API_URL}/api/projets/set-active`, { projectId }, getAuthHeaders());
  return res.data.projet;
};

export const downloadProject = async (projectId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/api/projets/${projectId}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/zip' });
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `project_${projectId}.zip`);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(downloadUrl);

  } catch (error) {
    console.error("Erreur lors du telechargement du projet : ", error);
    alert("Erreur lors du téléchargement du projet");
  }
};

export const getProjectsWithDeploymentInfo = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/api/projets/deploy-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur getProjectsWithDeploymentInfo:', error);
    throw error;
  }
};


export const deployProject = async (userId, projectName) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/deploy`, { userId, projectName }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message
  }
};

//section avis
export const getAvis = async () => {
  const res = await axios.get(`${API_URL}/api/avis`);
  return res.data;
};

export const createAvis = async (note, commentaire) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_URL}/api/avis/create`, { note, commentaire },
    {
      headers:
        { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
};

//dashboard admin
export const getDashboardStats = async (startDate, endDate) => {
  const token = localStorage.getItem("token");
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await axios.get(`${API_URL}/api/stats/admin/tableau`,
    {
      headers:
        { Authorization: `Bearer ${token}` },
        params
    }
  );
  return response.data;
};





