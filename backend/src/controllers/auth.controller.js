import User from "../model/users.model.js";
import { generateToken } from "../../lib/utils.js";
import bcrypt, { hash } from 'bcryptjs';
import { sendWelcomeEmail } from "../../email/emailHandler.js";
import dotenv from 'dotenv';
dotenv.config();

export const signUp = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || password) {
            return res.status(400).json('All fields are required to fill');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json('Invalid Email Format');
        }

        if (password.length < 6) {
            return res.status(400).json('Password must be atleast 6 character');
        }

        const user = await User.findOne(
            { email },
        );
        if (user) {
            return res.status(400).json('Email already Exists');
        }
        const salt = await bcrypt.getSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashPassword,
        });

        if (newUser) {

            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            res.status({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, process.env.CLIENT_URL);
            } catch (error) {
                console.log("Failed to send Resend email");
            }
        } else {
            res.status(400).json('Invalid User');
        }
    } catch (error) {
        res.status(500).json('Error In SignUp: ', error);
    }
};

export const login = async (req, res) => {
    const { email, password } = await req.body;
    try {
        if (!email || !password) {
            return res.status(400).json('Email and Password Required');
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json('Invalid Credentials');
        }
        const isPasswordCorrect = await bcrypt.compare(password, User.password);
        if (!isPasswordCorrect) return res.status(400).json('Invalid Credentials');

        generateToken(user._id, res);

        return res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (error) {
        return res.status(400).json('User Not Found');
    }
}
