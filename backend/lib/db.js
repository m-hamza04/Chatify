import mongoose from 'mongoose';

export const connection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to Database');
    } catch (error) {
        console.error('Connection Failed:', error.message);
        process.exit(1);
    }
}