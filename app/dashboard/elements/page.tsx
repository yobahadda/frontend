'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/app/hooks/useSession'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

interface Modalite {
  id: number
  nom: string
  coefficient: number
  description: string
}

interface Element {
  id: number
  nom: string
  coefficient: number
  responsable: {
    id: number
    nom: string
    prenom: string
    specialite: string
    codeIdentification: string
    login: string
    imageUrl: string
  }
}

interface ElementWithModalites {
  element: Element
  modalites: Modalite[]
}

export default function ElementsPage() {
  const { professor } = useSession()
  const [elementsWithModalites, setElementsWithModalites] = useState<ElementWithModalites[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (professor?.id) {
      loadElementsWithModalites(professor.id)
    }
  }, [professor])

  const loadElementsWithModalites = async (professorId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`http://127.0.0.1:8080/elements/professor/${professorId}/with-modalites`)
      if (!response.ok) {
        throw new Error('Failed to fetch elements with modalites')
      }
      const data = await response.json()
      setElementsWithModalites(data)
    } catch (error) {
      console.error('Error loading elements with modalites:', error)
      toast.error('Erreur lors du chargement des éléments et modalités')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes Éléments de Module</h1>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Éléments et Modalités d'Évaluation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élément</TableHead>
                <TableHead>Coefficient</TableHead>
                <TableHead>Modalités d'Évaluation</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {elementsWithModalites.map(({ element, modalites }) => (
                <TableRow key={element.id}>
                  <TableCell>{element.nom}</TableCell>
                  <TableCell>{element.coefficient}</TableCell>
                  <TableCell>
                    {modalites.length > 0 ? (
                      <ul>
                        {modalites.map((modalite) => (
                          <li key={modalite.id}>
                            {modalite.nom} (Coefficient: {modalite.coefficient})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "Aucune modalité définie"
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/elements/${element.id}/saisie-notes`} passHref>
                      <Button variant="outline" size="sm">
                        Saisir les notes
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

