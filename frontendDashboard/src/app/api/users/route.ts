import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB = path.join(process.cwd(), 'data', 'users.json');

async function readDB() {
  try {
    const raw = await fs.readFile(DB, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

async function writeDB(data: any) {
  await fs.writeFile(DB, JSON.stringify(data, null, 2));
}

// Simple ID generator (timestamp + random number)
function generateId() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export async function GET() {
  const users = await readDB();
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const body = await req.json();
  const users = await readDB();
  const id = generateId();

  users.push({
    id,
    username: body.username,
    password: body.password,
    role: body.role || 'user',
    display: body.display || ""   // ✅ save display
  });

  await writeDB(users);
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const users = await readDB();
  const idx = users.findIndex((u: any) => u.id === body.id);
  if (idx === -1) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  users[idx] = {
    ...users[idx],
    username: body.username,
    password: body.password,
    role: body.role,
    // ✅ Only overwrite if display was provided (even if it's an empty string)
    display: body.display !== undefined ? body.display : users[idx].display
  };

  await writeDB(users);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const users = await readDB();
  const filtered = users.filter((u: any) => u.id !== body.id);
  await writeDB(filtered);
  return NextResponse.json({ ok: true });
}
