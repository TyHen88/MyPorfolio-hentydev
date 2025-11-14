import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hen Ty's Portfolio | Full-Stack Developer",
  description: "Showcasing my projects, experience, and skills in web development.",
  icons: {
    icon: [
      { url: '/icon-dev.png', type: 'image/png', sizes: 'any' },
    ],
    shortcut: '/icon-dev.png',
    apple: '/icon-dev.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >

          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
