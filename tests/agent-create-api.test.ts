import { describe, expect, it } from 'vitest';
import { listAvatars } from '../lib/avatar-store';

describe('/api/agent', () => {
  it('creates a sanitized user-owned avatar', async () => {
    const { POST } = await import('../app/api/agent/route');
    const response = await POST(new Request('http://localhost/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '  Nova  ',
        avatarUrl: 'https://example.com/nova.png',
        outfit: 'space_force',
        personalityPrompt: 'Helpful navigator',
        initialRoom: 'lounge',
      }),
    }));
    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.agent.name).toBe('Nova');
    expect(data.agent.userId).toBe('vitest-user');
    expect(data.agent.currentRoom).toBe('lounge');
    expect(listAvatars('vitest-user').some(agent => agent.id === data.agent.id)).toBe(true);
  });

  it('rejects unsafe avatar URLs', async () => {
    const { POST } = await import('../app/api/agent/route');
    const response = await POST(new Request('http://localhost/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Unsafe', avatarUrl: 'javascript:alert(1)' }),
    }));
    expect(response.status).toBe(400);
  });
});