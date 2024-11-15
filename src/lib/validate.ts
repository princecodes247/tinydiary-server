import { ZodError, ZodSchema } from 'zod';
import { AppError } from './errors/app-error';

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: { path: (string | number)[]; message: string }[] };

// Function to validate data against a Zod schema with optional error message customization
export function validate<T>(
  schema: ZodSchema<T>,
  data: unknown,
  options: { safe?: boolean; customErrorMessage?: string } = {}
): ValidationResult<T> {
  const { safe = false, customErrorMessage } = options;

  try {
    if (safe) {
      const result = schema.safeParse(data);
      if (result.success) {
        return { success: true, data: result.data };
      }
      return {
        success: false,
        errors: result.error.errors.map(err => ({
          path: err.path,
          message: err.message,
        })),
      };
    } else {
      // `parse` will throw on validation errors
      return { success: true, data: schema.parse(data) };
    }
  } catch (err) {
    if (err instanceof ZodError) {
      // Standardize error structure and use custom error message if provided
      const errorMessage = customErrorMessage || "Validation failed";
      throw new AppError(
        errorMessage,
        400,
        false,
        err.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ")
      );
    }
    throw err; // Re-throw unexpected errors
  }
}
