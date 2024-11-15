// src/middleware/validation.middleware.ts

import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../lib/errors/app-error";
import { validate } from "../lib/validate";

// Middleware to validate different parts of the request (body, query, params, headers)
export const validateRequest = <T>(
    schema: ZodSchema<T>,
    location: 'body' | 'query' | 'params' | 'headers' = 'body'
) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const dataToValidate = req[location];

            // Validate the specified request data (body, query, params, or headers)
            const result = validate(schema, dataToValidate, {
                safe: true
            });

            if (!result.success) {

                res.status(400).json({
                    success: false,
                    message: "Invalid Request",
                    errors: result.errors,
                });
                return
            }

            // If validation passed, continue to the next middleware or route handler
            next();
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.status).json({
                    // success: false,
                    message: error.message,
                    errors: error?.cause,
                });
                return
            }

            // Pass unexpected errors to the global error handler
            next(error);
        }
    };
};
