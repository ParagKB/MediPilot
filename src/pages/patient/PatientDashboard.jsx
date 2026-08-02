import Layout from '../../components/Layout'
import Card from '../../components/Card'
import { FileText, Calendar, Pill, Activity, UtensilsCrossed, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../services/database'

function PatientDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const reports = db.getMedicalReportsByUserId(user.id)
  const appointments = db.getAppointmentsByUserId(user.id)
  const medications = db.getMedicationsByUserId(user.id)
  const healthMetrics = db.getHealthMetricsByUserId(user.id)

  const quickStats = [
    { icon: FileText, label: 'Medical Reports', value: reports.length, color: 'text-blue-600', bg: 'bg-blue-100', path: '/patient/reports' },
    { icon: Calendar, label: 'Appointments', value: appointments.length, color: 'text-green-600', bg: 'bg-green-100', path: '/patient/appointments' },
    { icon: Pill, label: 'Active Medications', value: medications.filter(m => m.status === 'active').length, color: 'text-purple-600', bg: 'bg-purple-100', path: '/patient/medications' },
    { icon: Activity, label: 'Health Metrics', value: healthMetrics.length, color: 'text-red-600', bg: 'bg-red-100', path: '/patient/health' },
  ]

  const quickActions = [
    { icon: FileText, label: 'Upload Report', path: '/patient/reports', color: 'from-blue-500 to-blue-600' },
    { icon: Calendar, label: 'Book Appointment', path: '/patient/appointments', color: 'from-green-500 to-green-600' },
    { icon: Pill, label: 'Add Medication', path: '/patient/medications', color: 'from-purple-500 to-purple-600' },
    { icon: UtensilsCrossed, label: 'Meal Plans', path: '/patient/meals', color: 'from-orange-500 to-orange-600' },
  ]

  return (
    <Layout title="Patient Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} onClick={() => navigate(stat.path)} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.bg} rounded-full mb-3`}>
                  <Icon className={stat.color} size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            )
          })}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Card key={action.label} onClick={() => navigate(action.path)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{action.label}</h3>
                      <p className="text-sm text-gray-600">Click to access</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        <Card hover={false}>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={24} />
            Health Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overall Health Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Good</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Checkup</span>
              <span className="text-gray-800 font-medium">2 weeks ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Next Appointment</span>
              <span className="text-gray-800 font-medium">{appointments.length > 0 ? 'Scheduled' : 'None'}</span>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default PatientDashboard
