import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "sonner"
import { NextAuthProvider } from '@/providers/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NextPost Analytics',
  description: 'Análise de Conteúdo e Engajamento para Redes Sociais',
  icons: {
    icon: [
      { url: '/icon.svg' },
      { url: '/icon-dark.svg', media: '(prefers-color-scheme: dark)' }
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-dark.png', media: '(prefers-color-scheme: dark)' }
    ],
    shortcut: ['/favicon.ico']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  )
}
