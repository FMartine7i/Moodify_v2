import { Router } from 'express';
import { getAlbums, getAlbumsByMood } from '../controllers/albums.js';
const albumsRouter = Router();
albumsRouter.get('/', (req, res) => {
    if (req.query.mood)
        getAlbumsByMood(req, res);
    else
        getAlbums(req, res);
});
export default albumsRouter;
