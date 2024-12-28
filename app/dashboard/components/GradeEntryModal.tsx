'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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
}

interface GradeEntryModalProps {
  element: Element
  modalites: Modalite[]
  onClose: () => void
}

export function GradeEntryModal({ element, modalites, onClose }: GradeEntryModalProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedModalite, setSelectedModalite] = useState<Modalite | null>(null)
  const [grade, setGrade] = useState('')
  const [isAbsent, setIsAbsent] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/etudiants/by-element/${element.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch students')
      }
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
      toast.error('Erreur lors du chargement des étudiants')
    }
  }

  const handleSubmit = async () => {
    if (!selectedStudent || !selectedModalite) {
      toast.error('Veuillez sélectionner un étudiant et une modalité d\'évaluation')
      return
    }

    const gradeValue = isAbsent ? 0 : parseFloat(grade)
    if (!isAbsent && (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 20)) {
      toast.error('La note doit être comprise entre 0 et 20')
      return
    }

    const gradeData = {
      etudiant: { id: selectedStudent.id },
      element: { id: element.id },
      modaliteEvaluation: { id: selectedModalite.id },
      note: gradeValue,
      absent: isAbsent,
      valide: gradeValue >= 10,
      rattrapagePossible: gradeValue > 0 && gradeValue < 10
    }

    try {
      const response = await fetch('http://127.0.0.1:8080/note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradeData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit grade')
      }

      toast.success('Note enregistrée avec succès')
      setGrade('')
      setIsAbsent(false)
      setSelectedStudent(null)
    } catch (error) {
      console.error('Error submitting grade:', error)
      toast.error('Erreur lors de l\'enregistrement de la note')
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Saisie des notes - {element.nom}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="student">Étudiant</label>
            <Select onValueChange={(value) => setSelectedStudent(students.find(s => s.id === parseInt(value)) || null)}>
              <SelectTrigger className="col-span-3">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="modalite">Modalité</label>
            <Select onValueChange={(value) => setSelectedModalite(modalites.find(m => m.id === parseInt(value)) || null)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner une modalité" />
              </SelectTrigger>
              <SelectContent>
                {modalites.map((modalite) => (
                  <SelectItem key={modalite.id} value={modalite.id.toString()}>
                    {modalite.nom} (Coefficient: {modalite.coefficient})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="grade">Note</label>
            <Input
              id="grade"
              type="number"
              min="0"
              max="20"
              step="0.25"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="col-span-3"
              disabled={isAbsent}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="absent"
              checked={isAbsent}
              onCheckedChange={(checked) => {
                setIsAbsent(checked as boolean)
                if (checked) {
                  setGrade('0')
                }
              }}
            />
            <label htmlFor="absent">Absent</label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Enregistrer la note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

