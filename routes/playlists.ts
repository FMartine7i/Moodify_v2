import { Router, Request, Response } from 'express'
import { getPlaylists, getPlaylistsByMood } from '../controllers/playlists.js'
const playlistsRouter = Router()

playlistsRouter.get('/', (req: Request, res: Response) => {
  if (req.query.mood) getPlaylistsByMood(req, res)
  else getPlaylists(req, res)
})

export default playlistsRouter