'use client'

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, BookOpen, Users, BarChart2, Settings, LogOut, FileText, CheckSquare } from 'lucide-react'
import { useSession } from '../../hooks/useSession'

const menuItems = [
  { icon: Home, label: "Accueil", href: "/dashboard" },
  { icon: BookOpen, label: "Modules", href: "/dashboard/modules" },
  { icon: FileText, label: "Éléments", href: "/dashboard/elements" },
  { icon: Users, label: "Étudiants", href: "/dashboard/students" },
  { icon: CheckSquare, label: "Saisie des Notes", href: "/dashboard/grades" },
  { icon: BarChart2, label: "Statistiques", href: "/dashboard/stats" },
  { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const { logout } = useSession()

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 h-screen"
      initial={{ width: isOpen ? 240 : 80 }}
      animate={{ width: isOpen ? 240 : 80 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
          <motion.h1
            className="text-xl font-bold text-gray-800 dark:text-white"
            initial={{ opacity: isOpen ? 1 : 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
          >
            ENSA Dashboard
          </motion.h1>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4 space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href} passHref>
                  <motion.div
                    className="flex items-center p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="w-6 h-6 mr-4" />
                    <motion.span
                      initial={{ opacity: isOpen ? 1 : 0 }}
                      animate={{ opacity: isOpen ? 1 : 0 }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <motion.button
            className="flex items-center w-full p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
          >
            <LogOut className="w-6 h-6 mr-4" />
            <motion.span
              initial={{ opacity: isOpen ? 1 : 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
            >
              Déconnexion
            </motion.span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}