'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    name: "Prof. Ahmed",
    role: "Enseignant-chercheur",
    content: "Ce système a considérablement simplifié la gestion des notes et amélioré notre efficacité.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Fatima L.",
    role: "Étudiante en 3ème année",
    content: "L'accès facile à mes notes et à mon progrès académique est vraiment apprécié.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Dr. Karim",
    role: "Chef de département",
    content: "Un outil indispensable pour le suivi et l'amélioration continue de nos programmes.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Sara M.",
    role: "Responsable administratif",
    content: "La gestion des notes n'a jamais été aussi simple et efficace. Un vrai gain de temps pour notre équipe.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 relative min-h-screen flex items-center">
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
          Ce qu'ils en disent
        </motion.h2>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-2/3 mx-auto"
            >
              <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border-gray-700">
                <CardContent className="p-6">
                  <p className="text-gray-300 mb-4 text-lg">"{testimonials[currentIndex].content}"</p>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonials[currentIndex].avatar} />
                      <AvatarFallback>{testimonials[currentIndex].name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white">{testimonials[currentIndex].name}</p>
                      <p className="text-sm text-gray-400">{testimonials[currentIndex].role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-all duration-300"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}

