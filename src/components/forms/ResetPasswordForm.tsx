'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { updatePassword } from '@/lib/services/authService'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Eye, EyeOff, Loader2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const passwordSchema = z.string().superRefine((password, ctx) => {
  if (password.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password must be at least 8 characters long',
      path: [],
    })
  }
  if (!/[A-Z]/.test(password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password must contain at least one uppercase letter',
      path: [],
    })
  }
  if (!/[a-z]/.test(password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password must contain at least one lowercase letter',
      path: [],
    })
  }
  if (!/\d/.test(password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password must contain at least one number',
      path: [],
    })
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password must contain at least one special character',
      path: [],
    })
  }
})

const updatePasswordSchema = z
  .object({
    currentPassword: z.string(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = form.watch('password')
  const confirmPassword = form.watch('confirmPassword')

  const requirements = [
    { text: 'At least 8 characters', met: password?.length >= 8, id: 'length' },
    { text: 'One uppercase letter', met: /[A-Z]/.test(password || ''), id: 'upper' },
    { text: 'One lowercase letter', met: /[a-z]/.test(password || ''), id: 'lower' },
    { text: 'One number', met: /\d/.test(password || ''), id: 'number' },
    { text: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password || ''), id: 'special' },
  ]

  const metRequirements = requirements.filter(req => req.met).length
  const passwordStrength = (metRequirements / requirements.length) * 100
  const passwordsMatch = password === confirmPassword && password?.length > 0

  const getStrengthText = () => {
    if (passwordStrength < 40) return 'Weak'
    if (passwordStrength < 80) return 'Medium'
    return 'Strong'
  }

  async function onSubmit(values: z.infer<typeof updatePasswordSchema>) {
    setIsLoading(true)
    try {
      const message = await updatePassword(values)
      toast.success(message)
      setIsLoading(false)
      form.reset()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your current password"
                        {...field}
                      />
                    </FormControl>
                    <button
                      className="absolute right-3 top-0 h-full cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your new password"
                        {...field}
                      />
                    </FormControl>
                    <button
                      className="absolute right-3 top-0 h-full cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Password strength</span>
                      <Badge
                        variant={
                          passwordStrength >= 80 ? 'default' : passwordStrength >= 40 ? 'secondary' : 'destructive'
                        }
                      >
                        {getStrengthText()}
                      </Badge>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your new password"
                        {...field}
                      />
                    </FormControl>
                    <button
                      className="absolute right-3 top-0 h-full cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <div className="flex items-center space-x-2">
                      {passwordsMatch ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-destructive" />
                          <span className="text-sm text-destructive">Passwords don&apos;t match</span>
                        </>
                      )}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Password Requirements</h3>
            <div className="space-y-2">
              {requirements.map(req => (
                <div key={req.id} className="flex items-center space-x-3">
                  {req.met ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${req.met ? 'text-green-700' : 'text-gray-600'}`}>{req.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" />
              Updating Password...
            </>
          ) : (
            'Update Password'
          )}
        </Button>
      </form>
    </Form>
  )
}
