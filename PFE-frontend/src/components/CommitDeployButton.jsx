import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5010/api';

const CommitDeployButton = ({ user, selectedRepo, selectedFile, content, sha, commitMessage }) => {
    const [loading, setLoading] = useState(false);
    const [deploymentURL, setDeploymentURL] = useState(null);

    // Detect frontend folder in GitHub repo
    const detectFrontendFolder = async () => {
        const username = user?.username || user?.login;
        const repoPath = `${username}/${selectedRepo}`;

        const searchFolders = async (path = '') => {
            try {
                const url = `https://api.github.com/repos/${repoPath}/contents/${path}`;
                const res = await axios.get(url);
                const items = res.data;

                for (const item of items) {
                    const frontendConfigFiles = [
                        'vite.config.js', 'angular.json', 'svelte.config.js', 'nuxt.config.js'
                    ];
                    if (frontendConfigFiles.includes(item.name)) return path || '.';

                    if (item.name === 'package.json') {
                        const pkgRes = await axios.get(item.download_url);
                        const pkgText = typeof pkgRes.data === 'string' ? pkgRes.data : JSON.stringify(pkgRes.data);
                        const isFrontend =
                            pkgText.includes('"react"') ||
                            pkgText.includes('"next"') ||
                            pkgText.includes('"vue"') ||
                            pkgText.includes('"vite"') ||
                            pkgText.includes('"@angular/core"') ||
                            pkgText.includes('"svelte"') ||
                            pkgText.includes('"nuxt"');
                        if (isFrontend) return path || '.';
                    }
                }

                for (const item of items) {
                    if (item.type === 'dir') {
                        const result = await searchFolders(item.path);
                        if (result) return result;
                    }
                }
            } catch (err) {
                console.error(`❌ Error scanning path "${path}":`, err.message);
            }
            return null;
        };

        return await searchFolders();
    };

    const handleCommitAndDeploy = async () => {
        setLoading(true);
        try {
            const username = user?.username || user?.login;
            const frontendPath = await detectFrontendFolder();

            if (!frontendPath) {
                alert('No frontend folder detected in the repo.');
                setLoading(false);
                return;
            }

            // Fetch package.json from the detected frontend folder
            const repoPath = `${username}/${selectedRepo}`;
            const pkgUrl = `https://api.github.com/repos/${repoPath}/contents/${frontendPath}/package.json`;
            const pkgRes = await axios.get(pkgUrl);
            const pkgContent = atob(pkgRes.data.content);
            const packageData = JSON.parse(pkgContent);

            const scripts = packageData.scripts || {};
            const dependencies = packageData.dependencies || {};
            const devDependencies = packageData.devDependencies || {};

            // Detect framework
            let framework = 'other';
            if ('next' in dependencies) framework = 'nextjs';
            else if ('react' in dependencies || 'react-dom' in dependencies) framework = 'react';
            else if ('vite' in dependencies || 'vite' in devDependencies) framework = 'vite';
            else if ('vue' in dependencies) framework = 'vue';
            else if ('@angular/core' in dependencies) framework = 'angular';
            else if ('svelte' in dependencies) framework = 'svelte';
            else if ('nuxt' in dependencies || 'nuxt' in devDependencies) framework = 'nuxtjs';

            const buildCommand = scripts.build || 'npm run build';

            // Default output directory based on framework
            let outputDirectory = 'dist';
            if (framework === 'nextjs') outputDirectory = '.next';
            else if (framework === 'react') outputDirectory = 'build';
            else if (framework === 'angular') outputDirectory = 'dist';
            else if (framework === 'nuxtjs') outputDirectory = '.output/public';

            // Adjust relative file path
            let relativeFilePath = selectedFile;
            if (frontendPath !== '.' && selectedFile.startsWith(frontendPath + '/')) {
                relativeFilePath = selectedFile.slice(frontendPath.length + 1);
            }

            // Fetch GitHub repoId
            const githubRepoInfo = await axios.get(`https://api.github.com/repos/${username}/${selectedRepo}`);
            const repoId = githubRepoInfo.data.id;

            const res = await axios.post(`${API_BASE}/commit-deploy`, {
                repo: selectedRepo,
                repoId, // NEW: include the GitHub repo ID
                file: relativeFilePath,
                content,
                sha,
                commitMessage: commitMessage || 'Update and deploy',
                frontendPath,
                username,
                framework,
                buildCommand,
                outputDirectory,
                rootDirectory: frontendPath,
                branch: 'main',
            });

            setDeploymentURL(res.data.url);
        } catch (err) {
            console.error('❌ Commit + Deploy failed:', err.response?.data || err.message);
            alert('Commit + Deploy failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '1rem' }}>
            <button
                onClick={handleCommitAndDeploy}
                disabled={loading}
                style={{ padding: '0.5rem 1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
                {loading ? 'Deploying...' : 'Commit + Deploy'}
            </button>
            {deploymentURL && (
                <p style={{ marginTop: '0.5rem' }}>
                    Live at: <a href={`https://${deploymentURL}`} target="_blank" rel="noreferrer">{deploymentURL}</a>
                </p>
            )}
        </div>
    );
};

export default CommitDeployButton;
