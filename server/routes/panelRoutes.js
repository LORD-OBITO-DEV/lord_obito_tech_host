import express from 'express';
import { createProvisionalPanel } from '../controllers/panelController.js';
const router = express.Router();
router.post('/create', createProvisionalPanel);
export default router;
