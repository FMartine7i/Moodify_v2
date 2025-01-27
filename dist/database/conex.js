import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGODB_URI || '';
const connectDB = async () => {
    // mensaje de error por si la uri no esta configurada
    if (!uri) {
        console.log('No se ha configurado la URI de la base de datos en el archivo .env');
        return;
    }
    try {
        await mongoose.connect(uri);
        console.log('base de datos conectada con mongoose');
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
export default connectDB;
