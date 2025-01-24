import Song from '../models/songs_scheme'
import Album from '../models/albums_scheme'
import { Request, Response } from 'express'
import { getSpotifyApi } from '../service/spotifyService'

export const fetchAndSaveSongs = async () => {
  try {
    const playlist_id = process.env.PLAYLIST_ID;
    
    const spotifyApi = await getSpotifyApi()
    const response = await spotifyApi.searchTracks(playlist_id as string, { limit: 50 });
    const tracks = response.body.tracks?.items

    if (!playlist_id) throw new Error('La variable PLAYLIST_ID no está definida en el archivo .env')
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

export const fetchAndSaveAlbums = async (req: Request, res: Response) => {
  try {
    const spotifyApi = await getSpotifyApi()
    const query = req.query.q as string
    const response = await spotifyApi.searchAlbums(query, { limit: 50 })
    const albums = response.body.albums?.items
    
    if (!query) return res.status(400).json({ error: 'Falta el parámetro de búsqueda (q)' })
    if (!albums) {
      console.log('No se encontraron álbumes.')
      return
    }
    
    for (const album of albums) {
      const newAlbum = new Album({
        name: album.name,
        artist: album.artists[0].name,
        image: album.images[0].url,
        release_date: album.release_date
      })
      await newAlbum.save()
    }
    res.status(200).json({ message: 'Álbumes guardados en la base de datos.' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Error al obtener los álbumes.' })
  }
}
