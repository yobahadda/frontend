'use client'

import { useState, useEffect } from 'react'
import { fetchAllElements, fetchAllProfessors, fetchAllModules, fetchModuleElements, affectProfToEle, fetchAllAssignments, deleteAffectation } from '@/services/api'
import { Professeur, Module, ModuleElement} from '@/types'
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
  const [professors, setProfessors] = useState<Professeur[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [elements, setElements] = useState<ModuleElement[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    loadData();
  }, [])

  const handleSelectChange = async (value: string, field: string) => {
    const newVal = field==='module' ? await loadElements(parseInt(value)) : value;
    setNewAssignment({ ...newAssignment, [field]: newVal })
  }

  const loadData = async () => {
    const assigns = await fetchAllAssignments()
    const eles = await fetchAllElements()
    const profs = await fetchAllProfessors()
    const modls = await fetchAllModules()
    setModules(modls)
    setProfessors(profs)
    setElements(eles)
    setAssignments(assigns.map((assign: any) => ({
      id: assign.id,
      professor: assign.professeur,
      module: assign.module + " S" + (assign.semestre).toString(),
      element: assign.elementDeModule
    })))
  }

  const loadElements = async (id: number) => {
    const elems = await fetchModuleElements(id)
    setElements(elems)
  }

  const getProfName = (id:number) => {
    const prof = professors.find(f => f.id === id)?.nom
    return prof ? prof : 'Inconnu'
  }

  const getModuleName = (id:number) => {
    const mod =  modules.find(f => f.id === id)?.nom
    return mod ? mod : 'Inconnu'
  }

  const getEleName = async (id:number) => {
    const ele =  elements.find(f => f.id === id)?.nom
    return ele ? ele : 'Inconnu'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && editingId) {
      // Update existing assignment
      setAssignments(assignments.map(a => a.id === editingId ? { ...newAssignment, id: editingId } : a))
      toast.success('Affectation modifiée avec succès')
    } else {
      const data = await affectProfToEle({
        elementId: newAssignment.element,
        profId: newAssignment.professor
      })
      setAssignments([...assignments, { 
        id: data.id, 
        professor: getProfName(parseInt(newAssignment.professor)),
        module: getModuleName(parseInt(newAssignment.module)),
        element: await getEleName(parseInt(newAssignment.element))
      }])
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

  const handleDelete = async (id: number) => {
    try{
      await deleteAffectation(id)
      setAssignments(assignments.filter(a => a.id !== id))
      toast.success('Affectation supprimée avec succès')
    }catch(e){
      console.error('Failed to delete affectation:', e)
      toast.error('Erreur lors de la suppression de l\'affectation')
    }
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
                  <SelectItem key={prof.id} value={(prof.id).toString()}>{prof.nom} {prof.prenom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleSelectChange(value, 'module')} value={newAssignment.module}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((mod) => (
                  <SelectItem key={mod.id} value={(mod.id).toString()}>{mod.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleSelectChange(value, 'element')} value={newAssignment.element}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un élément" />
              </SelectTrigger>
              <SelectContent>
                {elements.map((elem) => (
                  <SelectItem key={elem.id} value={(elem.id).toString()}>{elem.nom}</SelectItem>
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

