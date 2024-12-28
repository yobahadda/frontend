'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { fetchFilieres, addFiliere } from '@/services/api'
import { Filiere, Module, Element } from '@/types'
import React from 'react'

export function FiliereManagement() {
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [newFiliere, setNewFiliere] = useState({ nom: '', description: '' })
  const [expandedFiliere, setExpandedFiliere] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFilieres()
  }, [])

  const loadFilieres = async () => {
    try {
      setLoading(true)
      const data = await fetchFilieres()
      setFilieres(data)
    } catch (error) {
      console.error('Error loading filieres:', error)
      toast.error('Erreur lors du chargement des filières')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFiliere({ ...newFiliere, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const addedFiliere = await addFiliere(newFiliere)
      setFilieres([...filieres, addedFiliere])
      setNewFiliere({ nom: '', description: '' })
      toast.success('Filière ajoutée avec succès')
    } catch (error) {
      console.error('Error adding filiere:', error)
      toast.error('Erreur lors de l\'ajout de la filière')
    }
  }

  const toggleExpand = (filiereId: number) => {
    setExpandedFiliere(expandedFiliere === filiereId ? null : filiereId)
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
              value={newFiliere.nom}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Description"
              name="description"
              value={newFiliere.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Ajouter une Filière
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </motion.form>

        {loading ? (
          <div className="text-center py-4">Chargement des filières...</div>
        ) : (
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
                {filieres.map((filiere) => (
                  <React.Fragment key={filiere.id}>
                    <TableRow>
                      <TableCell className="font-medium">{filiere.nom}</TableCell>
                      <TableCell>{filiere.description}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => toggleExpand(filiere.id)}>
                            {expandedFiliere === filiere.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedFiliere === filiere.id && (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <div className="pl-4">
                            <h4 className="font-semibold mb-2">Modules:</h4>
                            {filiere.modules && filiere.modules.length > 0 ? (
                              <ul className="list-disc pl-5">
                                {filiere.modules.map((module: Module) => (
                                  <li key={module.id}>
                                    {module.nom} (Semestre: {module.semestre}, Année: {module.anneeUniversitaire})
                                    {module.elements && module.elements.length > 0 && (
                                      <ul className="list-circle pl-5">
                                        {module.elements.map((element: Element) => (
                                          <li key={element.id}>
                                            {element.nom} (Coefficient: {element.coefficient})
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>Aucun module pour cette filière.</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

