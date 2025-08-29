# 🎓 AcadJoin - Educational Institute Discovery Platform

<div align="center">

![AcadJoin Logo](https://img.shields.io/badge/AcadJoin-Educational%20Platform-blue?style=for-the-badge&logo=graduation-cap)
![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-6.18.0-47A248?style=for-the-badge&logo=mongodb)
![Firebase](https://img.shields.io/badge/Firebase-12.1.0-FFCA28?style=for-the-badge&logo=firebase)

**Connect, Discover, and Choose Your Educational Path**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Site-green?style=for-the-badge)](http://localhost:3000)
[![Documentation](https://img.shields.io/badge/Documentation-Read%20Docs-blue?style=for-the-badge)](#documentation)

</div>

---

## 📋 Table of Contents

- [🚀 Features](#-features)
- [🎯 Key Capabilities](#-key-capabilities)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🚀 Getting Started](#-getting-started)
- [🏗️ Project Structure](#️-project-structure)
- [👥 User Types](#-user-types)
- [🔧 API Endpoints](#-api-endpoints)
- [🎨 UI Components](#-ui-components)
- [🔐 Authentication](#-authentication)
- [📊 Admin Panel](#-admin-panel)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Features

### 🎓 **For Students & Learners**
- 👤 **Personal Profile Creation** - Build comprehensive student profiles
- 🎯 **Skills & Achievements Showcase** - Highlight your academic excellence
- 📚 **Educational Background Tracking** - Manage your academic journey
- 💼 **Professional Experience** - Showcase internships and work experience
- 📄 **Document Uploads** - Store certificates, transcripts, and portfolios
- 🎯 **Career Opportunities Access** - Connect with placement opportunities

### 🏫 **For Educational Institutes**
- 🏢 **Comprehensive Institute Profile** - Detailed institutional information
- 👨‍🏫 **Faculty Management System** - Manage and showcase faculty members
- 📖 **Course Catalog Management** - Organize and display academic programs
- 💼 **Placement Cell Integration** - Connect students with career opportunities
- 📊 **Student Enrollment Tracking** - Monitor and manage student data
- 🏆 **Academic Program Showcase** - Highlight specialized courses and programs

### 🌟 **Platform Features**
- 🔍 **Advanced Search & Discovery** - Find institutes and courses easily
- ⭐ **Verified Reviews & Ratings** - Authentic student feedback system
- 💬 **Peer Mentoring** - Connect with senior students and alumni
- 📱 **Responsive Design** - Optimized for all devices
- 🔐 **Secure Authentication** - Multiple login options (Email/Google)
- 🎨 **Modern UI/UX** - Beautiful, intuitive interface

---

## 🎯 Key Capabilities

| Feature | Description | Status |
|---------|-------------|--------|
| 🔐 **Multi-Auth System** | Email/Password + Google OAuth | ✅ Active |
| 👥 **Role-Based Access** | Students, Institutes, Admins | ✅ Active |
| 📊 **Admin Dashboard** | Comprehensive management panel | ✅ Active |
| 💳 **Payment Integration** | Razorpay payment gateway | ✅ Active |
| 📧 **Email Validation** | Real-time email verification | ✅ Active |
| 🔍 **Advanced Search** | Filter by location, course, rating | ✅ Active |
| 📱 **Mobile Responsive** | Optimized for all screen sizes | ✅ Active |
| 🌙 **Dark Mode** | Theme switching capability | ✅ Active |

---

## 🛠️ Tech Stack

### **Frontend**
- ![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat&logo=next.js) **Next.js 15.4.6** - React framework with App Router
- ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript) **TypeScript 5.0** - Type-safe JavaScript
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat&logo=tailwind-css) **Tailwind CSS 3.4.17** - Utility-first CSS framework
- ![Radix UI](https://img.shields.io/badge/Radix_UI-1.0-161618?style=flat) **Radix UI** - Accessible component primitives
- ![Lucide React](https://img.shields.io/badge/Lucide_React-0.539.0-000000?style=flat) **Lucide React** - Beautiful icons

### **Backend & Database**
- ![MongoDB](https://img.shields.io/badge/MongoDB-6.18.0-47A248?style=flat&logo=mongodb) **MongoDB 6.18.0** - NoSQL database
- ![Firebase](https://img.shields.io/badge/Firebase-12.1.0-FFCA28?style=flat&logo=firebase) **Firebase 12.1.0** - Authentication & hosting
- ![Razorpay](https://img.shields.io/badge/Razorpay-2.9.6-02042B?style=flat) **Razorpay 2.9.6** - Payment gateway

### **State Management & Utilities**
- ![Zustand](https://img.shields.io/badge/Zustand-5.0.7-764ABC?style=flat) **Zustand 5.0.7** - Lightweight state management
- ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.62.0-EC5990?style=flat) **React Hook Form 7.62.0** - Form handling
- ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.12-0055FF?style=flat) **Framer Motion 12.23.12** - Animation library

---

## 📦 Installation

### **Prerequisites**
- Node.js 18+ 
- npm/yarn/pnpm
- MongoDB database
- Firebase project
- Razorpay account

### **Clone & Install**
```bash
# Clone the repository
git clone https://github.com/yourusername/acadjoin.git
cd acadjoin

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

---

## ⚙️ Configuration

### **Environment Variables**
Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=your_mongodb_name

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@acadjoin.com
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

---

## 🚀 Getting Started

### **Development Server**
```bash
# Start development server with Turbopack
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### **Build for Production**
```bash
# Build the application
npm run build
# or
yarn build
# or
pnpm build

# Start production server
npm start
# or
yarn start
# or
pnpm start
```

---

## 🏗️ Project Structure

```
acadjoin/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 api/               # API routes
│   │   ├── 📁 admin/             # Admin panel
│   │   ├── 📁 institutes/        # Institute pages
│   │   ├── 📁 people-profile/    # User profile pages
│   │   ├── 📁 registration/      # Registration flows
│   │   └── 📄 page.tsx           # Homepage
│   ├── 📁 components/            # Reusable components
│   │   ├── 📁 admin/             # Admin components
│   │   ├── 📁 ui/                # UI primitives
│   │   └── 📄 *.tsx              # Feature components
│   ├── 📁 contexts/              # React contexts
│   ├── 📁 hooks/                 # Custom hooks
│   └── 📁 lib/                   # Utility libraries
├── 📁 public/                    # Static assets
├── 📄 package.json               # Dependencies
├── 📄 tailwind.config.ts         # Tailwind configuration
└── 📄 next.config.ts             # Next.js configuration
```

---

## 👥 User Types

### **🎓 Students & Learners**
- Create personal profiles
- Browse institutes and courses
- Read and write reviews
- Connect with alumni
- Access career opportunities

### **🏫 Educational Institutes**
- Register and manage profiles
- Showcase faculty and courses
- Manage student enrollments
- Track placement statistics
- Engage with prospective students

### **👨‍💼 Administrators**
- Manage all users and content
- Monitor platform analytics
- Handle verification processes
- Configure platform settings
- Manage payment systems

---

## 🔧 API Endpoints

### **Authentication**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/get-user` - Get user data

### **Institute Management**
- `POST /api/institutes/register` - Institute registration
- `GET /api/institutes` - Get all institutes
- `GET /api/institutes/[id]` - Get specific institute
- `PUT /api/institutes/[id]` - Update institute

### **User Management**
- `POST /api/people/register` - People registration
- `GET /api/people` - Get all users
- `PUT /api/people/[id]` - Update user profile

### **Admin Operations**
- `GET /api/admin/dashboard` - Admin dashboard data
- `PUT /api/admin/settings` - Update platform settings
- `DELETE /api/admin/users/[id]` - Delete user

---

## 🎨 UI Components

The project uses a comprehensive component library built with:

- **Radix UI Primitives** - Accessible, unstyled components
- **Tailwind CSS** - Utility-first styling
- **Custom Components** - Feature-specific components
- **Responsive Design** - Mobile-first approach
- **Dark Mode Support** - Theme switching capability

### **Key Components**
- `Navbar` - Navigation header
- `Footer` - Site footer
- `HeroSection` - Landing page hero
- `InstituteOverview` - Institute display
- `ReviewComponents` - Review system
- `AdminDashboard` - Admin interface

---

## 🔐 Authentication

### **Authentication Methods**
1. **Email/Password** - Traditional registration and login
2. **Google OAuth** - One-click Google sign-in
3. **Admin Access** - Special admin credentials

### **Security Features**
- Password hashing with bcrypt
- JWT token management
- Email validation
- Role-based access control
- Session management

---

## 📊 Admin Panel

### **Dashboard Features**
- 📈 **Analytics Overview** - Platform statistics
- 👥 **User Management** - Manage all users
- 🏫 **Institute Management** - Verify and manage institutes
- 💬 **Message Management** - Handle user communications
- ⚙️ **Settings Configuration** - Platform settings
- 📊 **Reports & Insights** - Detailed analytics

### **Admin Capabilities**
- User verification and approval
- Content moderation
- Payment management
- System configuration
- Data analytics and reporting

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure responsive design
- Write comprehensive tests
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- 📧 **Email**: support@acadjoin.com
- 📖 **Documentation**: [Read our docs](#documentation)
- 🐛 **Issues**: [Report a bug](https://github.com/yourusername/acadjoin/issues)
- 💡 **Feature Requests**: [Request a feature](https://github.com/yourusername/acadjoin/issues)

---

<div align="center">

**Made with ❤️ by the AcadJoin Team**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername/acadjoin)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/company/acadjoin)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/acadjoin)

</div>