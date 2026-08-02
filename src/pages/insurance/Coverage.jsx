import { useState } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/Card'
import { Shield, Search, CheckCircle, XCircle, DollarSign } from 'lucide-react'
import { db } from '../../services/database'

function Coverage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const policies = db.getAllInsurancePolicies()

  const handleSearch = (e) => {
    e.preventDefault()
    const policy = policies.find(p => 
      p.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userId === searchQuery
    )
    
    if (policy) {
      const user = db.findUserById(policy.userId)
      setSearchResult({ ...policy, userName: user?.name })
    } else {
      setSearchResult({ notFound: true })
    }
  }

  const getCoverageStatus = (policy) => {
    const endDate = new Date(policy.endDate)
    const today = new Date()
    return endDate > today ? 'active' : 'expired'
  }

  return (
    <Layout title="Coverage Verification">
      <div className="space-y-6">
        <Card hover={false}>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Policy Number or Patient ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter policy number or patient ID"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Search size={20} />
                  Search
                </button>
              </div>
            </div>
          </form>
        </Card>

        {searchResult && (
          <Card hover={false}>
            {searchResult.notFound ? (
              <div className="text-center py-8">
                <XCircle className="text-red-600 mx-auto mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Policy Found</h3>
                <p className="text-gray-600">No matching policy found for the search query.</p>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{searchResult.userName}</h3>
                      <p className="text-sm text-gray-600">Policy: {searchResult.policyNumber}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    getCoverageStatus(searchResult) === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {getCoverageStatus(searchResult)}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Coverage Type</div>
                    <div className="font-semibold text-gray-800">{searchResult.coverageType}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Coverage Amount</div>
                    <div className="font-semibold text-gray-800 flex items-center gap-1">
                      <DollarSign size={18} />
                      {searchResult.coverageAmount?.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Start Date</div>
                    <div className="font-semibold text-gray-800">
                      {new Date(searchResult.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">End Date</div>
                    <div className="font-semibold text-gray-800">
                      {new Date(searchResult.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Coverage Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-green-600" size={16} />
                      <span className="text-gray-700">Hospitalization covered</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-green-600" size={16} />
                      <span className="text-gray-700">Outpatient procedures covered</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-green-600" size={16} />
                      <span className="text-gray-700">Emergency services covered</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-green-600" size={16} />
                      <span className="text-gray-700">Prescription medications covered</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Active Policies</h2>
          <div className="space-y-4">
            {policies.length === 0 ? (
              <Card hover={false}>
                <div className="text-center py-8 text-gray-500">
                  <Shield size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No policies found.</p>
                </div>
              </Card>
            ) : (
              policies.map((policy) => {
                const user = db.findUserById(policy.userId)
                return (
                  <Card key={policy.id} hover={false}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Shield className="text-purple-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{user?.name}</h3>
                          <p className="text-sm text-gray-600">{policy.policyNumber}</p>
                          <p className="text-sm text-gray-600">{policy.coverageType}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800 flex items-center gap-1">
                          <DollarSign size={16} />
                          {policy.coverageAmount?.toLocaleString()}
                        </div>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                          getCoverageStatus(policy) === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {getCoverageStatus(policy)}
                        </span>
                      </div>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Coverage
