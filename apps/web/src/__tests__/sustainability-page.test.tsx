import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('next/navigation', () => ({
  usePathname: () => '/sustainability',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/components/navigation/navigation-bar', () => ({
  NavigationBar: () => React.createElement('nav', { 'aria-label': 'Main navigation' }),
}));

const { default: SustainabilityPortalPage } = await import('@/app/sustainability/page');

describe('SustainabilityPortalPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sustainability metrics and title correctly', () => {
    render(React.createElement(SustainabilityPortalPage));
    expect(screen.getByText(/Stadium Sustainability Hub/i)).toBeTruthy();
  });

  it('displays the three carbon/waste diversion metrics cards', () => {
    render(React.createElement(SustainabilityPortalPage));
    expect(screen.getByText(/Energy Savings/i)).toBeTruthy();
    expect(screen.getByText(/Waste Diverted/i)).toBeTruthy();
    expect(screen.getByText(/Carbon Offset/i)).toBeTruthy();
  });

  it('contains the energy audit logs section', () => {
    render(React.createElement(SustainabilityPortalPage));
    expect(screen.getByText(/Waste Audit Logs/i)).toBeTruthy();
  });
});
