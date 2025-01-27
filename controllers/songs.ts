import { getSpotifyApi } from '../service/spotify_service.js';
import { Request, Response } from 'express'
import Song from '../models/songs_schema.js'
import moods from '../data/moods.json' assert { type: 'json' }

// -------------------- GET ALL SONGS -------------------
const getSongs = async (req: Request, res: Response) => {
  try {
    const { album, title, year, artist, ...invalidParams } = req.query
    const validParams = ['album', 'title', 'year']
    const extraParams = Object.keys(invalidParams).filter(param => !validParams.includes(param))
    // alertar que ciertos parámetros no son válidos
    if (extraParams.length > 0) return res.status(400).json({ error: `Parámetros inválidos: ${extraParams.join(', ')}` })
    
    const query: any = {}
    if (album) query.album = { $regex: album, $options: 'i' } // búsqueda insensible a mayúsculas y minúsculas
    if (title) query.title = { $regex: title, $options: 'i' } 
    if (artist) query.artist = { $regex: artist, $options: 'i' }
    if (year) query.year = year

    const songs = await Song.find(query)
    res.status(200).json(songs)
} catch (err) {
    res.status(500).json({ error: 'Error al obtener las canciones' })
  }
}

// -------------------- GET SONG BY ID -------------------
const getSongById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    // Validar que el ID sea un número válido
    if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'ID inválido' });

    const song = await Song.findOne({ id: Number(id) })
    if (!song) return res.status(404).json({ error: 'Canción no encontrada' })
    res.status(200).json(song)
  } catch {
    res.status(500).json({ error: 'Error al obtener la canción' })
  }
}

// -------------------- GET SONGS BY MOOD -------------------
const getSongsByMood = async (req: Request, res: Response) => {
  try{   
    const { mood } = req.query
    if (!mood || !(mood as string in moods)) return res.status(400).json({ error: 'Falta el parámetro de búsqueda (mood)' })
    
    const songsFromDB = await Song.find({ moods: mood })
    if ( songsFromDB.length >= 10 ) return res.status(200).json({ local: songsFromDB, spotify: [] })

    const spotifyApi = await getSpotifyApi()
    const keywords = moods[mood as keyof typeof moods]
    const query = keywords.join(' ')
    const response = await spotifyApi.searchTracks(query, { limit: 50 })
    const tracks = response.body.tracks?.items.map(track => ({
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      image: track.album.images[0].url,
      preview: track.preview_url || '',
      duration: track.duration_ms
    }))
    res.status(200).json({ local: songsFromDB, spotify: tracks })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las canciones' })
  }
}

export { getSongs, getSongById, getSongsByMood }