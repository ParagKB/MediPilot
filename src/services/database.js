// In-memory database simulation
class Database {
  constructor() {
    this.users = []
    this.medicalReports = []
    this.appointmentRequests = []
    this.appointments = []
    this.medications = []
    this.healthMetrics = []
    this.mealPlans = []
    this.hospitals = []
    this.insuranceProviders = []
    this.insurancePolicies = []
    this.insuranceClaims = []
    this.dietChats = []
    
    this.initializeData()
  }

  initializeData() {
    // Create demo users
    this.users = [
      {
        id: '1',
        email: 'patient@demo.com',
        password: 'demo123',
        name: 'John Doe',
        role: 'patient',
        preferred_interface: 'patient',
        phone: '+1234567890',
        dateOfBirth: '1990-05-15',
        address: '123 Main St, City, State'
      },
      {
        id: '2',
        email: 'hospital@demo.com',
        password: 'demo123',
        name: 'City Hospital',
        role: 'hospital',
        preferred_interface: 'hospital',
        phone: '+1234567891',
        hospitalId: 'h1'
      },
      {
        id: '3',
        email: 'insurance@demo.com',
        password: 'demo123',
        name: 'HealthCare Insurance',
        role: 'insurance',
        preferred_interface: 'insurance',
        phone: '+1234567892',
        providerId: 'ip1'
      }
    ]

    // Create demo hospitals
    this.hospitals = [
      {
        id: 'h1',
        name: 'City General Hospital',
        address: '456 Hospital Ave, City, State',
        phone: '+1234567891',
        specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
        availableSlots: []
      },
      {
        id: 'h2',
        name: 'Metro Medical Center',
        address: '789 Medical Blvd, City, State',
        phone: '+1234567893',
        specialties: ['Pediatrics', 'Oncology', 'Surgery'],
        availableSlots: []
      }
    ]

    // Create demo insurance providers
    this.insuranceProviders = [
      {
        id: 'ip1',
        name: 'HealthCare Insurance Co.',
        phone: '+1234567892',
        email: 'contact@healthcare.com',
        coverageTypes: ['Basic', 'Premium', 'Family']
      }
    ]

    // Create demo insurance policy
    this.insurancePolicies = [
      {
        id: 'pol1',
        userId: '1',
        providerId: 'ip1',
        policyNumber: 'HC-2024-001',
        coverageType: 'Premium',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        coverageAmount: 500000,
        status: 'active'
      }
    ]
  }

  // User operations
  findUserByEmail(email) {
    return this.users.find(u => u.email === email)
  }

  findUserById(id) {
    return this.users.find(u => u.id === id)
  }

  updateUser(id, updates) {
    const index = this.users.findIndex(u => u.id === id)
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates }
      return this.users[index]
    }
    return null
  }

  // Medical Reports
  createMedicalReport(report) {
    const newReport = {
      id: `mr${this.medicalReports.length + 1}`,
      createdAt: new Date().toISOString(),
      ...report
    }
    this.medicalReports.push(newReport)
    return newReport
  }

  getMedicalReportsByUserId(userId) {
    return this.medicalReports.filter(r => r.userId === userId)
  }

  // Appointment Requests
  createAppointmentRequest(request) {
    const newRequest = {
      id: `ar${this.appointmentRequests.length + 1}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...request
    }
    this.appointmentRequests.push(newRequest)
    return newRequest
  }

  getAppointmentRequestsByUserId(userId) {
    return this.appointmentRequests.filter(r => r.userId === userId)
  }

  getAppointmentRequestsByHospitalId(hospitalId) {
    return this.appointmentRequests.filter(r => r.hospitalId === hospitalId)
  }

  updateAppointmentRequest(id, updates) {
    const index = this.appointmentRequests.findIndex(r => r.id === id)
    if (index !== -1) {
      this.appointmentRequests[index] = { ...this.appointmentRequests[index], ...updates }
      return this.appointmentRequests[index]
    }
    return null
  }

  // Appointments
  createAppointment(appointment) {
    const newAppointment = {
      id: `apt${this.appointments.length + 1}`,
      createdAt: new Date().toISOString(),
      ...appointment
    }
    this.appointments.push(newAppointment)
    return newAppointment
  }

  getAppointmentsByUserId(userId) {
    return this.appointments.filter(a => a.userId === userId)
  }

  // Medications
  createMedication(medication) {
    const newMedication = {
      id: `med${this.medications.length + 1}`,
      createdAt: new Date().toISOString(),
      ...medication
    }
    this.medications.push(newMedication)
    return newMedication
  }

  getMedicationsByUserId(userId) {
    return this.medications.filter(m => m.userId === userId)
  }

  updateMedication(id, updates) {
    const index = this.medications.findIndex(m => m.id === id)
    if (index !== -1) {
      this.medications[index] = { ...this.medications[index], ...updates }
      return this.medications[index]
    }
    return null
  }

  // Health Metrics
  createHealthMetric(metric) {
    const newMetric = {
      id: `hm${this.healthMetrics.length + 1}`,
      createdAt: new Date().toISOString(),
      ...metric
    }
    this.healthMetrics.push(newMetric)
    return newMetric
  }

  getHealthMetricsByUserId(userId) {
    return this.healthMetrics.filter(m => m.userId === userId)
  }

  // Meal Plans
  createMealPlan(plan) {
    const newPlan = {
      id: `mp${this.mealPlans.length + 1}`,
      createdAt: new Date().toISOString(),
      ...plan
    }
    this.mealPlans.push(newPlan)
    return newPlan
  }

  getMealPlansByUserId(userId) {
    return this.mealPlans.filter(p => p.userId === userId)
  }

  // Hospitals
  getAllHospitals() {
    return this.hospitals
  }

  getHospitalById(id) {
    return this.hospitals.find(h => h.id === id)
  }

  // Insurance Claims
  createInsuranceClaim(claim) {
    const newClaim = {
      id: `ic${this.insuranceClaims.length + 1}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...claim
    }
    this.insuranceClaims.push(newClaim)
    return newClaim
  }

  getAllInsuranceClaims() {
    return this.insuranceClaims
  }

  updateInsuranceClaim(id, updates) {
    const index = this.insuranceClaims.findIndex(c => c.id === id)
    if (index !== -1) {
      this.insuranceClaims[index] = { ...this.insuranceClaims[index], ...updates }
      return this.insuranceClaims[index]
    }
    return null
  }

  // Insurance Policies
  getInsurancePolicyByUserId(userId) {
    return this.insurancePolicies.find(p => p.userId === userId)
  }

  getAllInsurancePolicies() {
    return this.insurancePolicies
  }
}

export const db = new Database()
