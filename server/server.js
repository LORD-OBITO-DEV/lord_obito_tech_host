import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import paypalRoutes from "./routes/paypalRoutes.js";
import panelRoutes from "./routes/panelRoutes.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/paypal", paypalRoutes);
app.use("/api/panel", panelRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "checkout.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur en ligne sur le port ${PORT}`));
