'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    subject: "Mathématiques",
    average: 15.2,
  },
  {
    subject: "Physique",
    average: 14.8,
  },
  {
    subject: "Chimie",
    average: 13.9,
  },
  {
    subject: "Informatique",
    average: 16.5,
  },
  {
    subject: "Biologie",
    average: 14.3,
  },
  {
    subject: "Anglais",
    average: 15.7,
  },
]

export function PerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="subject" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Line type="monotone" dataKey="average" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

