'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/app/hooks/useSession'
import { fetchModules } from '@/services/api'
import { Module } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ModulesPage() {
  const { professor } = useSession()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (professor?.id) {
      loadModules()
    }
  }, [professor])

  const loadModules = async () => {
    try {
      const data = await fetchModules(professor!.id)
      setModules(data)
    } catch (error) {
      console.error('Error loading modules:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes Modules</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{module.nom}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Semestre {module.semestre}</p>
                <div className="mt-4 flex justify-end">
                  <Link href={`/dashboard/modules/${module.id}`}>
                    <Button variant="outline">Voir les détails</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

