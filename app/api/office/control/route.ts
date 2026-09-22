import { NextResponse } from 'next/server';
import { getAuthenticatedUser, requireAuth } from '../../../../lib/auth';
import { updateControlState } from '../../../../lib/office-control';
import type { AgentControlStatus, OfficeRoomId } from '../../../../components/types';

const rooms: OfficeRoomId[] = ['work_room', 'meeting_room', 'lounge', 'focus_booth'];
const statuses: AgentControlStatus[] = ['autonomous', 'paused', 'human_override'];

export async function POST(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    if (typeof body.agentId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(body.agentId)) {
      return NextResponse.json({ error: 'Valid agentId is required' }, { status: 400 });
    }
    if (body.currentRoom !== undefined && !rooms.includes(body.currentRoom)) {
      return NextResponse.json({ error: 'Invalid room' }, { status: 400 });
    }
    if (body.controlStatus !== undefined && !statuses.includes(body.controlStatus)) {
      return NextResponse.json({ error: 'Invalid control status' }, { status: 400 });
    }

    const state = updateControlState(user.id, body.agentId, {
      currentRoom: body.currentRoom,
      controlStatus: body.controlStatus,
    });
    return NextResponse.json({ success: true, agentId: body.agentId, state });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update control state' }, { status: 500 });
  }
}