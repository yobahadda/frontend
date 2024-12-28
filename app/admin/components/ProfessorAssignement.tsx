'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-hot-toast'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { fetchProfessors, fetchAllElements, createAssignment, fetchAssignments, deleteAssignment } from '@/services/api'
import { Professor, ModuleElement } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Assignment {
  id: number
  professeur: Professor
  element: ModuleElement
}

export function ProfessorAssignment() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [elements, setElements] = useState<ModuleElement[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [selectedProfessor, setSelectedProfessor] = useState<string>('')
  const [selectedElement, setSelectedElement] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [professorsData, elementsData, assignmentsData] = await Promise.all([
        fetchProfessors(),
        fetchAllElements(),
        fetchAssignments()
      ])
      setProfessors(professorsData)
      setElements(elementsData)
      setAssignments(assignmentsData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProfessor || !selectedElement) {
      toast.error('Veuillez sélectionner un professeur et un élément')
      return
    }

    try {
      setSubmitting(true)
      const newAssignment = await createAssignment(parseInt(selectedElement), parseInt(selectedProfessor))
      setAssignments([...assignments, newAssignment])
      toast.success('Affectation ajoutée avec succès')
      setSelectedProfessor('')
      setSelectedElement('')
    } catch (error) {
      console.error('Error creating assignment:', error)
      toast.error('Erreur lors de l\'ajout de l\'affectation')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteAssignment(id)
      setAssignments(assignments.filter(a => a.id !== id))
      toast.success('Affectation supprimée avec succès')
    } catch (error) {
      console.error('Error deleting assignment:', error)
      toast.error('Erreur lors de la suppression de l\'affectation')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select onValueChange={setSelectedProfessor} value={selectedProfessor}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un professeur" />
              </SelectTrigger>
              <SelectContent>
                {professors.map((prof) => (
                  <SelectItem key={prof.id} value={prof.id.toString()}>
                    {prof.prenom} {prof.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedElement} value={selectedElement}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un élément" />
              </SelectTrigger>
              <SelectContent>
                {elements.map((elem) => (
                  <SelectItem key={elem.id} value={elem.id.toString()}>
                    {elem.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              <>
                Ajouter une Affectation
                <Plus className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.form>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Professeur</TableHead>
                <TableHead>Élément</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={assignment.professeur.imageUrl} alt={`${assignment.professeur.prenom} ${assignment.professeur.nom}`} />
                        <AvatarFallback>{assignment.professeur.prenom[0]}{assignment.professeur.nom[0]}</AvatarFallback>
                      </Avatar>
                      <span>{assignment.professeur.prenom} {assignment.professeur.nom}</span>
                    </div>
                  </TableCell>
                  <TableCell>{assignment.element.nom}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette affectation ? Cette action ne peut pas être annulée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(assignment.id)}>
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

