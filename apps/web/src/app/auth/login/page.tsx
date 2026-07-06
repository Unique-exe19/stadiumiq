'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Building2, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

const DEMO_USERS = [
  { role: 'Fan', emoji: '🎉', color: 'blue', desc: 'Navigate, find food, transport', href: '/fan' },
  { role: 'Staff', emoji: '🏟️', color: 'green', desc: 'Venue ops & crowd dashboard', href: '/staff' },
  { role: 'Security', emoji: '🛡️', color: 'red', desc: 'Alerts, cameras, incidents', href: '/security' },
  { role: 'Volunteer', emoji: '🤝', color: 'purple', desc: 'Tasks, messages, translation', href: '/volunteers' },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Demo instant login – works without backend for hackathon
  const demoLogin = async (user: typeof DEMO_USERS[0]) => {
    setDemoLoading(user.role);
    await new Promise(r => setTimeout(r, 800));
    router.push(user.href);
  };

  // Real email login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error((await res.json()).message ?? 'Login failed');
      const data = await res.json() as { accessToken: string };
      localStorage.setItem('stadium_token', data.accessToken);
      router.push('/fan');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-white flex items-center justify-center px-4 py-16">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        {/* ── DEMO FAST-LOGIN ─────────────────────────────── */}
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100 rounded-3xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
              <span className="h-2 w-2 rounded-full bg-white animate-ping" aria-hidden="true" />
            </span>
            <p className="text-sm font-bold text-primary-800">⚡ Hackathon Demo – Instant Access</p>
          </div>
          <p className="text-xs text-slate-500 mb-4">Click any role to enter the live demo immediately — no signup needed.</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_USERS.map((u) => (
              <button
                key={u.role}
                onClick={() => void demoLogin(u)}
                disabled={demoLoading !== null}
                className="relative flex flex-col items-start gap-1 p-3 bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-card text-left transition-all disabled:opacity-60"
              >
                {demoLoading === u.role && (
                  <span className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-green-500 animate-bounce" />
                  </span>
                )}
                <span className="text-xl">{u.emoji}</span>
                <span className="text-xs font-bold text-slate-800">{u.role}</span>
                <span className="text-[10px] text-slate-500 leading-tight">{u.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── SIGN IN CARD ─────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-elevated p-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-slate-800 text-lg">
              Stadium<span className="text-primary-600">IQ</span>
            </span>
          </div>

          <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-6">Sign in with your account</p>

          {/* Google OAuth – points to real NestJS backend */}
          <a
            href="http://localhost:3001/api/v1/auth/google"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </a>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">or email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Email form */}
          <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)} aria-label="Email sign in">
            {error && (
              <div className="px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all bg-slate-50/50"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <Link href="#" className="text-xs text-primary-600 hover:text-primary-700 font-medium">Forgot?</Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all bg-slate-50/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-5">
            Don&apos;t have an account?{' '}
            <Link href="#" className="text-primary-600 font-medium hover:underline">Request access</Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          🔒 Secured · FIFA World Cup 2026 · StadiumIQ
        </p>
      </div>
    </div>
  );
}
