import express from 'express';
import AuthController from './../../controllers/authController.js';

const router = express.Router();
const authController = new AuthController();

router.post('/auth/login', authController.login.bind(authController));

export default router;