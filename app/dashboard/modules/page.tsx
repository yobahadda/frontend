'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/app/hooks/useSession'
import { fetchModules } from '@/services/api'
import { Module } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
      console.log('Fetching modules...');
      console.log('Professor ID:', professor!.id);
      const data = await fetchModules(professor!.id)
      console.log('Modules data:', data);
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

  console.log('Current modules state:', modules);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes Modules</h1>
      <div className="grid grid-cols-1 gap-6">
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
                <p className="text-sm text-gray-500 mb-4">
                  Semestre {module.semestre} | Année Universitaire: {module.anneeUniversitaire}
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élément</TableHead>
                      <TableHead>Coefficient</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {module.elements.map((element) => (
                      <TableRow key={element.id}>
                        <TableCell>{element.nom}</TableCell>
                        <TableCell>{element.coefficient}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={element.responsable.imageUrl} alt={`${element.responsable.prenom} ${element.responsable.nom}`} />
                              <AvatarFallback>{element.responsable.prenom[0]}{element.responsable.nom[0]}</AvatarFallback>
                            </Avatar>
                            <span>{element.responsable.prenom} {element.responsable.nom}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link href={`/dashboard/elements/${element.id}`}>
                            <Button variant="outline" size="sm">
                              Détails
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

