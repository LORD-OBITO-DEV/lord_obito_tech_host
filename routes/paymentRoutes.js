const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypalController');

router.post('/paypal/create', paypalController.createOrder);
router.post('/paypal/capture', paypalController.captureOrder);

// Routes pour Wave / Orange seront ajoutées ici
router.post('/wave', (req, res) => res.send("Paiement Wave non implémenté"));
router.post('/orange', (req, res) => res.send("Paiement Orange Money non implémenté"));

module.exports = router;
