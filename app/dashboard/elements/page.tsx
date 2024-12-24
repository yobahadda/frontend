'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/app/hooks/useSession'
import { fetchModuleElementsByProfessor } from '@/services/api'
import { ModuleElement } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function ElementsPage() {
  const { professor } = useSession()
  const [elements, setElements] = useState<ModuleElement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (professor?.id) {
      console.log(professor.id)
      loadElements()
    }
  }, [professor])

  const loadElements = async () => {
    try {
      setLoading(true)
      console.log('Fetching module elements...')
      const data = await fetchModuleElementsByProfessor(professor!.id)
      console.log('Module elements data:', data)
      setElements(data)
    } catch (error) {
      console.error('Error loading elements:', error)
      toast.error('Erreur lors du chargement des éléments')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>
  }

  console.log('Current elements state:', elements)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes Éléments de Module</h1>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Éléments</CardTitle>
        </CardHeader>
        <CardContent>
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
              {elements.map((element) => (
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
    </div>
  )
}

