import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'superpass';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return NextResponse.json({ session: { username: ADMIN_USER, role: 'superuser' } });
  }

  // read users.json
  const file = path.join(process.cwd(), 'data', 'users.json');
  try {
    const raw = await fs.readFile(file, 'utf-8');
    const users = JSON.parse(raw) as any[];
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

    return NextResponse.json({ session: { username: found.username, role: found.role || 'user' } });
  } catch (e) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}