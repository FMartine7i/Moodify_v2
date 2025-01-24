import { Router, Request, Response } from "express"
const { getSongs, getSongById, getSongsByMood } = require('../controllers/songs')

Router().get('/', (req: Request, res: Response) => {
    if (req.query.mood) getSongsByMood(req, res)
    else getSongs(req, res)
})
Router().get('/:id', getSongById)

export default Router