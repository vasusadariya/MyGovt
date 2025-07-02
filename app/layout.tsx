import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"
import { SessionProvider } from "../components/session-provider"
import { Providers } from "./providers"
import { Toaster } from "../components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: "MyGovt - Digital Government Portal",
  description: "Secure, transparent, and efficient digital government services platform",
  keywords: "government, digital services, voting, complaints, documents, civic engagement",
  authors: [{ name: "HackOps Team" }],
  creator: "HackOps Development Team",
  publisher: "MyGovt Digital Services",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mygovt.gov",
    title: "MyGovt - Digital Government Portal",
    description: "Secure, transparent, and efficient digital government services platform",
    siteName: "MyGovt",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyGovt - Digital Government Portal",
    description: "Secure, transparent, and efficient digital government services platform",
    creator: "@mygovt",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <SessionProvider>
          <ThemeProvider>
            <Providers>
              <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {children}
                <Toaster />
              </div>
            </Providers>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}