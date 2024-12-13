import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from 'use-count-up';

const stats = [
  { label: 'Étudiants', value: 5000, suffix: '+' },
  { label: 'Professeurs', value: 200, suffix: '+' },
  { label: 'Filières', value: 15, suffix: '+' },
  { label: 'Taux de réussite', value: 92, suffix: '%' },
];

function StatItem({ label, value, suffix, index }) {
  const { value: displayValue } = useCountUp({
    isCounting: true,
    end: value,
    duration: 2,
    decimalPlaces: 0,
  });

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="text-4xl font-bold text-blue-400 mb-2"
        initial={{ scale: 1 }}
        whileInView={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
      >
        {displayValue}{suffix}
      </motion.div>
      <div className="text-gray-300">{label}</div>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section className="py-20 relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 animate-gradient-shift" />
      
      {/* Animated Bubble Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, index) => {
          const size = Math.random() * 100 + 50;
          const delay = Math.random() * 5;
          const duration = Math.random() * 10 + 5;
          
          return (
            <motion.div
              key={index}
              className="absolute bg-white/10 rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ 
                opacity: 0, 
                scale: 0.5,
                y: 100
              }}
              animate={{ 
                opacity: [0, 0.5, 0],
                scale: [0.5, 1, 0.5],
                y: [-100, 0, 100]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* SVG Blob */}
          <div className="w-full h-[400px] relative flex items-center justify-center">
            <svg 
              viewBox="0 0 200 200" 
              xmlns="http://www.w3.org/2000/svg" 
              className="absolute animate-blob"
            >
              <path 
                fill="#88CCFF" 
                d="M45.3,-78.4C59.1,-70.1,71.5,-59.3,79.3,-46.2C87.1,-33.1,90.4,-17.1,88.4,-2.4C86.4,12.3,79.2,24.5,70.5,35.4C61.9,46.2,51.8,55.6,40.4,64.1C29,72.6,14.5,80.1,-1.6,82.7C-17.8,85.3,-35.5,83,-50.3,75.5C-65.1,68,-76.8,55.4,-83.8,40.4C-90.8,25.4,-93.1,8.1,-87.5,-6.5C-81.8,-21.1,-68.3,-32.9,-55.5,-42.3C-42.8,-51.7,-30.9,-58.7,-18.2,-65.1C-5.4,-71.5,-2.7,-77.3,6.6,-83.7C15.9,-90.1,31.8,-97.1,45.3,-78.4Z" 
                transform="translate(100 100)" 
              />
            </svg>
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              Nos chiffres clés
            </h2>
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <StatItem 
                  key={index}
                  label={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}