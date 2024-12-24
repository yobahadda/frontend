'use client'

import { useState, useEffect } from 'react'
import { fetchAllModules, fetchAllDepartments, addModule, deleteModule } from '@/services/api'
import { Department } from '@/types'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { set } from 'date-fns'

interface Module {
  id: number
  nom: string
  filiere_id: number
  filiere: string
  elements: string[]
}

export function ModuleManagement() {
  const [modules, setModules] = useState<Module[]>([])
  const [filieres, setFilieres] = useState<Department[]>([])
  const [newModule, setNewModule] = useState({ nom: '', filiere: '', filiere_id: '', elements: '', semestre:1 })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => { 
    loadData();
  }, [])

  const loadData = async () => {
    const retreivedModules = await fetchAllModules()
    const retreivedDepartments = await fetchAllDepartments()
    setFilieres(retreivedDepartments)
    setModules(retreivedModules.map((module: any) => ({ 
      id: module.id, 
      nom: module.nom,
      filiere_id: module.filiere_id,
      elements: module.elements
    })))
  }

  const getFiliereName = (id:number) => {
    const filiere = filieres.find(f => f.id === id)
    return filiere ? filiere.nom : 'Inconnu'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewModule({ ...newModule, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setNewModule({ ...newModule, filiere: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && editingId) {
      // Update existing module
      setModules(modules.map(m => m.id === editingId ? { 
        nom: newModule.nom,
        filiere_id: parseInt(newModule.filiere_id),
        id: editingId,
        filiere: getFiliereName(parseInt(newModule.filiere)),
        elements: newModule.elements.split(',').map(el => el.trim()) 
      } : m))
      toast.success('Module modifié avec succès')
    } else {
      const newData = await addModule({
        nom: newModule.nom,
        filiere_id: parseInt(newModule.filiere),
        elements: newModule.elements.split(',').map(el => el.trim()),
        semestre: newModule.semestre
      })
      console.log(newModule);
      setModules([...modules, { 
        id: newData.id, 
        elements: newModule.elements.split(',').map(el => el.trim()),
        filiere_id: parseInt(newModule.filiere),
        filiere: getFiliereName(parseInt(newModule.filiere)),
        nom: newModule.nom
      }])
      toast.success('Module ajouté avec succès')
    }
    setNewModule({ nom: '', filiere: '', filiere_id: '', elements: '', semestre:1 })
    setIsEditing(false)
    setEditingId(null)
  }

  const handleEdit = async (module: Module) => { //something wrong here
    setNewModule({
      nom: module.nom,
      filiere: getFiliereName(module.filiere_id),
      filiere_id: module.filiere_id.toString(),
      elements: module.elements.map((el: any) => el.nom).join(', '),
      semestre: 1
    });
    console.log(newModule);
    setIsEditing(true)
    setEditingId(module.id)
  }

  const handleDelete = (id: number) => {
    deleteModule(id)
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
                {filieres.map(filiere => (
                  <SelectItem key={filiere.id} value={(filiere.id).toString()}>{filiere.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <Input
              placeholder="Éléments (séparés par des virgules)"
              name="elements"
              value={newModule.elements}
              onChange={handleInputChange}
              required
            />
            <Input
            placeholder="Semestre"
            name="semestre"
            type='number'
            min={1}
            value={newModule.semestre}
            onChange={handleInputChange}
            required
          />
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
                <TableHead>Filière</TableHead>
                <TableHead>Éléments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell className="font-medium">{module.nom}</TableCell>
                  <TableCell>{getFiliereName(module.filiere_id)}</TableCell>
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

