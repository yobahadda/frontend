import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './components/ThemeContext'
import { CustomLoader } from './components/CustomLoader'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Système de Gestion des Notes - ENSA Khouribga',
  description: 'Plateforme de gestion des notes pour l\'École Nationale des Sciences Appliquées de Khouribga',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ThemeProvider>
          <Suspense fallback={<CustomLoader />}>
            {children}
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}

