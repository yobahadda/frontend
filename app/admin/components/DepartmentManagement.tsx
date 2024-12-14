'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Department {
  id: number
  nom: string
  description: string
}

export function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [newDepartment, setNewDepartment] = useState({ nom: '', description: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    // Fetch departments from API
    setDepartments([
      { id: 1, nom: 'Informatique', description: 'Département d\'informatique' },
      { id: 2, nom: 'Mathématiques', description: 'Département de mathématiques' },
    ])
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDepartment({ ...newDepartment, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && editingId) {
      // Update existing department
      setDepartments(departments.map(d => d.id === editingId ? { ...newDepartment, id: editingId } : d))
      toast.success('Filière modifiée avec succès')
    } else {
      // Add new department
      setDepartments([...departments, { id: Date.now(), ...newDepartment }])
      toast.success('Filière ajoutée avec succès')
    }
    setNewDepartment({ nom: '', description: '' })
    setIsEditing(false)
    setEditingId(null)
  }

  const handleEdit = (department: Department) => {
    setNewDepartment(department)
    setIsEditing(true)
    setEditingId(department.id)
  }

  const handleDelete = (id: number) => {
    setDepartments(departments.filter(d => d.id !== id))
    toast.success('Filière supprimée avec succès')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Gestion des Filières</CardTitle>
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
              placeholder="Nom de la filière"
              name="nom"
              value={newDepartment.nom}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Description"
              name="description"
              value={newDepartment.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {isEditing ? 'Modifier' : 'Ajouter'} une Filière
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </motion.form>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.nom}</TableCell>
                  <TableCell>{department.description}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(department)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(department.id)}>
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

