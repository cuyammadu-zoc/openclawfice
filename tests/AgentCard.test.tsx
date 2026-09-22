import { describe, expect, it } from 'vitest';
import { getAgentCardPortraitSource } from '../components/AgentCard';

describe('AgentCard portrait rendering hierarchy', () => {
  it('uses avatarUrl as the portrait source when supplied', () => {
    expect(getAgentCardPortraitSource({
      avatarUrl: 'https://example.com/avatar.png',
      emoji: '🤖',
    })).toBe('https://example.com/avatar.png');
  });

  it('falls back to the emoji portrait when avatarUrl is omitted', () => {
    expect(getAgentCardPortraitSource({ emoji: '🤖' })).toBe('🤖');
    expect(getAgentCardPortraitSource({})).toBe('🤖');
  });
});