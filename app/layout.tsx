import type { Metadata } from 'next';
import './globals.css';
import { Inter, Orbitron } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Will Reynoir',
  description: 'The retro-futuristic study of Will Reynoir.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Goodreads widget script – replace USER_ID and params with your own snippet */}
        {/* Get the official embed code from Goodreads and paste below, or remove if you prefer. */}
        <Script
          id="goodreads-widget"
          strategy="lazyOnload"
        >{`
          // Example placeholder only – replace with your own Goodreads embed script.
          // This won't break anything if you forget to replace it; it just won't render.
        `}</Script>
      </head>
      <body
        className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
