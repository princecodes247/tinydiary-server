import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../lib/jwt";
import { AuthenticatedRequest } from "../../types";
import { AuthenticationError } from "./auth.errors";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) {
            throw new AuthenticationError('No token provided')
        }

        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)

        req.user = decoded as any
        next()
    } catch (error) {
        next(new AuthenticationError('Invalid token'))
    }
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return
    }

    const payload = verifyToken(token);
    if (!payload) {
        res.status(401).json({ message: "Invalid token." });
        return
    }

    req.user = payload;
    next();
};
