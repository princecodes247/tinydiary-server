import bcrypt from 'bcrypt'
import { toObjectId } from 'monarch-orm'
import { collections } from '../../db'
import { UserNotFoundError } from './user.errors'
import { CreateUserInput } from './user.validation'

const SALT_ROUNDS = 10

export const getUsers = async () => {
    const users = await collections.users.find().omit({
        password: true
    }).exec()
    return users
}

export const getUserById = async (id: string) => {
    const formattedId = toObjectId(id)
    if (!formattedId) throw new UserNotFoundError()

    const user = await collections.users.findOne({ _id: formattedId }).exec()
    if (!user) throw new UserNotFoundError()

    return {
        _id: user._id,
        name: user.name,
        accountType: user.accountType
    }
}

export const createUser = async (userData: CreateUserInput) => {
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS)

    const user = await collections.users.insertOne({
        ...userData,
        password: hashedPassword
    }).exec()

    return {
        _id: user._id,
        name: user.name,
        accountType: user.accountType
    }
} 