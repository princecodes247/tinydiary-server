import { AppError } from '../../lib/errors/app-error'

export class NoteNotFoundError extends AppError {
    constructor(message = 'No profile found') {
        super(message)
        this.status = 404
    }
}

export class InvalidNoteError extends AppError {
    constructor(message = 'Invalid profile') {
        super(message)
        this.status = 400
    }
}
