import { describe, expect, it } from 'vitest';
import { readControlState } from '../lib/office-control';

describe('/api/office/control', () => {
  it('persists a validated room and control status for the authenticated user', async () => {
    const { POST } = await import('../app/api/office/control/route');
    const response = await POST(new Request('http://localhost/api/office/control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId: 'drawer-agent', currentRoom: 'focus_booth', controlStatus: 'human_override' }),
    }));
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.state.currentRoom).toBe('focus_booth');
    expect(readControlState('vitest-user')['drawer-agent'].controlStatus).toBe('human_override');
  });

  it('rejects invalid rooms', async () => {
    const { POST } = await import('../app/api/office/control/route');
    const response = await POST(new Request('http://localhost/api/office/control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId: 'drawer-agent', currentRoom: 'secret-room' }),
    }));
    expect(response.status).toBe(400);
  });
});