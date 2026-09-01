import type { Metadata, Viewport } from "next";
import { Mona_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const MonaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CareerSync AI",
  description: "Mock interviews and resume checks in one place",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CareerSync AI"
  },
  applicationName: "CareerSync AI",
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: [
      { url: "/icons/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icons/apple-icon-180x180.png", sizes: "180x180", type: "image/png" }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: "#4361EE",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${MonaSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  );
}
