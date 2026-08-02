# MediPilot Nexus - Database Schema

## Overview
The application uses an in-memory database simulation located in `src/services/database.js`. This document describes all entities and their relationships.

## Entities

### 1. User
Stores user account information for all user types (patients, hospitals, insurance providers).

```javascript
{
  id: string,                    // Unique identifier
  email: string,                 // Login email
  password: string,              // Password (in production, should be hashed)
  name: string,                  // User/Organization name
  role: string,                  // 'patient' | 'hospital' | 'insurance'
  preferred_interface: string,   // Last selected interface
  phone: string,                 // Contact phone
  dateOfBirth: string,          // Patient only
  address: string,              // Physical address
  hospitalId: string,           // Hospital users only
  providerId: string            // Insurance users only
}
```

**Demo Users:**
- Patient: `patient@demo.com` / `demo123`
- Hospital: `hospital@demo.com` / `demo123`
- Insurance: `insurance@demo.com` / `demo123`

### 2. MedicalReport
Patient medical documents with AI analysis.

```javascript
{
  id: string,                    // Unique identifier
  userId: string,                // Reference to User
  title: string,                 // Report title
  type: string,                  // 'blood_test' | 'xray' | 'mri' | 'ct_scan' | 'general'
  fileName: string,              // Uploaded file name
  createdAt: string,            // ISO timestamp
  status: string,               // 'analyzed' | 'pending'
  aiAnalysis: {
    findings: string[],          // Key findings from analysis
    severity: string,            // 'none' | 'low' | 'medium' | 'high'
    recommendations: string[],   // AI recommendations
    followUpNeeded: boolean,     // Whether follow-up required
    suggestedSpecialty: string   // Recommended specialty if follow-up needed
  }
}
```

### 3. AppointmentRequest
Patient-initiated appointment requests to hospitals.

```javascript
{
  id: string,                    // Unique identifier
  userId: string,                // Reference to User (patient)
  hospitalId: string,            // Reference to Hospital
  specialty: string,             // Medical specialty
  reason: string,                // Reason for appointment
  preferredDate: string,         // ISO date string
  status: string,                // 'pending' | 'confirmed' | 'rejected'
  createdAt: string             // ISO timestamp
}
```

### 4. Appointment
Confirmed appointments between patients and hospitals.

```javascript
{
  id: string,                    // Unique identifier
  userId: string,                // Reference to User (patient)
  hospitalId: string,            // Reference to Hospital
  hospitalName: string,          // Hospital name for display
  specialty: string,             // Medical specialty
  date: string,                  // ISO date string
  time: string,                  // Time string (e.g., "10:00 AM")
  status: string,                // 'confirmed' | 'completed' | 'cancelled'
  createdAt: string             // ISO timestamp
}
```

### 5. Medication
Patient medication tracking and schedules.

```javascript
{
  id: string,                    // Unique identifier
  userId: string,                // Reference to User (patient)
  name: string,                  // Medication name
  dosage: string,                // Dosage amount (e.g., "100mg")
  frequency: string,             // 'Once daily' | 'Twice daily' | 'Three times daily' | 'As needed'
  startDate: string,             // ISO date string
  endDate: string,               // ISO date string (optional)
  instructions: string,          // Special instructions
  status: string,                // 'active' | 'completed'
  reminders: array,              // Reminder settings
  createdAt: string             // ISO timestamp
}
```

### 6. HealthMetric
Patient health measurements and vital signs.

```javascript
{
  id: string,                    // Unique identifier
  userId: string,                // Reference to User (patient)
  type: string,                  // 'blood_pressure' | 'blood_sugar' | 'weight' | 'heart_rate' | 'temperature'
  label: string,                 // Display label
  value: string,                 // Measurement value
  unit: string,                  // Unit of measurement
  notes: string,                 // Optional notes
  createdAt: string             // ISO timestamp
}
```

### 7. MealPlan
AI-generated personalized meal plans for patients.

```javascript
{
  id: string,                    // Unique identifier
  userId: string,                // Reference to User (patient)
  name: string,                  // Plan name
  duration: string,              // Duration (e.g., "7 days")
  calories: number,              // Daily calorie target
  preferences: {
    goal: string,                // 'weight_loss' | 'muscle_gain' | 'maintenance' | 'heart_health'
    dietType: string,            // 'balanced' | 'vegetarian' | 'vegan' | 'keto' | 'mediterranean'
    calories: string             // Target calories
  },
  meals: [
    {
      day: string,               // Day name
      breakfast: string,         // Breakfast meal
      lunch: string,             // Lunch meal
      dinner: string,            // Dinner meal
      snacks: string[]           // Snack items
    }
  ],
  createdAt: string             // ISO timestamp
}
```

### 8. Hospital
Hospital information and available services.

```javascript
{
  id: string,                    // Unique identifier
  name: string,                  // Hospital name
  address: string,               // Physical address
  phone: string,                 // Contact phone
  specialties: string[],         // Available specialties
  availableSlots: array          // Available appointment slots
}
```

**Demo Hospitals:**
- City General Hospital (Cardiology, Neurology, Orthopedics)
- Metro Medical Center (Pediatrics, Oncology, Surgery)

### 9. InsuranceProvider
Insurance company information.

```javascript
{
  id: string,                    // Unique identifier
  name: string,                  // Provider name
  phone: string,                 // Contact phone
  email: string,                 // Contact email
  coverageTypes: string[]        // Available coverage types
}
```

### 10. InsurancePolicy
Patient insurance policy details.

```javascript
{
  id: string,                    // Unique identifier
  userId: string,                // Reference to User (patient)
  providerId: string,            // Reference to InsuranceProvider
  policyNumber: string,          // Policy number
  coverageType: string,          // 'Basic' | 'Premium' | 'Family'
  startDate: string,             // ISO date string
  endDate: string,               // ISO date string
  coverageAmount: number,        // Maximum coverage amount
  status: string                 // 'active' | 'expired'
}
```

**Demo Policy:**
- Policy Number: `HC-2024-001`
- Coverage: Premium ($500,000)
- Patient: John Doe

### 11. InsuranceClaim
Insurance claim submissions and processing.

```javascript
{
  id: string,                    // Unique identifier
  policyNumber: string,          // Reference to policy
  patientName: string,           // Patient name
  procedure: string,             // Procedure/treatment description
  amount: number,                // Claim amount
  hospitalName: string,          // Hospital name
  date: string,                  // Service date (ISO string)
  status: string,                // 'pending' | 'approved' | 'rejected'
  createdAt: string             // ISO timestamp
}
```

### 12. DietChat
Conversation logs with AI dietitian (future feature).

```javascript
{
  id: string,                    // Unique identifier
  userId: string,                // Reference to User (patient)
  messages: array,               // Chat messages
  createdAt: string             // ISO timestamp
}
```

## Relationships

### User Relationships
- **User (Patient)** → has many → **MedicalReport**
- **User (Patient)** → has many → **AppointmentRequest**
- **User (Patient)** → has many → **Appointment**
- **User (Patient)** → has many → **Medication**
- **User (Patient)** → has many → **HealthMetric**
- **User (Patient)** → has many → **MealPlan**
- **User (Patient)** → has one → **InsurancePolicy**
- **User (Hospital)** → belongs to → **Hospital**
- **User (Insurance)** → belongs to → **InsuranceProvider**

### Hospital Relationships
- **Hospital** → has many → **AppointmentRequest**
- **Hospital** → has many → **Appointment**

### Insurance Relationships
- **InsuranceProvider** → has many → **InsurancePolicy**
- **InsurancePolicy** → has many → **InsuranceClaim**

## Database Operations

### Available Methods

#### User Operations
```javascript
db.findUserByEmail(email)           // Find user by email
db.findUserById(id)                 // Find user by ID
db.updateUser(id, updates)          // Update user data
```

#### Medical Reports
```javascript
db.createMedicalReport(report)                    // Create new report
db.getMedicalReportsByUserId(userId)             // Get user's reports
```

#### Appointment Requests
```javascript
db.createAppointmentRequest(request)              // Create new request
db.getAppointmentRequestsByUserId(userId)        // Get user's requests
db.getAppointmentRequestsByHospitalId(hospitalId) // Get hospital's requests
db.updateAppointmentRequest(id, updates)         // Update request
```

#### Appointments
```javascript
db.createAppointment(appointment)                 // Create appointment
db.getAppointmentsByUserId(userId)               // Get user's appointments
```

#### Medications
```javascript
db.createMedication(medication)                   // Create medication
db.getMedicationsByUserId(userId)                // Get user's medications
db.updateMedication(id, updates)                 // Update medication
```

#### Health Metrics
```javascript
db.createHealthMetric(metric)                     // Create metric
db.getHealthMetricsByUserId(userId)              // Get user's metrics
```

#### Meal Plans
```javascript
db.createMealPlan(plan)                          // Create meal plan
db.getMealPlansByUserId(userId)                  // Get user's plans
```

#### Hospitals
```javascript
db.getAllHospitals()                             // Get all hospitals
db.getHospitalById(id)                           // Get hospital by ID
```

#### Insurance Claims
```javascript
db.createInsuranceClaim(claim)                   // Create claim
db.getAllInsuranceClaims()                       // Get all claims
db.updateInsuranceClaim(id, updates)             // Update claim
```

#### Insurance Policies
```javascript
db.getInsurancePolicyByUserId(userId)            // Get user's policy
db.getAllInsurancePolicies()                     // Get all policies
```

## Data Persistence

**Current Implementation:**
- In-memory storage (data resets on page refresh)
- User session stored in localStorage

**For Production:**
- Replace with real database (PostgreSQL, MongoDB, etc.)
- Implement proper authentication with JWT
- Add data validation and sanitization
- Implement proper error handling
- Add database migrations
- Set up proper indexes for performance

## Security Considerations

**Current Demo:**
- Passwords stored in plain text (NEVER do this in production!)
- No input validation
- No SQL injection protection
- No rate limiting

**Production Requirements:**
- Hash passwords with bcrypt or similar
- Implement JWT authentication
- Add input validation and sanitization
- Use parameterized queries
- Implement rate limiting
- Add CORS protection
- Use HTTPS only
- Implement proper authorization checks

## Migration to Real Database

To migrate to a real database:

1. Choose a database (PostgreSQL recommended)
2. Create migration files for each entity
3. Replace `src/services/database.js` with real database client
4. Implement proper ORM (Prisma, TypeORM, etc.)
5. Add connection pooling
6. Implement transactions for complex operations
7. Add database backups
8. Set up monitoring and logging

## Example Migration (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  preferred_interface VARCHAR(50),
  phone VARCHAR(50),
  date_of_birth DATE,
  address TEXT,
  hospital_id UUID REFERENCES hospitals(id),
  provider_id UUID REFERENCES insurance_providers(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

This schema provides a solid foundation for the MediPilot Nexus platform and can be easily extended with additional features.
