'use client'

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, BookOpen, ArrowLeft } from "lucide-react"
import { toast } from 'react-hot-toast';
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useAuth as useAuthStore } from '@/lib/auth'

export default function Login() {
  const { user, signInWithGoogle } = useAuth()
  const router = useRouter()
  const loginStore = useAuthStore(state => state.login)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [emailError, setEmailError] = useState<string>('')
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)

  // Update email when user changes
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email || "" }))
    }
  }, [user])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear email error when user starts typing
    if (field === 'email') {
      setEmailError('')
    }
  }

  const checkEmailExistence = async (email: string) => {
    if (!email || email.length < 3) {
      setEmailError('')
      return
    }

    setIsCheckingEmail(true)
    try {
      const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      
      if (response.ok && data.isAvailable) {
        setEmailError('This email is not registered. Please check your email or sign up.')
      } else {
        setEmailError('')
      }
    } catch (error) {
      console.error('Email check error:', error)
      setEmailError('')
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const handleEmailChange = (value: string) => {
    handleChange('email', value)
    
    // Debounce email validation
    const timeoutId = setTimeout(() => {
      checkEmailExistence(value)
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields")
      return
    }

    setIsLoading(true)
    
    try {
      console.log('Attempting login for:', formData.email)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('Login response:', { status: response.status, data })

      if (!response.ok) {
        // Handle different error response formats
        const errorMessage = data.error || data.message || 'Login failed'
        console.log('Error message:', errorMessage)
        
        // Provide more specific error messages
        if (response.status === 401) {
          toast.error('Invalid email or password. Please check your credentials.')
        } else if (response.status === 500) {
          toast.error('Server error. Please try again later.')
        } else {
          toast.error(errorMessage)
        }
        return
      }

      // Login successful
      toast.success(`Welcome back!`)
      
      // Persist user in app auth store so Navbar can reflect logged-in state
      if (data?.user) {
        const u = data.user
        const storeUser = {
          id: u.id || '',
          firstName: u.firstName || '',
          lastName: u.lastName || (u.name || ''),
          email: u.email || formData.email,
          role: u.role || 'user',
          type: u.type || 'regular',
          currentInstitute: u.currentInstitute || '',
          course: u.course || '',
          year: u.year || '',
          location: u.location || u.address || '',
          phone: u.phone || '',
          instituteName: u.instituteName || u.name || '',
          address: u.address || '',
          website: u.website || '',
          isAdmin: u.isAdmin || false
        }
        loginStore(storeUser as any)

        // Persist minimal identity in localStorage for quick detection
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('fp_user_email', storeUser.email || '')
            const fullName = `${storeUser.firstName} ${storeUser.lastName}`.trim() || (storeUser.instituteName || '')
            window.localStorage.setItem('fp_user_name', fullName)
            // Store admin status
            if (storeUser.isAdmin) {
              window.localStorage.setItem('fp_user_is_admin', 'true')
            }
          }
        } catch {}
      }

      // Reset password field
      setFormData(prev => ({ ...prev, password: "" }))
      
      // Redirect based on user role
      if (data?.user?.isAdmin || data?.user?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
      
    } catch (error) {
      console.error('Login error:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true)
      const { user, isNewUser } = await signInWithGoogle()
      
      // Persist minimal identity in localStorage
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('fp_user_email', user?.email || '')
          window.localStorage.setItem('fp_user_name', user?.displayName || '')
        }
      } catch {}

      if (isNewUser) {
        // New user from login page - redirect to home (they can complete profile later)
        toast.success('Account created successfully! Welcome to EduPath.')
        router.push('/')
      } else {
        // Existing user - redirect to home
        toast.success('Welcome back!')
        router.push('/')
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
      // Error handling is done in the useAuth hook
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <section className="min-h-screen pt-16 flex items-center justify-center bg-gradient-to-br from-editorial-bg via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-navy-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full mx-4">
        {/* Back to Home */}
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="border-2 border-border/50 shadow-2xl">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-navy-900 to-coral-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-navy-900 to-coral-500 bg-clip-text text-transparent">EduPath</h1>
              </div>
              <div>
                <h2 className="text-3xl font-bold">Welcome back</h2>
                <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={`pl-10 ${emailError ? 'border-red-500' : ''}`}
                      required
                    />
                    {isCheckingEmail && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  {emailError && (
                    <p className="text-sm text-red-500 mt-1">{emailError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-coral-600 hover:text-coral-500">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-black hover:bg-red-500" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div>
                <Button
                  variant="default"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-200 text-gray-700 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGoogleLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin mr-2" />
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" x="0px" y="0px" viewBox="0 0 48 48" enableBackground="new 0 0 48 48" className="h-4 w-4 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
              </div>
            </CardContent>

            <CardFooter className="ml-[5rem]">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-coral-600 hover:text-coral-500 font-medium">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Additional info */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-muted-foreground">
            🎓 Join 10,000+ students already using EduPath
          </p>
          <p className="text-xs text-muted-foreground/70">
            Trusted by students across Kerala & India
          </p>
        </div>
      </div>
    </section>
  )
}