import jwt from 'jsonwebtoken';
import User from '../lib/db';
import dotenv from 'dotenv';
dotenv.config();

export const authentification = async (req, res) => {
    try {
        const token = req.cookie.jwt;
        if (!token) return res.status(401).json('Unauthorize - No token provided');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json('Unauthorize - Invalid token');

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return res.status(401).json('Unauthorize - Invalid User');
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json('Internal Server Error');
    }
}