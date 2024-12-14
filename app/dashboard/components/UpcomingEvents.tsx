'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"

const events = [
  { date: new Date(2023, 5, 15), title: "Examen de Mathématiques" },
  { date: new Date(2023, 5, 18), title: "Remise des notes de Physique" },
  { date: new Date(2023, 5, 22), title: "Conseil de classe" },
  { date: new Date(2023, 5, 25), title: "Début des vacances d'été" },
]

export function UpcomingEvents() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const getDayEvents = (day: Date) => {
    return events.filter(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendrier des Événements</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          components={{
            DayContent: (props) => {
              const dayEvents = getDayEvents(props.date)
              return (
                <div className="relative">
                  {props.day}
                  {dayEvents.length > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 h-3 w-3 p-0"
                    />
                  )}
                </div>
              )
            },
          }}
        />
        <div className="mt-4">
          <h3 className="font-semibold">Événements du jour sélectionné:</h3>
          {date && getDayEvents(date).map((event, index) => (
            <p key={index} className="text-sm text-muted-foreground">{event.title}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

