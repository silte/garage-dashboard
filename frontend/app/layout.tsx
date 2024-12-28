import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// eslint-disable-next-line import/no-named-export
export const metadata: Metadata = {
  title: 'Autotalli',
  description: 'Autotalli',
  themeColor: '#ffffff',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '144x144',
      url: '/144.png',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
