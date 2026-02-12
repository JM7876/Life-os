'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const glassCard = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(4px) saturate(180%)',
  WebkitBackdropFilter: 'blur(4px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
};

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleOAuth = async (provider: string) => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: '/' });
  };

  const handleDemo = async () => {
    setLoading('demo');
    await signIn('demo', { callbackUrl: '/' });
  };

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-screen bg-[#0d0d2a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d2a] text-white flex items-center justify-center p-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 25%, #0f3460 50%, #1a1a4e 75%, #2d1b4e 100%)' }} />
        <div className="absolute -bottom-1/4 -left-1/4 w-[150%] h-[80%] opacity-60" style={{ background: 'radial-gradient(ellipse at 30% 80%, #00d4ff 0%, #0066ff 30%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute top-0 right-0 w-[80%] h-[100%] opacity-50" style={{ background: 'radial-gradient(ellipse at 70% 30%, #a855f7 0%, #7c3aed 40%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/4 left-1/3 w-[60%] h-[60%] opacity-40" style={{ background: 'radial-gradient(ellipse at 50% 50%, #f0abfc 0%, #c026d3 50%, transparent 80%)', filter: 'blur(100px)' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Life OS</h1>
          <p className="text-white/50">Your personal command center</p>
        </div>

        {/* Login Card */}
        <div className="relative rounded-[2rem] p-6 lg:p-8 overflow-hidden" style={glassCard}>
          {/* Shine */}
          <div className="absolute inset-0 rounded-[2rem] pointer-events-none" style={{ background: 'rgba(255, 255, 255, 0.05)', boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)', opacity: 0.5, filter: 'blur(1px) brightness(115%)' }} />
          <div className="absolute inset-x-0 top-0 h-20 rounded-t-[2rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />

          <div className="relative space-y-4">
            <h2 className="text-lg font-semibold text-center mb-6">Sign in to continue</h2>

            {/* Google Sign In */}
            <button
              onClick={() => handleOAuth('google')}
              disabled={loading !== null}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-colors disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <span className="font-medium text-sm flex-1 text-left">Continue with Google</span>
              {loading === 'google' && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            </button>

            {/* Microsoft Sign In */}
            <button
              onClick={() => handleOAuth('azure-ad')}
              disabled={loading !== null}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-colors disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 23 23" className="w-4.5 h-4.5">
                  <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
                  <rect x="12" y="1" width="10" height="10" fill="#7fba00"/>
                  <rect x="1" y="12" width="10" height="10" fill="#00a4ef"/>
                  <rect x="12" y="12" width="10" height="10" fill="#ffb900"/>
                </svg>
              </div>
              <span className="font-medium text-sm flex-1 text-left">Continue with Microsoft</span>
              {loading === 'azure-ad' && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/30">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Demo Mode */}
            <button
              onClick={handleDemo}
              disabled={loading !== null}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 font-medium text-sm hover:from-violet-600 hover:to-purple-600 transition-opacity disabled:opacity-50"
            >
              {loading === 'demo' ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entering...
                </span>
              ) : (
                'Enter Demo Mode'
              )}
            </button>

            <p className="text-[11px] text-white/30 text-center pt-2">
              Demo mode uses sample data. Connect Google or Microsoft for real integrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
