import { getSpotifyApi } from '../service/spotify_service.js';
import { Request, Response } from 'express'
import Album from '../models/playlists_scheme.js'
import moods from '../data/moods.json' assert { type: 'json' }

// -------------------- GET ALL PLAYLISTS -------------------
const getPlaylists = async (req: Request, res: Response) => {
  try {
    const query: any = {}
    const playlists = await Album.find(query)
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
    
    const playlistsFromDB = await Album.find({ moods: mood })
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