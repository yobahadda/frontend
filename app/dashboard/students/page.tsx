'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/app/hooks/useSession'
import { fetchStudentsByProfessor } from '@/services/api'
import { Student } from '@/types'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Search, Mail } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const PAGE_SIZE = 10

interface Student {
  id: number
  nom: string
  prenom: string
  email: string
  imageUrl: string
  anneeEtude: number
  filiereId: number
  filiereNom: string
  filiereDescription: string
}

export default function StudentsPage() {
  const { user, professor } = useSession()
  console.log('Rendering StudentsPage');
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: 'asc' | 'desc' } | null>(null)

  useEffect(() => {
    console.log('Professor in StudentsPage:', professor);
    if (professor?.id) {
      console.log('Loading students for professor ID:', professor.id);
      loadStudents(professor.id)
    } else {
      console.log('No professor ID available');
    }
  }, [professor])

  const loadStudents = async (professorId: number) => {
    try {
      console.log('Fetching students for professor ID:', professorId);
      setLoading(true)
      const data = await fetchStudentsByProfessor(professorId)
      console.log('Fetched students:', data);
      setStudents(data)
      setFilteredStudents(data)
    } catch (err) {
      console.error('Error loading students:', err)
      setError('Failed to load students. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = students.filter(student => 
      student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.filiereNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.filiereDescription.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredStudents(filtered)
    setCurrentPage(1)
  }, [searchTerm, students])

  const handleSort = (key: keyof Student) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })

    const sortedStudents = [...filteredStudents].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })
    setFilteredStudents(sortedStudents)
  }

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE)

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading students...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Liste des Étudiants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center">
            <Search className="mr-2 h-4 w-4 opacity-50" />
            <Input
              placeholder="Rechercher par nom, prénom, email ou filière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Photo</TableHead>
                  <TableHead onClick={() => handleSort('nom')} className="cursor-pointer">
                    Nom {sortConfig?.key === 'nom' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('prenom')} className="cursor-pointer">
                    Prénom {sortConfig?.key === 'prenom' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead onClick={() => handleSort('anneeEtude')} className="cursor-pointer">
                    Année d'étude {sortConfig?.key === 'anneeEtude' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('filiereNom')} className="cursor-pointer">
                    Filière {sortConfig?.key === 'filiereNom' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(paginatedStudents) ? paginatedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={student.imageUrl} alt={`${student.prenom} ${student.nom}`} />
                        <AvatarFallback>{student.prenom[0]}{student.nom[0]}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{student.nom}</TableCell>
                    <TableCell>{student.prenom}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" className="p-0">
                              <Mail className="h-4 w-4 mr-2" />
                              {student.email.split('@')[0]}...
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{student.email}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{student.anneeEtude}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>{student.filiereNom}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{student.filiereDescription}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6}>No students found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, filteredStudents.length)} of {filteredStudents.length} students
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((old) => Math.min(old + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

