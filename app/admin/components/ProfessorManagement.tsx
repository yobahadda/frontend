'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Professor {
  id: number
  nom: string
  prenom: string
  email: string
  specialite: string
}

export function ProfessorManagement() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [newProfessor, setNewProfessor] = useState({ nom: '', prenom: '', email: '', specialite: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    // Fetch professors from API
    setProfessors([
      { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@example.com', specialite: 'Mathématiques' },
      { id: 2, nom: 'Martin', prenom: 'Marie', email: 'marie.martin@example.com', specialite: 'Physique' },
    ])
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProfessor({ ...newProfessor, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && editingId) {
      // Update existing professor
      setProfessors(professors.map(p => p.id === editingId ? { ...newProfessor, id: editingId } : p))
      toast.success('Professeur modifié avec succès')
    } else {
      // Add new professor
      setProfessors([...professors, { id: Date.now(), ...newProfessor }])
      toast.success('Professeur ajouté avec succès')
    }
    setNewProfessor({ nom: '', prenom: '', email: '', specialite: '' })
    setIsEditing(false)
    setEditingId(null)
  }

  const handleEdit = (professor: Professor) => {
    setNewProfessor(professor)
    setIsEditing(true)
    setEditingId(professor.id)
  }

  const handleDelete = (id: number) => {
    setProfessors(professors.filter(p => p.id !== id))
    toast.success('Professeur supprimé avec succès')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Gestion des Professeurs</CardTitle>
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
              value={newProfessor.nom}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Prénom"
              name="prenom"
              value={newProfessor.prenom}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={newProfessor.email}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Spécialité"
              name="specialite"
              value={newProfessor.specialite}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {isEditing ? 'Modifier' : 'Ajouter'} un Professeur
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </motion.form>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Spécialité</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professors.map((professor) => (
                <TableRow key={professor.id}>
                  <TableCell className="font-medium">{professor.nom}</TableCell>
                  <TableCell>{professor.prenom}</TableCell>
                  <TableCell>{professor.email}</TableCell>
                  <TableCell>{professor.specialite}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(professor)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(professor.id)}>
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

