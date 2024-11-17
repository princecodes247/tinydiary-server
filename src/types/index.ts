import { Request } from "express";
import { TUser } from "../db";

export interface AuthenticatedRequest extends Request {
    profile?: TUser
    user?: {
        _id: string
        name: string
        accountType: 'free' | 'paid'
    }
} 