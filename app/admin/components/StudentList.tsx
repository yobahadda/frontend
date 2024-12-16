'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Search } from 'lucide-react'

interface Student {
  id: number
  nom: string
  prenom: string
  filiere: string
  email: string
}

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [newStudent, setNewStudent] = useState({ nom: '', prenom: '', filiere: '', email: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [studentsPerPage] = useState(10)

  useEffect(() => {
    // Fetch students from API
    setStudents([
      { id: 1, nom: 'Dupont', prenom: 'Jean', filiere: 'Informatique', email: 'jean.dupont@example.com' },
      { id: 2, nom: 'Martin', prenom: 'Marie', filiere: 'Mathématiques', email: 'marie.martin@example.com' },
      // Add more sample data here...
    ])
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setNewStudent({ ...newStudent, filiere: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && editingId) {
      // Update existing student
      setStudents(students.map(s => s.id === editingId ? { ...newStudent, id: editingId } : s))
      toast.success('Étudiant modifié avec succès')
    } else {
      // Add new student
      setStudents([...students, { id: Date.now(), ...newStudent }])
      toast.success('Étudiant ajouté avec succès')
    }
    setNewStudent({ nom: '', prenom: '', filiere: '', email: '' })
    setIsEditing(false)
    setEditingId(null)
  }

  const handleEdit = (student: Student) => {
    setNewStudent(student)
    setIsEditing(true)
    setEditingId(student.id)
  }

  const handleDelete = (id: number) => {
    setStudents(students.filter(s => s.id !== id))
    toast.success('Étudiant supprimé avec succès')
  }

  const filteredStudents = students.filter(student =>
    student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.filiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Liste des Étudiants</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Nom"
              name="nom"
              value={newStudent.nom}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Prénom"
              name="prenom"
              value={newStudent.prenom}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={newStudent.email}
              onChange={handleInputChange}
              required
            />
            <Select onValueChange={handleSelectChange} value={newStudent.filiere}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une filière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Informatique">Informatique</SelectItem>
                <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                <SelectItem value="Physique">Physique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            {isEditing ? 'Modifier' : 'Ajouter'} un Étudiant
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </motion.form>

        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-5 h-5 text-gray-500" />
          <Input
            placeholder="Rechercher un étudiant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Filière</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.nom}</TableCell>
                  <TableCell>{student.prenom}</TableCell>
                  <TableCell>{student.filiere}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(student)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(student.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>
            Affichage de {indexOfFirstStudent + 1} à {Math.min(indexOfLastStudent, filteredStudents.length)} sur {filteredStudents.length} étudiants
          </div>
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(filteredStudents.length / studentsPerPage) }, (_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

