'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileText, Users, BarChart2 } from 'lucide-react'

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions Rapides</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="flex flex-col items-center justify-center h-24">
          <PlusCircle className="h-6 w-6 mb-2" />
          Nouvelle Note
        </Button>
        <Button variant="outline" className="flex flex-col items-center justify-center h-24">
          <FileText className="h-6 w-6 mb-2" />
          Rapport
        </Button>
        <Button variant="outline" className="flex flex-col items-center justify-center h-24">
          <Users className="h-6 w-6 mb-2" />
          Liste Étudiants
        </Button>
        <Button variant="outline" className="flex flex-col items-center justify-center h-24">
          <BarChart2 className="h-6 w-6 mb-2" />
          Statistiques
        </Button>
      </CardContent>
    </Card>
  )
}

