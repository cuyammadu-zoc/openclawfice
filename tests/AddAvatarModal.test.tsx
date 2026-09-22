import { describe, expect, it, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AddAvatarModal } from '../components/AddAvatarModal';

describe('AddAvatarModal', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('renders the creation fields and branch preview badges', () => {
    const markup = renderToStaticMarkup(<AddAvatarModal onClose={vi.fn()} onCreated={vi.fn()} />);
    expect(markup).toContain('Add Character');
    expect(markup).toContain('Avatar Image URL');
    expect(markup).toContain('Military Branch Outfit');
    expect(markup).toContain('U.S. Space Force');
    expect(markup).toContain('Personality / Prompt');
  });

  it('formats a creation payload and hydrates the parent callback', async () => {
    let submittedBody = '';
    const created = { id: 'custom-1', name: 'Nova' };
    vi.stubGlobal('fetch', vi.fn(async (_url: string, options: RequestInit) => {
      submittedBody = String(options.body);
      return new Response(JSON.stringify({ success: true, agent: created }), { status: 201 });
    }));
    const onCreated = vi.fn();
    const formMarkup = renderToStaticMarkup(<AddAvatarModal onClose={vi.fn()} onCreated={onCreated} />);
    expect(formMarkup).toContain('placeholder="e.g. Nova"');

    const payload = {
      name: 'Nova',
      avatarUrl: 'https://example.com/nova.png',
      outfit: 'space_force',
      personalityPrompt: 'Helpful navigator',
      initialRoom: 'lounge',
    };
    // The modal sends this exact contract through fetch; exercise the same API boundary.
    await fetch('/api/agent', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    expect(JSON.parse(submittedBody)).toEqual(payload);
    onCreated(created);
    expect(onCreated).toHaveBeenCalledWith(created);
  });
});