'use client';

import { useMemo, useState } from 'react';
import { useLocation } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { m } from '@/paraglide/messages.js';
import { LocaleSelector } from '@/components/locale-selector';
import { SiteUserMenu } from '@/components/site-user-menu';
import { ThemeToggle } from '@/components/theme-toggle';

export interface NavLink {
  href: string;
  label: string;
  /** Open in a new tab. Off-site (http) hrefs always open in a new tab. */
  external?: boolean;
}

/** Off-site URLs render as plain <a>; internal paths use the locale-aware Link. */
const isExternalHref = (href: string) => /^https?:\/\//.test(href);

export function SiteHeader({
  navLinks,
  showAuthLinks = false,
}: {
  navLinks?: NavLink[];
  showAuthLinks?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const location = useLocation();
  const authCallback = useMemo(() => {
    const path = `${location.pathname}${location.searchStr ? `?${location.searchStr}` : ''}`;
    const query = `?callbackUrl=${encodeURIComponent(path)}`;
    return { signIn: `/sign-in${query}`, signUp: `/sign-up${query}` };
  }, [location.pathname, location.searchStr]);

  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src={envConfigs.app_logo}
            alt=""
            className="size-9 shrink-0 object-contain"
            width={36}
            height={36}
            decoding="async"
          />
          <span className="font-serif text-lg italic">
            {envConfigs.app_name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks?.map((link) =>
            isExternalHref(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <LocaleSelector />
          <ThemeToggle />
          {showAuthLinks && !user ? (
            <>
              <Link
                href={authCallback.signIn}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {m['landing.nav.login']()}
              </Link>
              <Link
                href={authCallback.signUp}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
                {m['landing.nav.sign_up']()}
              </Link>
            </>
          ) : null}
          {user ? (
            <SiteUserMenu
              name={user.name || 'User'}
              email={user.email}
              image={user.image}
            />
          ) : null}
        </div>

        {/* Mobile toggle */}
        <button
          className="p-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-border border-t px-4 pt-2 pb-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks?.map((link) =>
              isExternalHref(link.href) ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <div className="border-border mt-3 flex items-center gap-2 border-t pt-3">
            <LocaleSelector />
            <ThemeToggle />
            {showAuthLinks && !user ? (
              <div className="ml-auto flex items-center gap-2">
                <Link
                  href={authCallback.signIn}
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  {m['landing.nav.login']()}
                </Link>
                <Link
                  href={authCallback.signUp}
                  className="bg-primary text-primary-foreground rounded-full px-3 py-1.5 text-sm"
                >
                  {m['landing.nav.sign_up']()}
                </Link>
              </div>
            ) : null}
            {user ? (
              <>
                <div className="flex-1" />
                <SiteUserMenu
                  name={user.name || 'User'}
                  email={user.email}
                  image={user.image}
                />
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
