'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileText, Users, BarChart2 } from 'lucide-react'
import { motion } from "framer-motion"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions Rapides</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {[
          { icon: PlusCircle, label: "Nouvelle Note" },
          { icon: FileText, label: "Rapport" },
          { icon: Users, label: "Liste Étudiants" },
          { icon: BarChart2, label: "Statistiques" },
        ].map((action, index) => (
          <motion.div
            key={action.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center space-y-2">
              <action.icon className="h-6 w-6" />
              <span>{action.label}</span>
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}

