import { useState } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/Card'
import { FileText, Upload, Calendar, AlertCircle, CheckCircle, Loader, Phone, Bot, Sparkles } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../services/database'
import { aiAgent } from '../../services/aiAgent'
import { motion, AnimatePresence } from 'framer-motion'

function MedicalReports() {
  const { user } = useAuth()
  const [reports, setReports] = useState(db.getMedicalReportsByUserId(user.id))
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [calling, setCalling] = useState(false)
  const [callStatus, setCallStatus] = useState(null)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [newReport, setNewReport] = useState({ title: '', type: '', file: null })

  const handleUpload = async (e) => {
    e.preventDefault()
    setUploading(true)
    setAnalyzing(true)
    setCallStatus(null)

    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Get AI analysis using AI Agent
    const analysis = await aiAgent.analyzeReport(newReport)

    const report = db.createMedicalReport({
      userId: user.id,
      title: newReport.title,
      type: newReport.type,
      fileName: newReport.file?.name || 'report.pdf',
      aiAnalysis: analysis,
      status: 'analyzed'
    })

    setReports([report, ...reports])
    setUploading(false)
    setAnalyzing(false)

    // Auto-initiate call if follow-up needed
    if (analysis.followUpNeeded && analysis.suggestedSpecialty) {
      setCalling(true)
      setCallStatus('Initiating automated call to hospital...')
      
      try {
        const call = await aiAgent.initiateAutomatedCall(user.id, report.id, analysis)
        
        if (call) {
          setCallStatus(`✅ Call completed! Appointment request sent to ${db.getHospitalById(call.hospitalId).name}`)
          
          // Show success message for 5 seconds
          setTimeout(() => {
            setCalling(false)
            setCallStatus(null)
          }, 5000)
        } else {
          setCallStatus('No hospital available for required specialty')
          setTimeout(() => {
            setCalling(false)
            setCallStatus(null)
          }, 3000)
        }
      } catch (error) {
        setCallStatus('Call failed. Please try again.')
        setTimeout(() => {
          setCalling(false)
          setCallStatus(null)
        }, 3000)
      }
    }

    setShowUploadForm(false)
    setNewReport({ title: '', type: '', file: null })
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-orange-600 bg-orange-100'
      case 'low': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-green-600 bg-green-100'
    }
  }

  return (
    <Layout title="Medical Reports">
      <div className="space-y-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <Upload size={20} />
          Upload New Report
          <Sparkles size={16} />
        </motion.button>

        <AnimatePresence>
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card hover={false}>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Title</label>
                    <input
                      type="text"
                      value={newReport.title}
                      onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Blood Test Results"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                    <select
                      value={newReport.type}
                      onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="blood_test">Blood Test</option>
                      <option value="xray">X-Ray</option>
                      <option value="mri">MRI</option>
                      <option value="ct_scan">CT Scan</option>
                      <option value="general">General Checkup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                    <input
                      type="file"
                      onChange={(e) => setNewReport({ ...newReport, file: e.target.files[0] })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl transition-all"
                      accept=".pdf,.jpg,.png"
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={uploading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 shadow-md"
                  >
                    {uploading ? 'Uploading & Analyzing...' : 'Upload Report'}
                  </motion.button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {analyzing && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card hover={false} className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <div className="flex items-center gap-3 text-blue-600">
                <Loader className="animate-spin" size={24} />
                <span className="font-medium">AI is analyzing your report...</span>
              </div>
            </Card>
          </motion.div>
        )}

        {calling && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card hover={false} className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="flex-shrink-0"
                >
                  <Bot className="text-green-600" size={32} />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Phone className="text-green-600" size={20} />
                    AI Agent Active
                  </h3>
                  <p className="text-gray-700">{callStatus}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    />
                    <span className="text-sm text-gray-600">Processing...</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="space-y-4">
          {reports.length === 0 ? (
            <Card hover={false}>
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No medical reports yet. Upload your first report to get started.</p>
              </div>
            </Card>
          ) : (
            reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover={true}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center"
                      >
                        <FileText className="text-blue-600" size={24} />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{report.title}</h3>
                        <p className="text-sm text-gray-600">{report.type.replace('_', ' ').toUpperCase()}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar size={14} />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {report.aiAnalysis && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.aiAnalysis.severity)}`}
                      >
                        {report.aiAnalysis.severity === 'none' ? 'Normal' : report.aiAnalysis.severity.toUpperCase()}
                      </motion.span>
                    )}
                  </div>

                  {report.aiAnalysis && (
                    <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                          <AlertCircle size={16} />
                          Key Findings
                        </h4>
                        <ul className="space-y-1">
                          {report.aiAnalysis.findings.map((finding, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="text-sm text-gray-600 flex items-start gap-2"
                            >
                              <span className="text-blue-600 mt-1">•</span>
                              {finding}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                          <CheckCircle size={16} />
                          Recommendations
                        </h4>
                        <ul className="space-y-1">
                          {report.aiAnalysis.recommendations.map((rec, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="text-sm text-gray-600 flex items-start gap-2"
                            >
                              <span className="text-green-600 mt-1">•</span>
                              {rec}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      {report.aiAnalysis.followUpNeeded && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-3"
                        >
                          <p className="text-sm text-yellow-800 flex items-center gap-2">
                            <Sparkles size={16} />
                            <strong>Follow-up recommended:</strong> {report.aiAnalysis.suggestedSpecialty}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}

export default MedicalReports
