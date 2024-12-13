'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, ClipboardList, BarChart2 } from 'lucide-react'
import { motion, useMotionValue, useTransform } from "framer-motion"
import { useState } from "react"
import { useTheme } from "./ThemeContext"

const features = [
  {
    title: "Gestion des Professeurs",
    description: "Gérez facilement les informations et les charges des professeurs.",
    icon: Users,
  },
  {
    title: "Gestion des Modules",
    description: "Organisez les modules et les éléments de modules efficacement.",
    icon: BookOpen,
  },
  {
    title: "Évaluations",
    description: "Configurez les modalités d'évaluation pour chaque module.",
    icon: ClipboardList,
  },
  {
    title: "Suivi des Notes",
    description: "Suivez les performances des étudiants avec des outils d'analyse avancés.",
    icon: BarChart2,
  },
]

function FeatureCard({ feature, index }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [30, -30])
  const rotateY = useTransform(x, [-100, 100], [-30, 30])
  const [isHovered, setIsHovered] = useState(false)
  const { theme } = useTheme()

  return (
    <motion.div
      style={{ x, y, rotateX, rotateY, z: 100 }}
      drag
      dragElastic={0.1}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      whileTap={{ cursor: 'grabbing' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={`h-full bg-${theme === 'default' ? 'gray-800' : 'background'} bg-opacity-50 backdrop-blur-sm border-${theme === 'default' ? 'gray-700' : 'primary'} hover:border-${theme === 'default' ? 'blue-500' : 'secondary'} transition-all duration-300 cursor-grab`}>
        <CardHeader>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <feature.icon className={`w-10 h-10 text-${theme === 'default' ? 'blue-400' : 'primary'} mb-4`} />
          </motion.div>
          <CardTitle className="text-white">{feature.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-300">{feature.description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Features() {
  return (
    <section id="fonctionnalités" className="py-20 relative">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800" />
      </motion.div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Fonctionnalités Principales
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureCard feature={feature} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

