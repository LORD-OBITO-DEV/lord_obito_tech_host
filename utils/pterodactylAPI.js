require('dotenv').config();
const axios = require('axios');

const PTERO_URL = process.env.PTERO_URL;
const PTERO_API_KEY = process.env.PTERO_API_KEY;

// Créer un panel sur Pterodactyl
async function createPanelOnPtero(panel) {
  const res = await axios.post(`${PTERO_URL}/api/application/servers`, {
    name: panel.panelName,
    user: panel.username,
    egg: panel.service, // nodejs, python, minecraft
    memory: panel.capacity === "unlimited" ? 4096 : parseInt(panel.capacity) * 1024,
    disk: panel.capacity === "unlimited" ? 20480 : parseInt(panel.capacity) * 1024,
    // Ajouter plus de configs si nécessaire
  }, {
    headers: {
      "Authorization": `Bearer ${PTERO_API_KEY}`,
      "Content-Type": "application/json",
      "Accept": "Application/vnd.pterodactyl.v1+json"
    }
  });

  return res.data.attributes;
}

// Supprimer un panel
async function deletePanelOnPtero(panel) {
  if (!panel.pteroId) return;
  await axios.delete(`${PTERO_URL}/api/application/servers/${panel.pteroId}`, {
    headers: {
      "Authorization": `Bearer ${PTERO_API_KEY}`,
      "Accept": "Application/vnd.pterodactyl.v1+json"
    }
  });
}

module.exports = { createPanelOnPtero, deletePanelOnPtero };
