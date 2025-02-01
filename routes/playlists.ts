import { Router, Request, Response } from 'express'
import { getPlaylists } from '../controllers/playlists.js'
const playlistsRouter = Router()

playlistsRouter.get('/', (req: Request, res: Response) => { getPlaylists(req, res) })

export default playlistsRouter