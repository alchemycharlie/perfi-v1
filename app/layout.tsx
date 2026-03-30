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
  title: 'PerFi — Personal Finance Planner',
  description:
    'UK-focused personal finance planner built for clarity, accessibility, and real life.',
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
