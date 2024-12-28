'use client'

import { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "./components/Overview"
import { RecentActivity } from "./components/RecentActivity"
import { PerformanceChart } from "./components/PerformanceChart"
import { ModuleCompletionChart } from "./components/ModuleCompletionChart"
import { UpcomingEvents } from "./components/UpcomingEvents"
import { QuickActions } from "./components/QuickActions"
import { useSession } from '../hooks/useSession'
import { fetchDashboardStats } from '@/services/api'
import { Loader2, Users, BookOpen, GraduationCap, BarChart2 } from 'lucide-react'

interface DashboardStats {
  totalStudents: number;
  totalModules: number;
  averageGrade: number;
  validationRate: number;
}

export default function DashboardPage() {
  const { professor } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      if (professor?.id) {
        try {
          const data = await fetchDashboardStats(professor.id)
          setStats(data)
        } catch (error) {
          console.error('Error fetching dashboard stats:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    loadStats()
  }, [professor])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Bienvenue, {professor?.prenom} {professor?.nom}
        </h1>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Étudiants"
          value={stats?.totalStudents}
          icon={Users}
          colorClass="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Modules"
          value={stats?.totalModules}
          icon={BookOpen}
          colorClass="from-green-500 to-green-600"
        />
        <StatCard
          title="Moyenne Générale"
          value={stats?.averageGrade.toFixed(2)}
          icon={GraduationCap}
          colorClass="from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Taux de Validation"
          value={`${((stats?.validationRate ?? 0) * 100).toFixed(1)}%`}
          icon={BarChart2}
          colorClass="from-purple-500 to-purple-600"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PerformanceChart />
          </motion.div>
        </div>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <QuickActions />
          </motion.div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ModuleCompletionChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <UpcomingEvents />
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Aperçu des Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Overview />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, colorClass }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`bg-gradient-to-br ${colorClass} text-white`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

