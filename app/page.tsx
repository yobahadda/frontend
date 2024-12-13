'use client'
import { useRef, useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Stats from './components/Stats'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import Footer from './components/Footer'
import ScrollToTopButton from './components/ScrolltoTopButton'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import ParticleBackground from './components/ParticlesBackgound'
import { ThemeProvider } from './components/ThemeContext'

// const randomValue = useMemo(() => Math.random(), []);

export default function Home() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const [currentSection, setCurrentSection] = useState('hero')

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id)
        }
      })
    }, { threshold: 0.5 })

    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <ThemeProvider>
      <div ref={containerRef} className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white relative overflow-hidden transition-colors duration-1000">
        <ParticleBackground />
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-gray-900 to-gray-900 opacity-50" />
        </motion.div>
        <Header currentSection={currentSection} />
        <main className="flex-grow relative z-10">
          <Hero />
          <Features />
          <Stats />
          <Testimonials />
          <CTA />
        </main>
        <Footer />
        <ScrollProgressIndicator />
        <ScrollToTopButton />
      </div>
    </ThemeProvider>
  )
}

function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

