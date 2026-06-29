'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth-provider';
import { Logo } from '@/components/logo';
import { LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const STORAGE_KEY = 'dealscout_session_deals';

export default function AuthPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) throw error;
        await importSessionDeals();
        toast.success('Account created. Guest deals imported.');
        if (data.session) router.replace('/dashboard');
        else {
          setMode('login');
          toast.message('Check your email to confirm, then sign in.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Signed in.');
        router.replace('/dashboard');
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Toaster richColors theme="dark" />
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-[#8BA3C2] hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="rounded-2xl border border-[#1E3A5F] bg-[#112240] p-8">
          <div className="mb-7">
            <Logo showWordmark />
          </div>

          {/* Mode tabs */}
          <div className="flex rounded-xl bg-[#0A192F] border border-[#1E3A5F] p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
                mode === 'login' ? 'bg-emerald text-[#0A192F]' : 'text-[#8BA3C2] hover:text-white'
              }`}
            >
              <LogIn className="h-4 w-4" /> Sign in
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
                mode === 'signup' ? 'bg-emerald text-[#0A192F]' : 'text-[#8BA3C2] hover:text-white'
              }`}
            >
              <UserPlus className="h-4 w-4" /> Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs text-[#8BA3C2] block mb-1.5">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="ds-input"
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-[#8BA3C2] block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ds-input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs text-[#8BA3C2] block mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ds-input"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald text-[#0A192F] font-semibold text-sm py-2.5 hover:bg-emerald/90 transition-colors disabled:opacity-60 mt-2"
            >
              {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </form>

          {mode === 'signup' && (
            <p className="text-[11px] text-[#4A6A8A] mt-5 leading-relaxed">
              Any deals saved as a guest will be imported to your new account and removed from this browser.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

async function importSessionDeals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const deals = JSON.parse(raw);
    if (!Array.isArray(deals) || deals.length === 0) return;
    const rows = deals.map((d: { label: string; inputs: unknown; metrics: unknown; verdict: string }) => ({
      label: d.label, inputs: d.inputs, metrics: d.metrics, verdict: d.verdict,
    }));
    const { error } = await supabase.from('deals').insert(rows);
    if (error) { console.warn('Session deal import failed:', error.message); return; }
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Session deal import skipped:', e);
  }
}
