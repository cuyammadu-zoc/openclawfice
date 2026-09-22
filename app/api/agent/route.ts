import { NextResponse } from 'next/server';
import { getAuthenticatedUser, requireAuth } from '../../../lib/auth';
import { createAvatar } from '../../../lib/avatar-store';
import { OUTFITS } from '../../../config/outfits';
import type { CreateAvatarInput, OfficeRoomId } from '../../../components/types';

const rooms: OfficeRoomId[] = ['work_room', 'meeting_room', 'lounge', 'focus_booth'];

function sanitizeInput(body: unknown): CreateAvatarInput | null {
  if (!body || typeof body !== 'object') return null;
  const value = body as Record<string, unknown>;
  if (typeof value.name !== 'string') return null;
  const name = value.name.trim().slice(0, 80);
  if (!name) return null;

  let avatarUrl: string | undefined;
  if (value.avatarUrl !== undefined) {
    if (typeof value.avatarUrl !== 'string' || value.avatarUrl.length > 2048) return null;
    const candidate = value.avatarUrl.trim();
    if (candidate) {
      try {
        const url = new URL(candidate);
        if (!['http:', 'https:'].includes(url.protocol)) return null;
        avatarUrl = url.toString();
      } catch { return null; }
    }
  }

  let outfit: CreateAvatarInput['outfit'];
  if (value.outfit !== undefined) {
    if (typeof value.outfit !== 'string' || !Object.prototype.hasOwnProperty.call(OUTFITS, value.outfit)) return null;
    outfit = value.outfit as CreateAvatarInput['outfit'];
  }

  let initialRoom: OfficeRoomId | undefined;
  if (value.initialRoom !== undefined) {
    if (typeof value.initialRoom !== 'string' || !rooms.includes(value.initialRoom as OfficeRoomId)) return null;
    initialRoom = value.initialRoom as OfficeRoomId;
  }

  const personalityPrompt = typeof value.personalityPrompt === 'string'
    ? value.personalityPrompt.trim().slice(0, 1000) || undefined
    : undefined;
  return { name, avatarUrl, outfit, personalityPrompt, initialRoom };
}

export async function POST(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const input = sanitizeInput(await request.json());
    if (!input) return NextResponse.json({ error: 'Invalid avatar payload' }, { status: 400 });
    const agent = createAvatar(user.id, input);
    return NextResponse.json({ success: true, agent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create avatar' }, { status: 500 });
  }
}