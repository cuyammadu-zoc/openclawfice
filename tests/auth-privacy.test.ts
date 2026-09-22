import { beforeEach, describe, expect, it } from 'vitest';
import { belongsToUser, scopeToUser } from '../lib/privacy';

describe('Better Auth privacy boundaries', () => {
  beforeEach(() => {
    delete process.env.OPENCLAWFICE_TEST_BYPASS_AUTH;
  });

  it('rejects an unauthenticated office request', async () => {
    const { GET } = await import('../app/api/office/route');
    const response = await GET(new Request('http://localhost/api/office'));
    expect(response.status).toBe(401);
  });

  it('only returns records owned by the authenticated user', () => {
    const records = [
      { id: 'private-a', userId: 'user-a' },
      { id: 'private-b', userId: 'user-b' },
    ];
    expect(belongsToUser(records[0], 'user-a')).toBe(true);
    expect(belongsToUser(records[0], 'user-b')).toBe(false);
    expect(scopeToUser(records, 'user-b')).toEqual([records[1]]);
  });
});