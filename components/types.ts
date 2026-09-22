// Shared types for OpenClawfice components

export type AgentStatus = 'working' | 'idle';
export type Mood = 'great' | 'good' | 'okay' | 'stressed';
export type MilitaryBranch =
  | 'army'
  | 'navy'
  | 'air_force'
  | 'marines'
  | 'coast_guard'
  | 'space_force';
export type OfficeRoomId = 'work_room' | 'meeting_room' | 'lounge' | 'focus_booth';
export type AgentControlStatus = 'autonomous' | 'paused' | 'human_override';

export interface FurnitureInteraction {
  actionType: 'play_arcade' | 'drink_coffee' | 'rest_on_couch' | 'check_server';
  occupantAgentId?: string;
  durationMs: number;
}

export interface CreateAvatarInput {
  name: string;
  avatarUrl?: string;
  outfit?: MilitaryBranch;
  personalityPrompt?: string;
  initialRoom?: OfficeRoomId;
}

export interface FurnitureItem {
  id: string;
  type: 'desk' | 'plant' | 'server_rack' | 'couch' | 'coffee_machine' | 'arcade_cabinet';
  x: number;
  y: number;
  room: OfficeRoomId;
  interaction?: FurnitureInteraction;
}

export interface OfficeLayoutConfig {
  gridWidth: number;
  gridHeight: number;
  furniture: FurnitureItem[];
  theme: 'classic' | 'cyberpunk' | 'military_hq' | 'retro_arcade';
}

export interface PendingAction {
  id: string;
  type: string;
  icon: string;
  title: string;
  description: string;
  from: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: number;
  data?: Record<string, any>;
}

export interface Accomplishment {
  id: string;
  icon: string;
  title: string;
  detail?: string;
  who: string;
  timestamp: number;
  screenshot?: string;
  file?: string;
}

export interface Skill {
  name: string;
  level: number;
  icon: string;
}

export interface AgentCapability {
  id: string;
  name: string;
  category: 'development' | 'browsing' | 'terminal' | 'communication' | 'file_system';
  status: 'enabled' | 'disabled' | 'restricted';
  description: string;
}

export interface Needs {
  energy: number;
  output: number;
  collab: number;
  queue: number;
  focus: number;
}

export interface Agent {
  id: string;
  userId?: string;
  currentRoom?: OfficeRoomId;
  controlStatus?: AgentControlStatus;
  name: string;
  role: string;
  emoji: string;
  color: string;
  avatarUrl?: string;
  outfit?: MilitaryBranch | string;
  skinColor?: string;
  shirtColor?: string;
  hairColor?: string;
  status: AgentStatus;
  mood: Mood;
  task?: string;
  thought?: string;
  currentMessage?: {
    text: string;
    timestamp: number;
    durationMs: number;
    type: 'thought' | 'speech' | 'command';
  };
  lastActive?: string;
  nextTaskAt?: number;
  cooldown?: {
    jobId?: string;
    jobName?: string;
    intervalMs?: number;
    enabled?: boolean;
    nextRunAt?: number;
  };
  isNew?: boolean;
  hasIdentity?: boolean;
  workEvidence?: {
    hasToolCalls: boolean;
    lastToolUseTs: number;
    lastActivityTs: number;
  };
  needs: Needs;
  skills: Skill[];
  capabilities?: AgentCapability[];
  xp: number;
  level: number;
}

export interface ChatMessage {
  from: string;
  text: string;
  ts: number;
}
