'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from 'react-hot-toast'

interface Student {
  id: number
  nom: string
  prenom: string
}

interface Modalite {
  id: number
  nom: string
  coefficient: number
}

interface Element {
  id: number
  nom: string
  coefficient: number
}

interface Grade {
  id?: number
  note: number
  absent: boolean
  valide: boolean
  rattrapagePossible: boolean
}

export default function SaisieNotesPage() {
  const params = useParams()
  const elementId = parseInt(params.elementId as string)

  const [element, setElement] = useState<Element | null>(null)
  const [modalites, setModalites] = useState<Modalite[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [grades, setGrades] = useState<Record<number, Grade>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [elementId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [elementResponse, modalitesResponse, studentsResponse] = await Promise.all([
        fetch(`http://127.0.0.1:8080/elements/${elementId}`),
        fetch(`http://127.0.0.1:8080/elements/modalites-evaluation/element/${elementId}`),
        fetch(`http://127.0.0.1:8080/etudiants/by-element/${elementId}`)
      ])

      if (!elementResponse.ok || !modalitesResponse.ok || !studentsResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const [elementData, modalitesData, studentsData] = await Promise.all([
        elementResponse.json(),
        modalitesResponse.json(),
        studentsResponse.json()
      ])

      setElement(elementData)
      setModalites(modalitesData)
      setStudents(studentsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentGrades = async (studentId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/notes/etudiant/${studentId}/element/${elementId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch student grades')
      }
      const gradesData = await response.json()
      const newGrades: Record<number, Grade> = {}
      modalites.forEach(modalite => {
        const existingGrade = gradesData.find((g: any) => g.modaliteEvaluation.id === modalite.id)
        newGrades[modalite.id] = existingGrade ? {
          id: existingGrade.id,
          note: existingGrade.note,
          absent: existingGrade.absent,
          valide: existingGrade.valide,
          rattrapagePossible: existingGrade.rattrapagePossible
        } : {
          note: 0,
          absent: false,
          valide: false,
          rattrapagePossible: false
        }
      })
      setGrades(newGrades)
    } catch (error) {
      console.error('Error fetching student grades:', error)
      toast.error('Erreur lors du chargement des notes de l\'étudiant')
    }
  }

  const handleStudentChange = (studentId: string) => {
    const student = students.find(s => s.id === parseInt(studentId))
    setSelectedStudent(student || null)
    if (student) {
      fetchStudentGrades(student.id)
    } else {
      setGrades({})
    }
  }

  const handleGradeChange = (modaliteId: number, field: keyof Grade, value: any) => {
    setGrades(prevGrades => {
      const updatedGrade = { ...prevGrades[modaliteId], [field]: value }

      if (field === 'note') {
        const noteValue = Math.min(20, Math.max(0, parseFloat(value) || 0))
        updatedGrade.note = noteValue
        updatedGrade.valide = noteValue >= 10
        updatedGrade.rattrapagePossible = noteValue < 10 && noteValue > 0
      }

      if (field === 'absent') {
        if (value) {
          updatedGrade.note = 0
          updatedGrade.valide = false
          updatedGrade.rattrapagePossible = false
        }
      }

      return { ...prevGrades, [modaliteId]: updatedGrade }
    })
  }

  const handleSubmit = async () => {
    if (!selectedStudent) {
      toast.error('Veuillez sélectionner un étudiant')
      return
    }

    const gradesToSubmit = Object.entries(grades).map(([modaliteId, grade]) => ({
      id: grade.id, // Include this for existing grades
      etudiant: { id: selectedStudent.id },
      element: { id: elementId },
      modaliteEvaluation: { id: parseInt(modaliteId) },
      note: grade.note,
      absent: grade.absent,
      valide: grade.valide,
      rattrapagePossible: grade.rattrapagePossible
    }))

    try {
      const response = await fetch('http://127.0.0.1:8080/notes/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradesToSubmit),
      })

      if (!response.ok) {
        throw new Error('Failed to submit grades')
      }

      toast.success('Notes enregistrées avec succès')
      fetchStudentGrades(selectedStudent.id) // Refresh grades after submission
    } catch (error) {
      console.error('Error submitting grades:', error)
      toast.error('Erreur lors de l\'enregistrement des notes')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Saisie des notes - {element?.nom}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Notes de l'étudiant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select onValueChange={handleStudentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un étudiant" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    {student.prenom} {student.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedStudent && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modalité</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Validé</TableHead>
                    <TableHead>Rattrapage possible</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modalites.map((modalite) => (
                    <TableRow key={modalite.id}>
                      <TableCell>{modalite.nom} (Coef. {modalite.coefficient})</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.25"
                          value={grades[modalite.id]?.note || 0}
                          onChange={(e) => handleGradeChange(modalite.id, 'note', e.target.value)}
                          className="w-20"
                          disabled={grades[modalite.id]?.absent}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={grades[modalite.id]?.absent || false}
                          onCheckedChange={(checked) => handleGradeChange(modalite.id, 'absent', checked)}
                        />
                      </TableCell>
                      <TableCell>
                        {grades[modalite.id]?.valide ? 'Oui' : 'Non'}
                      </TableCell>
                      <TableCell>
                        {grades[modalite.id]?.rattrapagePossible ? 'Oui' : 'Non'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSubmit}>Enregistrer les notes</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

