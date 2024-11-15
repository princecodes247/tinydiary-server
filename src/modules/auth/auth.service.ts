import { collections, TUserInput } from '../../db'
import { comparePassword, hashPassword } from '../../lib/auth'
import { generateToken } from '../../lib/jwt'
import { LoginInput } from '../user/user.validation'
import { InvalidCredentialsError, RegistrationError } from './auth.errors'

export const login = async ({ name, password }: LoginInput) => {
    const user = await collections.users.findOne({ name }).exec()

    if (!user) {
        throw new InvalidCredentialsError('Invalid credentials')
    }

    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
        throw new InvalidCredentialsError('Invalid credentials')
    }

    const token = generateToken(user)

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
    const existingUser = collections.users.find({ email });
    if (existingUser) {
        throw new RegistrationError("User already exists")
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await collections.users.insertOne({ name, email, password: hashedPassword, accountType: "free" }).exec()
    return newUser
} 