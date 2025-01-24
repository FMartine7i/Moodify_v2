import { getSpotifyApi } from '../service/spotifyService';
import { Request, Response } from 'express'
import Song from '../models/songs_scheme'

// -------------------- GET ALL SONGS -------------------
const getSongs = async (req: Request, res: Response) => {
  try {
    const { genre, title, year} = req.query
    const query: any = {}

    if (genre) query.genre = genre
    if (title) query.title = { $regex: title, $options: 'i' } // búsqueda insensible a mayúsculas y minúsculas
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
    const songId = req.params.id
    const song = await Song.findById(songId)
    if (!song) {
      return res.status(404).json({ error: 'Canción no encontrada' })
    }
    res.status(200).json(song)

  } catch {
    res.status(500).json({ error: 'Error al obtener la canción' })
  }
}

// -------------------- GET SONGS BY MOOD -------------------
const moodToKeywords = {
  relaxed: ['chill', 'acoustic', 'relax', 'lofi', 'reggae', 'chillhop'],
  happy: ['happy', 'uplifting', 'coldplay', 'energetic', 'abba', 'pop', 'summer'],
  sad: ['melancholy', 'sad', 'emotional', 'slow', 'damien rice', 'tom odell'],
  angry: ['metal', 'hard rock', 'judas priest', 'metallica', 'iron maiden', 'pantera'],
  dark: ['dark', 'gloomy', 'somber', 'bauhaus', 'depeche mode'],
  romantic: ['romantic', 'love', 'duran duran', 'the cure'],
  emotional: ['emotional', 'heartfelt', 'expressive', 'soulful']
  }

const getSongsByMood = async (req: Request, res: Response) => {
  const spotifyApi = await getSpotifyApi();
  const { mood } = req.params

}