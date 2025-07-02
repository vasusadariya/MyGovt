import type React from "react"
import type { Metadata } from "next"
import { Roboto_Flex } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"
import "@/app/styles/animations.css"

const roboto = Roboto_Flex({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HackOps Government Portal",
  description: "Digital Government Services Platform - Created by HackOps team for Dotslash 8.0",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <SessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
