import type { Metadata } from 'next';
import { Suspense } from 'react';

import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { StaffDashboardLayout } from '@/components/dashboard/staff-dashboard-layout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Staff Dashboard',
  description: 'FIFA World Cup 2026 venue operations command center.',
};

export default function StaffDashboardPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <Suspense fallback={<DashboardSkeleton />}>
        <StaffDashboardLayout />
      </Suspense>
    </main>
  );
}
