'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from '@/app/hooks/useSession'
import { fetchDetailedStatistics } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Loader2 } from 'lucide-react'

interface DetailedStats {
  moduleAverages: { name: string; average: number }[];
  successRates: { name: string; rate: number }[];
  gradeDistribution: { grade: string; count: number }[];
  studentPerformance: { name: string; performance: number }[];
}

export default function StatsPage() {
  const { professor } = useSession()
  const [stats, setStats] = useState<DetailedStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      if (professor?.id) {
        try {
          const data = await fetchDetailedStatistics(professor.id)
          setStats(data)
        } catch (error) {
          console.error('Error loading statistics:', error)
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
      <motion.h1
        className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Statistiques Détaillées
      </motion.h1>
      <Tabs defaultValue="module-averages" className="space-y-6">
        <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger value="module-averages">Moyennes par Module</TabsTrigger>
          <TabsTrigger value="success-rates">Taux de Réussite</TabsTrigger>
          <TabsTrigger value="grade-distribution">Distribution des Notes</TabsTrigger>
          <TabsTrigger value="student-performance">Performance des Étudiants</TabsTrigger>
        </TabsList>
        <TabsContent value="module-averages">
          <StatCard title="Moyennes par Module" chart={<ModuleAveragesChart data={stats?.moduleAverages} />} />
        </TabsContent>
        <TabsContent value="success-rates">
          <StatCard title="Taux de Réussite" chart={<SuccessRatesChart data={stats?.successRates} />} />
        </TabsContent>
        <TabsContent value="grade-distribution">
          <StatCard title="Distribution des Notes" chart={<GradeDistributionChart data={stats?.gradeDistribution} />} />
        </TabsContent>
        <TabsContent value="student-performance">
          <StatCard title="Performance des Étudiants" chart={<StudentPerformanceChart data={stats?.studentPerformance} />} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ title, chart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {chart}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ModuleAveragesChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="average" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function SuccessRatesChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="rate" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}

function GradeDistributionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="grade" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function StudentPerformanceChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="performance" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  )
}

