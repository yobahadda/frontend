'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { module: "Algèbre", average: 14.2 },
  { module: "Analyse", average: 13.8 },
  { module: "Mécanique", average: 12.5 },
  { module: "Électricité", average: 15.1 },
  { module: "Informatique", average: 16.3 },
  { module: "Chimie", average: 13.9 },
]

export function PerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="module" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Line type="monotone" dataKey="average" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}