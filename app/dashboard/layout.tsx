'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from "./components/Sidebar"
import { Header } from "./components/Header"
import { useSession } from '../hooks/useSession'
import { Toaster } from 'react-hot-toast'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { professor, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !professor) {
      router.push('/login')
    }
  }, [professor, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!professor) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}

