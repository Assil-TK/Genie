const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-image', upload.single('image'), async (req, res) => {
  console.log('Received upload request');
  if (!req.isAuthenticated()) {
    console.log('Unauthorized: user not authenticated');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { repo, uploadPath, commitMessage } = req.body;
  const file = req.file;
  if (!file || !repo || !uploadPath || !commitMessage) {
    console.log('Missing required fields:', { fileExists: !!file, repo, uploadPath, commitMessage });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  console.log(`User: ${req.user.username}, Repo: ${repo}, Upload path: ${uploadPath}, Commit message: ${commitMessage}`);
  console.log(`File info: originalname=${file.originalname}, size=${file.size}`);

  const fileName = file.originalname;
  const fullPath = path.posix.join(uploadPath, fileName);
  const encodedContent = file.buffer.toString('base64');

  try {
    let sha;
    console.log(`Checking if file exists at path: ${fullPath}`);
    try {
      const { data } = await axios.get(
        `https://api.github.com/repos/${req.user.username}/${repo}/contents/${fullPath}`,
        {
          headers: {
            Authorization: `token ${req.user.accessToken}`,
          },
        }
      );
      sha = data.sha;
      console.log('Existing file found with SHA:', sha);
    } catch (err) {
      if (err.response?.status === 404) {
        console.log('File does not exist yet, will create new file.');
      } else {
        console.error('Error checking file existence:', err.response?.data || err.message);
        throw err;
      }
    }

    console.log('Sending PUT request to create/update file on GitHub...');
    const response = await axios.put(
      `https://api.github.com/repos/${req.user.username}/${repo}/contents/${fullPath}`,
      {
        message: commitMessage,
        content: encodedContent,
        ...(sha && { sha }),
      },
      {
        headers: {
          Authorization: `token ${req.user.accessToken}`,
        },
      }
    );

    console.log('GitHub upload successful:', response.data.content.download_url);
    res.json({
      message: 'Uploaded',
      path: fullPath,
      url: response.data.content.download_url,
    });
  } catch (err) {
    console.error('Upload failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
