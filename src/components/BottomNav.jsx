import { useNavigate, useLocation } from 'react-router-dom'
import { Home, FileText, Calendar, Pill, Activity, UtensilsCrossed, ArrowLeftRight, ClipboardList, Building2, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  // Don't show on home or switch pages
  if (location.pathname === '/' || location.pathname === '/switch' || location.pathname === '/login') {
    return null
  }

  const getNavItems = () => {
    if (location.pathname.startsWith('/patient')) {
      return [
        { icon: Home, label: 'Dashboard', path: '/patient' },
        { icon: FileText, label: 'Reports', path: '/patient/reports' },
        { icon: Calendar, label: 'Appointments', path: '/patient/appointments' },
        { icon: Pill, label: 'Medications', path: '/patient/medications' },
        { icon: Activity, label: 'Health', path: '/patient/health' },
      ]
    } else if (location.pathname.startsWith('/hospital')) {
      return [
        { icon: Home, label: 'Dashboard', path: '/hospital' },
        { icon: ClipboardList, label: 'Requests', path: '/hospital/requests' },
        { icon: Calendar, label: 'Slots', path: '/hospital/slots' },
      ]
    } else if (location.pathname.startsWith('/insurance')) {
      return [
        { icon: Home, label: 'Dashboard', path: '/insurance' },
        { icon: FileText, label: 'Claims', path: '/insurance/claims' },
        { icon: Shield, label: 'Coverage', path: '/insurance/coverage' },
      ]
    }
    return []
  }

  const navItems = getNavItems()

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            )
          })}
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-600 hover:text-blue-500 transition-colors"
          >
            <ArrowLeftRight size={24} />
            <span className="text-xs mt-1">Switch</span>
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

export default BottomNav
