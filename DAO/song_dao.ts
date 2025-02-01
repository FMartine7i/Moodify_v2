import SongModel from "../models/song_model.js";
import { Song } from "../entities/song.js";

export class SongDAO {
  // POST: insertar una canción
  async create(song: Song) {
    const newSong = new SongModel(song)
    return await newSong.save()
  }
  // GET: obtener todas las canciones
  async findAll(query: any) {
    return await SongModel.find(query)
  }
  // GET: obtener una canción por id
  async findById(id: number) {
    return await SongModel.findOne({ id: id })
  }
  // GET: obtener canción por nombre y artista
  async findByNameAndArtist(name: String, artist: String) {
    return await SongModel.findOne({ 
      name: { $regex: `^${name}$`, $options: 'i' }, 
      artist: { $regex: `^${artist}$`, $options: 'i' }, 
    })
  }
  // PUT: actualizar una canción
  async update(id: number, song: Song) {
    return await SongModel.findByIdAndUpdate(id, song)
  }
}