import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `mongodb://${process.env.MONGO_USERNAME}:${
    process.env.MONGO_PASSWORD
}@${process.env.HOST_SERVER || 'localhost'}:${process.env.DATABASE_PORT}/${
    process.env.MONGO_DATABASE
}`;

async function connectDB() {
    try {
        const conn = await mongoose.connect(connectionString);
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
}

export default connectDB;
