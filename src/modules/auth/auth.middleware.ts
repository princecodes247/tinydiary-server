import { NextFunction, Response } from "express";
import { toObjectId } from "monarch-orm";
import { collections } from "../../db";
import { verifyToken } from "../../lib/jwt";
import { AuthenticatedRequest } from "../../types";
import { AuthenticationError } from "./auth.errors";

export const hasAuth = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) {
            throw new AuthenticationError('No token provided')
        }

        const token = authHeader.split(' ')[1]
        const decoded = verifyToken<{
            _id: string;
            name: string;
        }>(token)
        if (!decoded) {
            throw new AuthenticationError('Invalid token provided')
        }
        const userData = await collections.users.findOne({ _id: toObjectId(decoded._id) }).omit({
            password: true
        }).exec()
        if (!userData) {
            throw new AuthenticationError('No such user exists')
        }
        req.user = userData
        next()
    } catch (error) {
        next(error)
        // next(new AuthenticationError('Invalid token'))
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
