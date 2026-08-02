import Layout from '../../components/Layout'
import Card from '../../components/Card'
import { ClipboardList, Calendar, Users, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../services/database'

function HospitalDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const hospital = db.getHospitalById(user.hospitalId)
  const requests = db.getAppointmentRequestsByHospitalId(user.hospitalId)
  const pendingRequests = requests.filter(r => r.status === 'pending')

  const stats = [
    { icon: ClipboardList, label: 'Pending Requests', value: pendingRequests.length, color: 'text-yellow-600', bg: 'bg-yellow-100', path: '/hospital/requests' },
    { icon: CheckCircle, label: 'Total Requests', value: requests.length, color: 'text-green-600', bg: 'bg-green-100', path: '/hospital/requests' },
    { icon: Calendar, label: 'Available Slots', value: hospital?.availableSlots?.length || 0, color: 'text-blue-600', bg: 'bg-blue-100', path: '/hospital/slots' },
    { icon: Users, label: 'Patients Today', value: 0, color: 'text-purple-600', bg: 'bg-purple-100', path: '/hospital' },
  ]

  return (
    <Layout title="Hospital Dashboard">
      <div className="space-y-6">
        <Card hover={false}>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{hospital?.name}</h2>
          <p className="text-gray-600">{hospital?.address}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {hospital?.specialties.map(specialty => (
              <span key={specialty} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {specialty}
              </span>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
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

        {pendingRequests.length > 0 && (
          <Card hover={false}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Requests</h3>
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((request) => {
                const patient = db.findUserById(request.userId)
                return (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-800">{patient?.name}</div>
                      <div className="text-sm text-gray-600">{request.specialty}</div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  </div>
                )
              })}
            </div>
            <button
              onClick={() => navigate('/hospital/requests')}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Requests
            </button>
          </Card>
        )}
      </div>
    </Layout>
  )
}

export default HospitalDashboard
