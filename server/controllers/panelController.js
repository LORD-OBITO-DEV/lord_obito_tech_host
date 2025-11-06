import Panel from '../models/Panel.js';

export async function createProvisionalPanel(req, res){
  try {
    const { type, ram, cpu, disk, durationDays, username, password, email, price } = req.body;
    const createdAt = new Date();
    const expireAt = new Date(createdAt.getTime() + durationDays * 24*60*60*1000);
    const panel = new Panel({
      panelId: `tmp-${Date.now()}`,
      type, ram, cpu, disk, durationDays, username, password, email, price,
      status: 'pending', createdAt, expireAt
    });
    await panel.save();
    return res.json({ success:true, panelId: panel.panelId });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success:false, message: e.message });
  }
}
