# Email Validation System

This document describes the comprehensive email validation system implemented to ensure email uniqueness across all registration types in the EduPath platform.

## Overview

The email validation system prevents users from registering with the same email address across different registration types:
- Regular signup (`/signup`)
- People registration (`/register-people`)
- Institute registration (`/register-institute`)
- Google authentication

## Architecture

### Core Components

1. **Email Validation Library** (`src/lib/email-validation.ts`)
   - Centralized validation logic
   - Checks across all user collections
   - Provides detailed error messages

2. **API Endpoints**
   - `/api/auth/check-email` - Real-time email availability check
   - Updated registration APIs with email validation
   - Google authentication with email uniqueness check

3. **Frontend Integration**
   - Real-time validation with debouncing
   - Visual feedback with loading states
   - Error messages for users

## Implementation Details

### Email Validation Library

```typescript
// Core validation function
export async function validateEmailUniqueness(email: string): Promise<EmailValidationResult>

// Comprehensive validation including format check
export async function validateEmail(email: string): Promise<EmailValidationResult>
```

The validation checks these collections:
- `users` - Regular signup accounts
- `peopleRegistrations` - People registration profiles
- `instituteRegistrations` - Institute registration profiles

### API Endpoints

#### `/api/auth/check-email`
- **Method**: GET
- **Purpose**: Real-time email availability check
- **Parameters**: `email` (query parameter)
- **Response**: 
  ```json
  {
    "isAvailable": true/false,
    "message": "Email is available" / "Error message",
    "existingIn": ["regular signup", "people registration"] // if not available
  }
  ```

#### Updated Registration APIs
All registration APIs now include email validation:
- `/api/auth/signup`
- `/api/people-registration`
- `/api/institute-registration`
- `/api/auth/store-google-user`

### Frontend Features

#### Real-time Validation
- Debounced validation (500ms delay)
- Loading spinner during validation
- Visual feedback with red border for invalid emails
- Clear error messages

#### User Experience
- Immediate feedback as user types
- Prevents form submission with duplicate emails
- Helpful error messages indicating where email is already registered

## Error Messages

The system provides specific error messages based on where the email is already registered:

- **Single registration type**: "This email is already registered for [type]. Please use a different email address."
- **Multiple registration types**: "This email is already registered for: [type1, type2]. Please use a different email address."
- **Invalid format**: "Invalid email format. Please enter a valid email address."

## Testing

### Test Endpoint
Use `/api/test-email-validation?email=test@example.com` to test the validation system.

### Manual Testing
1. Try registering with the same email across different registration types
2. Verify real-time validation works on all forms
3. Test Google authentication with existing emails
4. Check error messages are displayed correctly

## Security Considerations

- Email addresses are normalized (lowercase, trimmed) before validation
- Database queries are protected against injection
- Error messages don't reveal sensitive information
- Validation is performed server-side for security

## Performance

- Debounced validation reduces API calls
- Database queries are optimized with indexes on email fields
- Caching could be added for frequently checked emails
- Validation is performed only when necessary

## Future Enhancements

1. **Email Verification**: Add email verification workflow
2. **Bulk Validation**: Support for bulk email validation
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **Caching**: Implement caching for frequently checked emails
5. **Analytics**: Track validation patterns for optimization

## Database Indexes

Ensure these indexes exist for optimal performance:

```javascript
// MongoDB indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.peopleRegistrations.createIndex({ "email": 1 }, { unique: true })
db.instituteRegistrations.createIndex({ "email": 1 }, { unique: true })
```

## Troubleshooting

### Common Issues

1. **Validation not working**: Check if MongoDB connection is established
2. **Slow validation**: Verify database indexes are created
3. **Error messages not showing**: Check frontend error handling
4. **Google auth conflicts**: Ensure Google user storage includes email validation

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` to see detailed validation logs.

## Migration Notes

If migrating from an existing system:
1. Ensure all existing emails are unique across collections
2. Add database indexes for performance
3. Test validation with existing user data
4. Update any hardcoded email validation logic
