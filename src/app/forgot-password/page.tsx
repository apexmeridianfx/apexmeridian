"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://apexmeridianfx.vercel.app/reset-password',
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#050a14] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-yellow-500 font-bold text-2xl mb-1">Apex Meridian</h1>
          <p className="text-gray-400 text-sm">Capital Management Platform</p>
        </div>

        <div className="bg-[#0a1628] border border-yellow-900/30 rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <CheckCircle className="text-green-400 mx-auto mb-4" size={48} />
              <h2 className="text-white text-xl font-bold mb-2">Check Your Email</h2>
              <p className="text-gray-400 text-sm mb-6">
                We sent a password reset link to <span className="text-yellow-500">{email}</span>. 
                Click the link in the email to reset your password.
              </p>
              <Link href="/login"
                className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <Mail className="text-yellow-500" size={24} />
                <h2 className="text-white text-xl font-bold">Reset Password</h2>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Enter your email address and we will send you a link to reset your password.
              </p>
              {error && (
                <p className="text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4 text-sm">
                  {error}
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Email Address</label>
                  <input
                    type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required placeholder="your@email.com"
                    className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <p className="text-center text-gray-400 text-sm mt-6">
                Remember your password?{' '}
                <Link href="/login" className="text-yellow-500 hover:text-yellow-400">Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}