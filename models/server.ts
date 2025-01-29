import dotenv from 'dotenv'
dotenv.config()
import express, { Application } from 'express'
import cors from 'cors'
import songsRouter from '../routes/songs.js'
import albumsRouter from '../routes/albums.js'
import playlistsRouter from '../routes/playlists.js'
import usersRouter from '../routes/users.js'
import connectDB from '../database/conex.js'
import http from 'http'

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
    this.app.use('/api/v2/playlists', playlistsRouter)
    this.app.use('/api/v2/users', usersRouter)
  }
  // conexión a base de datos
  public async listen() {
    try {
      await connectDB()
      this.app.listen(this.port, () => {
        console.log(`Servidor corriendo en http://:${this.port}`)
      })
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err)
        process.exit(1)
    }
  }
}

export default Server