import mongoose, { Schema, Document } from 'mongoose'
import Counter from './counter.js'

interface ISong extends Document {
    id?: number
    name: string
    artist: string
    album: string
    image: string
    preview_url: string
    duration: number
    year?: number
}

const songSchema: Schema<ISong> = new Schema ({
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    image: { type: String },
    preview_url: { type: String },
    duration: { type: Number },
    year: { type: Number }
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

export default mongoose.model('Song', songSchema)