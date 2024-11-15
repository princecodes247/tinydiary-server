import { NextFunction, Response } from 'express'
import { validate } from '../../lib/validate'
import { AuthenticatedRequest } from '../../types'
import { InvalidUserError } from './user.errors'
import { createUser, getUserById, getUsers } from './user.service'
import { createUserSchema } from './user.validation'


export const createUserController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const validatedData = validate(createUserSchema, req.body)
        if (!validatedData) {
            throw new InvalidUserError('Invalid user data').addError(validatedData)
        }

        const user = await createUser(validatedData)
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}
export const getUsersController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const users = await getUsers()
        res.json(users)
    } catch (error) {
        next(error)
    }
}
export const getUserController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = await getUserById(req.params.id)
        res.json(user)
    } catch (error) {
        next(error)
    }
}
