import express from 'express';
import { signUp, login, logout, updateProfile } from '../controllers/auth.controller';
import { authentification } from '../../middleware/authentication';
import arcjetProtection from '../../middleware/arcjet.middleware';

const router = express.Router();
router.use(arcjetProtection);

router.get('/login', login);
router.post('/signup', signUp);
router.post('/logout', logout);
router.patch('/update-profile', authentification, updateProfile);
export default router;