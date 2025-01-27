import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import songsRouter from '../routes/songs.js';
import albumsRouter from '../routes/albums.js';
import playlistsRouter from '../routes/playlists.js';
import connectDB from '../database/conex.js';
class Server {
    app;
    port;
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.middlewares();
        this.routes();
    }
    // levantar el servidor
    middlewares() {
        this.app.use(express.static('public'));
        this.app.use(cors());
        this.app.use(express.json());
    }
    // configuración de rutas
    routes() {
        this.app.use('/api/v2/songs', songsRouter);
        this.app.use('/api/v2/albums', albumsRouter);
        this.app.use('/api/v2/playlists', playlistsRouter);
    }
    // conexión a base de datos
    async listen() {
        try {
            await connectDB();
            this.app.listen(this.port, () => {
                console.log(`Servidor corriendo en puerto ${this.port}`);
            });
        }
        catch (err) {
            console.error('Error al conectar a la base de datos:', err);
            process.exit(1);
        }
    }
}
export default Server;
