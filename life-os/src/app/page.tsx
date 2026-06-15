'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0A0D13',
          color: '#F4F2EC',
          display: 'grid',
          placeItems: 'center',
          fontFamily: '-apple-system, system-ui, sans-serif',
        }}
      >
        <span style={{ opacity: 0.5, fontSize: 13 }}>Loading…</span>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0D13',
        color: '#F4F2EC',
        fontFamily: '-apple-system, system-ui, sans-serif',
        padding: 40,
      }}
    >
      <p>
        Signed in as <strong>{user.displayName ?? user.email}</strong>.
      </p>
      <button
        onClick={() => signOut()}
        style={{
          marginTop: 16,
          padding: '8px 14px',
          borderRadius: 11,
          border: '1px solid rgba(255,255,255,.12)',
          background: 'rgba(255,255,255,.06)',
          color: '#F4F2EC',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 13,
        }}
      >
        Sign out
      </button>
    </div>
  );
}
