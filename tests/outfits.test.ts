import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { OUTFITS, parseOutfit } from '../config/outfits';

describe('military outfit registry', () => {
  it('accepts every supported branch', () => {
    for (const branch of Object.keys(OUTFITS)) {
      expect(parseOutfit(branch)).toBe(branch);
    }
  });

  it('normalizes safe human-readable branch values', () => {
    expect(parseOutfit('Space Force')).toBe('space_force');
    expect(parseOutfit('coast-guard')).toBe('coast_guard');
  });

  it('returns null for invalid, undefined, and null values', () => {
    expect(parseOutfit('army-general')).toBeNull();
    expect(parseOutfit(undefined)).toBeNull();
    expect(parseOutfit(null)).toBeNull();
  });

  it('returns sanitized outfit values through the office API', async () => {
    const openclawDir = join(homedir(), '.openclaw');
    const openclawConfigPath = join(openclawDir, 'openclaw.json');
    const officeConfigPath = join(process.cwd(), 'openclawfice.config.json');
    const originalOpenclawConfig = existsSync(openclawConfigPath) ? readFileSync(openclawConfigPath, 'utf-8') : null;
    const originalOfficeConfig = existsSync(officeConfigPath) ? readFileSync(officeConfigPath, 'utf-8') : null;

    try {
      mkdirSync(openclawDir, { recursive: true });
      writeFileSync(openclawConfigPath, JSON.stringify({ agents: {
        list: [{ id: 'outfit-agent', name: 'Outfit Agent', outfit: 'navy' }],
      } }));
      writeFileSync(officeConfigPath, JSON.stringify({ agents: {
        'outfit-agent': { outfit: 'space force', avatarUrl: 'https://example.com/avatar.png' },
      } }));

      const { GET } = await import('../app/api/office/route');
      const data = await (await GET(new Request('http://localhost/api/office'))).json();
      const agent = data.agents.find((candidate: { id: string }) => candidate.id === 'outfit-agent');
      expect(agent.outfit).toBe('space_force');
      expect(agent.avatarUrl).toBe('https://example.com/avatar.png');
    } finally {
      if (originalOpenclawConfig === null) rmSync(openclawConfigPath, { force: true });
      else writeFileSync(openclawConfigPath, originalOpenclawConfig);
      if (originalOfficeConfig === null) rmSync(officeConfigPath, { force: true });
      else writeFileSync(officeConfigPath, originalOfficeConfig);
    }
  });
});