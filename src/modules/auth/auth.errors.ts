import { AppError } from '../../lib/errors/app-error'

export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message)
        this.status = 401
    }
}

export class InvalidCredentialsError extends AppError {
    constructor(message = 'Invalid credentials') {
        super(message)
        this.status = 401
    }
}

export class RegistrationError extends AppError {
    constructor(message = 'Invalid credentials') {
        super(message)
        this.status = 401
    }
} 