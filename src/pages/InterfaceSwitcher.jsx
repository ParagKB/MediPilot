import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Building2, Shield, ArrowLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

function InterfaceSwitcher() {
  const navigate = useNavigate()
  const { updateUserPreference } = useAuth()

  const handleInterfaceSelect = (interfaceType) => {
    updateUserPreference(interfaceType)
    navigate(`/${interfaceType}`)
  }

  const interfaces = [
    {
      type: 'patient',
      icon: User,
      title: 'Patient Portal',
      description: 'Manage your health records and appointments',
      color: 'from-blue-500 to-blue-600'
    },
    {
      type: 'hospital',
      icon: Building2,
      title: 'Hospital Dashboard',
      description: 'Manage patient requests and appointments',
      color: 'from-green-500 to-green-600'
    },
    {
      type: 'insurance',
      icon: Shield,
      title: 'Insurance Portal',
      description: 'Process claims and verify coverage',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Logo at Top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <img src="/assets/logo.svg" alt="MediPilot Nexus" className="h-20 w-auto" />
        </motion.div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Switch Interface</h1>
          <p className="text-lg text-gray-600">Choose the interface you want to access</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {interfaces.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleInterfaceSelect(item.type)}
                className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer"
              >
                <div className={`bg-gradient-to-r ${item.color} p-8 text-white`}>
                  <Icon size={48} className="mb-4" />
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default InterfaceSwitcher
