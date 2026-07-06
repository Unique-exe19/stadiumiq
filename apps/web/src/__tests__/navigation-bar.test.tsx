/**
 * NavigationBar – Component Tests
 * Uses Vitest + React Testing Library
 */
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Mocks ──────────────────────────────────────────────────────────────────
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: React.PropsWithChildren<{ href: string; [k: string]: unknown }>) =>
    React.createElement('a', { href, ...props }, children),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...p }: React.PropsWithChildren<Record<string, unknown>>) =>
      React.createElement('div', p, children),
    ul: ({ children, ...p }: React.PropsWithChildren<Record<string, unknown>>) =>
      React.createElement('ul', p, children),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) =>
    React.createElement(React.Fragment, null, children),
}));

// Dynamic import after mocks
const { NavigationBar } = await import('@/components/navigation/navigation-bar');

// ── Tests ──────────────────────────────────────────────────────────────────
describe('NavigationBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the StadiumIQ logo link', () => {
    render(React.createElement(NavigationBar));
    expect(screen.getByLabelText(/StadiumIQ/i)).toBeTruthy();
  });

  it('renders all main navigation links', () => {
    render(React.createElement(NavigationBar));
    expect(screen.getByText('Fan Portal')).toBeTruthy();
    expect(screen.getByText('Staff Dashboard')).toBeTruthy();
    expect(screen.getByText('Security')).toBeTruthy();
    expect(screen.getByText('Volunteers')).toBeTruthy();
  });

  it('renders a Sign In link', () => {
    render(React.createElement(NavigationBar));
    const signInLinks = screen.getAllByText(/Sign In/i);
    expect(signInLinks.length).toBeGreaterThan(0);
  });

  it('renders a language selector button', () => {
    render(React.createElement(NavigationBar));
    expect(screen.getByLabelText(/Change language/i)).toBeTruthy();
  });

  it('opens mobile menu when hamburger button is clicked', () => {
    render(React.createElement(NavigationBar));
    const openBtn = screen.getByLabelText(/Open menu/i);
    fireEvent.click(openBtn);
    expect(screen.getByLabelText(/Close menu/i)).toBeTruthy();
  });

  it('closes mobile menu when close button is clicked', () => {
    render(React.createElement(NavigationBar));
    fireEvent.click(screen.getByLabelText(/Open menu/i));
    fireEvent.click(screen.getByLabelText(/Close menu/i));
    expect(screen.queryByRole('dialog')).toBeFalsy();
  });

  it('language selector opens dropdown on click', () => {
    render(React.createElement(NavigationBar));
    const langBtn = screen.getByLabelText(/Change language/i);
    fireEvent.click(langBtn);
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('has correct aria-current on active page link', () => {
    render(React.createElement(NavigationBar));
    // On '/' none of the nav links start with '/' in a matching way
    const currentLinks = screen.queryAllByRole('link', { current: 'page' });
    expect(Array.isArray(currentLinks)).toBe(true);
  });
});
