import dotenv from 'dotenv';
dotenv.config();
import Server from './models/server.js';
const app = new Server();
app.listen();
