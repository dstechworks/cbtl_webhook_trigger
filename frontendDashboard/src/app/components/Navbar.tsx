'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Alert from './Alert';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false); // for mobile menu

  // Load username from localStorage
  useEffect(() => {
    const sessionStr = localStorage.getItem('session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        setUsername(session.username);
      } catch { }
    }
  }, []);

  async function logout() {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('session');
      setAlert({ message: 'You have been logged out successfully!', type: 'success' });
      setTimeout(() => router.push('/login'), 1500);
    }
  }

  const links = [
    { name: 'Dashboard', path: '/' },
    { name: 'Users', path: '/users' },
  ];

  return (
    <>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      <header className="bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] px-4 md:px-8 py-3 flex items-center justify-between rounded-b-xl flex-wrap">
        {/* Brand */}
        <button
          onClick={() => router.push('/')}
          className="text-xl font-semibold text-[#333] hover:text-blue-600 transition cursor-pointer"
        >
          CBTL
        </button>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden px-3 py-2 rounded-md border border-gray-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Navigation */}
        <nav className={`flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full md:w-auto ${menuOpen ? 'flex' : 'hidden md:flex'}`}>
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => { router.push(link.path); setMenuOpen(false); }}
              className={`px-3 py-1 rounded-lg text-sm font-medium cursor-pointer transition ${pathname === link.path
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-[#444] hover:bg-gray-100'
                }`}
            >
              {link.name}
            </button>
          ))}

          {/* Username */}
          {username && (
            <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium shadow-sm">
              {username}
            </div>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="px-3 py-1 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition"
          >
            Logout
          </button>
        </nav>
      </header>
    </>
  );
}
