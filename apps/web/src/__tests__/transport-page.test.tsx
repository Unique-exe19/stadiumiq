import React from 'react';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/transport',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/components/navigation/navigation-bar', () => ({
  NavigationBar: () => React.createElement('nav', { 'aria-label': 'Main navigation' }),
}));

const { default: TransportAdvisorPage } = await import('@/app/transport/page');

describe('TransportAdvisorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders transit title and layout correctly', () => {
    render(React.createElement(TransportAdvisorPage));
    expect(screen.getByText(/Stadium Transit & Schedules/i)).toBeTruthy();
  });

  it('renders metro and bus route options in transit list', () => {
    render(React.createElement(TransportAdvisorPage));
    expect(screen.getByText(/Line 1 \(Metro Link\)/i)).toBeTruthy();
    expect(screen.getByText(/Shuttle A \(Express\)/i)).toBeTruthy();
  });

  it('contains the transport advisory sections', () => {
    render(React.createElement(TransportAdvisorPage));
    expect(screen.getByText(/Transit Zone Map/i)).toBeTruthy();
    expect(screen.getByText(/Accessibility Services/i)).toBeTruthy();
  });
});
