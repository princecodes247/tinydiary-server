import { z } from 'zod'

export const registerSchema = z.object({
    name: z.string().min(2).max(50),
    password: z.string().min(6).max(100),
    email: z.string().email()
})

export const loginSchema = z.object({
    name: z.string(),
    password: z.string()
})

export type CreateUserInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>