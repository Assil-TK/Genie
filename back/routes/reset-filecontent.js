const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/', (req, res) => {
  const filePath1 = path.join(__dirname, '../../PFE-frontend/src/pages/filecontent.js');
  const filePath2 = path.join(__dirname, '../../PFE-frontend/src/pages/filecontent2.js'); // ✅ NEW
  const componentsFolder = path.join(__dirname, '../../PFE-frontend/src/importedcomponents');
  const emptyContent = `// Auto-cleared preview file`;

  // 1. Clear filecontent.js
  fs.writeFile(filePath1, emptyContent, 'utf8', (err) => {
    if (err) {
      console.error('Error clearing filecontent.js:', err);
      return res.status(500).json({ message: 'Failed to reset filecontent.js' });
    }
    console.log('filecontent.js cleared.');

    // 2. Clear filecontent2.js ✅ NEW
    fs.writeFile(filePath2, emptyContent, 'utf8', (err) => {
      if (err) {
        console.error('Error clearing filecontent2.js:', err);
        return res.status(500).json({ message: 'Failed to reset filecontent2.js' });
      }
      console.log('filecontent2.js cleared.');

      // 3. Delete all files and folders inside importedcomponents
      fs.readdir(componentsFolder, (err, items) => {
        if (err) {
          console.error('Error reading importedcomponents folder:', err);
          return res.status(500).json({ message: 'Failed to read folder' });
        }

        const deletePromises = items.map((item) => {
          const fullPath = path.join(componentsFolder, item);

          return fs.promises
            .stat(fullPath)
            .then((stats) => {
              if (stats.isDirectory()) {
                return fs.promises.rm(fullPath, { recursive: true, force: true });
              } else {
                return fs.promises.unlink(fullPath);
              }
            })
            .then(() => {
              console.log(`Deleted: ${item}`);
            })
            .catch((err) => {
              console.error(`Failed to delete ${item}:`, err);
            });
        });

        Promise.all(deletePromises)
          .then(() => {
            return res.status(200).json({ message: 'All files cleared and folder emptied!' });
          })
          .catch((err) => {
            console.error('Error deleting items:', err);
            return res.status(500).json({ message: 'Some items could not be deleted' });
          });
      });
    });
  });
});

module.exports = router;
