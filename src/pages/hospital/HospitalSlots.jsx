import { useState } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/Card'
import { Calendar, Plus, Clock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'

function HospitalSlots() {
  const { user } = useAuth()
  const [slots, setSlots] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSlot, setNewSlot] = useState({
    date: '',
    time: '',
    specialty: '',
    doctor: ''
  })

  const handleAddSlot = (e) => {
    e.preventDefault()
    const slot = {
      id: `slot${slots.length + 1}`,
      ...newSlot,
      status: 'available',
      createdAt: new Date().toISOString()
    }
    setSlots([slot, ...slots])
    setShowAddForm(false)
    setNewSlot({ date: '', time: '', specialty: '', doctor: '' })
  }

  return (
    <Layout title="Appointment Slots">
      <div className="space-y-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add New Slot
        </button>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card hover={false}>
                <form onSubmit={handleAddSlot} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={newSlot.date}
                      onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={newSlot.time}
                      onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                    <select
                      value={newSlot.specialty}
                      onChange={(e) => setNewSlot({ ...newSlot, specialty: e.target.value })}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name</label>
                    <input
                      type="text"
                      value={newSlot.doctor}
                      onChange={(e) => setNewSlot({ ...newSlot, doctor: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Dr. John Smith"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Add Slot
                  </button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {slots.length === 0 ? (
          <Card hover={false}>
            <div className="text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>No appointment slots created yet.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {slots.map((slot) => (
              <Card key={slot.id} hover={false}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{slot.specialty}</h3>
                      <p className="text-sm text-gray-600">{slot.doctor}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(slot.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {slot.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {slot.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default HospitalSlots
