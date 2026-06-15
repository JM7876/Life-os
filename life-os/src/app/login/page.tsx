'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace('/');
  }, [loading, user, router]);

  async function handleSignIn() {
    setError(null);
    setPending(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      const message =
        e instanceof Error && e.message
          ? e.message
          : 'Sign-in was cancelled or failed. Try again.';
      setError(message);
      setPending(false);
    }
  }

  return (
    <div className="lo-login">
      <style>{loginCss}</style>
      <div className="lo-aurora" aria-hidden="true">
        <span className="b b1" />
        <span className="b b2" />
        <span className="b b3" />
      </div>

      <main className="lo-login-stack">
        <div className="lo-brand">
          <span className="lo-mark">✦</span>
          <span className="lo-brandtxt">Life OS</span>
        </div>

        <section className="lo-card">
          <h1>Welcome back</h1>
          <p>Sign in to open your dashboard.</p>

          <button
            className="lo-google"
            onClick={handleSignIn}
            disabled={pending}
            type="button"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>{pending ? 'Opening Google…' : 'Continue with Google'}</span>
          </button>

          {error && <p className="lo-err">{error}</p>}

          <p className="lo-foot">
            By signing in you agree to your data being stored privately under your
            Firebase account.
          </p>
        </section>
      </main>
    </div>
  );
}

const loginCss = `
.lo-login{
  --bg:#0A0D13; --text:#F4F2EC; --dim:rgba(244,242,236,.55); --faint:rgba(244,242,236,.32);
  --glass:rgba(255,255,255,.055); --glass2:rgba(255,255,255,.09); --line:rgba(255,255,255,.12);
  --amber:#F0B45F; --amber2:#E0934A;
  position:relative; min-height:100vh; width:100%;
  background:var(--bg); color:var(--text); overflow:hidden;
  font-family:-apple-system,"SF Pro Display","SF Pro Text",system-ui,"Segoe UI",sans-serif;
  -webkit-font-smoothing:antialiased; display:grid; place-items:center; padding:24px;
}
.lo-login *{box-sizing:border-box;}
.lo-aurora{position:fixed; inset:0; z-index:0; pointer-events:none; filter:blur(70px);}
.lo-aurora .b{position:absolute; border-radius:50%; opacity:.5;}
.b1{width:46vw;height:46vw;left:-8vw;top:-12vw;background:radial-gradient(circle,#E0934A 0%,transparent 70%);animation:drift1 22s ease-in-out infinite;}
.b2{width:40vw;height:40vw;right:-6vw;bottom:-10vw;background:radial-gradient(circle,#3F8F76 0%,transparent 70%);animation:drift2 26s ease-in-out infinite;}
.b3{width:34vw;height:34vw;left:36vw;top:30vh;background:radial-gradient(circle,#6A4F9E 0%,transparent 70%);opacity:.32;animation:drift1 30s ease-in-out infinite reverse;}
@keyframes drift1{50%{transform:translate(6%,8%) scale(1.08);}}
@keyframes drift2{50%{transform:translate(-7%,-6%) scale(1.1);}}

.lo-login-stack{position:relative; z-index:2; display:flex; flex-direction:column; align-items:center; gap:24px; width:100%; max-width:380px;}
.lo-brand{display:flex; align-items:center; gap:10px;}
.lo-mark{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;font-size:11px;font-weight:700;color:#1a130a;
  background:linear-gradient(140deg,var(--amber),var(--amber2)); box-shadow:0 0 18px rgba(240,180,95,.4); letter-spacing:-1px;}
.lo-brandtxt{font-weight:600; letter-spacing:.2px;}

.lo-card{
  width:100%; padding:28px 24px; border-radius:24px;
  background:var(--glass); backdrop-filter:blur(26px) saturate(150%); -webkit-backdrop-filter:blur(26px) saturate(150%);
  border:1px solid var(--line);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.10), 0 18px 40px -20px rgba(0,0,0,.6);
  display:flex; flex-direction:column; gap:14px;
}
.lo-card h1{font-size:22px; font-weight:600; letter-spacing:-.4px; margin:0;}
.lo-card p{font-size:13.5px; color:var(--dim); margin:0;}

.lo-google{
  display:flex; align-items:center; justify-content:center; gap:10px;
  margin-top:6px; padding:11px 14px; border-radius:13px;
  background:#fff; color:#1a130a; border:none;
  font-size:14px; font-weight:600; cursor:pointer; font-family:inherit;
  transition:transform .12s ease, box-shadow .12s ease;
}
.lo-google:hover{transform:translateY(-1px); box-shadow:0 10px 24px -12px rgba(0,0,0,.6);}
.lo-google:disabled{opacity:.6; cursor:default; transform:none; box-shadow:none;}

.lo-err{font-size:12.5px; color:#F0857A; margin:0;}
.lo-foot{font-size:11.5px; color:var(--faint); margin:8px 0 0; line-height:1.5;}

@media (prefers-reduced-motion:reduce){ .lo-aurora .b{animation:none;} }
`;
