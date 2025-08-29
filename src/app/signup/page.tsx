'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, BookOpen, ArrowLeft } from "lucide-react"
import { toast } from 'react-hot-toast'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useAuth } from "@/hooks/useAuth"
import { useAuth as useAuthStore } from '@/lib/auth'

export default function Signup() {
  const router = useRouter()
  const { signInWithGoogle } = useAuth()
  const loginStore = useAuthStore(state => state.login)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [emailError, setEmailError] = useState<string>('')
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear email error when user starts typing
    if (field === 'email') {
      setEmailError('')
    }
  }

  const checkEmailAvailability = async (email: string) => {
    if (!email || email.length < 3) {
      setEmailError('')
      return
    }

    setIsCheckingEmail(true)
    try {
      const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      
      if (!response.ok) {
        setEmailError(data.error || 'Email validation failed')
      } else {
        setEmailError('')
      }
    } catch (error) {
      console.error('Email check error:', error)
      setEmailError('Failed to check email availability')
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const handleEmailChange = (value: string) => {
    handleChange('email', value)
    
    // Debounce email validation
    const timeoutId = setTimeout(() => {
      checkEmailAvailability(value)
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Signup attempt:", { email: formData.email, firstName: formData.firstName })
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error("Please fill in all fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    if (!agreeToTerms) {
      toast.error("You must agree to the terms of service")
      return
    }

    setIsLoading(true)
    
    try {
      const requestBody = {
        ...formData,
        agreeToTerms // Make sure to include this field
      }
      console.log('Sending signup request:', requestBody)
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      console.log('Signup response:', { status: response.status, data })

      if (!response.ok) {
        // Handle validation errors from the API
        const errorMessage = data.error || 'Failed to create account'
        console.log('Error message:', errorMessage)
        throw new Error(errorMessage)
      }

      toast.success('Account created successfully! Welcome to EduPath!')
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
      })
      setAgreeToTerms(false)
      
      // Automatically log in the user
      if (data?.user) {
        const u = data.user
        const storeUser = {
          id: u.id || '',
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          email: u.email || '',
          role: u.role || 'user',
          type: u.type || 'regular'
        }
        loginStore(storeUser as any)

        // Persist minimal identity in localStorage for quick detection
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('fp_user_email', storeUser.email || '')
            const fullName = `${storeUser.firstName} ${storeUser.lastName}`.trim()
            window.localStorage.setItem('fp_user_name', fullName)
          }
        } catch {}
      }
      
      // Redirect to home page as logged-in user
      router.push('/')
      
    } catch (error) {
      console.error('Error creating account:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      setIsGoogleLoading(true)
      const { user, isNewUser } = await signInWithGoogle()
      
      if (isNewUser) {
        // New user from signup page - redirect to profile page to complete profile
        toast.success('Account created successfully! Please complete your profile.')
        router.push('/user-profile')
      } else {
        // Existing user from signup page - redirect to profile page to update profile
        toast.success('Welcome back! Please update your profile information.')
        router.push('/user-profile')
      }
    } catch (error) {
      console.error('Google signup error:', error)
      // Error handling is done in the useAuth hook
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <section className="min-h-screen  flex items-center justify-center bg-gradient-to-br from-editorial-bg via-background to-muted/20">
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
                <h2 className="text-3xl font-bold">Create your account</h2>
                <p className="text-muted-foreground mt-2">Join our community of students and learners</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
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
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link href="/termsofservice" className="text-coral-600 hover:text-coral-500">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacypolicy" className="text-coral-600 hover:text-coral-500">
                      Privacy Policy
                    </Link>
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                </div>

                <Button type="submit" className="w-full bg-black hover:bg-red-500" disabled={isLoading || !agreeToTerms}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Creating account...
                    </div>
                  ) : (
                    "Create account"
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

              {/* Social Signup */}
              <div>
                <Button
                  variant="default"
                  onClick={handleGoogleSignup}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-200 text-gray-700 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGoogleLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin mr-2" />
                      Signing up...
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
	c0-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
              </div>
            </CardContent>

            <CardFooter className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-coral-600 hover:text-coral-500 font-medium">
                  Sign in
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