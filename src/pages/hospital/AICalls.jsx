import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/Card'
import { Phone, Bot, User, Calendar, Clock, MessageSquare, CheckCircle, AlertCircle, Activity } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../services/database'
import { motion, AnimatePresence } from 'framer-motion'

function AICalls() {
  const { user } = useAuth()
  const [calls, setCalls] = useState([])
  const [selectedCall, setSelectedCall] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadCalls()
    const interval = setInterval(loadCalls, 5000)
    return () => clearInterval(interval)
  }, [user.hospitalId])

  const loadCalls = () => {
    const hospitalCalls = db.getAICallsByHospitalId(user.hospitalId)
    setCalls(hospitalCalls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'calling': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'initiating': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'failed': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-orange-600 bg-orange-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredCalls = filter === 'all' ? calls : calls.filter(c => c.status === filter)

  const stats = {
    total: calls.length,
    completed: calls.filter(c => c.status === 'completed').length,
    active: calls.filter(c => c.status === 'calling' || c.status === 'initiating').length,
    today: calls.filter(c => {
      const today = new Date().toDateString()
      return new Date(c.createdAt).toDateString() === today
    }).length
  }

  return (
    <Layout title="AI Agent Calls">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card hover={false} className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <Phone className="text-blue-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Calls</div>
          </Card>

          <Card hover={false} className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </Card>

          <Card hover={false} className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-3">
              <Activity className="text-yellow-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </Card>

          <Card hover={false} className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
              <Calendar className="text-purple-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.today}</div>
            <div className="text-sm text-gray-600">Today</div>
          </Card>
        </div>

        <Card hover={false}>
          <div className="flex gap-2 flex-wrap">
            {['all', 'completed', 'calling', 'initiating'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          {filteredCalls.length === 0 ? (
            <Card hover={false}>
              <div className="text-center py-8 text-gray-500">
                <Bot size={48} className="mx-auto mb-4 opacity-50" />
                <p>No AI calls yet.</p>
              </div>
            </Card>
          ) : (
            filteredCalls.map((call) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <Card hover={true} onClick={() => setSelectedCall(call)} className="cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <motion.div
                        animate={call.status === 'calling' ? { rotate: 360 } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          call.status === 'calling' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}
                      >
                        <Bot className={call.status === 'calling' ? 'text-blue-600' : 'text-gray-600'} size={24} />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{call.patientName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(call.urgency)}`}>
                            {call.urgency}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{call.specialty}</p>
                        <p className="text-sm text-gray-700">{call.reason}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(call.createdAt).toLocaleString()}
                          </span>
                          {call.callDuration && (
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {call.callDuration}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Phone size={14} />
                            {call.patientPhone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getStatusColor(call.status)}`}>
                        {call.status}
                      </span>
                      {call.status === 'calling' && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="flex items-center gap-1 text-blue-600 text-xs"
                        >
                          <Activity size={14} />
                          <span>Live</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {call.status === 'completed' && call.transcript && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedCall(call)
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        <MessageSquare size={16} />
                        View Call Transcript
                      </button>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCall(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bot size={32} />
                    <div>
                      <h2 className="text-2xl font-bold">AI Call Details</h2>
                      <p className="text-blue-100">Call ID: {selectedCall.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCall(null)}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Patient</p>
                    <p className="font-semibold text-gray-800">{selectedCall.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Specialty</p>
                    <p className="font-semibold text-gray-800">{selectedCall.specialty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Urgency</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(selectedCall.urgency)}`}>
                      {selectedCall.urgency}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-800">{selectedCall.callDuration || 'N/A'}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Reason for Call</p>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedCall.reason}</p>
                </div>

                {selectedCall.transcript && selectedCall.transcript.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <MessageSquare size={20} />
                      Call Transcript
                    </h3>
                    <div className="space-y-3">
                      {selectedCall.transcript.map((msg, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: msg.speaker === 'AI Agent' ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`flex ${msg.speaker === 'AI Agent' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            msg.speaker === 'AI Agent'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-green-100 text-green-900'
                          }`}>
                            <p className="text-xs font-semibold mb-1">{msg.speaker}</p>
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

export default AICalls
