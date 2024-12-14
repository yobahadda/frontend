'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Module {
  id: number
  nom: string
  filiere: string
  elements: string[]
}

export function ModuleManagement() {
  const [modules, setModules] = useState<Module[]>([])
  const [newModule, setNewModule] = useState({ nom: '', filiere: '', elements: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    // Fetch modules from API
    setModules([
      { id: 1, nom: 'Programmation avancée', filiere: 'Informatique', elements: ['Java', 'Python'] },
      { id: 2, nom: 'Analyse mathématique', filiere: 'Mathématiques', elements: ['Calcul différentiel', 'Intégration'] },
    ])
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewModule({ ...newModule, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setNewModule({ ...newModule, filiere: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && editingId) {
      // Update existing module
      setModules(modules.map(m => m.id === editingId ? { 
        ...newModule, 
        id: editingId, 
        elements: newModule.elements.split(',').map(el => el.trim()) 
      } : m))
      toast.success('Module modifié avec succès')
    } else {
      // Add new module
      setModules([...modules, { 
        id: Date.now(), 
        ...newModule, 
        elements: newModule.elements.split(',').map(el => el.trim()) 
      }])
      toast.success('Module ajouté avec succès')
    }
    setNewModule({ nom: '', filiere: '', elements: '' })
    setIsEditing(false)
    setEditingId(null)
  }

  const handleEdit = (module: Module) => {
    setNewModule({
      nom: module.nom,
      filiere: module.filiere,
      elements: module.elements.join(', ')
    })
    setIsEditing(true)
    setEditingId(module.id)
  }

  const handleDelete = (id: number) => {
    setModules(modules.filter(m => m.id !== id))
    toast.success('Module supprimé avec succès')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Gestion des Modules et Éléments</CardTitle>
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
            <Select onValueChange={handleSelectChange} value={newModule.filiere}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une filière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Informatique">Informatique</SelectItem>
                <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                {/* Add more departments as needed */}
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Éléments (séparés par des virgules)"
            name="elements"
            value={newModule.elements}
            onChange={handleInputChange}
            required
          />
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
                <TableHead>Filière</TableHead>
                <TableHead>Éléments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell className="font-medium">{module.nom}</TableCell>
                  <TableCell>{module.filiere}</TableCell>
                  <TableCell>{module.elements.join(', ')}</TableCell>
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

