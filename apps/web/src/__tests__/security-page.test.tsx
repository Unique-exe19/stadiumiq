import React from 'react';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/security',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/components/navigation/navigation-bar', () => ({
  NavigationBar: () => React.createElement('nav', { 'aria-label': 'Main navigation' }),
}));

const { default: SecurityPortalPage } = await import('@/app/security/page');

describe('SecurityPortalPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders security operations dashboard title correctly', () => {
    render(React.createElement(SecurityPortalPage));
    expect(screen.getByText(/Security Control Center/i)).toBeTruthy();
  });

  it('displays the security statistics cards', () => {
    render(React.createElement(SecurityPortalPage));
    expect(screen.getAllByText(/Active Alerts/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Officers On-site/i)).toBeTruthy();
    expect(screen.getByText(/Cameras Online/i)).toBeTruthy();
  });

  it('renders the camera feeds section', () => {
    render(React.createElement(SecurityPortalPage));
    expect(screen.getByText(/Camera Feeds/i)).toBeTruthy();
  });
});
