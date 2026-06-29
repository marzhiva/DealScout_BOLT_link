'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, GitCompareArrows, BookOpen, LogIn, LogOut, Menu, X, UserRound, Home } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { Logo, LogoMark } from '@/components/logo';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Underwriting', icon: LayoutDashboard },
  { href: '/compare', label: 'Saved Deals', icon: GitCompareArrows },
  { href: '/glossary', label: 'Glossary', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isGuest, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 bg-[#0A192F]/95 backdrop-blur border-b border-[#1E3A5F]">
        <LogoMark className="h-8 w-8" />
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg border border-[#1E3A5F] text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-56 flex-col bg-[#0A192F] border-r border-[#1E3A5F]">
        <SidebarContent
          isActive={isActive}
          user={user}
          isGuest={isGuest}
          onSignOut={signOut}
        />
      </aside>

      {/* Mobile bottom-sheet drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 rounded-t-2xl bg-[#112240] border-t border-[#1E3A5F] p-4 pb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <Logo showWordmark />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg border border-[#1E3A5F] text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                      active
                        ? 'bg-[#0A192F] text-white font-medium border border-[#1E3A5F]'
                        : 'text-[#8BA3C2] hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className={cn('h-4 w-4', active ? 'text-emerald' : '')} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 pt-4 border-t border-[#1E3A5F]">
              {isGuest ? (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#8BA3C2] hover:text-white hover:bg-white/5"
                >
                  <LogIn className="h-4 w-4" /> Sign in
                </Link>
              ) : (
                <button
                  onClick={() => { setOpen(false); signOut(); }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#8BA3C2] hover:text-white hover:bg-white/5"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SidebarContent({
  isActive,
  user,
  isGuest,
  onSignOut,
}: {
  isActive: (h: string) => boolean;
  user: { email?: string } | null;
  isGuest: boolean;
  onSignOut: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link href="/" className="flex items-center h-[60px] px-4 border-b border-[#1E3A5F]">
        <Logo showWordmark />
      </Link>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-0.5 p-3 pt-4">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150',
                active
                  ? 'bg-[#112240] text-white font-medium border border-[#1E3A5F]'
                  : 'text-[#8BA3C2] hover:text-white hover:bg-[#112240]/60'
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-[#10B981]' : '')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Auth footer */}
      <div className="p-3 border-t border-[#1E3A5F]">
        {isGuest ? (
          <div className="rounded-xl bg-[#112240] border border-[#1E3A5F] p-3">
            <div className="flex items-center gap-2 text-[11px] text-[#4A6A8A] mb-2">
              <UserRound className="h-3.5 w-3.5" /> Guest mode
            </div>
            <p className="text-[11px] text-[#8BA3C2] mb-3 leading-relaxed">
              Deals save to this browser. Sign up to sync to your account.
            </p>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#10B981] text-[#0A192F] text-xs font-semibold px-3 py-2 hover:bg-[#10B981]/90 transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" /> Sign in / Sign up
            </Link>
          </div>
        ) : (
          <div className="rounded-xl bg-[#112240] border border-[#1E3A5F] p-3">
            <div className="text-[11px] text-[#4A6A8A] mb-1">Signed in</div>
            <div className="text-xs text-white truncate mb-3">{user?.email}</div>
            <button
              onClick={onSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#1E3A5F] text-[#8BA3C2] text-xs px-3 py-2 hover:bg-white/5 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
