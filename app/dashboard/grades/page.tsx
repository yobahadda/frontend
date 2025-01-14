'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/app/hooks/useSession'
import { fetchElementsByProfessor, fetchStudentsByElement, fetchEvaluationMethods, fetchGrades } from '@/services/api'
import { ModuleElement, Student, Grade, EvaluationMethod } from '@/types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from "framer-motion"
import { Save, RefreshCw, AlertCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function GradesPage() {
  const { professor } = useSession()
  const [elements, setElements] = useState<ModuleElement[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Record<number, Record<number, Grade>>>({})
  const [selectedElement, setSelectedElement] = useState<string>('')
  const [selectedModality, setSelectedModality] = useState<string>('')
  const [evaluationMethods, setEvaluationMethods] = useState<EvaluationMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [gradesExist, setGradesExist] = useState(false); // Added state to track existing grades

  useEffect(() => {
    if (professor?.id) {
      loadElements()
    }
  }, [professor])

  const loadElements = async () => {
    try {
      const data = await fetchElementsByProfessor(professor!.id)
      setElements(data)
    } catch (error) {
      console.error('Error loading elements:', error)
      toast.error('Erreur lors du chargement des éléments')
    } finally {
      setLoading(false)
    }
  }

  const handleElementChange = async (elementId: string) => {
    setSelectedElement(elementId);
    setSelectedModality('');
    setLoading(true);
    try {
      const [studentsData, methodsData, gradesData] = await Promise.all([
        fetchStudentsByElement(parseInt(elementId)),
        fetchEvaluationMethods(parseInt(elementId)),
        fetchGrades(parseInt(elementId)).catch(error => {
          console.error('Error fetching grades:', error);
          return []; // Return an empty array if grades fetch fails
        })
      ]);
      setStudents(studentsData);
      setEvaluationMethods(methodsData);
      setGradesExist(gradesData.length > 0); // Update gradesExist state

      // Initialize grades with existing data or default values
      const initialGrades = studentsData.reduce((acc, student) => {
        acc[student.id] = methodsData.reduce((gradeAcc, method) => {
          const existingGrade = gradesData.find(g => g.etudiant.id === student.id && g.modaliteEvaluation.id === method.id);
          gradeAcc[method.id] = existingGrade ? {
            ...existingGrade,
            valide: existingGrade.note >= 10,
            rattrapagePossible: existingGrade.note > 0 && existingGrade.note < 10
          } : {
            note: 0,
            absent: false,
            valide: false,
            rattrapagePossible: false,
            element_id: parseInt(elementId),
            etudiant_id: student.id,
            modaliteEvaluation: { id: method.id }
          };
          return gradeAcc;
        }, {} as Record<number, Grade>);
        return acc;
      }, {} as Record<number, Record<number, Grade>>);
      setGrades(initialGrades);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleModalityChange = (modalityId: string) => {
    setSelectedModality(modalityId);
  };

  const handleGradeChange = (studentId: number, field: keyof Grade, value: any) => {
    if (!selectedModality) return;

    const modalityId = parseInt(selectedModality);
    setGrades(prev => {
      const updatedGrade = { ...prev[studentId][modalityId], [field]: value }

      if (field === 'note') {
        const noteValue = Math.min(20, Math.max(0, parseFloat(value) || 0))
        updatedGrade.note = noteValue
        updatedGrade.valide = noteValue >= 10
        updatedGrade.rattrapage_possible = noteValue < 10 && noteValue > 0
      }

      if (field === 'absent') {
        if (value) {
          updatedGrade.note = 0
          updatedGrade.valide = false
          updatedGrade.rattrapage_possible = false
        }
      }

      return { 
        ...prev, 
        [studentId]: {
          ...prev[studentId],
          [modalityId]: updatedGrade
        }
      }
    })
  }

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const gradesToSubmit = Object.values(grades)
        .flatMap(studentGrades => Object.values(studentGrades))
        .filter(grade => grade.note !== 0 || grade.absent) // Only submit non-zero grades or absent marks
        .map(grade => ({
          etudiant: { id: grade.etudiant_id },
          modaliteEvaluation: { id: grade.modaliteEvaluation.id },
          note: grade.note,
          absent: grade.absent
        }));
        console.log('Grades to submit:', gradesToSubmit);
        console.log('Selected modality:', selectedModality);


      const response = await fetch(`http://127.0.0.1:8080/notes/bulk/${selectedModality}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradesToSubmit),
      });

      if (!response.ok) {
        throw new Error('Failed to submit grades');
      }

      toast.success('Notes enregistrées avec succès');
      // Refresh grades after successful submission
      handleElementChange(selectedElement);
    } catch (error) {
      console.error('Error submitting grades:', error);
      toast.error('Erreur lors de l\'enregistrement des notes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-2xl font-semibold text-gray-600 dark:text-gray-300"
        >
          Chargement...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-6xl mx-auto overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="text-3xl font-bold">Saisie des Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6 space-y-4">
              <Select onValueChange={handleElementChange} value={selectedElement}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un élément de module" />
                </SelectTrigger>
                <SelectContent>
                  {elements.map(element => (
                    <SelectItem key={element.id} value={element.id.toString()}>
                      {element.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedElement && (
                <Select onValueChange={handleModalityChange} value={selectedModality}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une modalité d'évaluation" />
                  </SelectTrigger>
                  <SelectContent>
                    {evaluationMethods.map(method => (
                      <SelectItem key={method.id} value={method.id.toString()}>
                        {method.nom} (Coef. {method.coefficient})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <AnimatePresence>
              {selectedElement && selectedModality && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100 dark:bg-gray-800">
                          <TableHead className="w-1/6 font-semibold">Photo</TableHead>
                          <TableHead className="w-1/5 font-semibold">Étudiant</TableHead>
                          <TableHead className="w-1/6 font-semibold">Note (/20)</TableHead>
                          <TableHead className="w-1/6 font-semibold">Absent</TableHead>
                          <TableHead className="w-1/6 font-semibold">Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map(student => (
                          <TableRow key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <TableCell>
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={student.imageUrl} alt={`${student.prenom} ${student.nom}`} />
                                <AvatarFallback>{student.prenom[0]}{student.nom[0]}</AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{student.nom} {student.prenom}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={grades[student.id]?.[parseInt(selectedModality)]?.note || ''}
                                onChange={(e) => handleGradeChange(student.id, 'note', e.target.value)}
                                className="w-24 text-center"
                                disabled={grades[student.id]?.[parseInt(selectedModality)]?.absent || gradesExist}
                              />
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <Checkbox
                                        checked={grades[student.id]?.[parseInt(selectedModality)]?.absent || false}
                                        onCheckedChange={(checked) => handleGradeChange(student.id, 'absent', checked)}
                                        disabled={gradesExist}
                                      />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Marquer comme absent</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              {grades[student.id]?.[parseInt(selectedModality)]?.valide ? (
                                <Badge variant="default">Validé</Badge>
                              ) : grades[student.id]?.[parseInt(selectedModality)]?.rattrapage_possible ? (
                                <Badge variant="secondary">Rattrapage</Badge>
                              ) : (
                                <Badge variant="destructive">Non validé</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button 
                      onClick={handleSubmit} 
                      disabled={saving}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      {saving ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Enregistrer les notes
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

