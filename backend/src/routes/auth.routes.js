import express from 'express';
import { signUp, login, logout } from '../controllers/auth.controller';

const router = express.Router();


router.get('/login', login);

router.post('/signup', signUp);

router.post('/logout', logout);

export default router;