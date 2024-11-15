import type { HttpTerminator } from 'http-terminator'
import { createHttpTerminator } from 'http-terminator'
import type { Server as HttpServer } from 'node:http'
import logger from '../logger'
import { AppError } from './app-error'

// Optional: You can define a type for error objects if needed.
interface ErrorObject {
    message?: string
    reason?: string
    description?: string
    name?: string
    code?: string
    HTTPStatus?: number
    statusCode?: number
    status?: number
    isCatastrophic?: boolean
    catastrophic?: boolean
    stack?: string
}

let httpServerRef: HttpTerminator | null = null

export const errorHandler = {
    listenToErrorEvents(httpServer: HttpServer): void {
        httpServerRef = createHttpTerminator({ server: httpServer })

        process.on('uncaughtException', errorHandler.handleError)
        process.on('unhandledRejection', errorHandler.handleError)
        process.on('SIGTERM', handleTerminationSignal)
        process.on('SIGINT', handleTerminationSignal)
    },

    async handleError(error: unknown) {
        try {
            const appError = convertUnknownToAppError(error as ErrorObject)
            logger.error(appError.message, { appError })
            await metricsExporter.fireMetric('error', {
                errorName: appError.name,
            })

            if (appError.isCatastrophic) {
                await terminateHttpServerAndExit()
            }
            return appError.toObject()
        } catch (handlingError: unknown) {
            logger.error('Error handler failed', {
                handlingError,
                originalError: error,
            })
            return { status: 500, message: 'An Unexpected Error Occurred' }
        }
    },
}

const handleTerminationSignal = async (): Promise<void> => {
    logger.error(
        'App received termination signal, attempting graceful shutdown'
    )
    await terminateHttpServerAndExit()
}

const terminateHttpServerAndExit = async (): Promise<void> => {
    if (httpServerRef) await httpServerRef.terminate()
    process.exit(1)
}

// Convert unknown error types to AppError
function convertUnknownToAppError(error: ErrorObject): AppError {
    const errorObj = getObjectIfNotAlreadyObject(error)
    const message = getPropertyOrDefault(
        errorObj,
        ['message', 'reason', 'description'],
        'Unknown error'
    )
    const name = getPropertyOrDefault(
        errorObj,
        ['name', 'code'],
        'unknown-error'
    )
    const httpStatus = getPropertyOrDefault(
        errorObj,
        ['HTTPStatus', 'statusCode', 'status'],
        500
    )
    const isCatastrophic = getPropertyOrDefault(
        errorObj,
        ['isCatastrophic', 'catastrophic'],
        true
    )
    const stackTrace = errorObj.stack || undefined

    const appError = new AppError(message, httpStatus, isCatastrophic, name)
    appError.stack = stackTrace
    return Object.assign(appError, errorObj)
}

// Utility to get a property from an object or return a default value
function getPropertyOrDefault<T extends object, K extends keyof T>(
    obj: T,
    keys: K[],
    defaultValue: T[K]
): T[K] {
    for (const key of keys) {
        if (key in obj) return obj[key]
    }
    return defaultValue
}

// Simulated metrics exporter
const metricsExporter = {
    async fireMetric(
        name: string,
        labels: Record<string, string>
    ): Promise<void> {
        logger.info(
            `Firing metric ${name} with labels ${JSON.stringify(labels)}`
        )
    },
}

function getObjectIfNotAlreadyObject(target: unknown): ErrorObject {
    return typeof target === 'object' && target !== null
        ? (target as ErrorObject)
        : {}
}
