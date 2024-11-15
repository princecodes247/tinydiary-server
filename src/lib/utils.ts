import type { Request } from 'express'

export const getQueryParam = (req: Request, param: string) => {
    const target = req.query[param]
    if (!target) return null
    return Array.isArray(target) ? target.join('') : target.toString()
}
