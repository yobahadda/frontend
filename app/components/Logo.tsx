'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Logo() {
  return (
    <motion.div 
      className="flex items-center space-x-2"
      whileHover={{ scale: 1.05 }}
    >
      <Image src="/logo.svg" alt="ENSA Khouribga Logo" width={40} height={40} />
      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">ENSA Khouribga</span>
    </motion.div>
  )
}

