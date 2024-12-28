'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Professor {
  id: number
  nom: string
  prenom: string
  specialite: string
  codeIdentification: string
  login: string
  motDePasse: string
  imageUrl: string
}

export function ProfessorManagement() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [newProfessor, setNewProfessor] = useState<Omit<Professor, 'id'>>({
    nom: '',
    prenom: '',
    specialite: '',
    codeIdentification: '',
    login: '',
    motDePasse: '',
    imageUrl: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetchProfessors()
  }, [])

  const fetchProfessors = async () => {
    try {
      const response = await fetch('http://localhost:8080/professeurs')
      if (!response.ok) {
        throw new Error('Failed to fetch professors')
      }
      const data = await response.json()
      setProfessors(data)
    } catch (error) {
      console.error('Error fetching professors:', error)
      toast.error('Erreur lors du chargement des professeurs')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProfessor({ ...newProfessor, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && editingId) {
        // Update existing professor
        const response = await fetch(`http://localhost:8080/professeurs/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProfessor)
        })
        if (!response.ok) {
          throw new Error('Failed to update professor')
        }
        toast.success('Professeur modifié avec succès')
      } else {
        // Add new professor
        const response = await fetch('http://localhost:8080/professeurs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProfessor)
        })
        if (!response.ok) {
          throw new Error('Failed to add professor')
        }
        toast.success('Professeur ajouté avec succès')
      }
      fetchProfessors() // Refresh the list
      setNewProfessor({
        nom: '',
        prenom: '',
        specialite: '',
        codeIdentification: '',
        login: '',
        motDePasse: '',
        imageUrl: ''
      })
      setIsEditing(false)
      setEditingId(null)
    } catch (error) {
      console.error('Error submitting professor:', error)
      toast.error('Erreur lors de l\'enregistrement du professeur')
    }
  }

  const handleEdit = (professor: Professor) => {
    setNewProfessor(professor)
    setIsEditing(true)
    setEditingId(professor.id)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/professeurs/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Failed to delete professor')
      }
      setProfessors(professors.filter(p => p.id !== id))
      toast.success('Professeur supprimé avec succès')
    } catch (error) {
      console.error('Error deleting professor:', error)
      toast.error('Erreur lors de la suppression du professeur')
    }
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
              placeholder="Spécialité"
              name="specialite"
              value={newProfessor.specialite}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Code d'identification"
              name="codeIdentification"
              value={newProfessor.codeIdentification}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Login (Email)"
              name="login"
              type="email"
              value={newProfessor.login}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Mot de passe"
              name="motDePasse"
              type="password"
              value={newProfessor.motDePasse}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="URL de l'image"
              name="imageUrl"
              value={newProfessor.imageUrl}
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
                <TableHead>Photo</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Spécialité</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professors.map((professor) => (
                <TableRow key={professor.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={professor.imageUrl} alt={`${professor.prenom} ${professor.nom}`} />
                      <AvatarFallback>{professor.prenom[0]}{professor.nom[0]}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{professor.nom}</TableCell>
                  <TableCell>{professor.prenom}</TableCell>
                  <TableCell>{professor.specialite}</TableCell>
                  <TableCell>{professor.codeIdentification}</TableCell>
                  <TableCell>{professor.login}</TableCell>
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

