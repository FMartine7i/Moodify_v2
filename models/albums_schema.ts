import mongoose, { Schema, Document } from 'mongoose'
import { Counter } from './counter.js'
import { Album } from '../entities/album.js'

interface IAlbum extends Album, Document { id: number }

const albumSchema: Schema<IAlbum> = new Schema ({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  artist: { type: String, required: true },
  image: { type: String },
  release_date: { type: String }
})

albumSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'albumId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      )
      this.id = counter?.seq || 1
    } catch (err) {
      console.error('Error al obtener el contador:', err)
      return next(err as Error)
    }
  } 
  next()
})

export default mongoose.model<IAlbum>('Album', albumSchema)