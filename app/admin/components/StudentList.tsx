'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Search, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Student {
  id: number
  nom: string
  prenom: string
  filiere: string
  email: string
  annee: number
}

const STUDENTS_PER_PAGE = 10

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({ nom: '', prenom: '', filiere: '', email: '', annee: 1 })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({ filiere: '', annee: '' })
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: 'ascending' | 'descending' } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      // In a real application, this would be an API call
      const response = await new Promise<Student[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { id: 1, nom: 'Dupont', prenom: 'Jean', filiere: 'Informatique', email: 'jean.dupont@example.com', annee: 1 },
            { id: 2, nom: 'Martin', prenom: 'Marie', filiere: 'Mathématiques', email: 'marie.martin@example.com', annee: 2 },
            { id: 3, nom: 'Bernard', prenom: 'Luc', filiere: 'Physique', email: 'luc.bernard@example.com', annee: 3 },
            { id: 4, nom: 'Petit', prenom: 'Sophie', filiere: 'Informatique', email: 'sophie.petit@example.com', annee: 1 },
            { id: 5, nom: 'Robert', prenom: 'Thomas', filiere: 'Mathématiques', email: 'thomas.robert@example.com', annee: 2 },
          ])
        }, 1000)
      })
      setStudents(response)
    } catch (error) {
      console.error('Failed to fetch students:', error)
      toast.error('Erreur lors du chargement des étudiants')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewStudent({ ...newStudent, [name]: name === 'annee' ? parseInt(value) : value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && editingId) {
        // In a real application, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        setStudents(students.map(s => s.id === editingId ? { ...newStudent, id: editingId } : s))
        toast.success('Étudiant modifié avec succès')
      } else {
        // In a real application, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        const newId = Math.max(...students.map(s => s.id)) + 1
        setStudents([...students, { id: newId, ...newStudent }])
        toast.success('Étudiant ajouté avec succès')
      }
      setNewStudent({ nom: '', prenom: '', filiere: '', email: '', annee: 1 })
      setIsEditing(false)
      setEditingId(null)
    } catch (error) {
      console.error('Failed to save student:', error)
      toast.error('Erreur lors de l\'enregistrement de l\'étudiant')
    }
  }

  const handleEdit = (student: Student) => {
    setNewStudent(student)
    setIsEditing(true)
    setEditingId(student.id)
  }

  const handleDelete = async (id: number) => {
    try {
      // In a real application, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setStudents(students.filter(s => s.id !== id))
      toast.success('Étudiant supprimé avec succès')
    } catch (error) {
      console.error('Failed to delete student:', error)
      toast.error('Erreur lors de la suppression de l\'étudiant')
    }
  }

  const handleSort = (key: keyof Student) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const handleExport = () => {
    // Implement CSV export logic here
    const csv = [
      ['ID', 'Nom', 'Prénom', 'Filière', 'Email', 'Année'],
      ...filteredStudents.map(student => [student.id, student.nom, student.prenom, student.filiere, student.email, student.annee])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'students.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    toast.success('Liste des étudiants exportée avec succès')
  }

  const filteredStudents = students.filter(student =>
    (student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.filiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filters.filiere === '' || student.filiere === filters.filiere) &&
    (filters.annee === '' || student.annee === parseInt(filters.annee))
  )

  const sortedStudents = sortConfig
    ? [...filteredStudents].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    : filteredStudents

  const totalPages = Math.ceil(sortedStudents.length / STUDENTS_PER_PAGE)
  const currentStudents = sortedStudents.slice((currentPage - 1) * STUDENTS_PER_PAGE, currentPage * STUDENTS_PER_PAGE)

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <Select onValueChange={(value) => handleSelectChange('filiere', value)} value={newStudent.filiere}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une filière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Informatique">Informatique</SelectItem>
                <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                <SelectItem value="Physique">Physique</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleSelectChange('annee', value)} value={newStudent.annee.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1ère année</SelectItem>
                <SelectItem value="2">2ème année</SelectItem>
                <SelectItem value="3">3ème année</SelectItem>
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filtres avancés</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="filiere" className="text-right">
                    Filière
                  </Label>
                  <Select onValueChange={(value) => setFilters({ ...filters, filiere: value })} value={filters.filiere}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Toutes les filières" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les filières</SelectItem>
                      <SelectItem value="Informatique">Informatique</SelectItem>
                      <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                      <SelectItem value="Physique">Physique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="annee" className="text-right">
                    Année
                  </Label>
                  <Select onValueChange={(value) => setFilters({ ...filters, annee: value })} value={filters.annee}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Toutes les années" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les années</SelectItem>
                      <SelectItem value="1">1ère année</SelectItem>
                      <SelectItem value="2">2ème année</SelectItem>
                      <SelectItem value="3">3ème année</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Chargement des étudiants...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('nom')}>Nom</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('prenom')}>Prénom</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('filiere')}>Filière</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>Email</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('annee')}>Année</TableHead>
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
                    <TableCell>{student.annee}</TableCell>
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
        )}

        <div className="mt-4 flex justify-between items-center">
          <div>
            Affichage de {(currentPage - 1) * STUDENTS_PER_PAGE + 1} à {Math.min(currentPage * STUDENTS_PER_PAGE, sortedStudents.length)} sur {sortedStudents.length} étudiants
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

