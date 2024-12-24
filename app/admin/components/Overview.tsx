'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell, LineChart, Line } from "recharts"
import { Users, GraduationCap, BookOpen, FileCheck, RefreshCcw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function Overview() {
  const [studentData, setStudentData] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const [gradeData, setGradeData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    
    const studentsResponse = await fetch('/api/students/stats')
    const departmentsResponse = await fetch('/api/departments/stats')
    const gradesResponse = await fetch('/api/grades/stats')

    const students = await studentsResponse.json()
    const departments = await departmentsResponse.json()
    const grades = await gradesResponse.json()

    setStudentData(students)
    setDepartmentData(departments)
    setGradeData(grades)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Vue d'ensemble</h2>
        <Button onClick={fetchData} disabled={isLoading}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Étudiants" value="1,234" icon={Users} change="+20.1%" />
        <StatCard title="Filières" value="15" icon={GraduationCap} change="+2" />
        <StatCard title="Modules" value="89" icon={BookOpen} change="+12" />
        <StatCard title="Évaluations" value="573" icon={FileCheck} change="+86" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Évolution du nombre d'étudiants</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studentData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Répartition par filière</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Distribution des notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeData}>
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, change }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {change.startsWith('+') ? (
            <span className="text-green-600">{change}</span>
          ) : (
            <span className="text-red-600">{change}</span>
          )}
          {' '}par rapport au mois dernier
        </p>
      </CardContent>
    </Card>
  )
}
