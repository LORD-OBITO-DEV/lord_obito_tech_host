import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const Environment = process.env.PAYPAL_MODE === "live"
  ? paypal.core.LiveEnvironment
  : paypal.core.SandboxEnvironment;

const client = new paypal.core.PayPalHttpClient(
  new Environment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET)
);

export const captureOrder = async (req, res) => {
  try {
    const { orderID, userData } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    const capture = await client.execute(request);

    // ✅ Crée automatiquement un panel
    await axios.post(`${process.env.BASE_URL}/api/panel/create`, userData);

    res.json({ success: true, capture: capture.result });
  } catch (err) {
    console.error("Erreur PayPal :", err.message);
    res.status(500).json({ error: "Erreur capture paiement PayPal" });
  }
};
