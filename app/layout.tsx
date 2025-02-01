import type { Metadata } from "next";
import { Roboto_Flex } from 'next/font/google'
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/styles/animations.css"
const roboto = Roboto_Flex({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "HackOps",
  description: "Created by HackOps team for Dotslash 8.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
