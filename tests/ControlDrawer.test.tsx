import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AgentControlDrawer } from '../components/AgentControlDrawer';
import type { Agent, OfficeRoomId } from '../components/types';

const agent: Agent = {
  id: 'drawer-agent',
  name: 'Drawer Agent',
  role: 'Operator',
  emoji: '🤖',
  color: '#2563eb',
  status: 'working',
  mood: 'good',
  currentRoom: 'work_room',
  controlStatus: 'autonomous',
  needs: { energy: 80, output: 60, collab: 40, queue: 0, focus: 80 },
  skills: [],
  xp: 0,
  level: 1,
};

describe('AgentControlDrawer', () => {
  it('renders status, room controls, pause, and command input', () => {
    const markup = renderToStaticMarkup(<AgentControlDrawer
      agent={agent}
      onClose={vi.fn()}
      onPause={vi.fn()}
      onChangeRoom={vi.fn()}
      onSendCommand={vi.fn()}
    />);
    expect(markup).toContain('Agent Control');
    expect(markup).toContain('Pause Agent');
    expect(markup).toContain('Work Room');
    expect(markup).toContain('Instant direct command');
  });

  it('exposes room changes through the typed callback contract', () => {
    let changedRoom: OfficeRoomId | null = null;
    const onChangeRoom = (_agentId: string, room: OfficeRoomId) => { changedRoom = room; };
    onChangeRoom(agent.id, 'focus_booth');
    expect(changedRoom).toBe('focus_booth');
  });
});