'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-hot-toast'
import { Download, Search, Filter, Loader2 } from 'lucide-react'
import { fetchAllStudentsGrades, generateTranscript, fetchFilieres, StudentGrade } from '@/services/api'
import { Filiere } from '@/types'

export default function AdminGradesPage() {
  const [students, setStudents] = useState<StudentGrade[]>([])
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFiliere, setSelectedFiliere] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [studentsData, filieresData] = await Promise.all([
        fetchAllStudentsGrades(),
        fetchFilieres()
      ])
      setStudents(studentsData)
      setFilieres(filieresData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateTranscript = async (studentId: number) => {
    try {
      const blob = await generateTranscript(studentId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `releve_notes_${studentId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Relevé de notes généré avec succès')
    } catch (error) {
      console.error('Error generating transcript:', error)
      toast.error('Erreur lors de la génération du relevé de notes')
    }
  }

  const filteredStudents = students.filter(student => 
    (student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.prenom.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedFiliere === '' || student.filiere === selectedFiliere)
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Gestion des Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center w-full md:w-auto">
            <Search className="w-4 h-4 mr-2 text-gray-500" />
            <Input
              placeholder="Rechercher un étudiant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-auto"
            />
          </div>
          <div className="flex items-center w-full md:w-auto">
            <Filter className="w-4 h-4 mr-2 text-gray-500" />
            <Select value={selectedFiliere} onValueChange={setSelectedFiliere}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrer par filière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les filières</SelectItem>
                {filieres.map((filiere) => (
                  <SelectItem key={filiere.id} value={filiere.nom}>
                    {filiere.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Filière</TableHead>
                {Object.keys(students[0]?.evaluations || {}).map((evalName) => (
                  <TableHead key={evalName}>{evalName}</TableHead>
                ))}
                <TableHead>Note Générale</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.nom}</TableCell>
                  <TableCell>{student.prenom}</TableCell>
                  <TableCell>{student.filiere}</TableCell>
                  {Object.entries(student.evaluations).map(([evalName, grade]) => (
                    <TableCell key={evalName}>{grade.toFixed(2)}</TableCell>
                  ))}
                  <TableCell>{student.noteGenerale.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerateTranscript(student.id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Relevé
                    </Button>
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

