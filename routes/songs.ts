import { Router, Request, Response } from 'express'
import { getSongs, getSongById, getSongsByMood } from '../controllers/songs.js'
const songsRouter =  Router()

songsRouter.get('/', (req: Request, res: Response) => {
  if (req.query.mood) getSongsByMood(req, res)
  else getSongs(req, res)
})
songsRouter.get('/:id', (req: Request, res: Response) => { getSongById(req, res) })

export default songsRouter