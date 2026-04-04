"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { User, ArrowLeft } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      const { data } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()
      setProfile(data || { id: user.id, email: user.email })
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    const form = e.currentTarget
    const data = new FormData(form)
    await supabase.from('profiles').upsert({
      id: userId,
      full_name: data.get('full_name'),
      phone: data.get('phone'),
      country: data.get('country'),
    })
    setSuccess(true)
    setSaving(false)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#050a14] flex items-center justify-center">
      <p className="text-yellow-500">Loading profile...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050a14] flex">
      <div className="w-64 bg-[#0a1628] border-r border-yellow-900/30 p-6">
        <h1 className="text-yellow-500 font-bold text-xl mb-8">Apex Meridian</h1>
        <button onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 text-sm">
          <ArrowLeft size={16} /> Back to Overview
        </button>
      </div>
      <div className="flex-1 p-8">
        <div className="flex items-center gap-3 mb-8">
          <User className="text-yellow-500" size={28} />
          <h2 className="text-white text-2xl font-bold">My Profile</h2>
        </div>
        <div className="max-w-2xl bg-[#0a1628] border border-yellow-900/30 rounded-xl p-8">
          {success && (
            <p className="text-green-400 bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-6 text-sm">
              Profile updated successfully!
            </p>
          )}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-2">Full Name</label>
              <input name="full_name" type="text" defaultValue={profile?.full_name || ''}
                className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Email</label>
              <input type="email" defaultValue={profile?.email || ''} disabled
                className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-4 py-3 text-white opacity-50 cursor-not-allowed" />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Phone</label>
              <input name="phone" type="tel" defaultValue={profile?.phone || ''}
                className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Country</label>
              <input name="country" type="text" defaultValue={profile?.country || ''}
                className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none" />
            </div>
            <button type="submit" disabled={saving}
              className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white rounded-lg font-medium mt-2 transition-colors">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}