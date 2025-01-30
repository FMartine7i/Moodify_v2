import { Router, Request, Response } from 'express'
import { getAlbums, getAlbumById, getAlbumsByMood } from '../controllers/albums.js'
const albumsRouter = Router()

albumsRouter.get('/', (req: Request, res: Response) => {
  if (req.query.mood) getAlbumsByMood(req, res)
  else getAlbums(req, res)
})
albumsRouter.get('/:id', (req: Request, res: Response) => { getAlbumById(req, res) })

export default albumsRouter