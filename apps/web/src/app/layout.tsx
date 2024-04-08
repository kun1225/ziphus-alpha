import type { Metadata } from "next";
// eslint-disable-next-line camelcase
import { Noto_Sans_TC } from "next/font/google";
import { Toaster } from "sonner";
import { NextUIProvider } from "@/components/nextui";
import ReactQueryProvider from "@/providers/react-query";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ziphus Alpha 1.0",
  description: "Ziphus",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="zh-Hant">
      <body className={notoSansTC.className}>
        <NextUIProvider>
          <ReactQueryProvider>
            <Toaster position="top-right" richColors closeButton />
            <>{children}</>
          </ReactQueryProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
