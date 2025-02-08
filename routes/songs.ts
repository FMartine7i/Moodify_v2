import { Router, Request, Response } from 'express'
import { insertSong, getSongs, getSongById, getSongsByMood } from '../controllers/songs.js'
const songsRouter =  Router()

songsRouter.get('/', (req: Request, res: Response) => { if (req.query.mood) getSongsByMood(req, res); else getSongs(req, res)})
songsRouter.get('/:id', (req: Request, res: Response) => { getSongById(req, res) })
songsRouter.post('/', (req: Request, res: Response) => { insertSong(req, res) })

export default songsRouter