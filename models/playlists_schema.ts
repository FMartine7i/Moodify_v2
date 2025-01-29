import mongoose, { Schema, Document } from 'mongoose'
import { Counter } from './counter.js'
import { Playlist } from '../entities/playlist.js'

interface IPlaylist extends Playlist,  Document { id: number }

const playlistSchema: Schema<IPlaylist> = new Schema ({
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String }
})

playlistSchema.pre('save', async function (next) {
    if (this.isNew) {
      try {
        const counter = await Counter.findByIdAndUpdate(
          { _id: 'playlistId' },
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

export default mongoose.model<IPlaylist>('Playlist', playlistSchema)