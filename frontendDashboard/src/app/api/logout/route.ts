import { NextResponse } from 'next/server';
export async function POST() {
  // client clears localStorage; server can just acknowledge
  return NextResponse.json({ ok: true });
}