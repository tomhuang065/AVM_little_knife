import mongoose from 'mongoose';
import dotenv from 'dotenv-defaults';
import dataInit from './upload';

export default {
    connect: () => {
        dotenv.config();
        if (!process.env.MONGO_URL) {
            console.error("Missing MONGO_URL!!!");
            process.exit(1);
        }
        mongoose.set('strictQuery', true);
        mongoose
        .connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true, 
        })
        .then((res) => {
            console.log("mongo db connection created")
            // dataInit();
        });
        mongoose.connection.on('error',
        console.error.bind(console, 'connection error:')); 
    }
};