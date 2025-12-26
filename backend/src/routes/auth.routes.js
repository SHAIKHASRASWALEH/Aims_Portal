import express from 'express';
import { sendOTP, verifyOTP, logout, checkLoggedIn } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/',checkLoggedIn);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/logout',authenticate, logout);

export default router;
