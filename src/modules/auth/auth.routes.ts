import { Router } from 'express'
import { validateRequest } from '../../middleware/validation.middleware'
import { loginSchema } from '../user/user.validation'
import { loginController, registerController } from './auth.controller'
import { registerSchema } from './auth.validation'

const authRoutes = Router()

authRoutes.post('/auth/login', validateRequest(loginSchema), loginController)
authRoutes.post('/auth/register', validateRequest(registerSchema), registerController)

export default authRoutes 