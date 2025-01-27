import mongoose, { Schema } from 'mongoose';
import { Counter } from './counter.js';
const albumSchema = new Schema({
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    artist: { type: String, required: true },
    image: { type: String },
    release_date: { type: String }
});
albumSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate({ _id: 'albumId' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
            this.id = counter?.seq || 1;
        }
        catch (err) {
            console.error('Error al obtener el contador:', err);
            return next(err);
        }
    }
    next();
});
export default mongoose.model('Album', albumSchema);
