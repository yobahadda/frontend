'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { useTheme } from "../components/ThemeContext"
import { useSession } from '../hooks/useSession'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { theme } = useTheme()
  const router = useRouter()
  const { login } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const success = await login(email, password)
      if (success) {
        toast.success(`Bienvenue, ${email}!`)
        router.push('/dashboard')
      } else {
        setError('Email ou mot de passe incorrect.')
      }
    } catch (err) {
      console.error(err)
      setError('Une erreur inattendue est survenue.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-blue-900">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
          Connexion Professeur
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-300">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button 
            type="submit" 
            className={`w-full bg-gradient-to-r from-${theme === 'default' ? 'blue-500' : 'primary'} to-${theme === 'default' ? 'cyan-400' : 'secondary'} text-white hover:from-${theme === 'default' ? 'blue-600' : 'primary'} hover:to-${theme === 'default' ? 'cyan-500' : 'secondary'} transform hover:scale-105 transition-all duration-300`}
          >
            Se connecter
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

