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
import { fetchModules, fetchFilieres, createModule } from '@/services/api'
import { Module, Filiere } from '@/types'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const moduleSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  semestre: z.number().min(1).max(6),
  anneeUniversitaire: z.string().regex(/^\d{4}-\d{4}$/, "Format attendu: YYYY-YYYY"),
  filiereId: z.string().min(1, "Veuillez sélectionner une filière"),
})

type ModuleFormValues = z.infer<typeof moduleSchema>

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

  useEffect(() => {
    console.log('Modules state:', modules)
  }, [modules])

  const loadModulesAndFilieres = async () => {
    setIsLoading(true)
    try {
      const [modulesData, filieresData] = await Promise.all([
        fetchModules(),
        fetchFilieres()
      ])
      setModules(modulesData || [])
      setFilieres(filieresData || [])
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Erreur lors du chargement des données')
      setModules([])
      setFilieres([])
    } finally {
      setIsLoading(false)
    }
  }

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      nom: "",
      semestre: 1,
      anneeUniversitaire: "",
      filiereId: "",
    },
  })

  const onSubmit = async (data: ModuleFormValues) => {
    try {
      setIsLoading(true)
      const newModule = await createModule(data)
      setModules([...modules, newModule])
      toast.success('Module ajouté avec succès')
      form.reset()
    } catch (error) {
      console.error('Error adding module:', error)
      toast.error('Erreur lors de l\'ajout du module')
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


  const handleEdit = (module: Module) => {
    setNewModule({
      nom: module.nom,
      semestre: module.semestre.toString(),
      anneeUniversitaire: module.anneeUniversitaire,
      filiereId: module.filiere.id.toString()
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-6">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du module</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom du module" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="semestre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semestre</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={1} max={6} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="anneeUniversitaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Année universitaire</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="YYYY-YYYY" />
                  </FormControl>
                  <FormDescription>Format: YYYY-YYYY (ex: 2023-2024)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="filiereId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filière</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une filière" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filieres.map((filiere) => (
                        <SelectItem key={filiere.id} value={filiere.id.toString()}>{filiere.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  Ajouter un Module
                  <Plus className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
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
              {modules && modules.length > 0 ? (
                modules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell className="font-medium">{module.nom}</TableCell>
                    <TableCell>{module.semestre}</TableCell>
                    <TableCell>{module.anneeUniversitaire}</TableCell>
                    <TableCell>{module.filiere?.nom || 'N/A'}</TableCell>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Aucun module trouvé</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

