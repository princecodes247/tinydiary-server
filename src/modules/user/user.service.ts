import { toObjectId } from 'monarch-orm'
import { collections } from '../../db'
import { UserNotFoundError } from './user.errors'

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
        email: user.email,
        accountType: user.accountType
    }
}