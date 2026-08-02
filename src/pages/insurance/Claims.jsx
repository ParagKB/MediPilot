import { useState } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/Card'
import { FileText, Plus, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react'
import { db } from '../../services/database'
import { motion, AnimatePresence } from 'framer-motion'

function Claims() {
  const [claims, setClaims] = useState(db.getAllInsuranceClaims())
  const [showAddForm, setShowAddForm] = useState(false)
  const [newClaim, setNewClaim] = useState({
    policyNumber: '',
    patientName: '',
    procedure: '',
    amount: '',
    hospitalName: '',
    date: ''
  })

  const handleAddClaim = (e) => {
    e.preventDefault()
    const claim = db.createInsuranceClaim({
      ...newClaim,
      amount: parseFloat(newClaim.amount)
    })
    setClaims([claim, ...claims])
    setShowAddForm(false)
    setNewClaim({ policyNumber: '', patientName: '', procedure: '', amount: '', hospitalName: '', date: '' })
  }

  const handleUpdateStatus = (claimId, status) => {
    const updated = db.updateInsuranceClaim(claimId, { status })
    setClaims(claims.map(c => c.id === claimId ? updated : c))
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="text-green-600" size={20} />
      case 'rejected': return <XCircle className="text-red-600" size={20} />
      default: return <Clock className="text-yellow-600" size={20} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-yellow-100 text-yellow-700'
    }
  }

  const pendingClaims = claims.filter(c => c.status === 'pending')
  const processedClaims = claims.filter(c => c.status !== 'pending')

  return (
    <Layout title="Insurance Claims">
      <div className="space-y-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add New Claim
        </button>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card hover={false}>
                <form onSubmit={handleAddClaim} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Policy Number</label>
                    <input
                      type="text"
                      value={newClaim.policyNumber}
                      onChange={(e) => setNewClaim({ ...newClaim, policyNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="HC-2024-001"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                    <input
                      type="text"
                      value={newClaim.patientName}
                      onChange={(e) => setNewClaim({ ...newClaim, patientName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Procedure/Treatment</label>
                    <input
                      type="text"
                      value={newClaim.procedure}
                      onChange={(e) => setNewClaim({ ...newClaim, procedure: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Claim Amount ($)</label>
                    <input
                      type="number"
                      value={newClaim.amount}
                      onChange={(e) => setNewClaim({ ...newClaim, amount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
                    <input
                      type="text"
                      value={newClaim.hospitalName}
                      onChange={(e) => setNewClaim({ ...newClaim, hospitalName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Date</label>
                    <input
                      type="date"
                      value={newClaim.date}
                      onChange={(e) => setNewClaim({ ...newClaim, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Submit Claim
                  </button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Claims</h2>
          <div className="space-y-4">
            {pendingClaims.length === 0 ? (
              <Card hover={false}>
                <div className="text-center py-8 text-gray-500">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No pending claims.</p>
                </div>
              </Card>
            ) : (
              pendingClaims.map((claim) => (
                <Card key={claim.id} hover={false}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Claim #{claim.id}</h3>
                        <p className="text-sm text-gray-600">{claim.patientName}</p>
                        <p className="text-xs text-gray-500 mt-1">Policy: {claim.policyNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-bold text-gray-800">
                        <DollarSign size={18} />
                        {claim.amount?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">{new Date(claim.date).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700"><strong>Procedure:</strong> {claim.procedure}</p>
                    <p className="text-sm text-gray-700"><strong>Hospital:</strong> {claim.hospitalName}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdateStatus(claim.id, 'approved')}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(claim.id, 'rejected')}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {processedClaims.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Processed Claims</h2>
            <div className="space-y-4">
              {processedClaims.map((claim) => (
                <Card key={claim.id} hover={false} className="opacity-75">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getStatusIcon(claim.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Claim #{claim.id}</h3>
                        <p className="text-sm text-gray-600">{claim.patientName}</p>
                        <p className="text-sm text-gray-600">${claim.amount?.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
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

export default Claims
