import { collections, TUserInput } from '../../db'
import { comparePassword, hashPassword } from '../../lib/auth'
import { generateToken } from '../../lib/jwt'
import { LoginInput } from '../user/user.validation'
import { InvalidCredentialsError, RegistrationError } from './auth.errors'

export const login = async ({ email, password }: LoginInput) => {
    const user = await collections.users.findOne({ email }).exec()

    if (!user) {
        throw new InvalidCredentialsError('No user found')
    }

    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
        throw new InvalidCredentialsError('Invalid credentials')
    }

    const token = generateToken({
        _id: user._id,
        name: user.name,
    })

    return {
        user: {
            _id: user._id,
            name: user.name,
            accountType: user.accountType
        },
        token
    }
}

export const register = async ({ name, email, password }: TUserInput) => {
    const existingUser = await collections.users.findOne({ email }).exec();
    if (existingUser) {
        throw new RegistrationError("User already exists " + email)
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await collections.users.insertOne({ name, email, password: hashedPassword, accountType: "free" }).exec()
    return newUser
} 