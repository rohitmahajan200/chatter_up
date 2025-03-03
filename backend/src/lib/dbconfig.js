import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()

export const connetDB = async () => {
    try {
        const connection=await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB is connected: ${connection.connection.host}`);
    } catch (error) {
        console.log("Error while connecting to DB: ",error);   
    }
    
}