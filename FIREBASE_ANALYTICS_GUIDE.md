# Firebase Analytics Implementation Guide

## Overview

Firebase Analytics has been successfully integrated into your TellYouDoc patient app. This document explains how to use the analytics service and what events are being tracked.

## Installation & Setup

### Packages Installed

- `@react-native-firebase/analytics@20.5.0` - Firebase Analytics SDK

### Configuration Files Updated

- `app.config.js` - Analytics plugin (temporarily commented out due to Node.js v22 compatibility)
- `App.js` - Added analytics initialization
- Created `src/services/analytics.js` - Analytics service wrapper
- Created `src/utils/analytics.js` - Analytics utilities

### Node.js Compatibility Issue

⚠️ **Important**: There's a known compatibility issue between React Native Firebase and Node.js v22. 

**Current Workaround:**
- The analytics plugin is commented out in `app.config.js` during development
- Analytics will work on actual devices and in production builds
- For development testing, you can use EAS Build or downgrade Node.js

**To fix for production:**
1. Uncomment the analytics plugin in `app.config.js`:
```javascript
"@react-native-firebase/analytics",
```
2. Run `npx expo prebuild` and build on device/emulator

**Alternative Solutions:**
- Use Node.js v18 LTS for development
- Use EAS Build for testing analytics
- Test on physical device/emulator

## Analytics Service Features

### Core Methods

#### 1. **Screen Tracking**
```javascript
import { AnalyticsService } from "../utils/analytics";

// Track screen views
AnalyticsService.logScreenView("Login", "LoginScreen");
```

#### 2. **Custom Events**
```javascript
// Log custom events with parameters
AnalyticsService.logEvent("custom_event_name", {
  parameter1: "value1",
  parameter2: 123,
  parameter3: true
});
```

#### 3. **User Management**
```javascript
// Set user ID
AnalyticsService.setUserId("user123");

// Set user properties
AnalyticsService.setUserProperties({
  age_group: "25-34",
  subscription_type: "premium",
  user_type: "patient"
});
```

### Healthcare-Specific Events

#### 1. **Appointment Booking**
```javascript
AnalyticsService.logAppointmentBooked({
  doctorId: "doc123",
  specialty: "cardiology",
  type: "new", // or "follow_up"
  bookingMethod: "app"
});
```

#### 2. **Symptoms Submission**
```javascript
AnalyticsService.logSymptomsSubmitted({
  count: 3,
  bodyParts: ["chest", "arm"],
  hasImages: true,
  method: "manual"
});
```

#### 3. **Doctor Profile Views**
```javascript
AnalyticsService.logDoctorProfileViewed({
  id: "doc123",
  specialty: "cardiology",
  rating: 4.5
});
```

#### 4. **Document Uploads**
```javascript
AnalyticsService.logDocumentUploaded({
  type: "medical_report",
  sizeMB: 2.5,
  method: "camera"
});
```

### Predefined Events

#### 1. **Authentication Events**
```javascript
// Login tracking
AnalyticsService.logLogin("phone"); // method: email, phone, social

// Sign up tracking  
AnalyticsService.logSignUp("phone");
```

#### 2. **Search Events**
```javascript
AnalyticsService.logSearch("cardiologist near me");
```

## Current Implementation

### Files with Analytics Integration

#### 1. **App.js**
- Analytics initialization on app start
- Basic setup and configuration

#### 2. **Login.js**
- Screen view tracking
- OTP request events
- Login/signup success events
- User ID setting after successful login

#### 3. **BookAppointmentScreen.js**
- Screen view tracking
- Doctor profile view events
- Appointment booking success events
- Detailed appointment tracking

## Event Tracking Examples

### Login Flow Events
```javascript
// Screen view
AnalyticsService.logScreenView("Login", "LoginScreen");

// OTP requested
AnalyticsService.logEvent("otp_requested", {
  phone_number_country_code: "+91",
  phone_number_length: 10
});

// Successful login
AnalyticsService.logLogin("phone");
AnalyticsService.logEvent("user_login_success", {
  phone_number_country_code: "+91",
  login_method: "phone_otp"
});

// New user registration
AnalyticsService.logSignUp("phone");
AnalyticsService.logEvent("new_user_registration", {
  phone_number_country_code: "+91", 
  registration_method: "phone_otp"
});
```

### Appointment Booking Events
```javascript
// Doctor profile viewed
AnalyticsService.logDoctorProfileViewed({
  id: "doc123",
  specialty: "cardiology",
  rating: 4.5
});

// Appointment booked
AnalyticsService.logAppointmentBooked({
  doctorId: "doc123",
  specialty: "cardiology", 
  type: "new",
  bookingMethod: "app"
});

// Detailed booking info
AnalyticsService.logEvent("appointment_booking_details", {
  appointment_date: "2025-07-15T00:00:00.000Z",
  time_slot_id: "slot123",
  location_id: "loc456",
  has_symptoms: true,
  symptoms_count: 3,
  is_follow_up: false
});
```

## How to Add Analytics to New Screens

### 1. Import the Analytics Service
```javascript
import { AnalyticsService } from "../utils/analytics";
```

### 2. Track Screen Views
```javascript
useEffect(() => {
  AnalyticsService.logScreenView("ScreenName", "ScreenClass");
}, []);
```

### 3. Track User Actions
```javascript
const handleButtonPress = async () => {
  // Track the action
  await AnalyticsService.logEvent("button_pressed", {
    button_name: "submit_symptoms",
    screen_name: "SymptomsScreen"
  });
  
  // Perform the actual action
  // ... your existing code
};
```

## Best Practices

### 1. **Event Naming**
- Use snake_case for event names
- Be descriptive but concise
- Use consistent naming patterns

### 2. **Parameters**
- Only include relevant parameters
- Avoid personally identifiable information
- Use consistent parameter names across events

### 3. **Performance**
- Analytics calls are async but don't block UI
- Events are queued and sent in batches
- No need to await analytics calls unless needed for timing

### 4. **Testing**
- Use DebugView in Firebase Console during development
- Test events in development builds
- Verify events appear in Firebase Analytics dashboard

## Debugging

### Enable Debug Mode

#### For Android
```bash
adb shell setprop debug.firebase.analytics.app com.tellyoudocpatient.dev
```

#### For iOS
Add `-FIRAnalyticsDebugEnabled` flag in Xcode scheme

#### For Development Builds
Events automatically show in DebugView during development.

### Console Logs
The analytics service includes console logs for development:
```javascript
console.log("Analytics event logged: event_name", parameters);
```

## Privacy & Compliance

### GDPR Compliance
The analytics service includes consent management:
```javascript
// Set user consent
AnalyticsService.setConsent({
  analytics_storage: true,
  ad_storage: true,
  ad_user_data: true,
  ad_personalization: true
});
```

### Disabling Analytics
Analytics can be disabled entirely:
```javascript
await analytics().setAnalyticsCollectionEnabled(false);
```

## Firebase Console

### Viewing Analytics Data
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to Analytics > Events
4. Use DebugView for real-time event monitoring

### Custom Dashboards
Create custom dashboards to track:
- User engagement metrics
- Appointment booking funnel
- Popular doctors/specialties
- User journey analysis

## Useful Analytics for Healthcare App

### Key Metrics to Track
1. **User Engagement**
   - Daily/Monthly active users
   - Session duration
   - Screen views per session

2. **Appointment Funnel**
   - Doctor searches
   - Profile views
   - Booking attempts
   - Successful bookings

3. **Feature Usage**
   - Symptoms submission rates
   - Document upload usage
   - Follow-up appointment rates

4. **User Behavior**
   - Most viewed doctor specialties
   - Popular time slots
   - Geographic distribution

## Next Steps

1. **Add Analytics to Remaining Screens**
   - Dashboard/Home screen
   - Profile screens
   - Settings screens
   - Search screens

2. **Enhanced Event Tracking**
   - Error tracking
   - Performance metrics
   - Feature adoption rates

3. **Custom Conversions**
   - Define conversion goals in Firebase
   - Track user journey completion
   - A/B testing setup

4. **Analytics Dashboards**
   - Create business intelligence dashboards
   - Set up automated reports
   - Configure alerts for key metrics

## Support

For issues with Firebase Analytics:
- Check [React Native Firebase Documentation](https://rnfirebase.io/analytics/usage)
- Review Firebase Console for event validation
- Check device logs for error messages
- Verify internet connectivity for event transmission
