import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { authAdapter } from './auth-database';

export const auth = betterAuth({
  database: authAdapter,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3333',
  secret: process.env.BETTER_AUTH_SECRET || 'openclawfice-development-secret-change-me',
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
});

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;