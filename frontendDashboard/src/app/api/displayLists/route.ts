import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB = path.join(process.cwd(), 'data', 'users.json');

// Read users.json file
async function readDB() {
    try {
        const raw = await fs.readFile(DB, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

// GET /api/displayLists
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const sessionStr = url.searchParams.get('session'); // Get session from query

        if (!sessionStr)
            return NextResponse.json({ error: 'Session required' }, { status: 400 });

        let session: any;
        try {
            session = JSON.parse(sessionStr); // Parse session JSON
        } catch {
            return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
        }

        const users = await readDB();
        const found = users.find((u: any) => u.username === session.username); // Find logged-in user
        if (!found) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const response = await fetch('http://64.227.136.248:3013/getListOfDisplay'); // Fetch external displays
        if (!response.ok) throw new Error('Failed to fetch display list');
        const result = await response.json();
        const externalDisplays = result.data || [];

        // Filter displays based on role
        let filteredDisplays: any[] = [];
        if (found.role === 'superuser') {
            filteredDisplays = externalDisplays; // Superuser sees all
        } else if (found.display) {
            const userDisplays = found.display.split(',');
            filteredDisplays = externalDisplays.filter((d: any) =>
                userDisplays.includes(d.display)
            );
        }

        // Return session info and displays
        return NextResponse.json({
            session: { username: found.username, role: found.role || 'user' },
            displays: filteredDisplays,
        });
    } catch (err: any) {
        console.error('GET error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
