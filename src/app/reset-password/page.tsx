"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Lock } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else router.push('/dashboard')
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
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-yellow-500" size={24} />
            <h2 className="text-white text-xl font-bold">Set New Password</h2>
          </div>
          {error && (
            <p className="text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4 text-sm">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-2">New Password</label>
              <input type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                required placeholder="Minimum 8 characters"
                className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Confirm New Password</label>
              <input type="password" value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required placeholder="Repeat password"
                className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}