'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/app/hooks/useSession'
import { fetchElementsByProfessor, fetchStudentsByElement, submitGrades } from '@/services/api'
import { ModuleElement, Student, Grade } from '@/types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'react-hot-toast'
import { motion } from "framer-motion"
import { Save, RefreshCw } from 'lucide-react'

export default function GradesPage() {
  const { professor } = useSession()
  const [elements, setElements] = useState<ModuleElement[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Record<number, Grade>>({})
  const [selectedElement, setSelectedElement] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (professor?.id) {
      loadElements()
    }
  }, [professor])

  const loadElements = async () => {
    try {
      const data = await fetchElementsByProfessor(professor!.id)
      setElements(data)
    } catch (error) {
      console.error('Error loading elements:', error)
      toast.error('Erreur lors du chargement des éléments')
    } finally {
      setLoading(false)
    }
  }

  const handleElementChange = async (elementId: string) => {
    setSelectedElement(elementId)
    setLoading(true)
    try {
      const studentsData = await fetchStudentsByElement(parseInt(elementId))
      setStudents(studentsData)
      const initialGrades = studentsData.reduce((acc, student) => {
        acc[student.id] = { 
          note: 0,
          rattrapage_possible: false,
          valide: false,
          element_id: parseInt(elementId),
          etudiant_id: student.id,
          absent: false
        }
        return acc
      }, {} as Record<number, Grade>)
      setGrades(initialGrades)
    } catch (error) {
      console.error('Error loading students:', error)
      toast.error('Erreur lors du chargement des étudiants')
    } finally {
      setLoading(false)
    }
  }

  const handleGradeChange = (studentId: number, field: keyof Grade, value: any) => {
    setGrades(prev => {
      const updatedGrade = { ...prev[studentId], [field]: value }

      if (field === 'note') {
        const noteValue = Math.min(20, Math.max(0, parseFloat(value) || 0))
        updatedGrade.note = noteValue
        updatedGrade.valide = noteValue >= 10
        updatedGrade.rattrapage_possible = noteValue < 10 && noteValue > 0
      }

      if (field === 'absent') {
        if (value) {
          updatedGrade.note = 0
          updatedGrade.valide = false
          updatedGrade.rattrapage_possible = false
        }
      }

      return { ...prev, [studentId]: updatedGrade }
    })
  }

  const handleSubmit = async () => {
    try {
      setSaving(true)
      await submitGrades(Object.values(grades))
      toast.success('Notes enregistrées avec succès')
    } catch (error) {
      console.error('Error submitting grades:', error)
      toast.error('Erreur lors de l\'enregistrement des notes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-indigo-800">Saisie des Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Select onValueChange={handleElementChange} value={selectedElement}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un élément de module" />
                </SelectTrigger>
                <SelectContent>
                  {elements.map(element => (
                    <SelectItem key={element.id} value={element.id.toString()}>
                      {element.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedElement && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/6">Photo</TableHead>
                      <TableHead className="w-1/4">Étudiant</TableHead>
                      <TableHead className="w-1/6">Note (/20)</TableHead>
                      <TableHead className="w-1/6">Absent</TableHead>
                      <TableHead className="w-1/6">Rattrapage possible</TableHead>
                      <TableHead className="w-1/6">Validé</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map(student => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={student.imageUrl} alt={`${student.prenom} ${student.nom}`} />
                            <AvatarFallback>{student.prenom[0]}{student.nom[0]}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{student.nom} {student.prenom}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            value={grades[student.id]?.note || ''}
                            onChange={(e) => handleGradeChange(student.id, 'note', e.target.value)}
                            className="w-24 text-center"
                            disabled={grades[student.id]?.absent}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={grades[student.id]?.absent || false}
                            onCheckedChange={(checked) => handleGradeChange(student.id, 'absent', checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={grades[student.id]?.rattrapage_possible || false}
                            onCheckedChange={(checked) => handleGradeChange(student.id, 'rattrapage_possible', checked)}
                            disabled={grades[student.id]?.absent || grades[student.id]?.note >= 10}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={grades[student.id]?.valide || false}
                            onCheckedChange={(checked) => handleGradeChange(student.id, 'valide', checked)}
                            disabled={grades[student.id]?.absent || grades[student.id]?.note < 10}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={saving}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les notes
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

  