'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { fetchModuleElementsByProfessor, fetchStudentsByElement, fetchCalculatedGrades, submitGrades } from '@/services/api'
import { ModuleElement, Student, CalculatedGrade } from '@/types'
import { useSession } from '@/app/hooks/useSession'

export function GradeCalculator() {
  const { professor } = useSession()
  const [elements, setElements] = useState<ModuleElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string>('')
  const [calculatedGrades, setCalculatedGrades] = useState<CalculatedGrade[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (professor?.id) {
      fetchElements(professor.id)
    }
  }, [professor])

  const fetchElements = async (professorId: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchModuleElementsByProfessor(professorId)
      setElements(data)
    } catch (error) {
      console.error('Error fetching elements:', error)
      setError('Erreur lors du chargement des éléments. Veuillez réessayer.')
      toast.error('Erreur lors du chargement des éléments. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const handleElementChange = async (elementId: string) => {
    setSelectedElement(elementId)
    setLoading(true)
    setError(null)
    try {
      const grades = await fetchCalculatedGrades(parseInt(elementId))
      setCalculatedGrades(grades)
    } catch (error) {
      console.error('Error fetching calculated grades:', error)
      setError('Erreur lors du chargement des notes calculées. Veuillez réessayer.')
      toast.error('Erreur lors du chargement des notes calculées')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitGrades = async () => {
    setLoading(true)
    setError(null)
    try {
      await submitGrades(calculatedGrades)
      toast.success('Notes finales enregistrées avec succès')
    } catch (error) {
      console.error('Error submitting final grades:', error)
      setError('Erreur lors de l\'enregistrement des notes finales. Veuillez réessayer.')
      toast.error('Erreur lors de l\'enregistrement des notes finales')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculer et Valider les Notes Finales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="text-red-500 mb-4">
              {error}
            </div>
          )}
          <Select onValueChange={handleElementChange} value={selectedElement}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un élément" />
            </SelectTrigger>
            <SelectContent>
              {elements.map(element => (
                <SelectItem key={element.id} value={element.id.toString()}>
                  {element.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : selectedElement && calculatedGrades.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Étudiant</TableHead>
                    <TableHead>Note Finale</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calculatedGrades.map(grade => (
                    <TableRow key={grade.etudiantId}>
                      <TableCell>{grade.etudiantId}</TableCell>
                      <TableCell>{grade.finalScore.toFixed(2)}</TableCell>
                      <TableCell>
                        {grade.finalScore >= 10 ? 'Validé' : 'Non validé'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button onClick={handleSubmitGrades} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement en cours...
                  </>
                ) : (
                  'Enregistrer les Notes Finales'
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

