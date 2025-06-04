const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

router.post('/deploy', async (req, res) => {
  const {
    repo,
    username,
    branch = 'main',
    buildCommand = 'npm run build',
    outputDirectory = 'build',
    rootDirectory = '.',
  } = req.body;

  if (!repo || !username) {
    return res.status(400).json({ error: 'Missing repo or username' });
  }

  const repoLc = repo.toLowerCase();
  const usernameLc = username.toLowerCase();

  const imageName = `${usernameLc}-${repoLc}-image`;
  const containerName = `${usernameLc}-${repoLc}-container`;
  const dockerContext = path.join(__dirname, '..', 'docker');
  const localOutputPath = path.join(__dirname, '..', 'tmp', `${usernameLc}-${repoLc}-build`);

  try {
    const buildCmd = `docker build \
--build-arg GITHUB_USERNAME=${username} \
--build-arg GITHUB_REPO=${repo} \
--build-arg BRANCH=${branch} \
--build-arg BUILD_COMMAND="${buildCommand}" \
-t ${imageName} ${dockerContext}`;
    console.log('🛠️ Building docker image...');
    await execPromise(buildCmd);

    const removeContainerCmd = `docker rm -f ${containerName}`;
    try {
      await execPromise(removeContainerCmd);
      console.log(`🧹 Removed existing container: ${containerName}`);
    } catch (e) {
      console.log(`ℹ️ No existing container named ${containerName}, continuing...`);
    }

    const createCmd = `docker create --name ${containerName} ${imageName}`;
    await execPromise(createCmd);

    await fs.remove(localOutputPath);
    await fs.ensureDir(localOutputPath);

    const containerBuildPath =
      rootDirectory === '.' ? `/app/${outputDirectory}` : `/app/${rootDirectory}/${outputDirectory}`;
    const copyCmd = `docker cp ${containerName}:${containerBuildPath} ${localOutputPath}`;
    console.log('📂 Copying build output from container...');
    await execPromise(copyCmd);

    const buildDir = path.join(localOutputPath, outputDirectory);
    const deploymentUrl = await deployToVercelFromHost(buildDir, repoLc);

    await execPromise(`docker rm ${containerName}`);
    await execPromise(`docker rmi ${imageName}`);
    await fs.remove(localOutputPath);

    res.json({ url: deploymentUrl });
  } catch (err) {
    console.error('❌ Deployment error:', err);
    res.status(500).json({ error: 'Deployment failed', message: err.message });
  }
});

function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(stderr || stdout || err.message));
      } else {
        resolve(stdout);
      }
    });
  });
}

async function deployToVercelFromHost(buildPath, projectName) {
  if (!VERCEL_TOKEN) throw new Error('VERCEL_TOKEN not defined');

  return new Promise((resolve, reject) => {
    const cmd = `vercel deploy ${buildPath} --prod --token=${VERCEL_TOKEN} --confirm`;
    console.log(' Deploying to Vercel with command:', cmd);

    exec(cmd, { maxBuffer: 1024 * 500 }, (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Deployment error:', stderr || err.message);
        return reject(stderr || err.message);
      }
      const match = stdout.match(/https?:\/\/[^\s]+\.vercel\.app/);
      const url = match ? match[0] : null;

      if (url) {
        console.log('✅ Deployed to:', url);
        resolve(url);
      } else {
        reject('URL not found in Vercel output');
      }
    });
  });
}

module.exports = router;
