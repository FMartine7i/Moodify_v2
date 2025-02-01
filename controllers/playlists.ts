import { getSpotifyApi } from '../service/spotify_service.js';
import { Request, Response } from 'express'
import Playlist from '../models/playlist_model.js'
import { PlaylistDAO } from '../DAO/playlist_dao.js'
import fs from 'fs'
import path from 'path' // leer dinámicamente el archivo JSON con los moods
const moods = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/moods.json'), 'utf-8'))
const playlistDao = new PlaylistDAO()

// ====================== ADD PLAYLIST to database =======================
const fetchPlaylists = async () => {
  try {
    const spotifyApi = await getSpotifyApi()
    const query = 'gaming' as string
    const response = await spotifyApi.searchPlaylists(query, { limit: 50 })
    // validar que la búsqueda de playlists no devuelva valores nulos
    if (!response.body.playlists || !response.body.playlists.items) {
      console.log('No playlists found.');
      return;
    }
    // verificar que la playlist no exista previamente en la BD
    for (const playlist of response.body.playlists.items) {
      const existingPlaylist = await Playlist.findOne({ name: playlist.name })
      if (existingPlaylist) {
        console.log(`La playlist ${playlist.name} ya existe en la base de datos.`)
        continue  // salta al siguiente álbum
      }
    }

    const playlists = response.body.playlists.items
    for (const playlist of playlists) {
      if (!playlist.name || !playlist.images || playlist.images.length === 0) {
        console.log('Playlist con datos incompletos, se omite.');
        continue;
      }
      await playlistDao.create({
        name: playlist.name,
        image: playlist.images[0].url || '',
        description: playlist.description || ''
     })
   }
    console.log('Playlists guardadas en la base de datos.')
  } catch (err) {
    console.log('Error al obtener playlists', err)
  } 
}
// -------------------- GET ALL PLAYLISTS -------------------
const getPlaylists = async (req: Request, res: Response) => {
  try {
    const query: any = {}
    const playlists = await playlistDao.findAll(query)
    res.status(200).json(playlists)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las playlists' })
  }
}

export { fetchPlaylists, getPlaylists }