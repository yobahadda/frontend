'use client'
import Link from "next/link"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">ENSA Khouribga</h3>
            <p className="text-gray-400">École Nationale des Sciences Appliquées de Khouribga</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">Accueil</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">À propos</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">Contact</Link></li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">Email: contact@ensakhouribga.ma</p>
            <p className="text-gray-400">Téléphone: +212 5XX XX XX XX</p>
          </motion.div>
        </div>
        <motion.div 
          className="border-t border-gray-800 mt-8 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500">&copy; 2023 ENSA Khouribga. Tous droits réservés.</p>
        </motion.div>
      </div>
    </footer>
  )
}

