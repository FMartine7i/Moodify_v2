import Song from '../models/songs_scheme'
import Album from '../models/albums_scheme'
import Playlist from '../models/playlists_scheme'
import { Request, Response } from 'express'
import { getSpotifyApi } from '../service/spotify_service'

const fetchAndSaveSongs = async () => {
  try {
    const playlist_id = process.env.PLAYLIST_ID;   
    const spotifyApi = await getSpotifyApi()
    const response = await spotifyApi.searchTracks(playlist_id as string, { limit: 50 });
    const tracks = response.body.tracks?.items
    // validar que la id de la playlist esté definida en el archivo .env
    if (!playlist_id) throw new Error('La variable PLAYLIST_ID no está definida en el archivo .env')
    // validar que la playlist no devuelva valores nulos
    if (!tracks) {
     console.log('No se encontraron canciones en la playlist.')
      return
    }

    for ( const track of tracks ) {
      const song = new Song({
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          image: track.album.images[0].url,
          preview: track.preview_url || '',
          duration: track.duration_ms
      })
      await song.save()
    }
    console.log('Canciones guardadas en la base de datos.')
  } catch (err) {
    console.log(err)
  }
}

const fetchAndSaveAlbums = async (req: Request, res: Response) => {
  try {
    const spotifyApi = await getSpotifyApi()
    const query = req.query.q as string || 'league'
    const response = await spotifyApi.searchAlbums(query, { limit: 50 })
    const albums = response.body.albums?.items
    // validar que la consulta no devuelva valores nulos
    if (!query) return res.status(400).json({ error: 'Falta el parámetro de búsqueda (q)' })
    // validar que la búsqueda de álbumes no devuelva valores nulos
    if (!albums) {
      console.log('No se encontraron álbumes.')
      return
    }
    
    for (const album of albums) {
      const newAlbum = new Album({
        name: album.name,
        artist: album.artists[0].name,
        image: album.images[0].url,
        release_date: album.release_date || ''
      })
      await newAlbum.save()
    }
    res.status(200).json({ message: 'Álbumes guardados en la base de datos.' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Error al obtener los álbumes.' })
  }
}

const fetchAndSavePlaylists = async (req: Request, res: Response) => {
  try {
    const spotifyApi = await getSpotifyApi()
    const query = req.query.q as string || 'gaming'
    const response = await spotifyApi.searchPlaylists(query, { limit: 50 })
    const playlists = response.body.playlists?.items
    // validar que la consulta no devuelva valores nulos
    if (!query) return res.status(400).json({ error: 'Falta el parámetro de búsqueda (q)' })
    // validar que la búsqueda de playlists no devuelva valores nulos
  if (!playlists) {
      console.log('No se encontraron playlists.')
      return
    }
  for (const playlist of playlists) {
    const newPlaylist = new Playlist({
      name: playlist.name,
      image: playlist.images[0].url,
      description: playlist.description || ''
    })
    await newPlaylist.save()
   }
   res.status(200).json({ message: 'Playlists guardadas en la base de datos.' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Error al obtener las playlists.' })
  } 
}

export { fetchAndSaveSongs, fetchAndSaveAlbums, fetchAndSavePlaylists }