import express from 'express';
import { createOrder, captureOrder } from '../controllers/paypalController.js';
const router = express.Router();
router.post('/create', createOrder);
router.post('/capture', captureOrder);
export default router;
