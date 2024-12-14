'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = {
  "2023": [
    { month: "Jan", average: 14.2 },
    { month: "Feb", average: 15.1 },
    { month: "Mar", average: 14.8 },
    { month: "Apr", average: 15.5 },
    { month: "May", average: 16.2 },
    { month: "Jun", average: 15.9 },
  ],
  "2022": [
    { month: "Jan", average: 13.8 },
    { month: "Feb", average: 14.5 },
    { month: "Mar", average: 14.2 },
    { month: "Apr", average: 15.0 },
    { month: "May", average: 15.7 },
    { month: "Jun", average: 15.3 },
  ],
}

export function PerformanceChart() {
  const [selectedYear, setSelectedYear] = useState("2023")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Performance par Mois</CardTitle>
        <Select
          value={selectedYear}
          onValueChange={setSelectedYear}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une année" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data[selectedYear]}>
              <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Tooltip />
              <Line type="monotone" dataKey="average" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

