import React from 'react';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/volunteers',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/components/navigation/navigation-bar', () => ({
  NavigationBar: () => React.createElement('nav', { 'aria-label': 'Main navigation' }),
}));

const { default: VolunteersPortalPage } = await import('@/app/volunteers/page');

describe('VolunteersPortalPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders volunteer coordination title correctly', () => {
    render(React.createElement(VolunteersPortalPage));
    expect(screen.getByText(/Volunteer Coordination/i)).toBeTruthy();
  });

  it('displays the assignments card section', () => {
    render(React.createElement(VolunteersPortalPage));
    expect(screen.getByText(/Today's Assignments/i)).toBeTruthy();
  });

  it('renders the team messages section', () => {
    render(React.createElement(VolunteersPortalPage));
    expect(screen.getByText(/Team Messages/i)).toBeTruthy();
  });

  it('contains the translation help widget', () => {
    render(React.createElement(VolunteersPortalPage));
    expect(screen.getByText(/Translation Help/i)).toBeTruthy();
    expect(screen.getByText(/Open Translator/i)).toBeTruthy();
  });
});
