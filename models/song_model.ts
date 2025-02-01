import mongoose, { Schema, Document } from 'mongoose'
import { Counter } from './counter.js'
import { Song } from '../entities/song.js'

interface ISong extends Song, Document { id: number }

const songSchema: Schema<ISong> = new Schema ({
  id: { type: Number },
  name: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, required: true },
  image: { type: String },
  preview_url: { type: String },
  duration: { type: String },
  year: { type: String },
  isFavorite: { type: Boolean, default: false }
})  

songSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'songId' },
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

export default mongoose.model<ISong>('Song', songSchema)