import { motion } from 'framer-motion'
import BottomNav from './BottomNav'
import { LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

function Layout({ children, title }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/assets/logo.svg" alt="MediPilot Nexus" className="h-12 w-auto" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              {user && <p className="text-sm text-gray-600">Welcome, {user.name}</p>}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-screen-xl mx-auto px-4 py-6"
      >
        {children}
      </motion.main>
      <BottomNav />
    </div>
  )
}

export default Layout
