import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Mail, Lock, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const demoAccounts = [
    { email: 'patient@demo.com', password: 'demo123', role: 'Patient', color: 'from-blue-500 to-blue-600' },
    { email: 'hospital@demo.com', password: 'demo123', role: 'Hospital', color: 'from-green-500 to-green-600' },
    { email: 'insurance@demo.com', password: 'demo123', role: 'Insurance', color: 'from-purple-500 to-purple-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 animated-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Logo at Top */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <img src="/assets/logo.svg" alt="MediPilot Nexus" className="h-32 w-auto drop-shadow-2xl" />
      </motion.div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg"
          >
            <Heart className="text-white" size={40} />
          </motion.div>
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
          >
            MediPilot Nexus
          </motion.h1>
          <p className="text-gray-600 mt-2 flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-purple-500" />
            Your Healthcare Platform
            <Sparkles size={16} className="text-blue-500" />
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                placeholder="Enter your email"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                placeholder="Enter your password"
                required
              />
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 text-red-600 p-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>

        <div className="mt-6 pt-6 border-t-2 border-gray-100">
          <p className="text-sm text-gray-600 mb-3 text-center font-medium">Demo Accounts:</p>
          <div className="space-y-2">
            {demoAccounts.map((account, index) => (
              <motion.button
                key={account.email}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setEmail(account.email)
                  setPassword(account.password)
                }}
                className={`w-full text-left px-4 py-3 bg-gradient-to-r ${account.color} text-white rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-xl`}
              >
                <div className="font-semibold flex items-center justify-between">
                  <span>{account.role}</span>
                  <Sparkles size={16} />
                </div>
                <div className="text-white/90 text-xs mt-1">{account.email}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
