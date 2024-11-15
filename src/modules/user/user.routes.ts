import { Router } from 'express'
import { createUserController, getUserController, getUsersController } from './user.controller'

const UserRouter = Router()

UserRouter.post('/users', createUserController)
UserRouter.get('/users', getUsersController)
UserRouter.get('/users/:id', getUserController)

export default UserRouter 