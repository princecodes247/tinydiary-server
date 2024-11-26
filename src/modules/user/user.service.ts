import { toObjectId } from 'monarch-orm'
import { collections } from '../../db'
import { UserNotFoundError } from './user.errors'

const SALT_ROUNDS = 10

export const getUsers = async () => {
    const users = await collections.users.find().omit({
        password: true,
    }).populate({
        notes: {
            select: {
                title: true
            }
        }
    }).exec()
    console.log({ users })
    return users
}

export const getUserById = async (id: string) => {
    const formattedId = toObjectId(id)
    if (!formattedId) throw new UserNotFoundError()

    const user = await collections.users.findOne({ _id: formattedId }).omit({ password: true }).populate({ notes: true }).exec()
    if (!user) throw new UserNotFoundError()

    return user
}