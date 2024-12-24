'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ModuleElement, Module } from '@/types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { fetchAllModules, fetchAllElements, fetchAllEvaluations, fetchModuleElements, addEvaluation } from '@/services/api'

interface EvaluationMethod {
  id: number
  nom: string
  coefficient: number
  module: string
  elementDeModule: string
}

export function EvaluationMethodManagement() {
  const [evaluationMethods, setEvaluationMethods] = useState<EvaluationMethod[]>([])
  const [newMethod, setNewMethod] = useState({ nom: '', coefficient: '', module: '', elementDeModule: '' })
  const [elements, setElements] = useState<ModuleElement[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    loadData();
  }, [])

  const loadData = async () => {
    const mods = await fetchAllModules()
    const eles = await fetchAllElements()
    const evals = await fetchAllEvaluations()
    setModules(mods)
    setElements(eles)
    setEvaluationMethods(evals);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMethod({ ...newMethod, [e.target.name]: e.target.value })
  }

  const handleSelectChange = async (value: string, name:string) => {
    const newVal = name==='module' ? await loadElements(parseInt(value)) : value;
    setNewMethod({ ...newMethod, [name]: value })
  }

  const loadElements = async (id: number) => {
    const elems = await fetchModuleElements(id)
    setElements(elems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
      console.log(newMethod)
      const newData = await addEvaluation({
        nom: newMethod.nom,
        coef: parseFloat(newMethod.coefficient),
        elementId: parseInt(newMethod.elementDeModule),
      })
      setEvaluationMethods([...evaluationMethods, { 
        id: newData.id, 
        ...newMethod, 
        elementDeModule: getEleName(parseInt(newMethod.elementDeModule)),
        module: getModuleName(parseInt(newMethod.module)),
        coefficient: parseFloat(newMethod.coefficient) 
      }])
      toast.success('Modalité d\'évaluation ajoutée avec succès')
    }
    setNewMethod({ nom: '', coefficient: '', module: '', elementDeModule: '' })
    setIsEditing(false)
    setEditingId(null)
  }

  const getModuleName = (id:number) => {
    const mod =  modules.find(f => f.id === id)?.nom
    return mod ? mod : 'Inconnu'
  }

  const getEleName = (id:number) => {
    const ele =  elements.find(f => f.id === id)?.nom
    return ele ? ele : 'Inconnu'
  }

  const handleEdit = async (method: EvaluationMethod) => {
    console.log(method)
    setNewMethod({
      nom: method.nom,
      coefficient: method.coefficient.toString(),
      module: method.module,
      elementDeModule: method.elementDeModule
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select onValueChange={(value) => handleSelectChange(value, 'module')} value={newMethod.module}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un module" />
            </SelectTrigger>
            <SelectContent>
                {modules.map((mod) => (
                  <SelectItem key={mod.id} value={(mod.id).toString()}>{mod.nom}</SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => handleSelectChange(value, 'elementDeModule')} value={newMethod.elementDeModule}>
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
                <TableHead>Element</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluationMethods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell className="font-medium">{method.nom}</TableCell>
                  <TableCell>{method.coefficient}</TableCell>
                  <TableCell>{method.elementDeModule}</TableCell>
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

