'use client';
import React, { useEffect, useState } from 'react';
import Alert from './Alert';

export default function UserForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: any;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const [displays, setDisplays] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDisplays, setSelectedDisplays] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ✅ Validation state
  const isFormValid =
    username.trim() !== '' &&
    password.trim() !== '' &&
    (role !== 'user' || selectedDisplays.length > 0);

  // Initialize form from initial props
  useEffect(() => {
    if (initial) {
      setUsername(initial.username);
      setPassword(initial.password);
      setRole(initial.role || 'user');
      setSelectedDisplays(
        initial.role === 'superuser' ? [] : (initial.display ? initial.display.split(',') : [])
      );
    } else {
      setUsername('');
      setPassword('');
      setRole('user');
      setSelectedDisplays([]);
    }
  }, [initial]);

  // Load display list
  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('http://64.227.136.248:3013/getListOfDisplay');
        if (!response.ok) throw new Error('Failed to fetch display list');
        const result = await response.json();
        setDisplays(result.data || []);
      } catch (error) {
        console.error('Error loading display list:', error);
      }
    }
    load();
  }, []);

  // Reset display selections when switching away from "user"
  useEffect(() => {
    setSearch('');
    if (role !== 'user') {
      setSelectedDisplays([]);
    }
  }, [role]);

  const filtered = displays.filter((d) =>
    d.display?.toLowerCase().includes(search.toLowerCase())
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return; // ✅ Prevent submission if invalid

    const payload: any = { username, password, role };

    if (role === 'superuser') {
      payload.display = '';
    } else {
      payload.display = selectedDisplays.join(',');
    }

    if (initial?.id) payload.id = initial.id;

    try {
      const res = await fetch('/api/users', {
        method: initial?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setAlert({ message: 'User saved successfully!', type: 'success' });
        onSaved && onSaved();

        if (!initial?.id) {
          setUsername('');
          setPassword('');
          setRole('user');
          setSelectedDisplays([]);
          setSearch('');
        }
      } else {
        const err = await res.text();
        setAlert({ message: `Failed to save user: ${err}`, type: 'error' });
      }
    } catch (err: any) {
      setAlert({ message: `Error: ${err.message}`, type: 'error' });
    }
  }

  const inputClass =
    'w-full p-3 border border-gray-300 rounded-xl text-base transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200';

  return (
    <form onSubmit={submit} className="space-y-4">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-[#444]">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-[#444]">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-[#444]">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={inputClass}
        >
          <option value="user">user</option>
          <option value="superuser">superuser</option>
        </select>
      </div>

      {/* Displays */}
      {role === 'user' && (
        <div className="text-left relative">
          <label className="block font-medium mb-2 text-[#444]">Select Displays</label>

          <div className="flex flex-wrap gap-2 mb-2">
            {selectedDisplays.map((d) => (
              <span
                key={d}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
              >
                {d}
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() =>
                    setSelectedDisplays(selectedDisplays.filter((x) => x !== d))
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Search display..."
            className={inputClass}
          />

          {showDropdown && filtered.length > 0 && (
            <div className="absolute top-full left-0 w-full max-h-52 bg-white border border-gray-300 rounded-b-xl shadow-md overflow-y-auto z-50">
              {filtered.map((d) => (
                <div
                  key={`${d.id}-${d.display}`}
                  className="p-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (!selectedDisplays.includes(d.display)) {
                      setSelectedDisplays([...selectedDisplays, d.display]);
                    }
                    setSearch('');
                  }}
                >
                  {d.display}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          disabled={!isFormValid} // ✅ disable when invalid
          className={`px-5 py-2.5 rounded-lg font-medium shadow-md transition active:scale-95
            ${isFormValid
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition cursor-pointer active:scale-95"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
