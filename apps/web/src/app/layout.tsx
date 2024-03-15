import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_TC } from 'next/font/google';
import { ThemeProvider } from '@/components/material-tailwind';

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Ziphus Alpha 1.0',
  description: 'Ziphus',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="zh-Hant">
      <body className={notoSansTC.className}>
        <ThemeProvider>
          <>{children}</>
        </ThemeProvider>
      </body>
    </html>
  );
}
