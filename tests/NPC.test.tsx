import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { NPC } from '../components/NPC';
import type { Agent } from '../components/types';

const baseAgent: Agent = {
  id: 'test-agent',
  name: 'Test Agent',
  role: 'Tester',
  emoji: '🤖',
  color: '#6366f1',
  status: 'idle',
  mood: 'good',
  needs: { energy: 80, output: 50, collab: 50, queue: 0, focus: 70 },
  skills: [],
  xp: 0,
  level: 1,
};

describe('NPC outfit rendering hierarchy', () => {
  it('renders a custom image before any military outfit', () => {
    const markup = renderToStaticMarkup(<NPC agent={{ ...baseAgent, avatarUrl: 'https://example.com/avatar.png', outfit: 'army' }} />);
    expect(markup).toContain('<img');
    expect(markup).toContain('https://example.com/avatar.png');
    expect(markup).not.toContain('military-outfit-army');
    expect(markup).toContain('image-rendering:pixelated');
  });

  it('renders a branch overlay when no custom image is supplied', () => {
    const markup = renderToStaticMarkup(<NPC agent={{ ...baseAgent, outfit: 'space_force' }} />);
    expect(markup).not.toContain('<img');
    expect(markup).toContain('military-outfit-space-force');
    expect(markup).toContain('U.S. Space Force');
  });

  it('falls back to the default sprite for omitted or invalid outfits', () => {
    const omitted = renderToStaticMarkup(<NPC agent={baseAgent} />);
    const invalid = renderToStaticMarkup(<NPC agent={{ ...baseAgent, outfit: 'not-a-branch' }} />);
    expect(omitted).not.toContain('<img');
    expect(omitted).toContain('background:');
    expect(invalid).not.toContain('military-outfit-');
  });
});