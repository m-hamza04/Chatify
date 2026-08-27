import express from 'express';
import { signUp, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { authentification } from '../../middleware/authentication.js';
import arcjetProtection from '../../middleware/arcjet.middleware.js';

const router = express.Router();
router.use(arcjetProtection);

router.get('/login', login);
router.post('/signup', signUp);
router.post('/logout', logout);
router.get('/check', authentification, checkAuth);
router.patch('/update-profile', authentification, updateProfile);
export default router;