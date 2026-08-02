import { useState } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/Card'
import { Calendar, Clock, MapPin, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../services/database'
import { motion, AnimatePresence } from 'framer-motion'

function Appointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState(db.getAppointmentsByUserId(user.id))
  const [requests, setRequests] = useState(db.getAppointmentRequestsByUserId(user.id))
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [newRequest, setNewRequest] = useState({
    hospitalId: '',
    specialty: '',
    reason: '',
    preferredDate: ''
  })

  const hospitals = db.getAllHospitals()

  const handleSubmitRequest = (e) => {
    e.preventDefault()
    const request = db.createAppointmentRequest({
      userId: user.id,
      ...newRequest
    })
    setRequests([request, ...requests])
    setShowRequestForm(false)
    setNewRequest({ hospitalId: '', specialty: '', reason: '', preferredDate: '' })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="text-green-600" size={20} />
      case 'rejected': return <XCircle className="text-red-600" size={20} />
      default: return <AlertCircle className="text-yellow-600" size={20} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-yellow-100 text-yellow-700'
    }
  }

  return (
    <Layout title="Appointments">
      <div className="space-y-6">
        <button
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Request New Appointment
        </button>

        <AnimatePresence>
          {showRequestForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card hover={false}>
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hospital</label>
                    <select
                      value={newRequest.hospitalId}
                      onChange={(e) => setNewRequest({ ...newRequest, hospitalId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select hospital</option>
                      {hospitals.map(h => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                    <select
                      value={newRequest.specialty}
                      onChange={(e) => setNewRequest({ ...newRequest, specialty: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select specialty</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="General Medicine">General Medicine</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                    <textarea
                      value={newRequest.reason}
                      onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Describe your reason for appointment"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                    <input
                      type="date"
                      value={newRequest.preferredDate}
                      onChange={(e) => setNewRequest({ ...newRequest, preferredDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Submit Request
                  </button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Appointment Requests</h2>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <Card hover={false}>
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No appointment requests yet.</p>
                </div>
              </Card>
            ) : (
              requests.map((request) => {
                const hospital = hospitals.find(h => h.id === request.hospitalId)
                return (
                  <Card key={request.id} hover={false}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{hospital?.name}</h3>
                          <p className="text-sm text-gray-600">{request.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Reason:</strong> {request.reason}</p>
                      <p className="flex items-center gap-2">
                        <Clock size={16} />
                        Preferred: {new Date(request.preferredDate).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin size={16} />
                        {hospital?.address}
                      </p>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Confirmed Appointments</h2>
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <Card hover={false}>
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No confirmed appointments yet.</p>
                </div>
              </Card>
            ) : (
              appointments.map((apt) => (
                <Card key={apt.id} hover={false}>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{apt.specialty}</h3>
                      <p className="text-sm text-gray-600">{apt.hospitalName}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        {new Date(apt.date).toLocaleDateString()} at {apt.time}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Appointments
