'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/app/hooks/useSession'
import { fetchModules, filterModulesByProfessor } from '@/services/api'
import { Module } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"
import Link from 'next/link'
import { ChevronRight, ExternalLink } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const generateLearningResources = (subject: string) => {
  const baseResources = [
    { name: `Coursera - ${subject} Specialization`, url: `https://www.coursera.org/search?query=${encodeURIComponent(subject)}` },
    { name: `edX - ${subject} Courses`, url: `https://www.edx.org/search?q=${encodeURIComponent(subject)}` },
    { name: `MIT OpenCourseWare - ${subject}`, url: `https://ocw.mit.edu/search/?q=${encodeURIComponent(subject)}` },
    { name: `Khan Academy - ${subject}`, url: `https://www.khanacademy.org/search?referer=%2F&page_search_query=${encodeURIComponent(subject)}` },
  ];

  // Add more specific resources based on the subject
  if (subject.toLowerCase().includes('programming') || subject.toLowerCase().includes('computer science')) {
    baseResources.push({ name: "freeCodeCamp", url: "https://www.freecodecamp.org/learn" });
  }
  if (subject.toLowerCase().includes('math') || subject.toLowerCase().includes('statistics')) {
    baseResources.push({ name: "Brilliant - Math Courses", url: "https://brilliant.org/courses/#math-foundational" });
  }
  if (subject.toLowerCase().includes('science')) {
    baseResources.push({ name: "OpenStax - Free Textbooks", url: "https://openstax.org/subjects" });
  }

  return baseResources;
};

export default function ModulesPage() {
  const { professor } = useSession()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (professor?.id) {
      loadModules()
    }
  }, [professor])

  const loadModules = async () => {
    try {
      console.log('Fetching modules...');
      const allModules = await fetchModules()
      console.log('All modules:', allModules);
      const filteredModules = filterModulesByProfessor(allModules, professor!.id)
      console.log('Filtered modules:', filteredModules);
      setModules(filteredModules)
    } catch (error) {
      console.error('Error loading modules:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (modules.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Mes Modules</h1>
        <Card>
          <CardContent>
            <p className="text-center py-4">Aucun module trouvé pour ce professeur.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes Modules</h1>
      <div className="grid grid-cols-1 gap-6">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{module.nom}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Semestre {module.semestre} | Année Universitaire: {module.anneeUniversitaire}
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élément</TableHead>
                      <TableHead>Coefficient</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {module.elements.map((element) => (
                      <TableRow key={element.id}>
                        <TableCell>{element.nom}</TableCell>
                        <TableCell>{element.coefficient}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={element.responsable.imageUrl} alt={`${element.responsable.prenom} ${element.responsable.nom}`} />
                              <AvatarFallback>{element.responsable.prenom[0]}{element.responsable.nom[0]}</AvatarFallback>
                            </Avatar>
                            <span>{element.responsable.prenom} {element.responsable.nom}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link href={`/dashboard/elements/${element.id}`}>
                            <Button variant="outline" size="sm">
                              Détails
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Ressources d'apprentissage suggérées:</h3>
                  <ul className="list-disc pl-5">
                    {generateLearningResources(module.nom).map((resource, index) => (
                      <li key={`module-${index}`} className="mb-1">
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                          {resource.name}
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      </li>
                    ))}
                    {module.elements.map((element) => 
                      generateLearningResources(element.nom).map((resource, index) => (
                        <li key={`${element.id}-${index}`} className="mb-1">
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                            {resource.name} ({element.nom})
                            <ExternalLink className="ml-1 h-4 w-4" />
                          </a>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

