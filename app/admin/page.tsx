'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfessorManagement } from './components/ProfessorManagement'
import { DepartmentManagement } from './components/DepartmentManagement'
import { ModuleManagement } from './components/ModuleManagement'
import { EvaluationMethodManagement } from './components/EvaluationMethodManagement'
import { ProfessorAssignment } from './components/ProfessorAssignement'
import { UserAccountManagement } from './components/UserAccountManagement'
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, BookOpen, Users, ClipboardList, UserCheck, Settings } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("professors")

  const tabContent = [
    { id: "professors", title: "Professeurs", icon: Users, component: ProfessorManagement },
    { id: "departments", title: "Filières", icon: GraduationCap, component: DepartmentManagement },
    { id: "modules", title: "Modules", icon: BookOpen, component: ModuleManagement },
    { id: "evaluation", title: "Évaluation", icon: ClipboardList, component: EvaluationMethodManagement },
    { id: "assignment", title: "Affectation", icon: UserCheck, component: ProfessorAssignment },
    { id: "accounts", title: "Comptes", icon: Settings, component: UserAccountManagement },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Tableau de Bord Administrateur
        </h1>
      </motion.div>
      <Card className="w-full max-w-6xl mx-auto bg-white/80 backdrop-blur-lg shadow-xl rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-4 bg-gray-100 p-2 rounded-lg">
              {tabContent.map(({ id, title, icon: Icon }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="flex flex-col items-center justify-center space-y-2 p-3 rounded-md transition-all duration-200 ease-in-out data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <AnimatePresence mode="wait">
              {tabContent.map(({ id, component: Component }) => (
                <TabsContent key={id} value={id}>
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Component />
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

