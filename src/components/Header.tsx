import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
  useAuth,
} from '@clerk/clerk-react';
import { cn } from '../lib/utils';
import { setSyncUser, fetchUserState, setTokenGetter } from '../lib/serverSync';
import { setCredits, mergeRemotePurchases } from '../lib/plans';

const navItems = [
  { to: '/', label: 'Templates' },
  { to: '/projects', label: 'My Projects' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About us' },
  { to: '/contact', label: 'Contact us' },
  { to: '/terms', label: 'Terms' },
];

/**
 * Invisible component that sits in the header and reacts to Clerk auth state.
 * On sign-in it:
 *   1. Registers the userId with the sync layer (so project/purchase pushes include userId).
 *   2. Fetches the user's server-side state (credits + purchases) and hydrates
 *      localStorage so the balance is correct regardless of which device this is.
 */
function SyncUser() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  useEffect(() => {
    const userId = isSignedIn ? (user?.id ?? null) : null;
    setSyncUser(userId);
    // Register a token getter so every API call is authenticated.
    setTokenGetter(userId ? () => getToken() : null);
    return () => setTokenGetter(null);
  }, [isSignedIn, user, getToken]);
  useEffect(() => {
    const userId = isSignedIn ? (user?.id ?? null) : null;
    if (userId) {
      void fetchUserState(userId).then((state) => {
        if (!state) return;
        // Server credit balance is authoritative — overwrite local.
        setCredits(state.credits);
        // Merge in any purchases made on other devices.
        mergeRemotePurchases(state.purchases);
      });
    }
  }, [isSignedIn, user]);
  return null;
}

function AdminLink() {
  const { isSignedIn, user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      setIsAdmin(false);
      return;
    }
    const current = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? '';
    fetch('/api/admin-config')
      .then((r) => r.json())
      .then((data) => {
        const emails = Array.isArray(data?.emails) ? data.emails : [];
        setIsAdmin(emails.some((e: string) => e.toLowerCase() === current));
      })
      .catch(() => setIsAdmin(false));
  }, [isSignedIn, user]);

  if (!isAdmin) return null;

  return (
    <NavLink
      to="/admin"
      className={({ isActive }) =>
        cn(
          'rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-[var(--app-fg)] text-[var(--app-bg)]'
            : 'text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)] hover:text-[var(--app-fg)]'
        )
      }
    >
      Admin
    </NavLink>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const authBlock = (
    <>
      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          appearance={{ elements: { avatarBox: { width: 32, height: 32 } } }}
        />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="btn-secondary h-8 !px-3.5 !py-0 text-[12px]">Sign in</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="btn-primary h-8 !px-3.5 !py-0 text-[12px]">Sign up</button>
        </SignUpButton>
      </SignedOut>
    </>
  );

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(248,247,244,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <SyncUser />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        {/* Left: Brand */}
        <div className="flex flex-col">
          <span
            className="text-base font-bold tracking-tight leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Website Builder
          </span>
          <span className="text-[10px] tracking-wide text-[var(--app-muted)]">
            by WB Roots
          </span>
        </div>

        {/* Center: Glass pill nav — desktop */}
        <nav className="glass-pill hidden items-center gap-1 rounded-full px-2 py-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--app-fg)] text-[var(--app-bg)]'
                    : 'text-[var(--app-muted)] hover:text-[var(--app-fg)]'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <AdminLink />
        </nav>

        {/* Right: Auth + Settings + mobile hamburger */}
        <div className="flex items-center gap-2">
          <NavLink
            to="/pricing"
            className="hidden items-center gap-1 rounded-full bg-[#F79A1B]/10 px-3 py-1.5 text-[12px] font-semibold text-[#B45309] transition-colors hover:bg-[#F79A1B]/20 sm:flex"
          >
            <Sparkles size={13} />
            Credits
          </NavLink>

          {authBlock}


          <button
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[var(--app-surface-hover)] md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden border-t border-[var(--app-border)] bg-[var(--app-bg)] md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[var(--app-fg)] text-[var(--app-bg)]'
                        : 'text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)] hover:text-[var(--app-fg)]'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <AdminLink />
              <div className="mt-2 flex items-center gap-2 px-4">{authBlock}</div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}