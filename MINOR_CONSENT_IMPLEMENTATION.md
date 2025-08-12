# Minor Consent Implementation

## Overview
This document outlines the implementation of parental consent functionality for minors (users under 18 years) across all behalf user creation components in the General Patient App.

## What Was Implemented

### 1. Age Calculation Logic
- Automatic detection when a selected birth date makes a person under 18 years old
- Exact age calculation considering month and day differences
- Dynamic UI updates based on the minor status

### 2. Parental Consent UI
- **Consent Checkbox**: Custom checkbox component with visual feedback
- **Consent Text**: Clear explanation of what the consent covers
- **Minor Notice**: Informative text indicating parental consent requirement
- **Conditional Display**: Only appears when the person is identified as a minor

### 3. Validation
- Form validation prevents submission without parental consent for minors
- Clear error messages guide users to provide required consent
- Validation is integrated into existing form validation logic

### 4. Data Handling
- Parental consent information is included in behalf user creation API calls
- Data is conditionally added to prevent unnecessary fields for adults
- Consent status is preserved throughout the user creation process

## Files Modified

### Core Components
1. **CreateOtherProfile.js** - Main behalf user creation screen
2. **OtherScreen.js** - Contains `OtherDetailsForm` component used across multiple screens

### Integration Points
3. **DashboardScreen.js** - Dashboard behalf user creation
4. **CurrentTreatmentScreen.js** - Treatment-related behalf user creation
5. **DoctorDetails.js** - Doctor-specific behalf user creation
6. **ScanQRScreen.js** - QR scan behalf user creation
7. **landinPage.js** - Landing page behalf user creation

## Implementation Details

### Age Calculation
```javascript
const today = new Date();
const age = today.getFullYear() - selectedDate.getFullYear();
const monthDiff = today.getMonth() - selectedDate.getMonth();
const dayDiff = today.getDate() - selectedDate.getDate();

let exactAge = age;
if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
  exactAge--;
}

const isUnder18 = exactAge < 18;
```

### Consent UI Components
- **Checkbox**: Custom styled checkbox with checkmark icon
- **Touch Handler**: Toggle consent status on tap
- **Visual States**: Different styles for checked/unchecked states
- **Notice Text**: Styled notice indicating minor status

### Data Structure
```javascript
const userData = {
  firstName,
  middleName,
  lastName,
  gender: formData.gender,
  dateOfBirth: dateOfBirth.toISOString(),
  relationship: formData.relation,
  ...(formData.parentalConsent !== undefined && { 
    parentalConsent: formData.parentalConsent 
  }),
};
```

## User Experience

### Flow for Adults (18+)
1. User enters name, birth date, gender, relation
2. Form validates and submits normally
3. No additional consent required

### Flow for Minors (<18)
1. User enters name, birth date, gender, relation
2. System detects minor status based on birth date
3. Parental consent section appears automatically
4. User must check consent checkbox to proceed
5. Form validates consent before submission
6. Consent information is included in API call

## Features

### ✅ Automatic Detection
- Real-time age calculation on date selection
- Immediate UI updates when minor status changes

### ✅ User-Friendly Interface
- Clear visual indicators for consent requirement
- Intuitive checkbox interaction
- Informative text explaining requirements

### ✅ Comprehensive Validation
- Prevents submission without required consent
- Clear error messages for missing consent
- Integrates with existing validation logic

### ✅ Data Integrity
- Consent information properly stored
- Conditional data inclusion (only for minors)
- Consistent across all creation points

### ✅ Cross-Platform Compatibility
- Works on both iOS and Android
- Responsive design for different screen sizes
- Uses platform-appropriate UI components

## Technical Notes

### State Management
- Uses React hooks for local state management
- Integrates with Redux for global behalf user storage
- Maintains consent state alongside form data

### Styling
- Consistent with app's design system
- Uses existing color schemes and fonts
- Responsive layout for different screen sizes

### Accessibility
- Clear labels and descriptions
- Touch-friendly interface elements
- High contrast for visibility

## Compliance
This implementation ensures compliance with medical treatment requirements for minors by:
- Requiring explicit parental consent for users under 18
- Clearly indicating when consent is required
- Preventing treatment authorization without proper consent
- Maintaining records of consent status

## Testing Considerations
- Test with birth dates that result in edge cases (exactly 18, just under 18)
- Verify consent requirement appears and disappears appropriately
- Ensure validation works correctly
- Test across different device sizes and orientations
- Verify data is properly saved with consent information
