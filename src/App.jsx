import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Home from './pages/Home'
import Login from './pages/Login'
import InterfaceSwitcher from './pages/InterfaceSwitcher'
import PatientDashboard from './pages/patient/PatientDashboard'
import MedicalReports from './pages/patient/MedicalReports'
import Appointments from './pages/patient/Appointments'
import Medications from './pages/patient/Medications'
import HealthMetrics from './pages/patient/HealthMetrics'
import MealPlans from './pages/patient/MealPlans'
import HospitalDashboard from './pages/hospital/HospitalDashboard'
import AppointmentRequests from './pages/hospital/AppointmentRequests'
import HospitalSlots from './pages/hospital/HospitalSlots'
import AICalls from './pages/hospital/AICalls'
import InsuranceDashboard from './pages/insurance/InsuranceDashboard'
import Claims from './pages/insurance/Claims'
import Coverage from './pages/insurance/Coverage'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
      <Route path="/switch" element={user ? <InterfaceSwitcher /> : <Navigate to="/login" />} />
      
      {/* Patient Routes */}
      <Route path="/patient" element={user ? <PatientDashboard /> : <Navigate to="/login" />} />
      <Route path="/patient/reports" element={user ? <MedicalReports /> : <Navigate to="/login" />} />
      <Route path="/patient/appointments" element={user ? <Appointments /> : <Navigate to="/login" />} />
      <Route path="/patient/medications" element={user ? <Medications /> : <Navigate to="/login" />} />
      <Route path="/patient/health" element={user ? <HealthMetrics /> : <Navigate to="/login" />} />
      <Route path="/patient/meals" element={user ? <MealPlans /> : <Navigate to="/login" />} />
      
      {/* Hospital Routes */}
      <Route path="/hospital" element={user ? <HospitalDashboard /> : <Navigate to="/login" />} />
      <Route path="/hospital/requests" element={user ? <AppointmentRequests /> : <Navigate to="/login" />} />
      <Route path="/hospital/slots" element={user ? <HospitalSlots /> : <Navigate to="/login" />} />
      <Route path="/hospital/ai-calls" element={user ? <AICalls /> : <Navigate to="/login" />} />
      
      {/* Insurance Routes */}
      <Route path="/insurance" element={user ? <InsuranceDashboard /> : <Navigate to="/login" />} />
      <Route path="/insurance/claims" element={user ? <Claims /> : <Navigate to="/login" />} />
      <Route path="/insurance/coverage" element={user ? <Coverage /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App
