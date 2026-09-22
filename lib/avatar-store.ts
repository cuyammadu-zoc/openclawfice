import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import type { CreateAvatarInput, MilitaryBranch, OfficeRoomId } from '../components/types';

export interface StoredAvatar {
  id: string;
  userId: string;
  name: string;
  role: string;
  emoji: string;
  color: string;
  avatarUrl?: string;
  outfit?: MilitaryBranch;
  personalityPrompt?: string;
  currentRoom: OfficeRoomId;
  controlStatus: 'autonomous';
  createdAt: number;
}

const ROOT = process.env.OPENCLAWFICE_DATA_DIR || join(homedir(), '.openclawfice');

function filePath(userId: string): string {
  return join(ROOT, 'users', userId, 'avatars.json');
}

function read(userId: string): StoredAvatar[] {
  try {
    const file = filePath(userId);
    if (!existsSync(file)) return [];
    const value = JSON.parse(readFileSync(file, 'utf-8'));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function listAvatars(userId: string): StoredAvatar[] {
  return read(userId);
}

export function createAvatar(userId: string, input: CreateAvatarInput): StoredAvatar {
  const avatar: StoredAvatar = {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId,
    name: input.name,
    role: 'Custom Agent',
    emoji: '🤖',
    color: '#60a5fa',
    avatarUrl: input.avatarUrl,
    outfit: input.outfit,
    personalityPrompt: input.personalityPrompt,
    currentRoom: input.initialRoom || 'work_room',
    controlStatus: 'autonomous',
    createdAt: Date.now(),
  };
  const avatars = [...read(userId), avatar];
  const file = filePath(userId);
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(file, JSON.stringify(avatars, null, 2));
  return avatar;
}