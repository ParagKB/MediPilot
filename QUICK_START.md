# MediPilot Nexus - Quick Start Guide

## Installation & Setup

### Step 1: Install Dependencies
Open your terminal in the project directory and run:
```bash
npm install
```

This will install all required packages including:
- React & React DOM
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- React Router DOM (navigation)
- TanStack Query (data fetching)
- Lucide React (icons)

### Step 2: Start Development Server
```bash
npm run dev
```

The application will start at `http://localhost:3000` and automatically open in your browser.

## Using the Application

### Login
When you first open the application, you'll see the login page with three demo accounts:

1. **Patient Account** - `patient@demo.com` / `demo123`
2. **Hospital Account** - `hospital@demo.com` / `demo123`
3. **Insurance Account** - `insurance@demo.com` / `demo123`

Click on any demo account card to auto-fill the credentials, then click "Login".

### Home Page - Interface Selection
After logging in, you'll see the Home page with three interface options:
- **Patient Portal** - For patients to manage their health
- **Hospital Dashboard** - For hospitals to manage appointments
- **Insurance Portal** - For insurance providers to process claims

Click on any interface to enter that portal.

## Patient Interface Features

### 1. Dashboard
- View quick stats (reports, appointments, medications, health metrics)
- Access quick actions
- See health overview

### 2. Medical Reports
- Upload new medical reports
- AI automatically analyzes reports
- View findings and recommendations
- Auto-appointment booking if follow-up needed

**Try it:**
1. Click "Upload New Report"
2. Fill in: Title (e.g., "Blood Test"), Type (Blood Test), Upload any file
3. Click "Upload Report"
4. Watch AI analyze and provide recommendations

### 3. Appointments
- Request new appointments
- View pending requests
- See confirmed appointments

**Try it:**
1. Click "Request New Appointment"
2. Select hospital, specialty, date
3. Enter reason for visit
4. Submit request

### 4. Medications
- Add medications
- Track active medications
- Mark medications as completed

**Try it:**
1. Click "Add Medication"
2. Enter medication details (name, dosage, frequency)
3. Set start and end dates
4. Add any special instructions

### 5. Health Metrics
- Track vital signs
- View history by metric type
- Monitor trends

**Try it:**
1. Click "Add Health Metric"
2. Select type (Blood Pressure, Blood Sugar, etc.)
3. Enter value
4. Add notes if needed

### 6. Meal Plans
- Generate AI-powered meal plans
- View personalized meal schedules
- Track nutrition goals

**Try it:**
1. Click "Generate AI Meal Plan"
2. Select health goal and diet type
3. Enter daily calorie target
4. Generate plan

## Hospital Interface Features

### 1. Dashboard
- View hospital information
- See pending requests count
- Quick access to all features

### 2. Appointment Requests
- View all pending requests
- See patient details
- Accept or reject requests

**Try it:**
1. First, login as patient and create an appointment request
2. Logout and login as hospital
3. Go to "Appointment Requests"
4. Click "Accept" or "Reject" on pending requests

### 3. Appointment Slots
- Create available time slots
- Manage doctor schedules
- Set specialty and timing

**Try it:**
1. Click "Add New Slot"
2. Select date, time, specialty
3. Enter doctor name
4. Submit

## Insurance Interface Features

### 1. Dashboard
- View claims statistics
- See active policies
- Quick access to features

### 2. Claims Processing
- Add new claims
- Review pending claims
- Approve or reject claims

**Try it:**
1. Click "Add New Claim"
2. Enter policy number, patient name
3. Add procedure details and amount
4. Submit claim
5. Review and approve/reject

### 3. Coverage Verification
- Search policies by number or patient ID
- View coverage details
- Check policy status

**Try it:**
1. Enter policy number: `HC-2024-001`
2. Click "Search"
3. View complete coverage details

## Navigation

### Bottom Navigation Bar
Available on all pages (except Home and Login):
- **Dashboard** - Return to main dashboard
- **Feature Icons** - Quick access to specific features
- **Switch** - Return to Home page to change interface

### Logout
Click the "Logout" button in the top-right corner of any page.

## Key Workflows

### Complete Patient Journey
1. Login as patient
2. Upload a medical report
3. AI analyzes and recommends follow-up
4. Request appointment at hospital
5. Track medications
6. Monitor health metrics
7. Generate meal plan

### Hospital Workflow
1. Login as hospital
2. View pending appointment requests
3. Accept/reject requests
4. Create available time slots
5. Manage patient appointments

### Insurance Workflow
1. Login as insurance provider
2. Review pending claims
3. Verify patient coverage
4. Approve/reject claims
5. Monitor policy status

## Tips

- **Interface Switching**: Use the "Switch" button in bottom nav to quickly change between interfaces
- **Demo Data**: The app comes with pre-populated demo data for testing
- **Responsive Design**: Try the app on different screen sizes - it's fully responsive
- **Animations**: Notice the smooth transitions and animations throughout the app

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, Vite will automatically use the next available port (3001, 3002, etc.)

### Dependencies Not Installing
Try:
```bash
npm cache clean --force
npm install
```

### Build Issues
Clear the cache and rebuild:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## Next Steps

1. Explore all three interfaces
2. Test the complete workflows
3. Customize the styling in `tailwind.config.js`
4. Add more features or modify existing ones
5. Integrate with a real backend (Base44 or custom API)

## Support

For issues or questions:
- Check the README.md for detailed documentation
- Review the code comments in source files
- Examine the database structure in `src/services/database.js`

Enjoy using MediPilot Nexus! 🏥💊🩺
