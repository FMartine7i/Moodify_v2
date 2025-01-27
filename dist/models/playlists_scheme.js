import mongoose, { Schema } from 'mongoose';
import Counter from './counter.js';
const playlistSchema = new Schema({
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String }
});
playlistSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate({ _id: 'playlistId' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
            this.id = counter?.seq || 1;
        }
        catch (err) {
            console.error('Error al obtener el contador:', err);
            return next(err);
        }
    }
    next();
});
export default mongoose.model('Playlist', playlistSchema);
