'use client';

import React, { useState } from 'react';
import { OUTFITS } from '../config/outfits';
import type { CreateAvatarInput, MilitaryBranch, OfficeRoomId } from './types';

interface AddAvatarModalProps {
  onClose: () => void;
  onCreated: (agent: unknown) => void;
}

const branches = Object.keys(OUTFITS) as MilitaryBranch[];

export function AddAvatarModal({ onClose, onCreated }: AddAvatarModalProps) {
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [outfit, setOutfit] = useState<MilitaryBranch>('army');
  const [personalityPrompt, setPersonalityPrompt] = useState('');
  const [initialRoom, setInitialRoom] = useState<OfficeRoomId>('work_room');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('A character name is required.');
      return;
    }

    const payload: CreateAvatarInput = { name: trimmedName, outfit, initialRoom };
    if (avatarUrl.trim()) payload.avatarUrl = avatarUrl.trim();
    if (personalityPrompt.trim()) payload.personalityPrompt = personalityPrompt.trim();

    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create character');
      onCreated(data.agent || data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create character');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Add Character" style={backdropStyle} onClick={onClose}>
      <form onSubmit={submit} onClick={event => event.stopPropagation()} style={modalStyle}>
        <div style={headerStyle}>
          <div><div style={eyebrowStyle}>NEW OFFICE MEMBER</div><h2 style={{ margin: '4px 0 0' }}>Add Character</h2></div>
          <button type="button" onClick={onClose} aria-label="Close" style={closeStyle}>×</button>
        </div>
        <label style={labelStyle}>Name<input required value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Nova" style={inputStyle} /></label>
        <label style={labelStyle}>Avatar Image URL<input value={avatarUrl} onChange={event => setAvatarUrl(event.target.value)} placeholder="https://..." type="url" style={inputStyle} /></label>
        <label style={labelStyle}>Military Branch Outfit<select value={outfit} onChange={event => setOutfit(event.target.value as MilitaryBranch)} style={inputStyle}>{branches.map(branch => <option key={branch} value={branch}>{OUTFITS[branch].title}</option>)}</select></label>
        <div aria-label="Outfit preview" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: -4, marginBottom: 12 }}>{branches.map(branch => <button key={branch} type="button" onClick={() => setOutfit(branch)} title={OUTFITS[branch].title} style={{ ...badgeStyle, background: OUTFITS[branch].themeColor, borderColor: outfit === branch ? '#fff' : OUTFITS[branch].borderColor }}>{branch === outfit ? '✓ ' : ''}{branch.replace('_', ' ')}</button>)}</div>
        <label style={labelStyle}>Initial Room<select value={initialRoom} onChange={event => setInitialRoom(event.target.value as OfficeRoomId)} style={inputStyle}><option value="work_room">Work Room</option><option value="meeting_room">Meeting Room</option><option value="lounge">Lounge</option><option value="focus_booth">Focus Booth</option></select></label>
        <label style={labelStyle}>Personality / Prompt<textarea value={personalityPrompt} onChange={event => setPersonalityPrompt(event.target.value)} placeholder="What should this character be like?" rows={4} style={{ ...inputStyle, resize: 'vertical' }} /></label>
        {error && <div role="alert" style={{ color: '#fca5a5', fontSize: 12, marginBottom: 10 }}>{error}</div>}
        <button type="submit" disabled={submitting} style={submitStyle}>{submitting ? 'Creating...' : 'Create Character'}</button>
      </form>
    </div>
  );
}

const backdropStyle = { position: 'fixed' as const, inset: 0, zIndex: 200, background: 'rgba(2,6,23,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };
const modalStyle = { width: 'min(480px, 100%)', maxHeight: '90vh', overflowY: 'auto' as const, background: '#111827', border: '2px solid #475569', borderRadius: 12, padding: 22, color: '#e2e8f0', boxShadow: '0 24px 80px rgba(0,0,0,0.45)' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 18 };
const eyebrowStyle = { color: '#60a5fa', fontSize: 9, letterSpacing: 1 };
const closeStyle = { background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', borderRadius: 5, fontSize: 20, cursor: 'pointer' };
const labelStyle = { display: 'block', color: '#cbd5e1', fontSize: 11, marginBottom: 12 };
const inputStyle = { display: 'block', width: '100%', boxSizing: 'border-box' as const, marginTop: 5, padding: '9px 10px', background: '#0f172a', border: '1px solid #475569', borderRadius: 6, color: '#e2e8f0', fontSize: 12 };
const badgeStyle = { border: '1px solid', borderRadius: 5, color: '#fff', cursor: 'pointer', padding: '5px 7px', fontSize: 10 };
const submitStyle = { width: '100%', padding: '11px 14px', background: '#2563eb', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontWeight: 700 };