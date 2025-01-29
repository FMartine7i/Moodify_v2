import { getSpotifyApi } from '../service/spotify_service.js';
import { Request, Response } from 'express'
import Playlist from '../models/playlists_model.js'
import fs from 'fs'
import path from 'path' // leer dinámicamente el archivo JSON con los moods
const moods = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/moods.json'), 'utf-8'))

// -------------------- GET ALL PLAYLISTS -------------------
const getPlaylists = async (req: Request, res: Response) => {
  try {
    const query: any = {}
    const playlists = await Playlist.find(query)
    res.status(200).json(playlists)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las playlists' })
  }
}

// -------------------- GET PLAYLISTS BY MOOD -------------------
const getPlaylistsByMood = async (req: Request, res: Response) => {
  try {
    const { mood } = req.query
    if (!mood || !(mood as string in moods)) return res.status(400).json({ error: 'Falta el parámetro de búsqueda (mood)' })
    
    const playlistsFromDB = await Playlist.find({ moods: mood })
    if ( playlistsFromDB.length >= 10 ) return res.status(200).json({ local: playlistsFromDB, spotify: [] })
    
    const spotifyApi = await getSpotifyApi()
    const keywords = moods[mood as keyof typeof moods]
    const query = keywords.join(' ')
    const response = await spotifyApi.searchPlaylists(query, { limit: 50 })
    const playlists = response.body.playlists?.items.map(playlist => ({
      name: playlist.name,
      image: playlist.images[0].url,
      description: playlist.description
    }))
    res.status(200).json({ local: playlistsFromDB, spotify: playlists })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las playlists' })
  }
}

export { getPlaylists, getPlaylistsByMood }