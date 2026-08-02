import { useState } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/Card'
import { Pill, Plus, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../services/database'
import { motion, AnimatePresence } from 'framer-motion'

function Medications() {
  const { user } = useAuth()
  const [medications, setMedications] = useState(db.getMedicationsByUserId(user.id))
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    instructions: ''
  })

  const handleAddMedication = (e) => {
    e.preventDefault()
    const medication = db.createMedication({
      userId: user.id,
      ...newMed,
      status: 'active',
      reminders: []
    })
    setMedications([medication, ...medications])
    setShowAddForm(false)
    setNewMed({ name: '', dosage: '', frequency: '', startDate: '', endDate: '', instructions: '' })
  }

  const toggleMedicationStatus = (id) => {
    const med = medications.find(m => m.id === id)
    const newStatus = med.status === 'active' ? 'completed' : 'active'
    const updated = db.updateMedication(id, { status: newStatus })
    setMedications(medications.map(m => m.id === id ? updated : m))
  }

  const activeMeds = medications.filter(m => m.status === 'active')
  const completedMeds = medications.filter(m => m.status === 'completed')

  return (
    <Layout title="Medications">
      <div className="space-y-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Medication
        </button>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card hover={false}>
                <form onSubmit={handleAddMedication} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medication Name</label>
                    <input
                      type="text"
                      value={newMed.name}
                      onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Aspirin"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
                      <input
                        type="text"
                        value={newMed.dosage}
                        onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 100mg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                      <select
                        value={newMed.frequency}
                        onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select</option>
                        <option value="Once daily">Once daily</option>
                        <option value="Twice daily">Twice daily</option>
                        <option value="Three times daily">Three times daily</option>
                        <option value="As needed">As needed</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={newMed.startDate}
                        onChange={(e) => setNewMed({ ...newMed, startDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={newMed.endDate}
                        onChange={(e) => setNewMed({ ...newMed, endDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                    <textarea
                      value={newMed.instructions}
                      onChange={(e) => setNewMed({ ...newMed, instructions: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Special instructions..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Add Medication
                  </button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Active Medications</h2>
          <div className="space-y-4">
            {activeMeds.length === 0 ? (
              <Card hover={false}>
                <div className="text-center py-8 text-gray-500">
                  <Pill size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No active medications.</p>
                </div>
              </Card>
            ) : (
              activeMeds.map((med) => (
                <Card key={med.id} hover={false}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Pill className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{med.name}</h3>
                        <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleMedicationStatus(med.id)}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200"
                    >
                      Mark Complete
                    </button>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Clock size={16} />
                      {new Date(med.startDate).toLocaleDateString()} - {med.endDate ? new Date(med.endDate).toLocaleDateString() : 'Ongoing'}
                    </p>
                    {med.instructions && (
                      <p className="flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5" />
                        {med.instructions}
                      </p>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {completedMeds.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Completed Medications</h2>
            <div className="space-y-4">
              {completedMeds.map((med) => (
                <Card key={med.id} hover={false} className="opacity-60">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="text-gray-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{med.name}</h3>
                      <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                      <p className="text-xs text-gray-500 mt-1">Completed</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Medications
