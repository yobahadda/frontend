'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import { fetchModules, fetchFilieres } from '@/services/api'
import { Module, Filiere } from '@/types'

export function ModuleManagement() {
  const [modules, setModules] = useState<Module[]>([])
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [newModule, setNewModule] = useState({ nom: '', semestre: '', anneeUniversitaire: '', filiereId: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadModulesAndFilieres()
  }, [])

  const loadModulesAndFilieres = async () => {
    setIsLoading(true)
    try {
      const [modulesData, filieresData] = await Promise.all([
        fetchModules(),
        fetchFilieres()
      ])
      setModules(modulesData)
      setFilieres(filieresData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewModule({ ...newModule, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string, field: string) => {
    setNewModule({ ...newModule, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && editingId) {
        // Update existing module
        // Implement API call to update module
        toast.success('Module modifié avec succès')
      } else {
        // Add new module
        // Implement API call to add new module
        toast.success('Module ajouté avec succès')
      }
      loadModulesAndFilieres() // Refresh the list
      setNewModule({ nom: '', semestre: '', anneeUniversitaire: '', filiereId: '' })
      setIsEditing(false)
      setEditingId(null)
    } catch (error) {
      console.error('Error submitting module:', error)
      toast.error('Erreur lors de l\'enregistrement du module')
    }
  }

  const handleEdit = (module: Module) => {
    setNewModule({
      nom: module.nom,
      semestre: module.semestre.toString(),
      anneeUniversitaire: module.anneeUniversitaire,
      filiereId: module.Filiere.id.toString()
    })
    setIsEditing(true)
    setEditingId(module.id)
  }

  const handleDelete = async (id: number) => {
    try {
      // Implement API call to delete module
      setModules(modules.filter(m => m.id !== id))
      toast.success('Module supprimé avec succès')
    } catch (error) {
      console.error('Error deleting module:', error)
      toast.error('Erreur lors de la suppression du module')
    }
  }

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
        <CardTitle className="text-2xl font-bold">Gestion des Modules</CardTitle>
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
              placeholder="Nom du module"
              name="nom"
              value={newModule.nom}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Semestre"
              name="semestre"
              type="number"
              min="1"
              max="6"
              value={newModule.semestre}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Année universitaire"
              name="anneeUniversitaire"
              value={newModule.anneeUniversitaire}
              onChange={handleInputChange}
              required
            />
            <Select onValueChange={(value) => handleSelectChange(value, 'filiereId')} value={newModule.filiereId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une filière" />
              </SelectTrigger>
              <SelectContent>
                {filieres.map((filiere) => (
                  <SelectItem key={filiere.id} value={filiere.id.toString()}>{filiere.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            {isEditing ? 'Modifier' : 'Ajouter'} un Module
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </motion.form>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du Module</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Année Universitaire</TableHead>
                <TableHead>Filière</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell className="font-medium">{module.nom}</TableCell>
                  <TableCell>{module.semestre}</TableCell>
                  <TableCell>{module.anneeUniversitaire}</TableCell>
                  <TableCell>{module.Filiere ? module.Filiere.nom : 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(module)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(module.id)}>
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

