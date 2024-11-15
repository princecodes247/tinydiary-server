export class AppError extends Error {
    private _errors: Array<Error | string> = []
    private _type = ''
    public status = 500
    public isCatastrophic = false
    public cause?: Error

    constructor(
        message = 'Unexpected error occurred in App service.',
        status = 500,
        isCatastrophic = false,
        cause?: Error | string
    ) {
        super(message)
        this._type = this.constructor.name
        this.message = message
        this.status = status
        this.isCatastrophic = isCatastrophic
        this.cause = cause instanceof Error ? cause : new Error(String(cause))
        Error.captureStackTrace(this, this.constructor)
    }

    get type(): string {
        return this._type
    }

    get errors(): Array<Error | string> {
        return this._errors
    }

    get stackTrace(): string {
        let stackTrace = `${this._type} stack trace: ${this.stack}\n`

        if (this.cause instanceof Error) {
            stackTrace += `Caused by ${this.cause.stack}`
        }

        return stackTrace
    }

    addError(error: Error | string): this {
        if (error) {
            this._errors.push(error)
        }
        return this
    }

    causedBy(error: Error): this {
        this.cause = error
        return this
    }

    toObject() {
        return {
            type: this._type,
            status: this.status,
            message: this.message,
            errors: this._errors,
        }
    }
}
