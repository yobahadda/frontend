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

interface EvaluationMethod {
  id: number
  nom: string
  coefficient: number
  module: string
}

export function EvaluationMethodManagement() {
  const [evaluationMethods, setEvaluationMethods] = useState<EvaluationMethod[]>([])
  const [newMethod, setNewMethod] = useState({ nom: '', coefficient: '', module: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    // Fetch evaluation methods from API
    setEvaluationMethods([
      { id: 1, nom: 'Examen final', coefficient: 0.6, module: 'Programmation avancée' },
      { id: 2, nom: 'Contrôle continu', coefficient: 0.4, module: 'Analyse mathématique' },
    ])
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMethod({ ...newMethod, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setNewMethod({ ...newMethod, module: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && editingId) {
      // Update existing evaluation method
      setEvaluationMethods(evaluationMethods.map(m => m.id === editingId ? { 
        ...newMethod, 
        id: editingId, 
        coefficient: parseFloat(newMethod.coefficient) 
      } : m))
      toast.success('Modalité d\'évaluation modifiée avec succès')
    } else {
      // Add new evaluation method
      setEvaluationMethods([...evaluationMethods, { 
        id: Date.now(), 
        ...newMethod, 
        coefficient: parseFloat(newMethod.coefficient) 
      }])
      toast.success('Modalité d\'évaluation ajoutée avec succès')
    }
    setNewMethod({ nom: '', coefficient: '', module: '' })
    setIsEditing(false)
    setEditingId(null)
  }

  const handleEdit = (method: EvaluationMethod) => {
    setNewMethod({
      nom: method.nom,
      coefficient: method.coefficient.toString(),
      module: method.module
    })
    setIsEditing(true)
    setEditingId(method.id)
  }

  const handleDelete = (id: number) => {
    setEvaluationMethods(evaluationMethods.filter(m => m.id !== id))
    toast.success('Modalité d\'évaluation supprimée avec succès')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Gestion des Modalités d'Évaluation</CardTitle>
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
              placeholder="Nom de la modalité"
              name="nom"
              value={newMethod.nom}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Coefficient"
              name="coefficient"
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={newMethod.coefficient}
              onChange={handleInputChange}
              required
            />
          </div>
          <Select onValueChange={handleSelectChange} value={newMethod.module}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Programmation avancée">Programmation avancée</SelectItem>
              <SelectItem value="Analyse mathématique">Analyse mathématique</SelectItem>
              {/* Add more modules as needed */}
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full">
            {isEditing ? 'Modifier' : 'Ajouter'} une Modalité d'Évaluation
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </motion.form>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Coefficient</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluationMethods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell className="font-medium">{method.nom}</TableCell>
                  <TableCell>{method.coefficient}</TableCell>
                  <TableCell>{method.module}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(method)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(method.id)}>
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

