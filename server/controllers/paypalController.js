import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';
dotenv.config();

// Configuration PayPal
const environment =
  process.env.PAYPAL_MODE === 'live'
    ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
    : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

const client = new paypal.core.PayPalHttpClient(environment);

// 🧾 Créer une commande PayPal
export const createOrder = async (req, res) => {
  try {
    const { amount, description } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount,
          },
          description: description || 'Panel Hosting LORD OBITO TECH HOST',
        },
      ],
    });

    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error('Erreur création commande PayPal:', err);
    res.status(500).json({ error: 'Erreur lors de la création de la commande PayPal' });
  }
};

// 💰 Capturer le paiement PayPal
export const captureOrder = async (req, res) => {
  try {
    const { orderID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client.execute(request);
    res.json({ success: true, details: capture.result });
  } catch (err) {
    console.error('Erreur capture paiement PayPal:', err);
    res.status(500).json({ error: 'Erreur lors de la capture du paiement PayPal' });
  }
};
