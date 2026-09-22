import type { FurnitureItem, OfficeLayoutConfig } from '../components/types';

export interface GridPoint {
  x: number;
  y: number;
}

export function isWithinGrid(point: GridPoint, layout: Pick<OfficeLayoutConfig, 'gridWidth' | 'gridHeight'>): boolean {
  return Number.isInteger(point.x) && Number.isInteger(point.y)
    && point.x >= 0 && point.x < layout.gridWidth
    && point.y >= 0 && point.y < layout.gridHeight;
}

export function isFurnitureBlocking(item: FurnitureItem, point: GridPoint): boolean {
  return item.x === point.x && item.y === point.y;
}

export function isWalkable(
  point: GridPoint,
  layout: Pick<OfficeLayoutConfig, 'gridWidth' | 'gridHeight' | 'furniture'>,
  room?: FurnitureItem['room'],
): boolean {
  if (!isWithinGrid(point, layout)) return false;
  return !layout.furniture.some(item => (!room || item.room === room) && isFurnitureBlocking(item, point));
}

export function findPath(
  start: GridPoint,
  goal: GridPoint,
  layout: Pick<OfficeLayoutConfig, 'gridWidth' | 'gridHeight' | 'furniture'>,
  room?: FurnitureItem['room'],
): GridPoint[] | null {
  if (!isWalkable(start, layout, room) || !isWalkable(goal, layout, room)) return null;
  const queue: GridPoint[] = [start];
  const visited = new Set([`${start.x},${start.y}`]);
  const previous = new Map<string, GridPoint>();
  const directions = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.x === goal.x && current.y === goal.y) {
      const path: GridPoint[] = [];
      let cursor = current;
      while (cursor.x !== start.x || cursor.y !== start.y) {
        path.unshift(cursor);
        cursor = previous.get(`${cursor.x},${cursor.y}`)!;
      }
      path.unshift(start);
      return path;
    }

    for (const direction of directions) {
      const next = { x: current.x + direction.x, y: current.y + direction.y };
      const key = `${next.x},${next.y}`;
      if (!visited.has(key) && isWalkable(next, layout, room)) {
        visited.add(key);
        previous.set(key, current);
        queue.push(next);
      }
    }
  }
  return null;
}