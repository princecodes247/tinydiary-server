import * as dotenv from 'dotenv'
import path from 'node:path'
import { z } from 'zod'
import logger from '../lib/logger'

// Load the correct .env file based on the current NODE_ENV
const envPath = path.resolve(
    process.cwd(),
    `.env.${process.env.NODE_ENV || 'development'}`
)
dotenv.config({ path: envPath })

// Define schema using zod for validation
const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: z.string().transform(Number).default('3001'),
    DB_URI: z.string().default('mongodb://localhost:27017/tinydiary'),
    LOG_LEVEL: z.enum(['info', 'warn', 'error']).default('info'),
})

// Parse and validate the environment variables
const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
    logger.error('❌ Invalid environment variables:', parsedEnv.error.format())
    process.exit(1) // Exit the application if environment validation fails
}

const env = parsedEnv.data

export default env
