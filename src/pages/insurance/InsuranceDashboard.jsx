import Layout from '../../components/Layout'
import Card from '../../components/Card'
import { FileText, Shield, CheckCircle, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../services/database'

function InsuranceDashboard() {
  const navigate = useNavigate()
  
  const claims = db.getAllInsuranceClaims()
  const policies = db.getAllInsurancePolicies()
  const pendingClaims = claims.filter(c => c.status === 'pending')
  const approvedClaims = claims.filter(c => c.status === 'approved')

  const stats = [
    { icon: FileText, label: 'Total Claims', value: claims.length, color: 'text-blue-600', bg: 'bg-blue-100', path: '/insurance/claims' },
    { icon: Clock, label: 'Pending Claims', value: pendingClaims.length, color: 'text-yellow-600', bg: 'bg-yellow-100', path: '/insurance/claims' },
    { icon: CheckCircle, label: 'Approved Claims', value: approvedClaims.length, color: 'text-green-600', bg: 'bg-green-100', path: '/insurance/claims' },
    { icon: Shield, label: 'Active Policies', value: policies.length, color: 'text-purple-600', bg: 'bg-purple-100', path: '/insurance/coverage' },
  ]

  return (
    <Layout title="Insurance Dashboard">
      <div className="space-y-6">
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

        <Card hover={false}>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/insurance/claims')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
            >
              <FileText className="text-blue-600 mb-2" size={24} />
              <div className="font-semibold text-gray-800">Process Claims</div>
              <div className="text-sm text-gray-600">Review and process pending claims</div>
            </button>
            <button
              onClick={() => navigate('/insurance/coverage')}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors"
            >
              <Shield className="text-purple-600 mb-2" size={24} />
              <div className="font-semibold text-gray-800">Verify Coverage</div>
              <div className="text-sm text-gray-600">Check patient coverage details</div>
            </button>
          </div>
        </Card>

        {pendingClaims.length > 0 && (
          <Card hover={false}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Pending Claims</h3>
            <div className="space-y-3">
              {pendingClaims.slice(0, 3).map((claim) => (
                <div key={claim.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">Claim #{claim.id}</div>
                    <div className="text-sm text-gray-600">${claim.amount?.toLocaleString()}</div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    Pending
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/insurance/claims')}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Claims
            </button>
          </Card>
        )}
      </div>
    </Layout>
  )
}

export default InsuranceDashboard
