'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"

export default function CTA() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    setIsSubmitted(true)
  }

  return (
    <section className="py-20 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-blue-900" />
      </motion.div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2 
          className="text-4xl font-bold mb-4 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Prêt à améliorer la gestion de vos notes ?
        </motion.h2>
        <motion.p 
          className="text-xl mb-8 text-blue-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Rejoignez les nombreuses institutions qui font confiance à notre système.
        </motion.p>
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full md:w-64 bg-white text-gray-900"
              />
              <Button type="submit" size="lg" className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white">
                Demander une démo
              </Button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-green-400 text-xl"
            >
              Merci ! Nous vous contacterons bientôt pour une démo.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-400 mix-blend-multiply filter blur-xl"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </motion.div>
    </section>
  )
}

