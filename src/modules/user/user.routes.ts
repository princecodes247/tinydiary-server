import { Router } from 'express'
import { hasAuth } from '../auth/auth.middleware'
import { createUserController, getUserController, getUsersController } from './user.controller'

const UserRouter = Router()

UserRouter.post('/users', createUserController)
UserRouter.get('/users', getUsersController)
UserRouter.get('/users/me', hasAuth, (req, res) => {
    res.json(req.user)
})
UserRouter.get('/users/:id', hasAuth, getUserController)

export default UserRouter 