import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export async function sendPanelEmail(to, panel) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const html = `
    <h2>LORD OBITO TECH PANEL</h2>
    <p>Votre panel a été créé ✅</p>
    <p><b>Type :</b> ${panel.type}</p>
    <p><b>Panel :</b> ${panel.panelId}</p>
    <p><b>Nom d'utilisateur :</b> ${panel.username}</p>
    <p><b>Mot de passe :</b> ${panel.password}</p>
    <p><b>Durée :</b> ${panel.durationDays} jours</p>
    <small>Propulsé par LORD OBITO TECH</small>
  `;

  await transporter.sendMail({
    from: `"LORD OBITO TECH" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Votre panel LORD OBITO TECH est prêt',
    html
  });
}
