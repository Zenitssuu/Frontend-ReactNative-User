# TellYouDoc App Workflow Documentation

## Table of Contents

1. [App Overview](#app-overview)
2. [Core User Journeys](#core-user-journeys)
3. [Screen-by-Screen Flow](#screen-by-screen-flow)
4. [Data Flow](#data-flow)
5. [Key Components](#key-components)
6. [Integration Points](#integration-points)

## App Overview

TellYouDoc is a mobile application designed to streamline the doctor-patient communication process. The app allows users to:

- Connect with doctors via QR code scanning or saved list
- Record symptoms before appointments
- Book appointments with doctors
- Upload medical documents after appointments
- Add follow-up information post-appointment
- Track appointment history and documents

The app follows a structured flow from doctor connection through appointment booking and follow-up, with symptoms recording integrated at multiple points.

## Core User Journeys

The app supports three primary user journeys:

### Journey 1: Doctor-First Approach

```
Dashboard → My Doctors/Scan QR → Select Doctor → 
Book Appointment → Record Symptoms → Complete Booking → 
(Later) Upload Documents → Visit Details / Follow-Up
```

**Use case**: User has a specific doctor they want to see first, then records symptoms as part of booking.

### Journey 2: Symptoms-First Approach

```
Dashboard → Record Symptoms → Select Doctor → 
Book Appointment (with symptoms) → Complete Booking → 
(Later) Upload Documents → Visit Details / Follow-Up
```

**Use case**: User is experiencing symptoms and wants to record them first before choosing a doctor.

### Journey 3: Add Symptoms to Existing Appointment

```
Dashboard → Record Symptoms → "Add to Existing Appointment" → 
Select Appointment → Add Symptoms → Dashboard
```

**Use case**: User has an upcoming appointment and wants to add symptom information beforehand.

## Screen-by-Screen Flow

### 1. Dashboard Screen (`DashboardScreen.js`)

**Purpose**: Central hub showing summary of appointments and quick actions.

**Features**:

- Patient workflow visualization (steps 1-4)
- Quick action buttons for key functions
- Upcoming appointments list
- Recent visit history
- Doctor count summary

**Navigation Options**:

- My Doctors: View saved doctor list
- Scan QR: Scan doctor QR code
- Record Symptoms: Navigate to symptom survey
- Profile: User profile information
- Visit Details: View specific appointment details

**Special Features**:

- Appointment selection modal when adding symptoms to existing appointments
- Comprehensive appointment listing with symptom status indicators

### 2. My Doctors Screen (`MyDoctorsScreen.js`)

**Purpose**: Shows list of saved doctors.

**Features**:

- Search functionality for doctors
- Filter by specialty type
- Doctor cards with detailed information
- Favorite doctor functionality
- Quick add new doctor via QR

**Navigation Options**:

- Select Doctor → Book Appointment
- Scan QR → Add New Doctor
- Back to Dashboard

### 3. Scan QR Screen (`ScanQRScreen.js`)

**Purpose**: Scans QR codes to add new doctors.

**Features**:

- Camera integration for QR scanning
- QR code processing
- Doctor info display
- Torch control

**Post-Scan Options**:

- Record Symptoms: Navigate to survey with selected doctor
- Book Appointment: Direct booking with scanned doctor
- Add to Saved List: Save doctor for later
- Cancel: Return to previous screen

### 4. Survey Details Screen (`SurveyDetailsScreen.js`)

**Purpose**: Records patient symptoms across multiple categories.

**Features**:

- Categorized symptom sections (body parts, general symptoms, etc.)
- Multilingual support (English, Bengali, Assamese)
- Summary view of recorded symptoms
- Question branching based on previous answers

**Navigation Options After Completion**:

- Book New Appointment: Goes to BookAppointment with recorded symptoms
- Add to Existing Appointment: Shows appointment selection on Dashboard
- Just Save: Returns to previous screen, saving data
- When coming from BookAppointmentScreen: Returns to booking with symptoms

### 5. Question Screen (`QuestionScreen.js`)

**Purpose**: Individual symptom questions within the survey.

**Features**:

- Dynamic question rendering based on category
- Multiple input types (text, selection, checkboxes)
- Conditional questions based on previous answers
- Multilingual support

### 6. Book Appointment Screen (`BookAppointmentScreen.js`)

**Purpose**: Books appointments with selected doctor.

**Features**:

- Doctor information display
- Date selection calendar
- Time slot selection
- Symptom recording integration
- Appointment summary

**Symptom Recording Integration**:

- When coming directly from doctor selection:
  - Shows "Record Symptoms" button alongside reason input
  - Allows direct text input for simple reason
- When coming from symptom survey:
  - Shows "Symptoms Recorded" indicator
  - Provides "Edit" option to return to survey
  - Maintains selected date/time when navigating

### 7. Upload Document Screen (`UploadDocumentScreen.js`)

**Purpose**: Uploads documents related to an appointment.

**Features**:

- Document type selection
- Description input
- Multiple upload methods (camera, gallery, files)
- Preview of selected documents

**Navigation Options**:

- Upload Another: Clear form for additional uploads
- Done: Return to Dashboard

### 8. Visit Details Screen (`VisitDetailsScreen.js`)

**Purpose**: Shows comprehensive appointment information.

**Features**:

- Doctor information
- Appointment details
- Symptom data display (expandable)
- Uploaded documents list
- Follow-up information (if exists)

**Actions**:

- Add Follow-Up: For completed appointments
- Upload Documents: Add documents to appointment
- View detailed symptom information

### 9. Follow-Up Screen (`FollowUpScreen.js`)

**Purpose**: Adds follow-up information to completed appointments.

**Features**:

- Original appointment summary
- Text input for follow-up details
- Options to upload additional documents

## Data Flow

### Symptom Data Flow

```
SurveyDetailsScreen → (record symptoms) →
↓
Options:
   ├── → BookAppointmentScreen (for new appointment)
   │      ↓
   │      → (create appointment with symptoms) → Storage
   │
   └── → DashboardScreen (for existing appointment)
          ↓
          → (update appointment with symptoms) → Storage
```

### Doctor Data Flow

```
ScanQRScreen → (scan QR) → process doctor info →
↓
Options:
   ├── → Add to saved doctors list → Storage
   ├── → BookAppointmentScreen (direct booking)
   └── → SurveyDetailsScreen (record symptoms first)
```

### Appointment Data Flow

```
BookAppointmentScreen → create appointment → Storage →
↓
Dashboard display
↓
VisitDetailsScreen (view details)
↓
Options:
   ├── → UploadDocumentScreen → add documents → Storage
   └── → FollowUpScreen → add follow-up info → Storage
```

## Key Components

### UIComponents.js

Contains reusable UI components:

- `PrimaryButton`, `SecondaryButton`, `OutlineButton`
- `LoadingSpinner`
- `DoctorCard`: Displays doctor information with favorite toggle
- `AppointmentCard`: Displays appointment summary
- `SectionHeader`: Standardized section headers
- `EmptyState`: Placeholder for empty lists

### AnimatedDropDown.js

Provides a custom dropdown component with animation effects, used for language selection.

### QuestionCard.js

Renders individual questions in the symptom survey with various input types.

## Integration Points

### Storage Integration

The app uses AsyncStorage through utility functions in `storage.js`:

- `getSavedDoctors()`, `addDoctor()`, `removeDoctor()`
- `getAppointments()`, `addAppointment()`, `updateAppointment()`
- `getDocuments()`, `addDocument()`, `getDocumentsByAppointment()`
- `addSurvey()`, `getSurveysByAppointment()`

### QR Integration

QR scanning uses Expo's camera libraries:

- `CameraView` from 'expo-camera'
- `handleBarCodeScanned()` processes scanned data

### Image/Document Upload

Document upload uses Expo libraries:

- `ImagePicker` for gallery selection and camera capture
- `DocumentPicker` for file selection

## Special Considerations

### Symptom Data Structure

Symptom data is organized in nested categories:

```javascript
surveyDetails = {
  generalSymptoms: {
    fever: {
      feverTemperatureMeasure: "38.5°C",
      // other fever-related data
    },
    // other general symptoms
  },
  bodyParts: {
    // body part symptoms
  },
  // other symptom categories
}
```

### Multi-language Support

The app supports multiple languages through translation objects in:
- `translatedSymptomSection.js`: Section/category translations
- `questionTranslations.js`: Question text translations

### Navigation Parameters

Critical parameters are passed between screens:
- Doctor information: Passed from MyDoctors/ScanQR to BookAppointment/Survey
- Symptom data: Passed from Survey to BookAppointment or Dashboard
- Appointment ID: Used to fetch/update specific appointment data

## Development Guidance

When updating the code, consider these key points:

1. **Multiple Entry Points**: Users can start journeys from different screens - maintain consistency
2. **Data Persistence**: Ensure symptom data is properly saved with appointments
3. **Navigation Flow**: Preserve logical progression between screens
4. **UI State Management**: Handle different UI states based on previous user actions
5. **Error Handling**: Implement proper validation and error handling for network/storage operations

The app follows a modular architecture with clear separation between screens, components, and utilities, making it maintainable and extendable. 

## developer notes:

- development build from eas:
  eas build --profile development --platform android
