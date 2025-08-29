# Login Troubleshooting Guide

## Common Login Issues and Solutions

### 1. "Login failed" Error

This error typically occurs due to one of the following issues:

#### Database Connection Issues
- **MongoDB not running**: Ensure MongoDB is running on your system
- **Connection string incorrect**: Check your `MONGODB_URI` environment variable
- **Network issues**: Verify network connectivity to MongoDB

#### Environment Variable Issues
- **Missing Firebase config**: Ensure all Firebase environment variables are set
- **Missing MongoDB URI**: Check if `MONGODB_URI` is properly configured

### 2. Testing Steps

#### Step 1: Test Database Connection
Visit `/api/test-db` in your browser to check:
- Database connectivity
- Collection counts
- Environment variable status

#### Step 2: Check Console Logs
Look for detailed error messages in:
- Browser console (F12)
- Terminal/server logs
- Network tab in browser dev tools

#### Step 3: Verify Environment Variables
Ensure these are set in your `.env.local` file:
```env
MONGODB_URI=mongodb://localhost:27017/futurepath
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Quick Fixes

#### Fix 1: Restart Development Server
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

#### Fix 2: Check MongoDB Status
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl status mongod
```

#### Fix 3: Clear Browser Cache
- Clear browser cache and cookies
- Try in incognito/private mode
- Check if localStorage is accessible

### 4. Debug Information

The enhanced login API now provides:
- Detailed console logging
- Specific error messages
- Database connection status
- Collection verification

### 5. Common Error Codes

- **400**: Missing email/password or invalid email format
- **401**: Invalid credentials (user not found or wrong password)
- **500**: Server error (database connection issues)

### 6. Testing the Fix

After implementing fixes:
1. Visit `/api/test-db` to verify database connection
2. Try logging in with valid credentials
3. Check console logs for detailed information
4. Verify user data is properly stored

### 7. Still Having Issues?

If problems persist:
1. Check the server logs for detailed error messages
2. Verify MongoDB collections exist and have data
3. Ensure bcrypt is properly installed (`npm install bcryptjs`)
4. Check if there are any CORS or network restrictions

### 8. Contact Information

For additional support, check:
- Server console logs
- Browser developer tools
- Network tab for API responses
- Database connection status
