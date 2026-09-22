import { describe, expect, it } from 'vitest';
import { loadLayoutConfig, saveLayoutConfig, validateLayoutConfig } from '../lib/layout-config';
import { findPath, isWalkable, isWithinGrid } from '../lib/layout-pathfinding';
import type { OfficeLayoutConfig } from '../components/types';

const layout: OfficeLayoutConfig = {
  gridWidth: 5,
  gridHeight: 4,
  theme: 'retro_arcade',
  furniture: [
    { id: 'desk-1', type: 'desk', x: 2, y: 1, room: 'work_room' },
    { id: 'arcade-1', type: 'arcade_cabinet', x: 4, y: 2, room: 'lounge' },
  ],
};

describe('LayoutEngine', () => {
  it('serializes and loads a user-scoped layout configuration', () => {
    expect(validateLayoutConfig(JSON.parse(JSON.stringify(layout)))).toBe(true);
    saveLayoutConfig('layout-engine-test', layout);
    expect(loadLayoutConfig('layout-engine-test')).toEqual(layout);
  });

  it('rejects furniture outside tilemap bounds', () => {
    expect(validateLayoutConfig({ ...layout, furniture: [{ ...layout.furniture[0], x: 5 }] })).toBe(false);
    expect(validateLayoutConfig({ ...layout, furniture: [{ ...layout.furniture[0], y: -1 }] })).toBe(false);
    expect(isWithinGrid({ x: 4, y: 3 }, layout)).toBe(true);
    expect(isWithinGrid({ x: 5, y: 3 }, layout)).toBe(false);
  });

  it('blocks furniture tiles and routes around obstacles', () => {
    expect(isWalkable({ x: 2, y: 1 }, layout, 'work_room')).toBe(false);
    expect(isWalkable({ x: 4, y: 2 }, layout, 'work_room')).toBe(true);
    const path = findPath({ x: 0, y: 1 }, { x: 4, y: 1 }, layout, 'work_room');
    expect(path).not.toBeNull();
    expect(path).not.toContainEqual({ x: 2, y: 1 });
    expect(findPath({ x: 2, y: 1 }, { x: 4, y: 1 }, layout, 'work_room')).toBeNull();
  });
});