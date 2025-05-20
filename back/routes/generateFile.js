const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/api/generate-file', async (req, res) => {
  const { repo, path, name, content } = req.body; // ✅ Get content from frontend
  const user = req.user;

  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const fileName = `${name}.js`;

    // Clean the path (remove leading slash if needed)
    const cleanedPath = path.startsWith('/') ? path.slice(1) : path;
    const fullPath = `${cleanedPath}/${fileName}`;

    // Encode the content for GitHub
    const encodedContent = Buffer.from(content).toString('base64');

    // Create the file in GitHub
    const response = await axios.put(
      `https://api.github.com/repos/${user.username}/${repo}/contents/${fullPath}`,
      {
        message: `Add file ${fileName}`,
        content: encodedContent,
      },
      {
        headers: {
          Authorization: `token ${user.accessToken}`,
          Accept: 'application/vnd.github+json',
        },
      }
    );

    res.json({ success: true, url: response.data.content?.html_url });
  } catch (err) {
    console.error('Failed to generate file:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate file' });
  }
});

module.exports = router;

