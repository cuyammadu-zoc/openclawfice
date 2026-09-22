import { describe, expect, it } from 'vitest';
import {
  beginFurnitureInteraction,
  findAvailableFurniture,
  getFurnitureActionMessage,
  releaseFurnitureInteraction,
} from '../lib/furniture-interactions';
import type { FurnitureItem } from '../components/types';

describe('FurnitureInteractions', () => {
  it('targets an available interactive furniture node in the agent room', () => {
    const furniture: FurnitureItem[] = [
      { id: 'plant-1', type: 'plant', x: 1, y: 1, room: 'lounge' },
      { id: 'arcade-1', type: 'arcade_cabinet', x: 3, y: 2, room: 'lounge' },
    ];
    expect(findAvailableFurniture(furniture, 'lounge')?.id).toBe('arcade-1');
    expect(findAvailableFurniture(furniture, 'work_room')).toBeNull();
  });

  it('locks occupied furniture and releases it after the interaction', () => {
    const furniture: FurnitureItem = { id: 'coffee-1', type: 'coffee_machine', x: 2, y: 2, room: 'lounge' };
    const interaction = beginFurnitureInteraction(furniture, 'agent-1', 2500);
    expect(interaction).toEqual({ actionType: 'drink_coffee', occupantAgentId: 'agent-1', durationMs: 2500 });
    expect(beginFurnitureInteraction({ ...furniture, interaction: interaction! }, 'agent-2')).toBeNull();
    expect(releaseFurnitureInteraction({ ...furniture, interaction: interaction! })).not.toHaveProperty('interaction');
  });

  it('creates an action speech bubble payload for each interaction', () => {
    const interaction = beginFurnitureInteraction({ id: 'arcade-1', type: 'arcade_cabinet', x: 0, y: 0, room: 'lounge' }, 'agent-1');
    expect(interaction).not.toBeNull();
    expect(getFurnitureActionMessage(interaction!)).toBe('🕹️ High score!');
  });
});