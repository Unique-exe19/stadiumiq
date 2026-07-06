import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    default: 'StadiumIQ – FIFA World Cup 2026 Smart Stadium',
    template: '%s | StadiumIQ',
  },
  description:
    'AI-powered smart stadium operations for FIFA World Cup 2026. Real-time navigation, crowd management, transport, and multilingual assistance.',
  keywords: ['FIFA', 'World Cup 2026', 'stadium', 'navigation', 'crowd management', 'AI', 'accessibility'],
  authors: [{ name: 'StadiumIQ Team' }],
  creator: 'StadiumIQ',
  publisher: 'StadiumIQ',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'StadiumIQ – FIFA World Cup 2026',
    description: 'AI-powered smart stadium experience',
    siteName: 'StadiumIQ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StadiumIQ',
    description: 'AI-powered FIFA World Cup 2026 smart stadium',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#f0f4ff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${outfit.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Skip navigation – WCAG 2.4.1 */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <QueryProvider>
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
