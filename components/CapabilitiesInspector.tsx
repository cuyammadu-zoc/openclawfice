'use client';

import { useState } from 'react';
import React from 'react';
import type { AgentCapability } from './types';

interface CapabilitiesInspectorProps {
  capabilities: AgentCapability[];
}

const statusColors: Record<AgentCapability['status'], string> = {
  enabled: '#22c55e',
  restricted: '#facc15',
  disabled: '#ef4444',
};

export function CapabilitiesInspector({ capabilities }: CapabilitiesInspectorProps) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = capabilities.filter(capability =>
    !normalizedQuery || `${capability.name} ${capability.category} ${capability.description}`.toLowerCase().includes(normalizedQuery),
  );

  return (
    <section aria-label="Agent capabilities">
      <label htmlFor="capability-search" style={{ display: 'block', color: '#94a3b8', fontSize: 11, marginBottom: 6 }}>
        Search capabilities
      </label>
      <input
        id="capability-search"
        value={query}
        onChange={event => setQuery(event.target.value)}
        placeholder="Name or category"
        style={{ width: '100%', boxSizing: 'border-box', background: '#0f172a', border: '1px solid #475569', borderRadius: 6, color: '#e2e8f0', padding: '8px 10px', fontSize: 12 }}
      />
      <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
        {filtered.map(capability => (
          <div key={capability.id} style={{ border: '1px solid #334155', borderRadius: 6, padding: 9 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
              <strong style={{ fontSize: 12 }}>{capability.name}</strong>
              <span style={{ color: statusColors[capability.status], fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                {capability.status}
              </span>
            </div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 3 }}>{capability.category}</div>
            <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 6 }}>{capability.description}</div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ color: '#94a3b8', fontSize: 12 }}>No matching capabilities.</div>}
      </div>
    </section>
  );
}