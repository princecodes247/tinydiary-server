import { AppError } from './app-error'

class DateRangeError extends AppError {
    constructor(message = 'Invalid Date Range') {
        super(message)
        this.status = 400
    }
}

export { DateRangeError }
