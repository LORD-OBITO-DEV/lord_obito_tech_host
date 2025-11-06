import express from "express";
import { createPanel } from "../controllers/panelController.js";

const router = express.Router();

// Route de création après paiement
router.post("/create", createPanel);

export default router;
