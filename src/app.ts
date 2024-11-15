import bodyParser from 'body-parser'
import cors from 'cors'
import type { NextFunction, Request, Response, Router } from 'express'
import express from 'express'
import helmet from 'helmet'
import { AppError } from './lib/errors/app-error'
import { errorHandler } from './lib/errors/error-handler'
import logger from './lib/logger'

export const setupApp = (...routes: Router[]) => {
    const app = express()
    app.use(bodyParser.json())
    app.use(cors())
    app.use(helmet())
    // Ping route for health checks
    app.get('/ping', (req: Request, res: Response) => {
        res.status(200).json({ message: 'pong' })
    })

    app.use(...routes)

    // 404 error route
    app.use('*', (req: Request, res: Response) => {
        res.status(404).json({
            status: 'error',
            message: 'Route not found',
        })
    })

    app.use(
        async (err: Error, req: Request, res: Response, _: NextFunction) => {
            logger.error(err.message)
            if (err instanceof AppError) {
                if (
                    err.isCatastrophic === undefined ||
                    err.isCatastrophic === null
                ) {
                    err.isCatastrophic = true // Error during a specific request is usually not fatal and should not lead to process exit
                }

                const errorRes = await errorHandler.handleError(err)
                res.status(errorRes?.status || 500).json(errorRes)
                return
            }
            res.status(500).json({
                message: err.message || 'An internal server error occurred',
            })
        }
    )
    return app
}
