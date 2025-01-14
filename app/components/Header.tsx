'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Logo from "./Logo"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTheme } from "./ThemeContext"
import { Sun, Moon, Palette } from 'lucide-react'

export default function Header({ currentSection }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const { theme, setTheme } = useTheme()

  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(17, 24, 39, 0)", "rgba(17, 24, 39, 0.8)"]
  )

  const headerY = useTransform(scrollY, [0, 50], [0, -10])

  useEffect(() => {
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', updateScroll)
    return () => window.removeEventListener('scroll', updateScroll)
  }, [])

  const navItems = ['Accueil', 'Fonctionnalités', 'Statistiques', 'Témoignages', 'Contact']

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ backgroundColor: headerBackground, y: headerY }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          <nav>
            <ul className="flex space-x-6">
              {navItems.map((item, index) => (
                <motion.li key={item} 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={`#${item.toLowerCase()}`} 
                    className={`text-gray-300 hover:text-blue-400 transition duration-300 ${
                      currentSection === item.toLowerCase() ? 'text-blue-400 font-bold' : ''
                    }`}
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setTheme(theme === 'default' ? 'ocean' : 'default')}
                className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
              >
                <Palette size={20} />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/login">
                <Button variant="outline" className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white">
                  Connexion
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/admin/login">
                <Button variant="outline" className="text-red-400 border-red-400 hover:bg-red-400 hover:text-">
                  Admin Connexion
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
