'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/app/hooks/useSession'
import { 
  fetchModuleElementsByProfessor, 
  fetchAssignedStudents, 
  submitGrades, 
  validateElementGrades,
  exportElementGrades,
  fetchElementStatus
} from '@/services/api'
import { ModuleElement, Student, Grade } from '@/types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'react-hot-toast'
import { motion } from "framer-motion"
import { Save, Check, FileText, AlertTriangle } from 'lucide-react'

export default function GradesPage() {
  const { professor } = useSession()
  const [elements, setElements] = useState<ModuleElement[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Record<number, Grade>>({})
  const [selectedElement, setSelectedElement] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [isValidated, setIsValidated] = useState(false)
  const [saving, setSaving] = useState(false)
  const [validating, setValidating] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (professor?.id) {
      loadElements(professor.id)
    }
  }, [professor])

  const loadElements = async (id:number) => {
    try {
      const data = await fetchModuleElementsByProfessor(id)
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
    setLoading(true)
    try {
      const [studentsData, statusData] = await Promise.all([
        fetchAssignedStudents(professor!.id, parseInt(elementId)),
        fetchElementStatus(parseInt(elementId))
      ])
      setStudents(studentsData)
      setIsValidated(statusData.isValidated)
      const initialGrades = studentsData.reduce((acc, student) => {
        acc[student.id] = { 
          etudiant_id: student.id, 
          element_id: parseInt(elementId),
          note: student.notes.find(n => n.element_id === parseInt(elementId))?.note || 0,
          absent: false,
          valide: false
        }
        return acc
      }, {})
      setGrades(initialGrades)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const handleGradeChange = (studentId: number, value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue < 0 || numValue > 20) return

    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note: numValue,
      }
    }))
  }

  const handleAbsenceToggle = (studentId: number) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        absent: !prev[studentId]?.absent,
      }
    }))
  }

  const handleSubmit = async () => {
    try {
      setSaving(true)
      const gradesToSubmit = Object.values(grades)
      await submitGrades(gradesToSubmit)
      toast.success('Notes enregistrées avec succès')
    } catch (error) {
      console.error('Error submitting grades:', error)
      toast.error('Erreur lors de l\'enregistrement des notes')
    } finally {
      setSaving(false)
    }
  }

  const handleValidate = async () => {
    try {
      setValidating(true)
      await validateElementGrades(parseInt(selectedElement))
      setIsValidated(true)
      toast.success('Élément validé avec succès')
    } catch (error) {
      console.error('Error validating element:', error)
      toast.error('Erreur lors de la validation de l\'élément')
    } finally {
      setValidating(false)
    }
  }

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      setExporting(true)
      const blob = await exportElementGrades(parseInt(selectedElement), format)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `notes_element_${selectedElement}.${format === 'excel' ? 'xlsx' : 'pdf'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success(`Notes exportées en ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Error exporting grades:', error)
      toast.error('Erreur lors de l\'exportation des notes')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-indigo-800">Saisie des Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
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
                      <TableHead className="w-1/3">Étudiant</TableHead>
                      <TableHead className="w-1/3">Note (/20)</TableHead>
                      <TableHead className="w-1/3">Absent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.nom} {student.prenom}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            value={grades[student.id]?.note || ''}
                            onChange={(e) => handleGradeChange(student.id, e.target.value)}
                            disabled={isValidated || grades[student.id]?.absent}
                            className="w-24 text-center"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={grades[student.id]?.absent || false}
                            onChange={() => handleAbsenceToggle(student.id)}
                            disabled={isValidated}
                            className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-6 flex justify-between items-center">
                  <div className="space-x-2">
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isValidated || saving}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      {saving ? 'Enregistrement...' : 'Enregistrer les notes'}
                      <Save className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={handleValidate} 
                      disabled={isValidated || validating}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {validating ? 'Validation...' : 'Valider l\'élément'}
                      <Check className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-x-2">
                    <Button 
                      onClick={() => handleExport('excel')} 
                      disabled={!isValidated || exporting}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      {exporting ? 'Exportation...' : 'Exporter en Excel'}
                      <FileText className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={() => handleExport('pdf')} 
                      disabled={!isValidated || exporting}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      {exporting ? 'Exportation...' : 'Exporter en PDF'}
                      <FileText className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {isValidated && (
                  <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">
                          Cet élément a été validé. Les notes ne sont plus modifiables.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

