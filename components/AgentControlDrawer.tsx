'use client';

import { useState } from 'react';
import React from 'react';
import type { Agent, AgentControlStatus, OfficeRoomId } from './types';
import { CapabilitiesInspector } from './CapabilitiesInspector';
import { DEFAULT_CAPABILITIES } from '../config/capabilities';

const ROOM_LABELS: Record<OfficeRoomId, string> = {
  work_room: 'Work Room',
  meeting_room: 'Meeting Room',
  lounge: 'Lounge',
  focus_booth: 'Focus Booth',
};

interface ActivityEntry {
  id: string;
  text: string;
  timestamp: number;
}

interface AgentControlDrawerProps {
  agent: Agent;
  activity?: ActivityEntry[];
  onClose: () => void;
  onPause: (agentId: string, paused: boolean) => void;
  onChangeRoom: (agentId: string, room: OfficeRoomId) => void;
  onSendCommand: (agentId: string, command: string) => Promise<void> | void;
}

export function AgentControlDrawer({
  agent,
  activity = [],
  onClose,
  onPause,
  onChangeRoom,
  onSendCommand,
}: AgentControlDrawerProps) {
  const [command, setCommand] = useState('');
  const currentRoom = agent.currentRoom || 'work_room';
  const controlStatus: AgentControlStatus = agent.controlStatus || 'autonomous';
  const isPaused = controlStatus === 'paused';

  const sendCommand = async () => {
    const value = command.trim();
    if (!value) return;
    await onSendCommand(agent.id, value);
    setCommand('');
  };

  return (
    <aside
      aria-label={`${agent.name} controls`}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(380px, 92vw)',
        zIndex: 120,
        padding: 20,
        overflowY: 'auto',
        background: '#111827',
        borderLeft: '2px solid #475569',
        color: '#e2e8f0',
        boxShadow: '-12px 0 40px rgba(0,0,0,0.35)',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Agent Control</div>
          <h2 style={{ margin: '6px 0 0', fontSize: 22 }}>{agent.name}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close controls" style={iconButtonStyle}>×</button>
      </header>

      <section style={sectionStyle}>
        <div style={rowStyle}><span>Status</span><strong>{agent.status}</strong></div>
        <div style={rowStyle}><span>Control</span><strong>{controlStatus.replace('_', ' ')}</strong></div>
        <div style={rowStyle}><span>Room</span><strong>{ROOM_LABELS[currentRoom]}</strong></div>
      </section>

      <section style={sectionStyle}>
        <CapabilitiesInspector capabilities={agent.capabilities || DEFAULT_CAPABILITIES} />
      </section>

      <section style={sectionStyle}>
        <button type="button" onClick={() => onPause(agent.id, !isPaused)} style={buttonStyle}>
          {isPaused ? 'Resume Agent' : 'Pause Agent'}
        </button>
        <label style={labelStyle} htmlFor="agent-room">Move to room</label>
        <select
          id="agent-room"
          value={currentRoom}
          onChange={event => onChangeRoom(agent.id, event.target.value as OfficeRoomId)}
          style={inputStyle}
        >
          {Object.entries(ROOM_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </section>

      <section style={sectionStyle}>
        <label style={labelStyle} htmlFor="agent-command">Instant direct command</label>
        <textarea
          id="agent-command"
          value={command}
          onChange={event => setCommand(event.target.value)}
          placeholder="Tell this agent what to do next"
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
        <button type="button" onClick={sendCommand} disabled={!command.trim()} style={buttonStyle}>Send Command</button>
      </section>

      <section style={sectionStyle}>
        <h3 style={{ margin: '0 0 10px', fontSize: 13 }}>Recent Activity</h3>
        {activity.length === 0 ? <div style={{ color: '#94a3b8', fontSize: 12 }}>No recent activity.</div> : activity.map(entry => (
          <div key={entry.id} style={{ padding: '8px 0', borderTop: '1px solid #334155', fontSize: 12 }}>
            <div>{entry.text}</div>
            <time style={{ color: '#64748b', fontSize: 10 }}>{new Date(entry.timestamp).toLocaleTimeString()}</time>
          </div>
        ))}
      </section>
    </aside>
  );
}

const sectionStyle = { marginTop: 22, paddingTop: 16, borderTop: '1px solid #334155' };
const rowStyle = { display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 9, fontSize: 12 };
const labelStyle = { display: 'block', margin: '12px 0 6px', color: '#94a3b8', fontSize: 11 };
const inputStyle = { width: '100%', boxSizing: 'border-box' as const, background: '#0f172a', border: '1px solid #475569', borderRadius: 6, color: '#e2e8f0', padding: '9px 10px', fontSize: 12 };
const buttonStyle = { width: '100%', marginTop: 10, background: '#2563eb', border: 'none', borderRadius: 6, color: '#fff', padding: '10px 12px', cursor: 'pointer', fontWeight: 700 };
const iconButtonStyle = { background: 'transparent', border: '1px solid #475569', borderRadius: 6, color: '#cbd5e1', fontSize: 20, lineHeight: 1, width: 32, height: 32, cursor: 'pointer' };