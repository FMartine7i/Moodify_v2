import { initializeCounters } from '../models/counter.js'
import connectDB from './conex.js'
import { fetchSongs, fetchSongsByMood } from '../controllers/songs.js'
import { fetchAlbums, fetchAlbumsByMood } from '../controllers/albums.js'
import { fetchPlaylists } from '../controllers/playlists.js'

const initializeDatabase = async () => {
  try {
    ///conectar a la base de datos
    await connectDB()
    console.log('Conectado a la base de datos.')
    //inicializar contadores
    await initializeCounters()
    await fetchSongs()
    await fetchSongsByMood()  
    await fetchAlbums()
    await fetchAlbumsByMood()
    await fetchPlaylists()
  } catch (err) {
    console.log('No se ha podido conectar a la base de datos', err)
  }
}
// ejecutar script
initializeDatabase()
  .then(() => {
    console.log('Inicialización completada.')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Error al inicializar la base de datos:', err)
    process.exit(1)
  })

export default initializeDatabase