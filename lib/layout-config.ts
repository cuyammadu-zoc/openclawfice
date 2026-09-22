import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import type { FurnitureItem, OfficeLayoutConfig, OfficeRoomId } from '../components/types';

const DATA_ROOT = process.env.OPENCLAWFICE_DATA_DIR || join(homedir(), '.openclawfice');
const ROOM_IDS: OfficeRoomId[] = ['work_room', 'meeting_room', 'lounge', 'focus_booth'];
const FURNITURE_TYPES: FurnitureItem['type'][] = [
  'desk', 'plant', 'server_rack', 'couch', 'coffee_machine', 'arcade_cabinet',
];
const THEMES: OfficeLayoutConfig['theme'][] = ['classic', 'cyberpunk', 'military_hq', 'retro_arcade'];

export const DEFAULT_LAYOUT_CONFIG: OfficeLayoutConfig = {
  gridWidth: 16,
  gridHeight: 10,
  furniture: [],
  theme: 'classic',
};

function layoutPath(userId: string): string {
  const safeUserId = userId.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'anonymous';
  return join(DATA_ROOT, 'users', safeUserId, 'layout.json');
}

export function validateLayoutConfig(value: unknown): value is OfficeLayoutConfig {
  if (!value || typeof value !== 'object') return false;
  const config = value as Partial<OfficeLayoutConfig>;
  if (typeof config.gridWidth !== 'number' || !Number.isInteger(config.gridWidth) || config.gridWidth < 1 || config.gridWidth > 200) return false;
  if (typeof config.gridHeight !== 'number' || !Number.isInteger(config.gridHeight) || config.gridHeight < 1 || config.gridHeight > 200) return false;
  const gridWidth: number = config.gridWidth;
  const gridHeight: number = config.gridHeight;
  if (!THEMES.includes(config.theme as OfficeLayoutConfig['theme'])) return false;
  if (!Array.isArray(config.furniture)) return false;

  const ids = new Set<string>();
  return config.furniture.every(item => {
    if (!item || typeof item !== 'object') return false;
    const furniture = item as Partial<FurnitureItem>;
    if (typeof furniture.id !== 'string' || furniture.id.length === 0 || ids.has(furniture.id)) return false;
    if (!FURNITURE_TYPES.includes(furniture.type as FurnitureItem['type'])) return false;
    if (!ROOM_IDS.includes(furniture.room as OfficeRoomId)) return false;
    if (typeof furniture.x !== 'number' || typeof furniture.y !== 'number') return false;
    const x: number = furniture.x;
    const y: number = furniture.y;
    if (!Number.isInteger(x) || !Number.isInteger(y)) return false;
    if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return false;
    ids.add(furniture.id);
    return true;
  });
}

export function loadLayoutConfig(userId: string): OfficeLayoutConfig {
  try {
    const file = layoutPath(userId);
    if (!existsSync(file)) return { ...DEFAULT_LAYOUT_CONFIG, furniture: [] };
    const parsed: unknown = JSON.parse(readFileSync(file, 'utf-8'));
    return validateLayoutConfig(parsed)
      ? parsed
      : { ...DEFAULT_LAYOUT_CONFIG, furniture: [] };
  } catch {
    return { ...DEFAULT_LAYOUT_CONFIG, furniture: [] };
  }
}

export function saveLayoutConfig(userId: string, config: OfficeLayoutConfig): OfficeLayoutConfig {
  if (!validateLayoutConfig(config)) throw new Error('Invalid office layout configuration');
  const file = layoutPath(userId);
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(file, JSON.stringify(config, null, 2));
  return config;
}