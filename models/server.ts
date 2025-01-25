import dotenv from 'dotenv'
dotenv.config()
import express, { Application } from 'express'
import cors from 'cors'
import connectDB from '../database/conex.js'
import initializeCounters from '../database/init_database.js'
import { fetchAndSaveSongs, fetchAndSaveAlbums, fetchAndSavePlaylists } from '../database/fetch_items.js'
import songsRouter from '../routes/songs.js'
import albumsRouter from '../routes/albums.js'

class Server {
  private app: Application
  private port: string | number

  constructor () {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.middlewares()
    this.routes()
  }
  // levantar el servidor
  middlewares() {
    this.app.use(express.static('public'))
    this.app.use(cors())
    this.app.use(express.json())
  }
  // configuración de rutas
  routes() {
    this.app.use('/api/v2/songs', songsRouter)
    this.app.use('/api/v2/albums', albumsRouter)
  }
  // conexión a base de datos
  public async listen() {
    try {
      await connectDB()
      await fetchAndSaveSongs()
      await fetchAndSaveAlbums()
      await fetchAndSavePlaylists()
      await initializeCounters()
      console.log('Base de datos y contadores inicializados.')
      this.app.listen(this.port, () => {
        console.log(`Servidor corriendo en puerto ${this.port}`)
      })
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err)
        process.exit(1)
    }
  }
}

export default Server