const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Route to write AI-generated content to a static file
router.post('/api/write-generated-content', (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'No content provided' });
  }

  const filePath = path.join(__dirname, '../../PFE-frontend/src/pages/filecontent2.js');

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return res.status(500).json({ message: 'Failed to write file' });
    }

    res.json({ message: 'Content written successfully to filecontent2.js' });
  });
});

module.exports = router;
