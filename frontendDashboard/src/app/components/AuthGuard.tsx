'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SESSION_DURATION_MINUTES = 30; // Change this to set session length

export default function AuthGuard({
  children,
  requireSuperuser
}: {
  children: React.ReactNode;
  requireSuperuser?: boolean;
}) {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem('session');
    if (!raw) {
      router.push('/login');
      return;
    }

    try {
      const s = JSON.parse(raw);

      // Check expiry
      if (!s.expiresAt) {
        // If no expiry, create one now
        s.expiresAt = Date.now() + SESSION_DURATION_MINUTES * 60 * 1000;
        localStorage.setItem('session', JSON.stringify(s));
      }

      if (Date.now() > s.expiresAt) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('session');
        router.push('/login');
        return;
      }

      // Check role if superuser is required
      if (requireSuperuser && s.role !== 'superuser') {
        alert('Requires Admin Permission');
        router.push('/');
        return;
      }

      setReady(true);
    } catch (e) {
      localStorage.removeItem('session');
      router.push('/login');
    }
  }, [requireSuperuser, router]);

  if (!ready) return null;
  return <>{children}</>;
}
