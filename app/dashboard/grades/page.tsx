'use client'

import { useState, useEffect} from 'react'
import { useSession } from '@/app/hooks/useSession'
import { fetchModuleElementsByProfessor, fetchStudentsByElement, fetchEvaluationsByElement, fetchGradesByElement, fetchGradesByElementAndEvaluation, submitGrades } from '@/services/api'
import { ModuleElement, Student, Grade, EvaluationMethod } from '@/types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'react-hot-toast'
import { motion } from "framer-motion"
import { Save, RefreshCw } from 'lucide-react'
import { parse } from 'path'
import { init } from 'next/dist/compiled/webpack/webpack'

export default function GradesPage() {
  const { professor } = useSession()
  const [elements, setElements] = useState<ModuleElement[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Record<number, Grade>>({})
  const [selectedElement, setSelectedElement] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedEvaluation, setSelectedEvaluation] = useState<string>('')
  const [modalitesEvaluation, setModalitesEvaluation] = useState<EvaluationMethod[]>([])

  useEffect(() => {
    if (professor?.id) {
      loadElements()
    }
  }, [professor])

  const loadElements = async () => {
    try {
      const data = await fetchModuleElementsByProfessor(professor!.id)
      setElements(data)
    } catch (error) {
      console.error('Error loading elements:', error)
      toast.error('Erreur lors du chargement des éléments')
    } finally {
      setLoading(false)
    }
  }

  const handleElementChange = async (elementId: string) => {
    setSelectedElement(elementId)
    const methods = await fetchEvaluationsByElement(parseInt(elementId))
    const retrGrades = await fetchGradesByElement(parseInt(elementId)) // do it later
    const studentsData = await fetchStudentsByElement(parseInt(elementId))
    setStudents(studentsData)
    setModalitesEvaluation(methods)
    setLoading(true)
    try {
      const initialGrades = studentsData.reduce((acc:any, student:Student) => {
        acc[student.id] = {
          id: student.id, //student id in etudiants table; must be grade id
          note: 0,
          valide: false,
          etudiant: student,
          absent: false,
          element_id: parseInt(elementId),
          modalite_id: 0
        }
        return acc
      }, {} as Record<number, Grade>)
      setGrades(initialGrades)
    } catch (error) {
      console.error('Error loading students:', error)
      toast.error('Erreur lors du chargement des étudiants')
    } finally {
      setLoading(false)
    }
  }

  const handleGradeChange = (studentId: number, field: keyof Grade, value: any) => {
    setGrades(prev => {
      const updatedGrade = { ...prev[studentId], [field]: value }

      if (field === 'note') {
        const noteValue = Math.min(20, Math.max(0, parseFloat(value) || 0))
        updatedGrade.note = noteValue
        updatedGrade.valide = noteValue >= 10
      }

      if (field === 'absent') {
        if (value) {
          updatedGrade.note = 0
          updatedGrade.valide = false
        }
      }

      return { ...prev, [studentId]: updatedGrade }
    })
  }

  const handleEvaluationChange = async (evaluationId: string) => {
    try {
      setLoading(true);
      setSelectedEvaluation(evaluationId);
      
      const elementId = parseInt(selectedElement);
      const modaliteId = parseInt(evaluationId);
      
      const retrGrades = await fetchGradesByElementAndEvaluation(
        elementId,
        modaliteId
      );
      
      if (retrGrades.length !== 0) {
        const formattedGrades = retrGrades.reduce((acc: Record<number, Grade>, grade: Grade) => {
          acc[grade.id] = {
            id: grade.id,
            note: grade.note,
            valide: grade.valide,
            etudiant: grade.etudiant,
            absent: grade.absent,
            element_id: grade.element_id,
            modalite_id: grade.modalite_id
          };
          return acc;
        }, {});
        
        setGrades(formattedGrades);
      } else {
        const updatedGrades: Record<number, Grade> = {};
        Object.entries(grades).forEach(([id, grade]) => {
          updatedGrades[parseInt(id)] = {
            ...grade,
            element_id: elementId,
            modalite_id: modaliteId
          };
        });
        setGrades(updatedGrades)
      }
    } catch (error) {
      console.error('Error loading grades:', error);
      toast.error('Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true)
      await submitGrades(Object.values(grades))
      toast.success('Notes enregistrées avec succès')
    } catch (error) {
      console.error('Error submitting grades:', error)
      toast.error('Erreur lors de l\'enregistrement des notes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>
  }


  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-indigo-800">Saisie des Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <Select onValueChange={handleElementChange} value={selectedElement}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un élément de module" />
                </SelectTrigger>
                <SelectContent>
                  {elements.map(element => (
                    <SelectItem key={element.id} value={element.id.toString()}>
                      {element.nom} {element.filiere_nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedElement && (
                <Select onValueChange={handleEvaluationChange} value={selectedEvaluation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une évaluation" />
                </SelectTrigger>
                <SelectContent>
                    {modalitesEvaluation.map((mod:EvaluationMethod) => (
                      <SelectItem key={mod.id} value={mod.id.toString()}>
                        {mod.nom} {mod.coefficient}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              )}
            </div>

            {selectedElement && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/6">Photo</TableHead>
                      <TableHead className="w-1/4">Étudiant</TableHead>
                      <TableHead className="w-1/6">Note (/20)</TableHead>
                      <TableHead className="w-1/6">Absent</TableHead>
                      <TableHead className="w-1/6">Valide</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(grades).map(([id,content]) => (
                      <TableRow key={id}>
                        <TableCell>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={content.etudiant.imageUrl || ''} alt={`${content.etudiant.prenom} ${content.etudiant.nom}`} />
                            <AvatarFallback>{content.etudiant.prenom[0]}{content.etudiant.nom[0]}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{content.etudiant.nom} {content.etudiant.prenom}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            value={content.note || ''}
                            onChange={(e) => handleGradeChange(parseInt(id), 'note', e.target.value)}
                            className="w-24 text-center"
                            disabled={content.absent}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={content.absent || false}
                            onCheckedChange={(checked) => handleGradeChange(parseInt(id), 'absent', checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={content.valide || false}
                            onCheckedChange={(checked) => handleGradeChange(parseInt(id), 'valide', checked)}
                            disabled
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

  