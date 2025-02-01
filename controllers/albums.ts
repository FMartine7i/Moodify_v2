import { getSpotifyApi } from '../service/spotify_service.js';
import { Request, Response } from 'express'
import Album from '../models/album_model.js'
import fs from 'fs'
import path from 'path' // leer dinámicamente el archivo JSON con los moods
import { AlbumDAO } from '../DAO/album_dao.js'
const albumDao = new AlbumDAO()
const moods = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/moods.json'), 'utf-8'))

// ====================== ADD ALBUM to database =======================
const fetchAlbums = async () => {
  try {
    const spotifyApi = await getSpotifyApi()
    const query = 'league' as string
    const response = await spotifyApi.searchAlbums(query, { limit: 50 })
    const albums = response.body.albums?.items
    // validar que la búsqueda de álbumes no devuelva valores nulos
    if (!albums) {
      console.log('No se encontraron álbumes.')
      return
    }
    // verificar que el álbum no exista previamente en la BD
    for (const album of albums) {
      const existingAlbum = await Album.findOne({ name: album.name, artist: album.artists[0].name })
      if (existingAlbum) {
        console.log(`El álbum ${album.name} ya existe en la base de datos.`)
        continue  // salta al siguiente álbum
      }
    }
    
    for (const album of albums) {
      const name = album.name || ''
      const artist = album.artists[0].name || ''
      const existingAlbum = await albumDao.findByNameAndArtist(name, artist)
      if (existingAlbum) {
        console.log(`El álbum ${album.name} ya existe en la base de datos.`)
        continue  // salta al siguiente álbum
      }

      await albumDao.create({
        name: name,
        artist: artist,
        image: album.images[0].url || '',
        release_date: album.release_date || ''
      })
    }
    console.log('Álbumes guardados en la base de datos.')
  } catch (err) {
    console.log(err)
  }
}
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

    const response = await albumDao.findAll(query)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los álbumes' })
  }
}

const getAlbumById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const albumId =  Number(id)
    // Validar que el ID sea un número válido
    if (isNaN(albumId)) return res.status(400).json({ error: 'ID inválido' });
    const album = await albumDao.findById(albumId)
    if (!album) return res.status(404).json({ error: 'Álbum no encontrado' })
    res.status(200).json(album)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el álbum' })
  }
}

// ====================== FETCH ALBUMS by mood =======================
const fetchAlbumsByMood = async () => {
  try {    
    const spotifyApi = await getSpotifyApi()
    for (const mood in moods) {
      const keywords = moods[mood as keyof typeof moods]
      const query = keywords.join(' ')
      const response = await spotifyApi.searchAlbums(query, { limit: 20 });
      const albums = response.body.albums?.items
      // validar que la playlist no devuelva valores nulos
      if (!albums || albums.length === 0) {
        console.log('No se encontraron canciones en la playlist.')
        return
      } 
      // verificar que la canción no exista previamente en la BD
      for (const album of albums) {
        const name = album.name || ''
        const artist = album.artists[0].name || ''
        const existingAlbum = await albumDao.findByNameAndArtist(name, artist)
        if (existingAlbum) {
          console.log(`El album ${name} ya existe en la base de datos.`)
          continue  // salta al siguiente track
        }
        // si las palabras clave de la lista de moods no están en la canción, saltar a la siguiente canción
        if (!keywords.some((keyword: string) => name.toLowerCase().includes(keyword) ||
        artist.toLowerCase().includes(keyword))) continue

        await albumDao.create({
          name: name,
          artist: artist,
          image: album.images[0].url || '',
          release_date: album.release_date.slice(0, 4) || ''
        })
      }
    }
  } catch(err) {
    console.log('Error al agregar las canciones a la BD', err)
  }
}

// -------------------- GET ALBUMS BY MOOD -------------------
const getAlbumsByMood = async (req: Request, res: Response) => {
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
    const response = await albumDao.findAll(query)
    console.log("Cuerpo de la consulta:", {
      $or: keywords.flatMap((keyword: string) => ({
        name: { $regex: keyword, $options: 'i' }
      }))
    })
    console.log(response)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las canciones' })
  }
}

export { fetchAlbums, getAlbums, getAlbumById, fetchAlbumsByMood, getAlbumsByMood }