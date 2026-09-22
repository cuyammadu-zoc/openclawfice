'use client';

import React, { useState } from 'react';
import type { FurnitureItem, OfficeLayoutConfig, OfficeRoomId } from './types';
import { isWalkable } from '../lib/layout-pathfinding';

const furnitureTypes: FurnitureItem['type'][] = ['desk', 'plant', 'server_rack', 'couch', 'coffee_machine', 'arcade_cabinet'];
const rooms: OfficeRoomId[] = ['work_room', 'meeting_room', 'lounge', 'focus_booth'];

interface LayoutEditorDrawerProps {
  initialConfig: OfficeLayoutConfig;
  onSave: (config: OfficeLayoutConfig) => void;
  onClose: () => void;
}

export function LayoutEditorDrawer({ initialConfig, onSave, onClose }: LayoutEditorDrawerProps) {
  const [config, setConfig] = useState(initialConfig);
  const [selectedType, setSelectedType] = useState<FurnitureItem['type']>('desk');
  const [selectedRoom, setSelectedRoom] = useState<OfficeRoomId>('work_room');
  const [message, setMessage] = useState('');

  const placeFurniture = (x: number, y: number) => {
    if (!isWalkable({ x, y }, config, selectedRoom)) {
      setMessage('That tile is occupied or outside the walkable grid.');
      return;
    }
    const item: FurnitureItem = {
      id: `${selectedType}-${Date.now()}`,
      type: selectedType,
      x,
      y,
      room: selectedRoom,
    };
    setConfig(previous => ({ ...previous, furniture: [...previous.furniture, item] }));
    setMessage('');
  };

  const removeFurniture = (item: FurnitureItem) => {
    setConfig(previous => ({ ...previous, furniture: previous.furniture.filter(candidate => candidate.id !== item.id) }));
  };

  return (
    <aside aria-label="Office layout editor" style={drawerStyle}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Layout Editor</h2>
        <button type="button" onClick={onClose} aria-label="Close layout editor" style={closeStyle}>×</button>
      </header>
      <div style={controlsStyle}>
        <label>Furniture<select value={selectedType} onChange={event => setSelectedType(event.target.value as FurnitureItem['type'])} style={selectStyle}>{furnitureTypes.map(type => <option key={type}>{type}</option>)}</select></label>
        <label>Room<select value={selectedRoom} onChange={event => setSelectedRoom(event.target.value as OfficeRoomId)} style={selectStyle}>{rooms.map(room => <option key={room}>{room}</option>)}</select></label>
        <label>Theme<select value={config.theme} onChange={event => setConfig(previous => ({ ...previous, theme: event.target.value as OfficeLayoutConfig['theme'] }))} style={selectStyle}><option>classic</option><option>cyberpunk</option><option>military_hq</option><option>retro_arcade</option></select></label>
      </div>
      <div role="grid" aria-label="Office layout grid" style={{ ...gridStyle, gridTemplateColumns: `repeat(${config.gridWidth}, minmax(18px, 1fr))` }}>
        {Array.from({ length: config.gridWidth * config.gridHeight }, (_, index) => {
          const x = index % config.gridWidth;
          const y = Math.floor(index / config.gridWidth);
          const item = config.furniture.find(candidate => candidate.x === x && candidate.y === y && candidate.room === selectedRoom);
          return <button type="button" role="gridcell" key={`${x}-${y}`} aria-label={`Place at ${x}, ${y}`} onClick={() => item ? removeFurniture(item) : placeFurniture(x, y)} style={{ ...tileStyle, background: item ? '#334155' : '#0f172a' }}>{item ? item.type.slice(0, 2).toUpperCase() : ''}</button>;
        })}
      </div>
      {message && <div role="alert" style={{ color: '#fca5a5', fontSize: 11, marginTop: 10 }}>{message}</div>}
      <button type="button" onClick={() => onSave(config)} style={saveStyle}>Save Layout</button>
    </aside>
  );
}

const drawerStyle = { position: 'fixed' as const, top: 0, right: 0, bottom: 0, zIndex: 130, width: 'min(440px, 94vw)', padding: 20, overflowY: 'auto' as const, background: '#111827', color: '#e2e8f0', borderLeft: '2px solid #475569', boxShadow: '-12px 0 40px rgba(0,0,0,0.35)' };
const controlsStyle = { display: 'grid', gap: 10, margin: '18px 0', fontSize: 11 };
const selectStyle = { display: 'block', width: '100%', marginTop: 5, background: '#0f172a', color: '#e2e8f0', border: '1px solid #475569', borderRadius: 5, padding: 7 };
const gridStyle = { display: 'grid', gap: 2, padding: 8, background: '#1e293b', border: '1px solid #475569' };
const tileStyle = { minWidth: 18, aspectRatio: '1', padding: 0, color: '#e2e8f0', border: '1px solid #334155', fontSize: 8, cursor: 'pointer' };
const closeStyle = { background: 'transparent', color: '#cbd5e1', border: '1px solid #475569', borderRadius: 5, fontSize: 20, cursor: 'pointer' };
const saveStyle = { width: '100%', marginTop: 16, padding: '10px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 };