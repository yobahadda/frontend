'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 12.4,
  },
  {
    name: "Feb",
    total: 13.2,
  },
  {
    name: "Mar",
    total: 14.5,
  },
  {
    name: "Apr",
    total: 13.8,
  },
  {
    name: "May",
    total: 15.1,
  },
  {
    name: "Jun",
    total: 14.7,
  },
  {
    name: "Jul",
    total: 15.3,
  },
  {
    name: "Aug",
    total: 14.9,
  },
  {
    name: "Sep",
    total: 15.7,
  },
  {
    name: "Oct",
    total: 15.2,
  },
  {
    name: "Nov",
    total: 14.8,
  },
  {
    name: "Dec",
    total: 15.5,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

