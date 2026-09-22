import type { AgentCapability } from '../components/types';

export const DEFAULT_CAPABILITIES: AgentCapability[] = [
  { id: 'github', name: 'GitHub Access', category: 'development', status: 'enabled', description: 'Read and update repositories and pull requests.' },
  { id: 'web_fetch', name: 'Web Fetch', category: 'browsing', status: 'enabled', description: 'Retrieve information from approved web resources.' },
  { id: 'terminal', name: 'Terminal Execution', category: 'terminal', status: 'restricted', description: 'Run local commands within configured boundaries.' },
  { id: 'messaging', name: 'Agent Communication', category: 'communication', status: 'enabled', description: 'Send messages to other agents and users.' },
  { id: 'local_storage', name: 'Local Storage', category: 'file_system', status: 'restricted', description: 'Read and write files in the configured workspace.' },
];