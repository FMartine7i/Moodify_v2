import { getSpotifyApi } from '../service/spotify_service.js';
import { Request, Response } from 'express'
import Album from '../models/albums_model.js'
import fs from 'fs'
import path from 'path' // leer dinámicamente el archivo JSON con los moods
const moods = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/moods.json'), 'utf-8'))

// -------------------- GET ALL ALBUMS -------------------
const getAlbums = async (req: Request, res: Response) => {
  try {
    const { title, artist, year, ...invalidParams } = req.query
    const validParams = ['title', 'artist', 'year']
    const extraParams = Object.keys(invalidParams).filter(param => !validParams.includes(param))
    // alertar que ciertos parámetros no son válidos
    if (extraParams.length > 0) return res.status(400).json({ error: `Parámetros inválidos: ${extraParams.join(', ')}` })
    
    const query: any = {}
    if (title) query.title = { $regex: title, $options: 'i' } // búsqueda insensible a mayúsculas y minúsculas
    if (artist) query.title = { $regex: artist, $options: 'i' }
    if (year) query.year = year

    const albums = await Album.find(query)
    res.status(200).json(albums)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los álbumes' })
  }
}

const getAlbumById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    // Validar que el ID sea un número válido
    if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'ID inválido' });
    const album = await Album.findOne({ id: Number(id) })
    if (!album) return res.status(404).json({ error: 'Álbum no encontrado' })
    res.status(200).json(album)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el álbum' })
  }
}

// -------------------- GET ALBUMS BY MOOD -------------------
const getAlbumsByMood = async (req: Request, res: Response) => {
  try {
    const { mood } = req.query
    if (!mood || !(mood as string in moods)) return res.status(400).json({ error: 'Falta el parámetro de búsqueda (mood)' })
    
    const albumsFromDB = await Album.find({ moods: mood })
    if ( albumsFromDB.length >= 10 ) return res.status(200).json({ local: albumsFromDB, spotify: [] })
    
    const spotifyApi = await getSpotifyApi()
    const keywords = moods[mood as keyof typeof moods]
    const query = keywords.join(' ')
    const response = await spotifyApi.searchAlbums(query, { limit: 50 })
    const albums = response.body.albums?.items.map(album => ({
      name: album.name,
      artist: album.artists[0].name,
      image: album.images[0].url,
      release_date: album.release_date.split('-')[0]
    }))
    res.status(200).json({ local: albumsFromDB, spotify: albums })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los álbumes' })
  }
}

export { getAlbums, getAlbumById, getAlbumsByMood }