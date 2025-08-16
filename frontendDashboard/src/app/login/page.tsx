'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '../components/Alert';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setAlert(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Login failed');

      const expiresAt = Date.now() + 30 * 60 * 1000;
      localStorage.setItem(
        'session',
        JSON.stringify({ ...data.session, expiresAt })
      );

      // ✅ Show success alert
      setAlert({ type: 'success', message: 'Signed in successfully!' });

      // Redirect after small delay (to allow user to see alert)
      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (err: any) {
      setError(err.message);
      setAlert({ type: 'error', message: err.message });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#ece9e6,#ffffff)] px-4">
      {/* ✅ Alert at top center */}
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="bg-white p-10 rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.08)] w-full max-w-md fade-in">
        <h1 className="text-2xl font-semibold text-center text-[#333] mb-6">
          CBTL DASHBOARD LOGIN
        </h1>

        <form onSubmit={submit} className="space-y-5">
          {/* Username */}
          <div className="text-left">
            <label className="block text-sm font-medium mb-2 text-[#444]">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter username"
            />
          </div>

          {/* Password */}
          <div className="text-left">
            <label className="block text-sm font-medium mb-2 text-[#444]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter password"
            />
          </div>

          {/* Error fallback (still useful for inline errors) */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} <code>@CBTL</code>
        </p>
      </div>
    </div>
  );
}
