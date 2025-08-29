# Admin Panel Setup

## Admin Login Credentials

The admin panel can be accessed using the following hardcoded credentials:

### Default Admin Credentials
- **Email:** `admin@domain.com`
- **Password:** `admin@123`

## Environment Variables (Optional)

To configure additional admin access via Google authentication, add the following environment variables to your `.env.local` file:

### Optional Variables

```bash
# Admin email addresses (comma-separated for multiple admins via Google auth)
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,admin@alhyaba.com

# Admin password for additional verification (optional)
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password_here
```

### Example Configuration

```bash
# Single admin
NEXT_PUBLIC_ADMIN_EMAILS=admin@yourdomain.com

# Multiple admins
NEXT_PUBLIC_ADMIN_EMAILS=admin@yourdomain.com,superadmin@yourdomain.com,manager@yourdomain.com

# With password protection
NEXT_PUBLIC_ADMIN_PASSWORD=secure_password_123
```

## How to Use

### Method 1: Direct Admin Login (Recommended)
1. Go to the login page at `/login`
2. Enter the admin credentials:
   - Email: `admin@domain.com`
   - Password: `admin@123`
3. Click "Sign in"
4. You will be redirected to the admin panel at `/admin`

### Method 2: Google Authentication (Optional)
1. Create a `.env.local` file in your project root
2. Add the environment variables above
3. Replace the email addresses with your actual admin emails
4. Set a secure password if you want additional protection
5. Restart your development server
6. Sign in with Google using an admin email

## Admin Access

- The admin panel is available at `/admin`
- Admin users have full access to all admin features
- Both direct login and Google authentication methods are supported

## Security Notes

- The default admin credentials are hardcoded for development purposes
- For production, consider changing the admin credentials in the login API
- Use `NEXT_PUBLIC_` prefix for client-side access
- Keep your admin passwords secure
- Regularly update admin email addresses
- Consider using environment-specific configurations for production
- The admin credentials are stored in `src/app/api/auth/login/route.ts`
