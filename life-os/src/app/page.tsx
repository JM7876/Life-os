'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LifeOSShell from '@/components/LifeOSShell';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { user, loading } = useAuth();
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

  return <LifeOSShell />;
}
