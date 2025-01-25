import dotenv from 'dotenv'
dotenv.config()
import Song from '../models/songs_scheme.js'
import Album from '../models/albums_scheme.js'
import Playlist from '../models/playlists_scheme.js'
import { getSpotifyApi } from '../service/spotify_service.js'

const fetchAndSaveSongs = async () => {
  try {
    const playlist_id = process.env.PLAYLIST_ID;
    if (!playlist_id) throw new Error('La variable PLAYLIST_ID no está definida en el archivo .env');

    const spotifyApi = await getSpotifyApi()
    const response = await spotifyApi.getPlaylistTracks(playlist_id, { limit: 50 });
    const tracks = response.body.items
    // validar que la playlist no devuelva valores nulos
    if (!tracks || tracks.length === 0) {
     console.log('No se encontraron canciones en la playlist.')
      return
    }

    for ( const track of tracks ) {
      const duration_ms = track.track?.duration_ms as number
      const minutes = Math.floor((duration_ms / 1000) / 60)
      const seconds = Math.floor((duration_ms / 1000) % 60)
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds
      const duration = `${minutes}:${formattedSeconds}`
      const song = new Song({
          name: track.track?.name,
          artist: track.track?.artists[0].name,
          album: track.track?.album.name,
          image: track.track?.album.images[0].url || '',
          preview_url: track.track?.preview_url || '',
          duration: duration,
          year: track.track?.album.release_date.slice(0, 4) || 0
      })
      await song.save()
    }
    console.log('Canciones guardadas en la base de datos.')
  } catch (err) {
    console.log(err)
  }
}

const fetchAndSaveAlbums = async () => {
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
    
    for (const album of albums) {
      const newAlbum = new Album({
        name: album.name,
        artist: album.artists[0].name,
        image: album.images[0].url,
        release_date: album.release_date || ''
      })
      await newAlbum.save()
    }
    console.log('Álbumes guardados en la base de datos.')
  } catch (err) {
    console.log(err)
  }
}

const fetchAndSavePlaylists = async () => {
  try {
    const spotifyApi = await getSpotifyApi()
    const query = 'gaming' as string
    const response = await spotifyApi.searchPlaylists(query, { limit: 50 })

    if (!response.body.playlists || !response.body.playlists.items) {
      console.log('No playlists found.');
      return;
    }

    const playlists = response.body.playlists.items
    for (const playlist of playlists) {
      if (!playlist.name || !playlist.images || playlist.images.length === 0) {
        console.log('Playlist con datos incompletos, se omite.');
        continue;
      }
      const newPlaylist = new Playlist({
        name: playlist.name,
        image: playlist.images[0].url || '',
        description: playlist.description || ''
     })
     await newPlaylist.save()
   }
    console.log('Playlists guardadas en la base de datos.')
  } catch (err) {
    console.log('Error al obtener playlists', err)
  } 
}

export  { fetchAndSaveSongs, fetchAndSaveAlbums, fetchAndSavePlaylists }