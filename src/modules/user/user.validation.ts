import { z } from 'zod'

export const createUserSchema = z.object({
    name: z.string().min(2).max(50),
    password: z.string().min(6).max(100),
    accountType: z.enum(['free', 'paid'])
})

export const loginSchema = z.object({
    name: z.string(),
    password: z.string()
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type LoginInput = z.infer<typeof loginSchema> 