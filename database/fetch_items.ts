import dotenv from 'dotenv'
dotenv.config()
import Song from '../models/songs_model.js'
import Album from '../models/albums_model.js'
import Playlist from '../models/playlists_model.js'
import { getSpotifyApi } from '../service/spotify_service.js'

// Función para formatear la duración de la canción dada en ms por dafault en minutos y segundos
const formatDuration = (ms: number) => {
  const minutes = Math.floor((ms / 1000) / 60)
  const seconds = Math.floor((ms / 1000) % 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

// Función para obtener el objeto SpotifyApi. Tiene un parámetro para pasar el contador importado en init_database.ts como argumento
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
    // verificar que la canción no exista previamente en la BD
    for (const track of tracks) {
      const existingSong = await Song.findOne({ name: track.track?.name, artist: track.track?.artists[0].name})
      if (existingSong) {
        console.log(`La canción ${track.track?.name} ya existe en la base de datos.`)
        continue  // salta al siguiente track
      }
    }

    for ( const track of tracks ) {
      const song = new Song({
        name: track.track?.name,
        artist: track.track?.artists[0].name,
        album: track.track?.album.name,
        image: track.track?.album.images[0].url || '',
        preview_url: track.track?.preview_url || '',
        duration: formatDuration(track.track?.duration_ms || 0),
        year: track.track?.album.release_date.slice(0, 4) || 0
      })
      await song.save()
    }
    console.log('Canciones guardadas/actualizadas en la base de datos.')
  } catch (err) {
    console.log('Error al agregar las canciones a la BD', err)
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
    // verificar que el álbum no exista previamente en la BD
    for (const album of albums) {
      const existingAlbum = await Album.findOne({ name: album.name, artist: album.artists[0].name })
      if (existingAlbum) {
        console.log(`El álbum ${album.name} ya existe en la base de datos.`)
        continue  // salta al siguiente álbum
      }
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
      const newPlaylist = new Playlist({
        name: playlist.name,
        image: playlist.images[0].url || '',
        description: playlist.description || ''
     })
     // Si la base de datos ya tiene el album guardado, lo actualiza
     await Playlist.updateOne(
      { name: playlist.name, image: playlist.images[0].url }, 
      { $set: newPlaylist },
      { upsert: true } // si el álbum no está en la BD, lo crea
    )
   }
    console.log('Playlists guardadas en la base de datos.')
  } catch (err) {
    console.log('Error al obtener playlists', err)
  } 
}

export  { fetchAndSaveSongs, fetchAndSaveAlbums, fetchAndSavePlaylists }