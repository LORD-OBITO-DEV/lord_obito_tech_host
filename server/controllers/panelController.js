import { ptero } from "../config/pteroConfig.js";

/**
 * ✅ Créer un utilisateur et un serveur après paiement validé
 */
export const createPanel = async (req, res) => {
  try {
    const { email, username, plan, cpu, ram, disk, duration } = req.body;

    // 1️⃣ Créer l'utilisateur dans Pterodactyl
    const userResponse = await ptero.post("/users", {
      email,
      username,
      first_name: username,
      last_name: "Client",
      password: Math.random().toString(36).slice(-10),
    });

    const userId = userResponse.data.attributes.id;

    // 2️⃣ Créer le serveur selon le plan acheté
    const serverResponse = await ptero.post("/servers", {
      name: `Panel-${username}`,
      user: userId,
      egg: 5, // 🥚 à adapter selon ton template (Node.js, Python, etc.)
      docker_image: "ghcr.io/parkervcp/yolks:nodejs_20",
      startup: "npm start",
      limits: {
        memory: ram * 1024, // en Mo
        swap: 0,
        disk: disk * 1024, // en Mo
        io: 500,
        cpu: cpu * 100, // en %
      },
      feature_limits: { databases: 1, allocations: 1, backups: 2 },
      allocation: { default: 1 }, // ⚠️ à ajuster selon tes nodes
    });

    // 3️⃣ Répondre au frontend
    res.json({
      success: true,
      message: `Panel créé pour ${username}`,
      panelUrl: `${process.env.PTERO_API_URL}`,
      userEmail: email,
      details: serverResponse.data,
      expiration: `Expire dans ${duration} jours`,
    });
  } catch (error) {
    console.error("Erreur création panel :", error.response?.data || error.message);
    res.status(500).json({ error: "Impossible de créer le panel" });
  }
};
