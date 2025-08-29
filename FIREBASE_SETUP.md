# Firebase Integration Setup

This project now includes Firebase authentication with Google Sign-in functionality.

## Environment Variables

Make sure you have the following environment variables set in your `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyApe3S0AQWqHSLgZb0JGd8Xe1uAfDbHgwE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=quranic-seminar.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=quranic-seminar
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=quranic-seminar.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=790587832804
NEXT_PUBLIC_FIREBASE_APP_ID=1:790587832804:web:ab0c3beef16d95332d6ff1
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-HD502KFR06
```

## Features

### Google Authentication
- **Signup Page**: Users can sign up using Google authentication
- **Login Page**: Users can sign in using Google authentication
- **User Profile**: After Google signup/login, users are redirected to their profile page
- **Profile Completion**: New Google users see a message to complete their profile

### User Management
- User data is automatically stored in the MongoDB database
- Firebase UID is used as the unique identifier
- Profile completion status is tracked

## How It Works

1. **Google Signup/Login**: Users click "Continue with Google" button
2. **Firebase Popup**: Google authentication popup appears
3. **User Creation**: If new user, account is created and data stored in database
4. **Redirect**: User is redirected to profile page
5. **Profile Completion**: New users see a message to complete their profile

## Database Schema

Users are stored in the `users` collection with the following structure:

```typescript
{
  uid: string,           // Firebase UID
  email: string,         // User's email
  displayName: string,   // User's display name
  photoURL: string,      // User's profile picture URL
  emailVerified: boolean, // Email verification status
  createdAt: string,     // Account creation date
  isProfileComplete: boolean, // Profile completion status
  authProvider: string,  // Authentication provider (e.g., 'google')
  updatedAt: string      // Last update date
}
```

## Components

- **`useAuth` Hook**: Manages Firebase authentication state and functions
- **`AuthContext`**: Provides authentication context across the app
- **`ProtectedRoute`**: Wraps components that require authentication
- **API Endpoints**: Handle storing and retrieving user data

## Usage

### In Components
```typescript
import { useAuth } from '@/hooks/useAuth';
import { useAuthContext } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const { user: authUser, loading } = useAuthContext();
  
  // Use authentication functions and user state
};
```

### Protected Routes
```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

const ProtectedPage = () => (
  <ProtectedRoute>
    <div>This content is only visible to authenticated users</div>
  </ProtectedRoute>
);
```

## Security

- Firebase handles all authentication securely
- User data is validated before storage
- Protected routes automatically redirect unauthenticated users
- No sensitive data is exposed in client-side code

## Troubleshooting

1. **Pop-up Blocked**: Ensure pop-ups are allowed for your domain
2. **Authentication Errors**: Check Firebase console for configuration issues
3. **Database Errors**: Verify MongoDB connection and collection permissions
4. **Environment Variables**: Ensure all Firebase config variables are set correctly
