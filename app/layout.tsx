import type { Metadata } from 'next';
import './globals.css';

/**
 * Root layout for PerFi.
 *
 * Font strategy: Inter is the design typeface (Phase 4 Section 4).
 * In production, self-host Inter via next/font/google or next/font/local.
 * In environments without Google Fonts access, the CSS variable --font-sans
 * falls back to system sans-serif (defined in globals.css).
 *
 * TODO (Phase B/C): Add self-hosted Inter font files if Google Fonts
 * is unreliable in the deployment environment.
 */

export const metadata: Metadata = {
  title: {
    default: 'PerFi — Personal Finance Planner',
    template: '%s | PerFi',
  },
  description:
    'UK-focused personal finance planner built for clarity, accessibility, and real life. No bank sync needed.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://perfi.co.uk'),
  openGraph: {
    title: 'PerFi — Personal Finance Planner',
    description:
      'Track income, benefits, budgets, and cashflow. Built for the UK, designed for everyone.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'PerFi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PerFi — Personal Finance Planner',
    description:
      'Track income, benefits, budgets, and cashflow. Built for the UK, designed for everyone.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
