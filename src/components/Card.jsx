import { motion } from 'framer-motion'
import { useState } from 'react'

function Card({ children, className = '', onClick, hover = true }) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e) => {
    if (!hover) return
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateXValue = ((y - centerY) / centerY) * -10
    const rotateYValue = ((x - centerX) / centerX) * 10
    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: hover ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : 'none',
        transition: 'transform 0.1s ease-out'
      }}
      className={`bg-white rounded-xl shadow-lg hover:shadow-2xl p-6 ${onClick ? 'cursor-pointer' : ''} ${className} relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

export default Card
