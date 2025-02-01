import { Playlist } from '../entities/playlist.js'
import PlaylistModel from '../models/playlist_model.js'

export class PlaylistDAO {
  // POST: insertar una canción
  async create(playlist: Playlist) {
    const newPlaylist = new PlaylistModel(playlist)
    return await newPlaylist.save()
  }
  // GET: obtener todas las canciones
  async findAll(query: any) {
    return await PlaylistModel.find(query)
  }
  // GET: obtener una canción por id
  async findById(id: number) {
    return await PlaylistModel.findOne({ id: id })
  }
  // GET: obtener canción por nombre y artista
  async findByNameAndArtist(name: String, artist: String) {
    return await PlaylistModel.findOne({ 
      name: { $regex: `^${name}$`, $options: 'i' }, 
      artist: { $regex: `^${artist}$`, $options: 'i' }, 
    })
  }
  // PUT: actualizar una canción
  async update(id: number, playlist: Playlist) {
    return await PlaylistModel.findByIdAndUpdate(id, playlist)
  }
}