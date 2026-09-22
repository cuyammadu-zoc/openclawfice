import type { FurnitureInteraction, FurnitureItem, OfficeRoomId } from '../components/types';

const ACTIONS: Partial<Record<FurnitureItem['type'], FurnitureInteraction['actionType']>> = {
  arcade_cabinet: 'play_arcade',
  coffee_machine: 'drink_coffee',
  couch: 'rest_on_couch',
  server_rack: 'check_server',
};

export const ACTION_MESSAGES: Record<FurnitureInteraction['actionType'], string> = {
  play_arcade: '🕹️ High score!',
  drink_coffee: '☕ Need caffeine',
  rest_on_couch: '🛋️ Taking five',
  check_server: '🖥️ Checking systems',
};

export function findAvailableFurniture(
  furniture: FurnitureItem[],
  room: OfficeRoomId,
): FurnitureItem | null {
  return furniture.find(item => item.room === room && ACTIONS[item.type] && !item.interaction) || null;
}

export function beginFurnitureInteraction(
  furniture: FurnitureItem,
  agentId: string,
  durationMs = 4000,
): FurnitureInteraction | null {
  const actionType = ACTIONS[furniture.type];
  if (!actionType || furniture.interaction) return null;
  return { actionType, occupantAgentId: agentId, durationMs };
}

export function getFurnitureActionMessage(interaction: FurnitureInteraction): string {
  return ACTION_MESSAGES[interaction.actionType];
}

export function releaseFurnitureInteraction(furniture: FurnitureItem): FurnitureItem {
  const { interaction: _interaction, ...released } = furniture;
  return released;
}