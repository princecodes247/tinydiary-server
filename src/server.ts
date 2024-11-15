import { setupApp } from './app'
import env from './config'
import logger from './lib/logger'
import authRoutes from './modules/auth/auth.routes'
import noteRoutes from './modules/note/note.routes'
import userRoutes from './modules/user/user.routes'

async function init() {
    try {
        const app = setupApp(
            noteRoutes,
            userRoutes,
            authRoutes
        )
        app.listen(env.PORT, () => {
            logger.info(`TinyDiary App Listening on Port ${env.PORT}`)
        })
    } catch (error) {
        logger.error(`An error occurred: ${JSON.stringify(error)}`)
        process.exit(1)
    }
}

init()
