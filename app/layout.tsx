import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Token Waste Scorecard — Agent Guardian',
  description: 'Free 3-minute diagnostic for AI agents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
