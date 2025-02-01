import { Album } from '../entities/album.js'
import AlbumModel from '../models/album_model.js'

export class AlbumDAO {
  // POST: insertar una canción
  async create(album: Album) {
    const newAlbum = new AlbumModel(album)
    return await newAlbum.save()
  }
  // GET: obtener todas las canciones
  async findAll(query: any) {
    return await AlbumModel.find(query)
  }
  // GET: obtener una canción por id
  async findById(id: number) {
    return await AlbumModel.findOne({ id: id })
  }
  // GET: obtener canción por nombre y artista
  async findByNameAndArtist(name: String, artist: String) {
    return await AlbumModel.findOne({ 
      name: { $regex: `^${name}$`, $options: 'i' }, 
      artist: { $regex: `^${artist}$`, $options: 'i' }, 
    })
  }
  // PUT: actualizar una canción
  async update(id: number, album: Album) {
    return await AlbumModel.findByIdAndUpdate(id, album)
  }
}