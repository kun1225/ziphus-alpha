import './globals.css';
import type { Metadata } from 'next';
// eslint-disable-next-line camelcase
import { Noto_Sans_TC } from 'next/font/google';
import { ThemeProvider } from '@/components/material-tailwind';
import { Toaster } from 'sonner';
import ReactQueryProvider from '@/providers/react-query';

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
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
          <ReactQueryProvider>
            <Toaster position="top-right" richColors closeButton />
            <>{children}</>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
