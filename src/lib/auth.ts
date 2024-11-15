import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Hashes a password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Compares a plain password with a hashed password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}


// Generates a random string, useful for tokens, salts, etc.
export function generateRandomString(length: number = 32): string {
  return [...Array(length)].map(() => Math.random().toString(36)[2]).join('');
}

// Checks if a user has a specific role
export function hasRole(userRoles: string[], requiredRole: string): boolean {
  return userRoles.includes(requiredRole);
}

