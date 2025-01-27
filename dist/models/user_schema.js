import mongoose, { Schema } from 'mongoose';
import { Counter } from './counter.js';
const userSchema = new Schema({
    id: { type: Number, unique: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true, minlength: 8 },
    profile_picture: { type: String }
});
userSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate({ _id: 'userId' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        }
        catch (err) {
            console.error('Error al obtener el contador:', err);
            return next(err);
        }
    }
    next();
});
export default mongoose.model('User', userSchema);
