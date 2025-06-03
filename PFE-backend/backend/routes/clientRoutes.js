const router = require("express").Router();
const clientController = require("../Controllers/clientController");
const authorize = require("../middleware/authorize");
const { verifyToken } = require("../middleware/authMiddleware"); 
// Toutes les routes protégées pour super-admin

router.use(verifyToken);
router.use(authorize("admin"));

// Gestion des admins
router.get("/",verifyToken,clientController.getClients);
router.get("/pending",verifyToken,clientController.getPendingClients);
router.post("/create",verifyToken,clientController.createClient);
router.put("/update/:id",verifyToken,clientController.updateClient);
router.delete("/delete/:id",verifyToken,clientController.deleteClient);

router.put("/approve/:Id",verifyToken,clientController.approveClient);


module.exports = router;
