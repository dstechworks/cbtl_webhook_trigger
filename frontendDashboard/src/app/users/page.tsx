'use client';
import React, { useEffect, useState } from 'react';
import AuthGuard from '../components/AuthGuard';
import Navbar from '../components/Navbar';
import UserForm from '../components/UserForm';

type User = { 
  id: string; 
  username: string; 
  password: string; 
  role?: string;
  display?: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<User | null>(null);

  // Load users from API
  async function load() {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data.users || []);
  }

  useEffect(() => {
    load();
  }, []);

  // Delete a user
  async function remove(id: string) {
    if (!confirm('Delete this user?')) return;
    await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <AuthGuard requireSuperuser={true}>
      <Navbar />
      <div className="px-4 md:px-6 py-6 md:py-8">
        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center md:text-left">
          👤 User Management
        </h1>

        {/* Responsive grid: single column on mobile, two on desktop */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Left: User List */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="font-semibold text-lg text-gray-700">
              Manage Users
            </h2>

            <ul className="mt-4 divide-y divide-gray-100">
              {users.length === 0 ? (
                <li className="py-4 text-gray-500 text-center">
                  No users found.
                </li>
              ) : (
                users.map((u) => (
                  <li
                    key={u.id}
                    className="flex flex-col md:flex-row md:items-center justify-between py-3"
                  >
                    <div className="mb-2 md:mb-0">
                      <div className="font-medium text-gray-800">{u.username}</div>
                      <div className="text-sm text-gray-500">{u.role || 'user'}</div>
                      {u.display && (
                        <div className="text-sm text-gray-400">{u.display}</div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setEditing(u)}
                        className="px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition cursor-pointer"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => remove(u.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition cursor-pointer"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Right: Add/Edit User */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="font-semibold text-lg text-gray-700 mb-4">
              {editing ? '✏️ Edit User' : '➕ Add User'}
            </h2>

            <UserForm
              initial={editing}
              onSaved={() => {
                setEditing(null);
                load();
              }}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
