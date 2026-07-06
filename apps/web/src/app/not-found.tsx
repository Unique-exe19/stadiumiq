'use client';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <h1 className="text-4xl font-bold font-display mb-2">404</h1>
      <p className="text-muted-foreground mb-4">Page Not Found</p>
      <a
        href="/"
        className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-400 transition-colors"
      >
        Go Home
      </a>
    </div>
  );
}
