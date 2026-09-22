import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import type { AgentControlStatus, OfficeRoomId } from '../components/types';

export interface AgentControlState {
  currentRoom: OfficeRoomId;
  controlStatus: AgentControlStatus;
  updatedAt: number;
}

const ROOT = process.env.OPENCLAWFICE_DATA_DIR || join(homedir(), '.openclawfice');

function statePath(userId: string): string {
  return join(ROOT, 'users', userId, 'office-control.json');
}

export function readControlState(userId: string): Record<string, AgentControlState> {
  try {
    const file = statePath(userId);
    if (!existsSync(file)) return {};
    const value = JSON.parse(readFileSync(file, 'utf-8'));
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}

export function updateControlState(userId: string, agentId: string, patch: Partial<AgentControlState>): AgentControlState {
  const state = readControlState(userId);
  const next: AgentControlState = {
    currentRoom: state[agentId]?.currentRoom || 'work_room',
    controlStatus: state[agentId]?.controlStatus || 'autonomous',
    updatedAt: Date.now(),
    ...patch,
  };
  state[agentId] = next;
  const file = statePath(userId);
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(file, JSON.stringify(state, null, 2));
  return next;
}