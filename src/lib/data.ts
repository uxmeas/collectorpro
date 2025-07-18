// In-memory user store (replace with DB later)
interface User {
  email: string;
  passwordHash: string;
  createdAt: string;
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: string;
}

// Pre-created test user (password: test123)
export const users: User[] = [
  {
    email: 'test@example.com',
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQeO', // test123
    createdAt: new Date().toISOString(),
    emailVerified: true,
  }
];

// In-memory verification tokens store
export const verificationTokens: Record<string, { email: string; expires: number }> = {};

// In-memory password reset tokens store
export const passwordResetTokens: Record<string, { email: string; expires: number }> = {}; 