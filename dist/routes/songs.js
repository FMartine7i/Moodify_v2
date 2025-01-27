import { Router } from 'express';
import { getSongs, getSongById, getSongsByMood } from '../controllers/songs.js';
const songsRouter = Router();
songsRouter.get('/', (req, res) => {
    if (req.query.mood)
        getSongsByMood(req, res);
    else
        getSongs(req, res);
});
songsRouter.get('/:id', (req, res) => { getSongById(req, res); });
export default songsRouter;
