import bcrypt from 'bcrypt'
import User from '../models/user_model.js'
import { Request, Response } from 'express'
import { UserDAO } from '../DAO/user_dao.js'

const userDao = new UserDAO()

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { username, email, password, profilePic } = req.body
      if (!username || !email || !password) return res.status(400).json({ error: 'Faltan datos' })
      // validar que el email o el user no existan
      const existingUser = await User.findOne({ $or: [{ email }, { username }] })
      if (existingUser) return res.status(400).json({ error: 'El usuario o el email ya existen' })
      // hashear password
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = await userDao.create({
        email,
        username,
        password: hashedPassword,
        profilePic
      })
      await newUser.save()
      res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser })
    } catch (err) {
      res.status(500).json({ error: 'Error al crear el usuario', err })
    }
  }
  
  async getUsers(res: Response) {
    try {
      const users = await userDao.findAll()
      res.status(200).json(users)
    } catch (err) {
      res.status(500).json({ error: 'Users not found.' })
    }
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params
    const userId = Number(id)
    try {
      const user = await userDao.findById(userId)
      console.log('Usuario encontrado:', user)
      if (!user) return res.status(404).json({ error: 'User not found.' })
      res.status(200).json(user)
    } catch (err) {
      console.error('Error al obtener el usuario:', err)
      res.status(500).json({ error: 'Error al obtener el usuario' })
    }
  }

  async getUserByUsername(req: Request, res: Response) {
    const { username } = req.params
    const { password } = req.body
    try {
      const user = await userDao.findByUsername(username)
      if (!user) return res.status(404).json({ error: 'User not found.' })
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) return res.status(400).json({ error: 'Invalid password.' })
      res.status(200).json(user) 
    } catch (err) {
      console.error('Error al obtener el usuario:', err)
      res.status(500).json({ error: 'Error al obtener el usuario' })
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params
    const userId = Number(id)
    const { username, email, password, profilePic } = req.body
    try {
      const user = await userDao.findById(userId)
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
      if (username) user.username = username
      if (email) user.email = email
      if (password) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
      }
      if (profilePic) user.profilePic = profilePic
      
      await userDao.update(userId, user)
      res.status (200).json({ message: 'Usuario actualizado exitosamente' })
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar el usuario' })
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params
    const userId = Number(id)
    try {
      const user = await userDao.delete(userId)
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
      res.status(200).json({ message: 'Usuario eliminado exitosamente' })
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar el usuario' })
    }
  }
}

export { UserController }