const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "temp/" });
const { verifyToken } = require ("../middleware/authMiddleware");
const fileController = require('../Controllers/fileController');
const aiController = require("../Controllers/aiController");

router.get('/list', verifyToken, fileController.listPages);
router.get('/paths', verifyToken, fileController.listPagePaths);



router.get("/listDash", fileController.listFormattedPages);

router.get('/:pageName', verifyToken, fileController.readPage); //utilisé modif

router.post('/generate', fileController.generateCode);

router.post("/ai/generate",verifyToken, aiController.generateEdit);
router.post("/ai/save",verifyToken, aiController.saveEdit);

router.post('/savePageCode',verifyToken,fileController.savePageCode); //utilisé modif
router.post('/syncToFrontend', verifyToken, fileController.writeToFrontendProject);
router.post('/removeFromFrontend', verifyToken, fileController.removeFromFrontendRoutes);
router.post(
  '/upload-image',
  verifyToken,         // your JWT/auth middleware
  upload.single("image"), // multer middleware to handle single file named "image"
  fileController.uploadImage
);

// Route pour créer un fichier de page
router.post('/createFile',verifyToken,fileController.createFile);

router.put('/:pageName', verifyToken, express.json(), fileController.updatePage);


module.exports = router;

