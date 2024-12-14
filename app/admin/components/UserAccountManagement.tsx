'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface UserAccount {
  id: number
  username: string
  email: string
  role: string
}

export function UserAccountManagement() {
  const [accounts, setAccounts] = useState<UserAccount[]>([])
  const [newAccount, setNewAccount] = useState({ username: '', email: '', role: '', password: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    // Fetch user accounts from API
    setAccounts([
      { id: 1, username: 'admin', email: 'admin@example.com', role: 'Administrateur' },
      { id: 2, username: 'prof1', email: 'prof1@example.com', role: 'Professeur' },
    ])
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAccount({ ...newAccount, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setNewAccount({ ...newAccount, role: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && editingId) {
      // Update existing account
      setAccounts(accounts.map(a => a.id === editingId ? { ...newAccount, id: editingId } : a))
      toast.success('Compte utilisateur modifié avec succès')
    } else {
      // Add new account
      setAccounts([...accounts, { id: Date.now(), ...newAccount }])
      toast.success('Compte utilisateur créé avec succès')
    }
    setNewAccount({ username: '', email: '', role: '', password: '' })
    setIsEditing(false)
    setEditingId(null)
  }

  const handleEdit = (account: UserAccount) => {
    setNewAccount({ ...account, password: '' })
    setIsEditing(true)
    setEditingId(account.id)
  }

  const handleDelete = (id: number) => {
    setAccounts(accounts.filter(a => a.id !== id))
    toast.success('Compte utilisateur supprimé avec succès')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Gestion des Comptes Utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Nom d'utilisateur"
              name="username"
              value={newAccount.username}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={newAccount.email}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Mot de passe"
              name="password"
              type="password"
              value={newAccount.password}
              onChange={handleInputChange}
              required={!isEditing}
            />
            <Select onValueChange={handleSelectChange} value={newAccount.role}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administrateur">Administrateur</SelectItem>
                <SelectItem value="Professeur">Professeur</SelectItem>
                <SelectItem value="Étudiant">Étudiant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            {isEditing ? 'Modifier' : 'Créer'} un Compte
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </motion.form>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom d'utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.username}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.role}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(account)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(account.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

