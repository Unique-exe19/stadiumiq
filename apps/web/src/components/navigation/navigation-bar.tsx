'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Building2, ChevronDown, Globe, LogIn, Map, Menu, Shield, Users, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/fan', label: 'Fan Portal', icon: Map },
  { href: '/staff', label: 'Staff Dashboard', icon: Building2 },
  { href: '/security', label: 'Security', icon: Shield },
  { href: '/volunteers', label: 'Volunteers', icon: Users },
];

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

type Language = { code: string; label: string; flag: string };

export function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<Language>(LANGUAGES[0] as Language);
  const pathname = usePathname();

  const selectLang = (lang: Language) => {
    setActiveLang(lang);
    setIsLangOpen(false);
    // For hackathon demo: store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('stadium_lang', lang.code);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3" role="banner">
      <nav
        className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl px-5 py-2.5 flex items-center justify-between border border-slate-200/80 shadow-soft"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-primary-400 rounded-lg"
          aria-label="StadiumIQ – Go to homepage"
        >
          <div
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm"
            aria-hidden="true"
          >
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold text-slate-800 text-[15px]">
            Stadium<span className="text-primary-600">IQ</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-0.5" role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`px-3.5 py-2 min-h-[36px] inline-flex items-center rounded-xl text-sm font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary-400 ${
                  pathname?.startsWith(href)
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-current={pathname?.startsWith(href) ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="relative hidden sm:block">
            <button
              className="flex items-center gap-1.5 px-3 h-9 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 text-sm font-medium transition-all border border-transparent hover:border-slate-200"
              aria-label="Change language"
              aria-expanded={isLangOpen}
              aria-haspopup="listbox"
              onClick={() => setIsLangOpen(!isLangOpen)}
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="text-xs">{activeLang.flag}</span>
              <span className="hidden lg:block text-xs">{activeLang.label}</span>
              <ChevronDown
                className={`h-3 w-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <>
                  {/* backdrop */}
                  <div className="fixed inset-0 z-10" onClick={() => setIsLangOpen(false)} />
                  <motion.ul
                    role="listbox"
                    aria-label="Select language"
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full mt-1.5 z-20 w-44 bg-white rounded-xl border border-slate-200 shadow-elevated overflow-hidden"
                  >
                    {LANGUAGES.map((lang) => (
                      <li key={lang.code}>
                        <button
                          role="option"
                          aria-selected={activeLang.code === lang.code}
                          onClick={() => selectLang(lang)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors text-left ${
                            activeLang.code === lang.code
                              ? 'bg-primary-50 text-primary-700 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-base" aria-hidden="true">
                            {lang.flag}
                          </span>
                          {lang.label}
                          {activeLang.code === lang.code && (
                            <span className="ml-auto text-primary-600 text-xs">✓</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Sign In */}
          <Link
            href="/auth/login"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-sm min-h-[36px]"
            aria-label="Sign in to your account"
          >
            <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
            Sign In
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-9 h-9 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden mt-2 bg-white rounded-2xl border border-slate-200 shadow-elevated overflow-hidden max-w-7xl mx-auto"
          >
            <ul role="list" className="p-2 flex flex-col gap-0.5">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      pathname?.startsWith(href)
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}

              {/* Mobile language picker */}
              <li className="pt-1 border-t border-slate-100 mt-1">
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Language</p>
                  <div className="grid grid-cols-4 gap-1">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          selectLang(lang);
                          setIsMenuOpen(false);
                        }}
                        className={`flex flex-col items-center py-1.5 rounded-lg text-xs transition-colors ${
                          activeLang.code === lang.code
                            ? 'bg-primary-50 text-primary-700'
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-[10px] mt-0.5">{lang.code.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </li>

              <li className="mt-0.5 pt-1 border-t border-slate-100">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  Sign In
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
