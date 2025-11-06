const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuration PayPal
const environment = process.env.PAYPAL_MODE === 'live' 
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

const client = new paypal.core.PayPalHttpClient(environment);

// Nodemailer pour envoyer le panel
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Route pour créer un paiement
router.post('/create', async (req, res) => {
  const { price, email, panelName, username, password, service } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{
      amount: { currency_code: "EUR", value: price },
      description: `Achat panel ${service} - ${panelName}`
    }]
  });

  try {
    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Route pour capturer un paiement
router.post('/capture', async (req, res) => {
  const { orderID, email, panelName, username, password, service } = req.body;

  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await client.execute(request);

    // Envoyer un mail avec les infos du panel
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Votre panel ${panelName} est prêt !`,
      html: `
        <h2>Merci pour votre achat ✅</h2>
        <p>Voici vos informations :</p>
        <ul>
          <li>Nom panel: ${panelName}</li>
          <li>Service: ${service}</li>
          <li>Username: ${username}</li>
          <li>Password: ${password}</li>
        </ul>
        <p>Connectez-vous et profitez de votre panel !</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error);
      else console.log('Email envoyé : ' + info.response);
    });

    res.json({ status: 'success', capture });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
