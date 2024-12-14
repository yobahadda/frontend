'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Assignment {
  id: number
  professor: string
  module: string
  element: string
}

export function ProfessorAssignment() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [newAssignment, setNewAssignment] = useState({ professor: '', module: '', element: '' })
  const [professors, setProfessors] = useState<string[]>([])
  const [modules, setModules] = useState<string[]>([])
  const [elements, setElements] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    // Fetch assignments, professors, modules, and elements from API
    setAssignments([
      { id: 1, professor: 'Jean Dupont', module: 'Programmation avancée', element: 'Java' },
      { id: 2, professor: 'Marie Martin', module: 'Analyse mathématique', element: 'Calcul différentiel' },
    ])
    setProfessors(['Jean Dupont', 'Marie Martin'])
    setModules(['Programmation avancée', 'Analyse mathématique'])
    setElements(['Java', 'Python', 'Calcul différentiel', 'Intégration'])
  }, [])

  const handleSelectChange = (value: string, field: string) => {
    setNewAssignment({ ...newAssignment, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && editingId) {
      // Update existing assignment
      setAssignments(assignments.map(a => a.id === editingId ? { ...newAssignment, id: editingId } : a))
      toast.success('Affectation modifiée avec succès')
    } else {
      // Add new assignment
      setAssignments([...assignments, { id: Date.now(), ...newAssignment }])
      toast.success('Affectation ajoutée avec succès')
    }
    setNewAssignment({ professor: '', module: '', element: '' })
    setIsEditing(false)
    setEditingId(null)
  }

  const handleEdit = (assignment: Assignment) => {
    setNewAssignment(assignment)
    setIsEditing(true)
    setEditingId(assignment.id)
  }

  const handleDelete = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id))
    toast.success('Affectation supprimée avec succès')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Affectation des Éléments aux Professeurs</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select onValueChange={(value) => handleSelectChange(value, 'professor')} value={newAssignment.professor}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un professeur" />
              </SelectTrigger>
              <SelectContent>
                {professors.map((prof) => (
                  <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleSelectChange(value, 'module')} value={newAssignment.module}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((mod) => (
                  <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleSelectChange(value, 'element')} value={newAssignment.element}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un élément" />
              </SelectTrigger>
              <SelectContent>
                {elements.map((elem) => (
                  <SelectItem key={elem} value={elem}>{elem}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            {isEditing ? 'Modifier' : 'Ajouter'} une Affectation
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </motion.form>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Professeur</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Élément</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.professor}</TableCell>
                  <TableCell>{assignment.module}</TableCell>
                  <TableCell>{assignment.element}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(assignment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(assignment.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

