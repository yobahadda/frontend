'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, BookOpen, Users, ClipboardList, UserCheck, Settings, BarChart2, Briefcase, Menu, FileText } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import Stats from '@/app/components/Stats'

const Overview = dynamic(() => import('../components/Overview').then(mod => mod.Overview), { ssr: false })
const ProfessorManagement = dynamic(() => import('../components/ProfessorManagement').then(mod => mod.ProfessorManagement), { ssr: false })
const FiliereManagement = dynamic(() => import('../components/FiliereManagement').then(mod => mod.FiliereManagement), { ssr: false })
const DepartmentManagement = dynamic(() => import('../components/DepartmentManagement').then(mod => mod.DepartmentManagement), { ssr: false })
const ModuleManagement = dynamic(() => import('../components/ModuleManagement').then(mod => mod.ModuleManagement), { ssr: false })
const EvaluationMethodManagement = dynamic(() => import('../components/EvaluationMethodManagement').then(mod => mod.EvaluationMethodManagement), { ssr: false })
const ProfessorAssignment = dynamic(() => import('../components/ProfessorAssignement').then(mod => mod.ProfessorAssignment), { ssr: false })
const StudentList = dynamic(() => import('../components/StudentList').then(mod => mod.StudentList), { ssr: false })
const UserAccountManagement = dynamic(() => import('../components/UserAccountManagement').then(mod => mod.UserAccountManagement), { ssr: false })
const AdminGradesPage = dynamic(() => import('./grades/page').then(mod => mod.default), { ssr: false })

const tabContent = [
  { id: "overview", title: "Vue d'ensemble", icon: BarChart2, component: Overview },
  { id: "professors", title: "Professeurs", icon: Users, component: ProfessorManagement },
  { id: "filieres", title: "Filières", icon: Briefcase, component: FiliereManagement },
  { id: "departments", title: "Départements", icon: GraduationCap, component: DepartmentManagement },
  { id: "modules", title: "Modules", icon: BookOpen, component: ModuleManagement },
  { id: "evaluation", title: "Évaluation", icon: ClipboardList, component: EvaluationMethodManagement },
  { id: "assignment", title: "Affectation", icon: UserCheck, component: ProfessorAssignment },
  { id: "students", title: "Étudiants", icon: Users, component: StudentList },
  { id: "accounts", title: "Comptes", icon: Settings, component: UserAccountManagement },
  { id: "grades", title: "Notes", icon: FileText, component: AdminGradesPage },
  { id: "stats", title: "Statistiques", icon: BarChart2, component: Stats },
]

const ClientSideContent = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <motion.div
        className={`bg-white dark:bg-gray-800 h-full overflow-y-auto transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 80 }}
      >
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-4"
          >
            <Menu className="h-6 w-6" />
          </Button>
          {tabContent.map(({ id, title, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? "default" : "ghost"}
              className={`w-full justify-start mb-2 ${sidebarOpen ? 'px-4' : 'px-0 justify-center'}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>{title}</span>}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
            Tableau de Bord Administrateur
          </h1>
          <Card className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {tabContent.map(({ id, component: Component }) => (
                  id === activeTab && (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Component />
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return <ClientSideContent />
}

