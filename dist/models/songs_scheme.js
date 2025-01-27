import mongoose, { Schema } from 'mongoose';
import Counter from './counter.js';
const songSchema = new Schema({
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    image: { type: String },
    preview_url: { type: String },
    duration: { type: Number },
    year: { type: Number }
});
songSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate({ _id: 'songId' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
            this.id = counter?.seq || 1;
        }
        catch (err) {
            console.error('Error al obtener el contador:', err);
            return next(err);
        }
    }
    next();
});
export default mongoose.model('Song', songSchema);
