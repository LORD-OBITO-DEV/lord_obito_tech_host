import fetch from 'node-fetch';
import dotenv from 'dotenv';
import Panel from '../models/Panel.js';
import { sendPanelEmail } from '../utils/mailer.js';

dotenv.config();
const PAYPAL_BASE = process.env.PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

async function getAccessToken(){
  const client = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const auth = Buffer.from(`${client}:${secret}`).toString('base64');
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method:'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type':'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  });
  return res.json();
}

export async function createOrder(req, res){
  try {
    const { amount } = req.body;
    if(!amount) return res.status(400).json({ success:false, message:'amount required' });

    const tokenJson = await getAccessToken();
    const accessToken = tokenJson.access_token;
    const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method:'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: 'EUR', value: amount.toFixed ? amount.toFixed(2) : String(amount) } }]
      })
    });
    const orderJson = await orderRes.json();
    return res.json(orderJson);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success:false, message: e.message });
  }
}

export async function captureOrder(req, res){
  try {
    const { orderID, panelId } = req.body;
    if(!orderID) return res.status(400).json({ success:false, message:'orderID required' });

    const tokenJson = await getAccessToken();
    const accessToken = tokenJson.access_token;

    const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method:'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const captureJson = await captureRes.json();

    // finalize panel: find provisional panel and mark active
    if(panelId){
      const panel = await Panel.findOne({ panelId: panelId });
      if(panel){
        panel.status = 'active';
        await panel.save();
        // send email
        await sendPanelEmail(panel.email, panel);
      }
    }
    return res.json({ success:true, capture: captureJson });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success:false, message: e.message });
  }
  }
