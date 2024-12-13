'use client'

import { useState } from 'react'
import { useSession } from '@/app/hooks/useSession'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from 'react-hot-toast'

export default function SettingsPage() {
  const { professor } = useSession()
  const [notifications, setNotifications] = useState(true)
  const [email, setEmail] = useState(professor?.login || '')

  const handleSave = () => {
    toast.success('Paramètres enregistrés')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      <div className="max-w-2xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleSave}>Enregistrer</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Activer les notifications</Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <Button onClick={handleSave}>Enregistrer</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

