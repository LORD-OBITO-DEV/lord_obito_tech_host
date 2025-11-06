const Panel = require('../models/Panel');
const { deletePanelOnPtero } = require('./pterodactylAPI'); // fonction à créer

async function checkExpiredPanels() {
  const now = new Date();
  const expiredPanels = await Panel.find({ expiresAt: { $lte: now }, status: "active" });

  for (const panel of expiredPanels) {
    try {
      await deletePanelOnPtero(panel); // supprime le panel sur Pterodactyl
      panel.status = "expired";
      await panel.save();
      console.log(`Panel ${panel.panelName} expiré et supprimé ✅`);
    } catch (err) {
      console.error(`Erreur suppression panel ${panel.panelName} :`, err);
    }
  }
}

// Vérifie toutes les 30 minutes
setInterval(checkExpiredPanels, 30 * 60 * 1000);
