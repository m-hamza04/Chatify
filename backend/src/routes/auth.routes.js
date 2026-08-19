import express from 'express';
import { signUp } from '../controllers/auth.controller';

const router = express.Router();


router.get('/login', (req, res) => {
   res.send('Login Page');
});

router.get('/signup', signUp);

router.get('/logout', (req, res) => {
   res.send('Logout Page');
});

export default router;