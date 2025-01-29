import { Router, Request, Response } from 'express'
import { UserController } from '../controllers/user.js'
const usersRouter = Router()
const userController = new UserController()

usersRouter.get('/', (req, res) => { userController.getUsers(res) })
usersRouter.get('/:id',(req, res) => { userController.getUserById(req, res) })
usersRouter.get('/username/:username', (req, res) => { userController.getUserByUsername(req, res) })
usersRouter.post('/', (req, res) => { userController.createUser(req, res) })
usersRouter.put('/:id', (req, res) => { userController.updateUser(req, res) })
usersRouter.delete('/:id', (req, res) => { userController.deleteUser(req, res) })

export default usersRouter