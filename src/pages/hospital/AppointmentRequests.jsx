import { useState } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/Card'
import { ClipboardList, User, Calendar, Phone, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../services/database'

function AppointmentRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState(db.getAppointmentRequestsByHospitalId(user.hospitalId))
  const hospital = db.getHospitalById(user.hospitalId)

  const handleAccept = (requestId) => {
    const request = requests.find(r => r.id === requestId)
    const updated = db.updateAppointmentRequest(requestId, { status: 'confirmed' })
    
    // Create confirmed appointment
    db.createAppointment({
      userId: request.userId,
      hospitalId: request.hospitalId,
      hospitalName: hospital.name,
      specialty: request.specialty,
      date: request.preferredDate,
      time: '10:00 AM',
      status: 'confirmed'
    })
    
    setRequests(requests.map(r => r.id === requestId ? updated : r))
  }

  const handleReject = (requestId) => {
    const updated = db.updateAppointmentRequest(requestId, { status: 'rejected' })
    setRequests(requests.map(r => r.id === requestId ? updated : r))
  }

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const processedRequests = requests.filter(r => r.status !== 'pending')

  return (
    <Layout title="Appointment Requests">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Requests</h2>
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <Card hover={false}>
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No pending requests.</p>
                </div>
              </Card>
            ) : (
              pendingRequests.map((request) => {
                const patient = db.findUserById(request.userId)
                return (
                  <Card key={request.id} hover={false}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="text-blue-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{patient?.name}</h3>
                        <p className="text-sm text-gray-600">{request.specialty}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(request.preferredDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={14} />
                            {patient?.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700"><strong>Reason:</strong> {request.reason}</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </div>

        {processedRequests.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Processed Requests</h2>
            <div className="space-y-4">
              {processedRequests.map((request) => {
                const patient = db.findUserById(request.userId)
                return (
                  <Card key={request.id} hover={false} className="opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <User className="text-gray-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{patient?.name}</h3>
                          <p className="text-sm text-gray-600">{request.specialty}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(request.preferredDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default AppointmentRequests
