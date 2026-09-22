import { NextResponse } from 'next/server';
import { auth } from './auth-server';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  if (process.env.OPENCLAWFICE_TEST_BYPASS_AUTH === '1' && process.env.OPENCLAWFICE_TEST_USER_ID) {
    return { id: process.env.OPENCLAWFICE_TEST_USER_ID, name: 'Test User', email: 'test@example.com' };
  }
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ? {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  } : null;
}

export async function requireAuth(request: Request): Promise<Response | null> {
  if (process.env.OPENCLAWFICE_TEST_BYPASS_AUTH === '1') return null;

  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}
