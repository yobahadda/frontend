'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Search, Download, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { fetchAllStudents, fetchFilieres } from '@/services/api'
import { Student, Filiere } from '@/types'

const STUDENTS_PER_PAGE = 10

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({ nom: '', prenom: '', email: '', filiere: { id: 0, nom: '' }, anneeEtude: 1, imageUrl: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({ filiere: '', annee: '' })
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: 'ascending' | 'descending' } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStudentsAndFilieres()
  }, [])

  const loadStudentsAndFilieres = async () => {
    setIsLoading(true)
    try {
      const [studentsData, filieresData] = await Promise.all([
        fetchAllStudents(),
        fetchFilieres()
      ])
      setStudents(studentsData)
      setFilieres(filieresData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string, field: string) => {
    if (field === 'filiere') {
      const selectedFiliere = filieres.find(f => f.id.toString() === value)
      setNewStudent({ ...newStudent, filiere: selectedFiliere || { id: 0, nom: '' } })
    } else {
      setNewStudent({ ...newStudent, [field]: parseInt(value) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && editingId) {
        // Update existing student
        // Implement API call to update student
        toast.success('Étudiant modifié avec succès')
      } else {
        // Add new student
        // Implement API call to add new student
        toast.success('Étudiant ajouté avec succès')
      }
      loadStudentsAndFilieres() // Refresh the list
      setNewStudent({ nom: '', prenom: '', email: '', filiere: { id: 0, nom: '' }, anneeEtude: 1, imageUrl: '' })
      setIsEditing(false)
      setEditingId(null)
    } catch (error) {
      console.error('Error submitting student:', error)
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
      // Implement API call to delete student
      setStudents(students.filter(s => s.id !== id))
      toast.success('Étudiant supprimé avec succès')
    } catch (error) {
      console.error('Error deleting student:', error)
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
    toast.success('Liste des étudiants exportée avec succès')
  }

  const filteredStudents = students.filter(student =>
    (student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.filiere.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filters.filiere === '' || student.filiere.id.toString() === filters.filiere) &&
    (filters.annee === '' || student.anneeEtude === parseInt(filters.annee))
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
            <Select onValueChange={(value) => handleSelectChange(value, 'filiere')} value={newStudent.filiere.id.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une filière" />
              </SelectTrigger>
              <SelectContent>
                {filieres.map((filiere) => (
                  <SelectItem key={filiere.id} value={filiere.id.toString()}>{filiere.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleSelectChange(value, 'anneeEtude')} value={newStudent.anneeEtude.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1ère année</SelectItem>
                <SelectItem value="2">2ème année</SelectItem>
                <SelectItem value="3">3ème année</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="URL de l'image"
              name="imageUrl"
              value={newStudent.imageUrl}
              onChange={handleInputChange}
              required
            />
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
                      {filieres.map((filiere) => (
                        <SelectItem key={filiere.id} value={filiere.id.toString()}>{filiere.nom}</SelectItem>
                      ))}
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

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('nom')}>Nom</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('prenom')}>Prénom</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('filiere')}>Filière</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>Email</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('anneeEtude')}>Année</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.nom}</TableCell>
                  <TableCell>{student.prenom}</TableCell>
                  <TableCell>{student.filiere.nom}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.anneeEtude}</TableCell>
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

