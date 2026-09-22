import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CapabilitiesInspector } from '../components/CapabilitiesInspector';
import type { AgentCapability } from '../components/types';

const capabilities: AgentCapability[] = [
  { id: 'github', name: 'GitHub Access', category: 'development', status: 'enabled', description: 'Repository access' },
  { id: 'terminal', name: 'Terminal Execution', category: 'terminal', status: 'restricted', description: 'Command access' },
  { id: 'storage', name: 'Local Storage', category: 'file_system', status: 'disabled', description: 'File access' },
];

describe('CapabilitiesInspector', () => {
  it('renders status indicators with their semantic colors', () => {
    const markup = renderToStaticMarkup(<CapabilitiesInspector capabilities={capabilities} />);
    expect(markup).toContain('enabled');
    expect(markup).toContain('restricted');
    expect(markup).toContain('disabled');
    expect(markup).toContain('#22c55e');
    expect(markup).toContain('#facc15');
    expect(markup).toContain('#ef4444');
  });

  it('exposes a search control for name and category filtering', () => {
    const markup = renderToStaticMarkup(<CapabilitiesInspector capabilities={capabilities} />);
    expect(markup).toContain('capability-search');
    expect(markup).toContain('Name or category');
  });
});