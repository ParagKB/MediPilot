import { useState } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/Card'
import { Activity, Plus, TrendingUp, TrendingDown, Heart, Droplet } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../services/database'
import { motion, AnimatePresence } from 'framer-motion'

function HealthMetrics() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState(db.getHealthMetricsByUserId(user.id))
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMetric, setNewMetric] = useState({
    type: '',
    value: '',
    unit: '',
    notes: ''
  })

  const metricTypes = [
    { value: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg', icon: Heart },
    { value: 'blood_sugar', label: 'Blood Sugar', unit: 'mg/dL', icon: Droplet },
    { value: 'weight', label: 'Weight', unit: 'kg', icon: Activity },
    { value: 'heart_rate', label: 'Heart Rate', unit: 'bpm', icon: Heart },
    { value: 'temperature', label: 'Temperature', unit: '°F', icon: Activity },
  ]

  const handleAddMetric = (e) => {
    e.preventDefault()
    const selectedType = metricTypes.find(t => t.value === newMetric.type)
    const metric = db.createHealthMetric({
      userId: user.id,
      ...newMetric,
      unit: selectedType.unit,
      label: selectedType.label
    })
    setMetrics([metric, ...metrics])
    setShowAddForm(false)
    setNewMetric({ type: '', value: '', unit: '', notes: '' })
  }

  const getMetricIcon = (type) => {
    const metricType = metricTypes.find(t => t.value === type)
    return metricType ? metricType.icon : Activity
  }

  const getMetricColor = (type) => {
    const colors = {
      blood_pressure: 'text-red-600 bg-red-100',
      blood_sugar: 'text-blue-600 bg-blue-100',
      weight: 'text-green-600 bg-green-100',
      heart_rate: 'text-pink-600 bg-pink-100',
      temperature: 'text-orange-600 bg-orange-100',
    }
    return colors[type] || 'text-gray-600 bg-gray-100'
  }

  const groupedMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.type]) acc[metric.type] = []
    acc[metric.type].push(metric)
    return acc
  }, {})

  return (
    <Layout title="Health Metrics">
      <div className="space-y-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Health Metric
        </button>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card hover={false}>
                <form onSubmit={handleAddMetric} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Metric Type</label>
                    <select
                      value={newMetric.type}
                      onChange={(e) => setNewMetric({ ...newMetric, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select type</option>
                      {metricTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value {newMetric.type && `(${metricTypes.find(t => t.value === newMetric.type)?.unit})`}
                    </label>
                    <input
                      type="text"
                      value={newMetric.value}
                      onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 120/80 or 98.6"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                    <textarea
                      value={newMetric.notes}
                      onChange={(e) => setNewMetric({ ...newMetric, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      placeholder="Any additional notes..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Add Metric
                  </button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {metrics.length === 0 ? (
          <Card hover={false}>
            <div className="text-center py-8 text-gray-500">
              <Activity size={48} className="mx-auto mb-4 opacity-50" />
              <p>No health metrics recorded yet. Start tracking your health!</p>
            </div>
          </Card>
        ) : (
          Object.entries(groupedMetrics).map(([type, typeMetrics]) => {
            const Icon = getMetricIcon(type)
            const colorClass = getMetricColor(type)
            const latestMetric = typeMetrics[0]
            
            return (
              <div key={type}>
                <h2 className="text-xl font-bold text-gray-800 mb-4">{latestMetric.label}</h2>
                <Card hover={false} className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${colorClass}`}>
                        <Icon size={28} />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-800">{latestMetric.value}</div>
                        <div className="text-sm text-gray-600">{latestMetric.unit}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Latest Reading</div>
                      <div className="text-xs text-gray-500">{new Date(latestMetric.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </Card>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700">History</h3>
                  {typeMetrics.slice(0, 5).map((metric) => (
                    <Card key={metric.id} hover={false} className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-800">{metric.value} {metric.unit}</div>
                          {metric.notes && <div className="text-sm text-gray-600">{metric.notes}</div>}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(metric.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </Layout>
  )
}

export default HealthMetrics
