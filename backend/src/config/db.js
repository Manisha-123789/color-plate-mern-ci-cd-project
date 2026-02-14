import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();



const uri = process.env.MONGODB_URI;
console.log(uri);
const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('db connected')

    } catch (error) {
        console.error('MongoDB connection failed', error.message);
    }
}

export default connectDB;

