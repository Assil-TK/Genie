// ... [imports unchanged]
import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Typography, CircularProgress, Box, Chip, Link, Snackbar, Alert
} from "@mui/material";
import { fetchRepos, fetchFileContent, fetchUser } from "../api/githubApi";

// === API Functions ===
async function getProjectsWithDeploymentInfo() {
    console.log("[API] Fetching projects with deployment info...");
    const res = await fetch('/api/react-projects');
    if (!res.ok) {
        console.error("[API] Failed to fetch projects", res.status);
        throw new Error('Failed to fetch projects');
    }
    const data = await res.json();
    console.log("[API] Projects fetched:", data);
    return data;
}

// UPDATED deployProject to return deployment URL
async function deployProject(userId, project) {
    console.log(`[API] Deploying project: ${project.repo} for user: ${userId}`);
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
        console.error(`[API] Deploy failed for ${project.repo}:`, error.message);
        throw new Error(error.message || 'Deploy failed');
    }

    const result = await res.json();
    console.log(`[API] Deploy succeeded for ${project.repo}`, result);
    return result.url;
}

// === saveProject unchanged ===
async function saveProject(userId, projectName) {
    console.log(`[API] Saving project: ${projectName} for user: ${userId}`);
    const res = await fetch('http://localhost:5010/api/save-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, projectName }),
    });
    if (!res.ok) {
        throw new Error('Saving project failed');
    }
    console.log(`[API] Project saved: ${projectName}`);
}

// === Main Component ===
const ProjectDeploy = () => {
    const [reactProjects, setReactProjects] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deploying, setDeploying] = useState({});
    const [currentUserId, setCurrentUserId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

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
                } catch (err) {
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

            // ✅ Update status + show success notification
            setProjects(prevProjects => {
                const updated = prevProjects.map(p =>
                    p.name === project.repo
                        ? { ...p, deploymentStatus: "success", vercelUrl }
                        : p
                );

                const exists = prevProjects.some(p => p.name === project.repo);
                if (!exists) {
                    updated.push({
                        name: project.repo,
                        deploymentStatus: "success",
                        vercelUrl,
                    });
                }

                return updated;
            });

            setSnackbarOpen(true); // ✅ show snackbar
        } catch (error) {
            alert("Erreur de déploiement : " + (error.message || "inconnue"));
            console.error(`[Deploy] Error for ${project.repo}:`, error);
        } finally {
            setDeploying(prev => ({ ...prev, [project.repo]: false }));
        }
    };

    // ✅ UPDATED renderStatusChip to depend on deployment status
    const renderStatusChip = (projectName) => {
        const project = projectsMap.get(projectName);
        if (project?.deploymentStatus === "success") {
            return <Chip label="Déployé" color="success" />;
        }
        return <Chip label="Pas encore déployé" color="info" />;
    };

    const projectsMap = new Map(projects.map(p => [p.name, p]));

    return (
        <Box sx={{ p: 10 }}>
            <Typography variant="h5" sx={{ color: "#F39325", fontFamily: "Poppins", mb: 3 }}>
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

            {/* ✅ Snackbar Notification */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Déploiement effectué avec succès !
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProjectDeploy;
