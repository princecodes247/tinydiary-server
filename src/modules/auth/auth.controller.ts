import { NextFunction, Request, Response } from "express";
import { loginSchema } from "../user/user.validation";
import { InvalidCredentialsError } from "./auth.errors";
import { login, register } from "./auth.service";

export const registerController = async (req: Request, res: Response) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }

    const newUser = register(req.body)

    res.status(201).json({ message: "User registered successfully", data: newUser });
};


export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = loginSchema.safeParse(req.body)
        if (!validatedData.success) {
            throw new InvalidCredentialsError('Invalid credentials').addError(validatedData.error)
        }

        const result = await login(validatedData.data)
        res.json(result)
    } catch (error) {
        next(error)
    }
}