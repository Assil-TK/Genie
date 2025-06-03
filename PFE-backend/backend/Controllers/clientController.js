const { User } = require("../Models");

exports.getClients = async (req, res) => {
  try {
    const clients = await User.findAll({
      where: { role:"client", isApproved: true }
    });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /admins/pending         → liste des admins en attente
// exports.getPendingAdmins = async (req, res) => {
//   try {
//     const pendings = await User.findAll({
//       where: { role: "admin", isApproved: false }
//     });
//     res.json(pendings);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


exports.getPendingClients = async (req, res) => {
    try {
      const pendingUsers = await User.findAll({
        where: {
          isApproved: false,
          isVerified: true, 
          role:"client",
        },
        attributes: ['id', 'username', 'email', 'createdAt'],
      });
  
      res.status(200).json(pendingUsers);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  
  exports.createClient = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // 🔍 Vérification si l'email existe déjà
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé." });
      }
  
      const newClient = await User.create({
        username,
        email,
        password,
        role: "client",
        isApproved: true,
        isVerified: true,
      });
  
      res.status(201).json(newClient);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur lors de la création" });
    }
  };
  

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = (({ username, email, isApproved }) => ({ username, email, isApproved }))(req.body);
    const client = await User.findByPk(id);
    if (!client || client.role !== "client") {
      return res.status(404).json({ message: "Client introuvable" });
    }
    await client.update(updates);
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await User.findByPk(id);
    if (!client || client.role !== "client") {
      return res.status(404).json({ message: "Client introuvable" });
    }
    await client.destroy();
    res.json({ message: "Client supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveClient = async (req, res) => {
  try {
    const userId = req.params.Id;
    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.isApproved = true;
    await user.save();

    res.status(200).json({ message: "Compte approuvé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};


