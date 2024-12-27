'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Department } from '@/types'
import { fetchAllStudents, fetchAllDepartments, addStudent, deleteStudent } from '@/services/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
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
  filiere_id: string
  email: string
  annee: number
  imageUrl: string
}

const STUDENTS_PER_PAGE = 10

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [filieres, setFilieres] = useState<Department[]>([])
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({ nom: '', prenom: '', filiere: '', email: '', annee: 1, filiere_id: '', imageUrl: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({ filiere: '', annee: '' })
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: 'ascending' | 'descending' } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData();
  }, [])

  const getStudentYear = (filiere: string) => {
    if (filiere.toLowerCase() === 'api1') {
      return 1;
    }else if (filiere.toLowerCase() === 'api2') {
      return 2;
    }else{
      return 3;
    }
  }

  const getFiliereName = (id:number) => {
    const filiere = filieres.find(f => f.id === id)
    return filiere ? filiere.nom : 'Inconnu'
  }

  const loadData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchAllStudents();
      const departments = await fetchAllDepartments();
      setFilieres(departments);
      setStudents(data.map((student:any) => {
        return {
          id: student.id,
          nom: student.nom,
          prenom: student.prenom,
          filiere: student.filiere_nom,
          email: student.email,
          annee: getStudentYear(student.filiere_nom),
          imageUrl : student.imageUrl
        }
      }))
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
    setNewStudent({ ...newStudent, 
      [name]: name === 'annee' ? parseInt(value) : value})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && editingId) {
        //editing
        setStudents(students.map(s => s.id === editingId ? { ...newStudent, id: editingId } : s))
        toast.success('Étudiant modifié avec succès')
      } else {
        const filiere_id = parseInt(newStudent.filiere)
        const filiere_nom = getFiliereName(parseInt(newStudent.filiere))
        const newData = await addStudent({
          nom : newStudent.nom,
          prenom : newStudent.prenom, 
          email : newStudent.email,
          filiere_id : filiere_id, //the id of filiere
          imageUrl : ''  
        })
        setStudents([...students, { id: newData.id, ...newStudent, filiere: filiere_nom }])
        toast.success('Étudiant ajouté avec succès')
      }
      setNewStudent({ nom: '', prenom: '', filiere: '', email: '', annee: 1, filiere_id: '', imageUrl: '' })
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
      await deleteStudent(id)
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
                {filieres.map((filiere) => (
                  <SelectItem key={filiere.id} value={(filiere.id).toString()}>{filiere.nom}</SelectItem>
                ))}
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
                  <TableHead className="cursor-pointer">Photo</TableHead>
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
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={student.imageUrl} alt={`${student.prenom} ${student.nom}`} />
                        <AvatarFallback>{student.prenom[0]}{student.nom[0]}</AvatarFallback>
                      </Avatar>
                    </TableCell>
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

