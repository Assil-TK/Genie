const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db/db');
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

router.post('/deploy', async (req, res) => {
  const {
    repo,
    username,
    framework: rawFramework,
    buildCommand,
    outputDirectory,
    rootDirectory: rawRootDirectory = '',
    branch = 'main',
    repoId
  } = req.body;

  console.log('\n🟡 [Backend] Received payload from frontend:');
  console.log(JSON.stringify(req.body, null, 2));

  if (!repo || !username || !repoId) {
    return res.status(400).json({ error: 'Missing required fields: repo, username, or repoId' });
  }

  const cleanRootDir = rawRootDirectory.trim() === '.' || rawRootDirectory.trim() === './' ? '' : rawRootDirectory.trim();
  console.log('📁 Using sanitized rootDirectory:', `"${cleanRootDir}"`);

  const framework = rawFramework === 'react' ? 'create-react-app' : rawFramework;
  const headers = {
    Authorization: `Bearer ${VERCEL_TOKEN}`,
    'Content-Type': 'application/json'
  };

  try {
    let project = await db.getProject(username, repo);
    let deploymentUrl;

    if (project && project.vercel_project_id) {
      console.log('🟢 Project already exists. Redeploying...');

      const deployResponse = await axios.post(
        'https://api.vercel.com/v13/deployments',
        {
          name: repo,
          project: project.vercel_project_id,
          gitSource: {
            type: 'github',
            ref: branch,
            repoId
          }
        },
        { headers }
      );

      deploymentUrl = deployResponse.data.url;
    } else {
      console.log('📦 Project not in DB or missing project ID. Creating new project...');

      const projectBody = {
        name: repo,
        framework,
        buildCommand,
        outputDirectory,
        gitRepository: {
          type: 'github',
          repoId,
          repo,
          org: username
        }
      };

      if (
        cleanRootDir &&
        !cleanRootDir.startsWith('./') &&
        !cleanRootDir.includes('../')
      ) {
        projectBody.rootDirectory = cleanRootDir;
      }

      const createResponse = await axios.post(
        'https://api.vercel.com/v9/projects',
        projectBody,
        { headers }
      );

      const newProjectId = createResponse.data.id;
      await db.insertProject(username, repo, newProjectId, null);

      const deployResponse = await axios.post(
        'https://api.vercel.com/v13/deployments',
        {
          name: repo,
          project: newProjectId,
          gitSource: {
            type: 'github',
            ref: branch,
            repoId
          }
        },
        { headers }
      );

      deploymentUrl = deployResponse.data.url;
    }

    await db.updateDeploymentUrl(username, repo, deploymentUrl);
    console.log('✅ Deployment successful:', deploymentUrl);

    return res.status(200).json({ url: deploymentUrl });

  } catch (error) {
    console.error('\n❌ Deployment failed.');
    console.error('Message:', error.message);
    console.error('Response:', error.response?.data);

    return res.status(500).json({
      error: 'Deployment failed',
      message: error.message,
      details: error.response?.data || 'Unknown error'
    });
  }
});

module.exports = router;
