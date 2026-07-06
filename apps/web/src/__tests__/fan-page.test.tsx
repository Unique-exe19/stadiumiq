/**
 * Fan Portal Page – Component Tests
 * Uses Vitest + React Testing Library
 */
import React from 'react';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Mocks ──────────────────────────────────────────────────────────────────
vi.mock('next/navigation', () => ({
  usePathname: () => '/fan',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: React.PropsWithChildren<{ href: string;[k: string]: unknown }>) =>
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

// Stub NavigationBar to avoid deep dependency chain
vi.mock('@/components/navigation/navigation-bar', () => ({
  NavigationBar: () => React.createElement('nav', { 'aria-label': 'Main navigation' }),
}));

const { default: FanPortalPage } = await import('@/app/fan/page');

// ── Tests ──────────────────────────────────────────────────────────────────
describe('Fan Portal Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a single h1 heading (SEO requirement)', () => {
    const { container } = render(React.createElement(FanPortalPage));
    const headings = container.querySelectorAll('h1');
    expect(headings).toHaveLength(1);
  });

  it('has main content anchor id for skip navigation', () => {
    const { container } = render(React.createElement(FanPortalPage));
    expect(container.querySelector('#main-content')).toBeTruthy();
  });

  it('renders match day banner with team names', () => {
    render(React.createElement(FanPortalPage));
    expect(screen.getByText(/Brazil/i)).toBeTruthy();
    expect(screen.getByText(/Germany/i)).toBeTruthy();
  });

  it('renders Quick Actions section with heading', () => {
    render(React.createElement(FanPortalPage));
    expect(screen.getByText(/Quick Actions/i)).toBeTruthy();
  });

  it('renders 6 quick action buttons', () => {
    render(React.createElement(FanPortalPage));
    // Some labels appear multiple times (e.g. Navigate), use getAllByText
    expect(screen.getAllByText('Navigate').length).toBeGreaterThan(0);
    expect(screen.getByText('Food')).toBeTruthy();
    expect(screen.getByText('Access')).toBeTruthy();
    expect(screen.getByText('Transport')).toBeTruthy();
    expect(screen.getByText('WiFi')).toBeTruthy();
    expect(screen.getByText('AI Help')).toBeTruthy();
  });

  it('renders Gate Status section', () => {
    render(React.createElement(FanPortalPage));
    expect(screen.getByText(/Gate Status/i)).toBeTruthy();
    expect(screen.getAllByText('Gate A').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Gate B').length).toBeGreaterThan(0);
  });

  it('renders Live Crowd Heatmap section', () => {
    render(React.createElement(FanPortalPage));
    expect(screen.getByText(/Live Crowd Heatmap/i)).toBeTruthy();
  });

  it('renders AI tip in gate status card', () => {
    render(React.createElement(FanPortalPage));
    expect(screen.getByText(/AI Tip/i)).toBeTruthy();
  });

  it('renders seat navigator with seat number', () => {
    render(React.createElement(FanPortalPage));
    expect(screen.getByText(/Section 12.*Row C.*Seat 42/i)).toBeTruthy();
  });

  it('renders AI Assistant panel', () => {
    render(React.createElement(FanPortalPage));
    expect(screen.getByText(/AI Assistant/i)).toBeTruthy();
    expect(screen.getByText(/Ask AI/i)).toBeTruthy();
  });
});
