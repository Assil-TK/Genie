import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Typography, CircularProgress, Box, Chip, Link, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { fetchRepos, fetchFileContent, fetchUser } from "../api/githubApi";
import Sidebar from '../components/Sidebar copy';
import Header from '../components/Header git';
// === API Functions ===
async function getProjectsWithDeploymentInfo() {
    const res = await fetch('/api/react-projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    const data = await res.json();
    return data;
}

async function deployProject(userId, project) {
    const res = await fetch('http://localhost:5010/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            repo: project.repo,
            username: userId,
            framework: project.framework,
            repoId: project.repoId,
            buildCommand: project.buildCommand || 'npm run build',
            outputDirectory: project.outputDirectory || 'build',
            rootDirectory: project.rootDirectory || '.',
            branch: project.branch || 'main',
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Deploy failed');
    }

    const result = await res.json();
    return result.url;
}

async function saveProject(userId, projectName) {
    const res = await fetch('http://localhost:5010/api/save-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, projectName }),
    });
    if (!res.ok) throw new Error('Saving project failed');
}

// === Main Component ===
const ProjectDeploy = () => {
    const [reactProjects, setReactProjects] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deploying, setDeploying] = useState({});
    const [currentUserId, setCurrentUserId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [dialog, setDialog] = useState({ open: false, error: '' });

    const fetchReactProjects = async (userId) => {
        try {
            const repos = await fetchRepos();
            const reactRepos = [];

            for (const repo of repos) {
                try {
                    const file = await fetchFileContent(repo.name, 'package.json');
                    let content = file?.content;
                    if (file?.encoding === 'base64') content = atob(content);
                    const packageJson = JSON.parse(content);

                    const dependencies = {
                        ...packageJson.dependencies,
                        ...packageJson.devDependencies,
                    };

                    if (dependencies?.react) {
                        try {
                            await saveProject(userId, repo.name);
                            reactRepos.push({
                                repo: repo.name,
                                username: repo.owner.login,
                                repoId: repo.id.toString(),
                                framework: "react",
                                buildCommand: "npm run build",
                                outputDirectory: "build",
                                rootDirectory: ".",
                                branch: repo.default_branch || "main",
                            });
                        } catch (saveError) {
                            console.error(` Error saving project ${repo.name}:`, saveError);
                        }
                    }
                } catch {
                    console.warn(` Skipped ${repo.name}: package.json missing or invalid`);
                }
            }

            setReactProjects(reactRepos);
        } catch (error) {
            console.error(' Error fetching GitHub repos:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const data = await getProjectsWithDeploymentInfo();
            setProjects(data);
        } catch (error) {
            console.error('❌ Error fetching projects:', error);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const res = await fetchUser();
                const user = res.user;
                const userId = user?.username;
                setCurrentUserId(userId);

                await Promise.all([fetchReactProjects(userId), fetchProjects()]);
            } catch (err) {
                console.error("❌ Failed to initialize user and projects", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleDeploy = async (userId, project) => {
        setDeploying(prev => ({ ...prev, [project.repo]: true }));
        try {
            const vercelUrl = await deployProject(userId, project);
            setProjects(prev => {
                const updated = prev.map(p =>
                    p.name === project.repo ? { ...p, deploymentStatus: "success", vercelUrl, deployError: null } : p
                );
                if (!prev.find(p => p.name === project.repo)) {
                    updated.push({ name: project.repo, deploymentStatus: "success", vercelUrl, deployError: null });
                }
                return updated;
            });
            setSnackbar({ open: true, message: "Déploiement effectué avec succès !", severity: "success" });
        } catch (error) {
            const errorMessage = error.message || "Erreur inconnue";
            console.error(`[Deploy] Error for ${project.repo}:`, errorMessage);

            setProjects(prev => {
                const updated = prev.map(p =>
                    p.name === project.repo
                        ? { ...p, deploymentStatus: "erreur", deployError: errorMessage }
                        : p
                );
                if (!prev.find(p => p.name === project.repo)) {
                    updated.push({ name: project.repo, deploymentStatus: "erreur", deployError: errorMessage });
                }
                return updated;
            });

            setSnackbar({ open: true, message: "Échec du déploiement.", severity: "error" });
        } finally {
            setDeploying(prev => ({ ...prev, [project.repo]: false }));
        }
    };

    const renderStatusChip = (projectName) => {
        const project = projectsMap.get(projectName);
        if (project?.deploymentStatus === "success") {
            return <Chip label="Déployé" color="success" />;
        }
        if (project?.deploymentStatus === "erreur") {
            return <Chip label="Erreur" color="error" />;
        }
        return <Chip label="Pas encore déployé" color="info" />;
    };

    const projectsMap = new Map(projects.map(p => [p.name, p]));

    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar />

            <Box sx={{ flexGrow: 1 }}>
                <Header />

                <Box sx={{ p: 10,marginLeft:4 }}>
                    <Typography variant="h5" sx={{ color: " #F39325", fontFamily: "Poppins", mb: 3, marginTop:3}}>
                        Déployer un projet
                    </Typography>

                    {loading ? (
                        <CircularProgress />
                    ) : reactProjects.length === 0 ? (
                        <Typography>Aucun projet React trouvé.</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nom du projet</TableCell>
                                        <TableCell>Statut du déploiement</TableCell>
                                        <TableCell>URL déployée</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reactProjects.map(project => {
                                        const projectName = project.repo;
                                        const savedProject = projectsMap.get(projectName);

                                        return (
                                            <TableRow key={projectName}>
                                                <TableCell>{projectName}</TableCell>
                                                <TableCell>{renderStatusChip(projectName)}</TableCell>
                                                <TableCell>
                                                    {savedProject?.deploymentStatus === "success" && savedProject?.vercelUrl ? (
                                                        <Link
                                                            href={`https://${savedProject.vercelUrl.replace(/^https?:\/\//, "")}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            underline="hover"
                                                        >
                                                            Voir site
                                                        </Link>
                                                    ) : savedProject?.deploymentStatus === "erreur" ? (
                                                        <Link
                                                            component="button"
                                                            underline="hover"
                                                            onClick={() => setDialog({ open: true, error: savedProject.deployError })}
                                                        >
                                                            Voir erreur
                                                        </Link>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        disabled={!!deploying[projectName]}
                                                        onClick={() => handleDeploy(currentUserId, project)}
                                                    >
                                                        {deploying[projectName] ? "Déploiement..." : "Déployer"}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    <Dialog
                        open={dialog.open}
                        onClose={() => setDialog({ open: false, error: '' })}
                        fullWidth
                        maxWidth="md"
                    >
                        <DialogTitle>Détails de l'erreur</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {dialog.error}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDialog({ open: false, error: '' })} color="primary">
                                Fermer
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={5000}
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                        <Alert
                            onClose={() => setSnackbar({ ...snackbar, open: false })}
                            severity={snackbar.severity}
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </Box>
            </Box>
        </Box>
    );
};

export default ProjectDeploy;