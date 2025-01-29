import UserModel from '../models/user_schema.js'
import { User } from '../entities/user.js'

export class UserDAO {
  // POST: insertar nuevo usuario
  async create(user: User) {
    const newUser = new UserModel(user)
    return await newUser.save()
  }
  // GET: obtener todos los usuarios
  async findAll() {
    return await UserModel.find()
  }
  // GET: obtener un usuario por id
  async findById (id: number) {
    return await UserModel.findOne({ id: id })
  }
  // GET: obtener un usuario por email
  async findByUsername (username: string) {
    return await UserModel.findOne({ username: username })
  }
  // PUT: actualizar un usuario por id
  async update(id: number, updatedUser: Partial<User>) {
    return await UserModel.findOneAndUpdate({ id: id }, updatedUser, { new: true })
  }
  // DELETE: eliminar un usuario por id
  async delete (id: number) {
    return await UserModel.findOneAndDelete({ id: id })
  }
}