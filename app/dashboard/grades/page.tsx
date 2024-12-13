'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/app/hooks/useSession'
import { fetchModuleElements, fetchStudents, fetchGrades, submitGrades } from '@/services/api'
import { ModuleElement, Student, Grade } from '@/types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from 'react-hot-toast'

export default function GradesPage() {
  const { professor } = useSession()
  const [elements, setElements] = useState<ModuleElement[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Record<number, Grade>>({})
  const [selectedElement, setSelectedElement] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (professor?.id) {
      loadElements()
    }
  }, [professor])

  const loadElements = async () => {
    try {
      const data = await fetchModuleElements(professor!.id)
      setElements(data)
    } catch (error) {
      console.error('Error loading elements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleElementChange = async (elementId: string) => {
    setSelectedElement(elementId)
    try {
      const [studentsData, gradesData] = await Promise.all([
        fetchStudents(elementId),
        fetchGrades(elementId)
      ])
      setStudents(studentsData)
      const gradesMap = gradesData.reduce((acc, grade) => {
        acc[grade.etudiant_id] = grade
        return acc
      }, {})
      setGrades(gradesMap)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleGradeChange = (studentId: number, value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue < 0 || numValue > 20) return

    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note: numValue,
        etudiant_id: studentId,
        element_id: parseInt(selectedElement),
      }
    }))
  }

  const handleAbsenceToggle = (studentId: number) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        absent: !prev[studentId]?.absent,
      }
    }))
  }

  const handleSubmit = async () => {
    try {
      const gradesToSubmit = Object.values(grades)
      await submitGrades(gradesToSubmit)
      toast.success('Notes enregistrées avec succès')
    } catch (error) {
      console.error('Error submitting grades:', error)
      toast.error('Erreur lors de l\'enregistrement des notes')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Saisie des Notes</h1>
      <div className="mb-6">
        <Select onValueChange={handleElementChange} value={selectedElement}>
          <SelectTrigger className="w-[300px]">
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
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Note (/20)</TableHead>
                <TableHead>Absent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(student => (
                <TableRow key={student.id}>
                  <TableCell>{student.nom} {student.prenom}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="20"
                      step="0.25"
                      value={grades[student.id]?.note || ''}
                      onChange={(e) => handleGradeChange(student.id, e.target.value)}
                      disabled={grades[student.id]?.absent}
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={grades[student.id]?.absent || false}
                      onChange={() => handleAbsenceToggle(student.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSubmit}>Enregistrer les notes</Button>
          </div>
        </>
      )}
    </div>
  )
}

