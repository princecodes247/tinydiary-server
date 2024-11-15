import { AppError } from '../../lib/errors/app-error'

export class UserNotFoundError extends AppError {
    constructor(message = 'User not found') {
        super(message)
        this.status = 404
    }
}

export class InvalidUserError extends AppError {
    constructor(message = 'Invalid user data') {
        super(message)
        this.status = 400
    }
} 