import { getSpotifyApi } from '../service/spotify_service.js';
import { Request, Response } from 'express'
import { getNextSequence } from '../models/counter.js'
import { SongDAO } from '../DAO/song_dao.js'
import fs from 'fs'
import path from 'path' // leer dinámicamente el archivo JSON con los moods
const moods = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/moods.json'), 'utf-8'))
const songDao = new SongDAO()

// Función para formatear la duración de la canción dada en ms por dafault en minutos y segundos
const formatDuration = (ms: number) => {
  const minutes = Math.floor((ms / 1000) / 60)
  const seconds = Math.floor((ms / 1000) % 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
// ======================= ADD SONG to database =========================
const insertSong = async (req: Request, res: Response) => {
  try {
    const { name, artist, album, image, preview_url, duration, year } = req.body
    const song = await songDao.findByNameAndArtist(name, artist)
    if (song) return res.status(400).json({ error: 'La canción ya existe en la base de datos.' })
    if (!name || !artist || !album || !image || !duration || !year) return res.status(400).json({ error: 'Faltan campos obligatorios' })
    
    const songId = await getNextSequence('songId')
    const newSong = await songDao.create({
      id: songId,
      name: name,
      artist: artist,
      album: album,
      image: image,
      preview_url: preview_url || '',
      duration: formatDuration(duration),
      year: year
    })
    res.status(200).json(newSong)
  } catch (error) {
    console.error('Error al insertar la canción en la base de datos:', error)
    res.status(500).json({ error: 'Error al insertar la canción en la base de datos.' })
  }
}
// ====================== FETCH SONGS to database =======================
const fetchSongs = async () => {
  try {
    const playlist_id = process.env.PLAYLIST_ID
    if (!playlist_id) return console.log('PLAYLIST_ID env variable not found.')
    
    const spotifyApi = await getSpotifyApi()
    const response = await spotifyApi.getPlaylistTracks(playlist_id, { limit: 50 });
    const tracks = response.body.items
    // validar que la playlist no devuelva valores nulos
    if (!tracks || tracks.length === 0) {
      console.log('No se encontraron canciones en la playlist.')
      return
    } 
    // verificar que la canción no exista previamente en la BD
    for (const track of tracks) {
      const name = track.track?.name || ''
      const artist = track.track?.artists[0].name || ''
      const existingSong = await songDao.findByNameAndArtist(name, artist)
      if (existingSong) {
        console.log(`La canción ${track.track?.name} ya existe en la base de datos.`)
        continue  // salta al siguiente track
      }

      await songDao.create({
        name: name,
        artist: artist,
        album: track.track?.album.name || '',
        image: track.track?.album.images[0].url || '',
        preview_url: track.track?.preview_url || '',
        duration: formatDuration(track.track?.duration_ms || 0),
        year: track.track?.album.release_date.slice(0, 4) || ''
      })
    }
  } catch (err) {
    console.log('Error al agregar las canciones a la BD', err)
  }
}
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
    const response = await songDao.findAll(query)
    res.status(200).json(response)
} catch (err) {
    res.status(500).json({ error: 'Error al obtener las canciones' })
  }
}
// -------------------- GET SONG BY ID -------------------
const getSongById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const songId = Number(id)
    // Validar que el ID sea un número válido
    if (isNaN(songId)) return res.status(400).json({ error: 'ID inválido' });

    const song = await songDao.findById(songId)
    if (!song) return res.status(404).json({ error: 'Canción no encontrada' })
    res.status(200).json(song)
  } catch {
    res.status(500).json({ error: 'Error al obtener la canción' })
  }
}
// ===================== ADD SONG BY MOOD to database =======================
const fetchSongsByMood = async () => {
  try {    
    const spotifyApi = await getSpotifyApi()
    for (const mood in moods) {
      const keywords = moods[mood as keyof typeof moods]
      const query = keywords.join(' ')
      const response = await spotifyApi.searchTracks(query, { limit: 20 });
      const tracks = response.body.tracks?.items
      // validar que la playlist no devuelva valores nulos
      if (!tracks || tracks.length === 0) {
        console.log('No se encontraron canciones en la playlist.')
        return
      } 
      // verificar que la canción no exista previamente en la BD
      for (const track of tracks) {
        const name = track.name || ''
        const artist = track.artists[0].name || ''
        const existingSong = await songDao.findByNameAndArtist(name, artist)
        if (existingSong) {
          console.log(`La canción ${track.name} ya existe en la base de datos.`)
          continue  // salta al siguiente track
        }
        // si las palabras clave de la lista de moods no están en la canción, saltar a la siguiente canción
        if (!keywords.some((keyword: string) => name.toLowerCase().includes(keyword) ||
        artist.toLowerCase().includes(keyword))) {
            continue
        }

        await songDao.create({
          name: name,
          artist: artist,
          album: track.album.name || '',
          image: track.album.images[0].url || '',
          preview_url: track.preview_url || '',
          duration: formatDuration(track.duration_ms || 0),
          year: track.album.release_date.slice(0, 4) || ''
        })
      }
    }
  } catch(err) {
    console.log('Error al agregar las canciones a la BD', err)
  }
}

// -------------------- GET SONGS BY MOOD -------------------
const getSongsByMood = async (req: Request, res: Response) => {
  try{   
    const { mood } = req.query
    if (!moods.hasOwnProperty(mood as string)) return res.status(400).json({ error: 'Falta el parámetro de búsqueda (mood)' })
    
    const keywords = moods[mood as keyof typeof moods]
    const query = {
      $or: keywords.flatMap((keyword: string) => [
        { name: { $regex: keyword, $options: 'i' } },
        { artist: { $regex: keyword, $options: 'i' } }  
      ])
    }

    console.log("Cuerpo de la consulta:", JSON.stringify(query, null, 2));
    const response = await songDao.findAll(query)
    console.log("Cuerpo de la consulta:", {
      $or: keywords.flatMap((keyword: string) => ({
        name: { $regex: keyword, $options: 'i' },
        artist: { $regex: keyword, $options: 'i' },
      }))
    })
    console.log(response)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las canciones' })
  }
}

export { insertSong, fetchSongs, fetchSongsByMood, getSongs, getSongById, getSongsByMood }