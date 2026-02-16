import { z } from 'zod'

/** Minimum 8 chars, at least one letter and one number (standard signup) */
export const passwordSchema = z
  .string()
  .min(8, 'At least 8 characters')
  .regex(/[a-zA-Z]/, 'At least one letter')
  .regex(/\d/, 'At least one number')

/** Strong password for admin: 12+ chars, upper, lower, number, special */
export const strongPasswordSchema = z
  .string()
  .min(12, 'At least 12 characters')
  .regex(/[a-z]/, 'At least one lowercase letter')
  .regex(/[A-Z]/, 'At least one uppercase letter')
  .regex(/\d/, 'At least one number')
  .regex(/[^a-zA-Z0-9]/, 'At least one special character')

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})

export const signupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: passwordSchema,
  workspaceName: z.string().min(1, 'Workspace name required').max(100, 'Workspace name too long'),
  name: z.string().max(100).optional(),
})

export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: strongPasswordSchema,
  totpCode: z
    .string()
    .optional()
    .refine((v) => !v || v.length === 6, 'Code must be 6 digits'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset link is invalid or expired'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type AdminLoginFormData = z.infer<typeof adminLoginSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

/** Returns a strength label and approximate score 0–4 for UI */
export function getPasswordStrength(password: string): { label: string; score: number } {
  if (!password) return { label: '', score: 0 }
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return { label: labels[Math.min(score, 4)], score: Math.min(score, 4) }
}
