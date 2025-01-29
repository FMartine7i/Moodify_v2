import mongoose, { Schema, Document } from 'mongoose'
import { Counter } from './counter.js'
import { User } from '../entities/user.js'

interface IUser extends User, Document { id: number }

const userSchema: Schema<IUser> = new Schema ({
  id: { type: Number, unique: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true, minlength: 8 },
  profilePic: { type: String },
  createdAt: { type: Date, default: Date.now }
})

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'userId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      )
      this.id = counter?.seq
    } catch (err) {
        console.error('Error al obtener el contador:', err)
        return next(err as Error)
    }
  }
  next()
})

const UserModel = mongoose.model<IUser>('User', userSchema)
export default UserModel