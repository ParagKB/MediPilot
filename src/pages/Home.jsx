import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Building2, Shield, Heart, LogOut, Sparkles, ArrowRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

function Home() {
  const navigate = useNavigate()
  const { user, updateUserPreference, logout } = useAuth()
  const [hoveredCard, setHoveredCard] = useState(null)

  const handleInterfaceSelect = (interfaceType) => {
    updateUserPreference(interfaceType)
    navigate(`/${interfaceType}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const interfaces = [
    {
      type: 'patient',
      icon: User,
      title: 'Patient Portal',
      description: 'Access medical reports, book appointments, track medications and health metrics',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-500/10 to-blue-600/10',
      features: ['Medical Reports', 'Appointments', 'Medications', 'Health Tracking']
    },
    {
      type: 'hospital',
      icon: Building2,
      title: 'Hospital Dashboard',
      description: 'Manage appointment requests, coordinate patient care, and schedule slots',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-500/10 to-green-600/10',
      features: ['Appointment Requests', 'Patient Management', 'Slot Management']
    },
    {
      type: 'insurance',
      icon: Shield,
      title: 'Insurance Portal',
      description: 'Process claims, verify coverage, and manage pre-authorizations',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-500/10 to-purple-600/10',
      features: ['Claims Processing', 'Coverage Verification', 'Pre-Authorization']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animated-gradient relative overflow-hidden">
      {/* Logo at Top */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20"
      >
        <img src="/assets/logo.svg" alt="MediPilot Nexus" className="h-24 w-auto drop-shadow-lg" />
      </motion.div>

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
        />
      </div>

      <header className="bg-white/80 backdrop-blur-xl shadow-lg relative z-10">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <Heart className="text-white" size={24} />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MediPilot Nexus
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Sparkles size={12} className="text-purple-500" />
                Welcome, {user?.name}
              </p>
            </div>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </motion.button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h2
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
            style={{ backgroundSize: '200% 200%' }}
          >
            Choose Your Interface
          </motion.h2>
          <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
            <Sparkles size={20} className="text-blue-500" />
            Select the portal that matches your role
            <Sparkles size={20} className="text-purple-500" />
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {interfaces.map((item, index) => {
            const Icon = item.icon
            const isHovered = hoveredCard === index
            return (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, y: 50, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  rotateY: 5,
                  rotateX: 5,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                onClick={() => handleInterfaceSelect(item.type)}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer group relative"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                {/* Animated Gradient Overlay */}
                <motion.div
                  animate={isHovered ? {
                    opacity: [0.1, 0.2, 0.1],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} pointer-events-none`}
                />

                <div className={`bg-gradient-to-r ${item.color} p-8 text-white relative overflow-hidden`}>
                  {/* Animated Background Pattern */}
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 opacity-10"
                  >
                    <div className="absolute top-0 left-0 w-32 h-32 border-4 border-white rounded-full" />
                    <div className="absolute bottom-0 right-0 w-40 h-40 border-4 border-white rounded-full" />
                  </motion.div>

                  <motion.div
                    animate={isHovered ? {
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    } : {}}
                    transition={{
                      duration: 0.6,
                    }}
                    className="relative z-10"
                  >
                    <Icon size={56} className="mb-4 drop-shadow-lg" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2 relative z-10">{item.title}</h3>
                  <motion.div
                    animate={isHovered ? { x: [0, 5, 0] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="absolute top-4 right-4"
                  >
                    <Sparkles className="text-white/50" size={24} />
                  </motion.div>
                </div>

                <div className="p-6 relative">
                  <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                  <div className="space-y-2 mb-6">
                    {item.features.map((feature, idx) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 + idx * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <motion.div
                          animate={isHovered ? {
                            scale: [1, 1.5, 1],
                          } : {}}
                          transition={{
                            duration: 0.5,
                            delay: idx * 0.1,
                            repeat: isHovered ? Infinity : 0,
                          }}
                          className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                        />
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full bg-gradient-to-r ${item.color} text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 group`}
                  >
                    Enter Portal
                    <motion.div
                      animate={isHovered ? { x: [0, 5, 0] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <ArrowRight size={20} />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default Home
