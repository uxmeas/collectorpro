// In-memory user store (replace with DB later)
interface User {
  email: string;
  passwordHash: string;
  createdAt: string;
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: string;
}

export const users: User[] = [];

// In-memory verification tokens store
export const verificationTokens: Record<string, { email: string; expires: number }> = {};

// In-memory password reset tokens store
export const passwordResetTokens: Record<string, { email: string; expires: number }> = {}; 