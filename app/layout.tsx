import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'AI Alignment Odyssey & Interactive Knowledge Lab',
  description: 'Interaktívna vzdelávacia platforma, simulátor a vedomostná hra k problematike zarovnania umelej inteligencie (AI Alignment) v slovenčine a angličtine.',
  openGraph: {
    title: 'AI Alignment Odyssey & Interactive Knowledge Lab',
    description: 'Interaktívna vzdelávacia platforma, simulátor a vedomostná hra k problematike zarovnania umelej inteligencie (AI Alignment).',
    type: 'website',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
