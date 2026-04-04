"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'

export default function ManageUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const supabase = createClient()

  const [profile, setProfile] = useState<any>(null)
  const [investments, setInvestments] = useState<any[]>([])
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: adminCheck } = await supabase
        .from('admins').select('id').eq('id', user.id).single()
      if (!adminCheck) { router.push('/dashboard'); return }

      const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', userId).single()
      setProfile(profile)

      const { data: investments } = await supabase
        .from('investments').select('*').eq('user_id', userId)
      setInvestments(investments || [])

      const { data: loans } = await supabase
        .from('loans').select('*').eq('user_id', userId)
      setLoans(loans || [])

      setLoading(false)
    }
    load()
  }, [userId])

  const addInvestment = async (type: 'forex' | 'real_estate') => {
    const { data } = await supabase.from('investments').insert({
      user_id: userId,
      type,
      plan_name: type === 'forex' ? 'Forex Plan' : 'Real Estate Fund',
      amount_invested: 0,
      returns: 0,
      total_balance: 0,
      status: 'active'
    }).select().single()
    if (data) setInvestments([...investments, data])
  }

  const updateInvestment = (id: string, field: string, value: string) => {
    setInvestments(investments.map(inv =>
      inv.id === id ? { ...inv, [field]: parseFloat(value) || value } : inv
    ))
  }

  const saveInvestment = async (inv: any) => {
    setSaving(true)
    await supabase.from('investments').update({
      plan_name: inv.plan_name,
      amount_invested: inv.amount_invested,
      returns: inv.returns,
      total_balance: inv.total_balance,
      status: inv.status,
      admin_note: inv.admin_note,
    }).eq('id', inv.id)
    setMessage('Investment saved successfully!')
    setTimeout(() => setMessage(''), 3000)
    setSaving(false)
  }

  const deleteInvestment = async (id: string) => {
    await supabase.from('investments').delete().eq('id', id)
    setInvestments(investments.filter(inv => inv.id !== id))
  }

  const updateLoanStatus = async (loanId: string, status: string, amount?: number) => {
    await supabase.from('loans').update({
      status,
      amount_approved: amount || 0
    }).eq('id', loanId)
    setLoans(loans.map(l => l.id === loanId ? { ...l, status, amount_approved: amount || l.amount_approved } : l))
    setMessage('Loan updated!')
    setTimeout(() => setMessage(''), 3000)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-yellow-500 text-lg font-medium tracking-widest uppercase">
        Your Wealth Is Working.
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050a14]">
      {/* Header */}
      <div className="bg-[#0a1628] border-b border-yellow-900/30 px-8 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors">
          <ArrowLeft size={18} /> Back to Admin
        </button>
        <div className="flex-1">
          <h1 className="text-white text-xl font-bold">
            Managing: {profile?.full_name || profile?.email}
          </h1>
          <p className="text-gray-400 text-sm">{profile?.email} · {profile?.country || 'No country'} · Joined {new Date(profile?.created_at).toLocaleDateString()}</p>
        </div>
        {message && (
          <span className="px-4 py-2 bg-green-900/30 text-green-400 border border-green-500/30 rounded-lg text-sm">
            {message}
          </span>
        )}
      </div>

      <div className="p-8 space-y-8 max-w-5xl mx-auto">

        {/* Customer Summary */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Invested', value: `$${investments.reduce((s, i) => s + (i.amount_invested || 0), 0).toLocaleString()}` },
            { label: 'Total Returns', value: `$${investments.reduce((s, i) => s + (i.returns || 0), 0).toLocaleString()}` },
            { label: 'Portfolio Balance', value: `$${investments.reduce((s, i) => s + (i.total_balance || 0), 0).toLocaleString()}` },
            { label: 'Active Loans', value: loans.filter(l => l.status === 'active').length },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-5">
              <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Investments Section */}
        <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-yellow-900/30 flex justify-between items-center">
            <h2 className="text-white font-semibold text-lg">Investments</h2>
            <div className="flex gap-2">
              <button
                onClick={() => addInvestment('forex')}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-500 rounded-lg text-sm transition-colors">
                <Plus size={14} /> Add Forex
              </button>
              <button
                onClick={() => addInvestment('real_estate')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-sm transition-colors">
                <Plus size={14} /> Add Real Estate
              </button>
            </div>
          </div>

          {investments.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No investments yet. Add one above.</p>
          ) : (
            <div className="divide-y divide-yellow-900/20">
              {investments.map((inv) => (
                <div key={inv.id} className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${inv.type === 'forex' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-blue-900/30 text-blue-400'}`}>
                      {inv.type === 'forex' ? '📈 Forex' : '🏢 Real Estate'}
                    </span>
                    <button
                      onClick={() => deleteInvestment(inv.id)}
                      className="text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs block mb-1">Plan Name</label>
                      <input
                        value={inv.plan_name || ''}
                        onChange={(e) => updateInvestment(inv.id, 'plan_name', e.target.value)}
                        className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs block mb-1">Status</label>
                      <select
                        value={inv.status}
                        onChange={(e) => updateInvestment(inv.id, 'status', e.target.value)}
                        className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 focus:outline-none">
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs block mb-1">Amount Invested ($)</label>
                      <input
                        type="number"
                        value={inv.amount_invested || 0}
                        onChange={(e) => updateInvestment(inv.id, 'amount_invested', e.target.value)}
                        className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs block mb-1">Returns Earned ($)</label>
                      <input
                        type="number"
                        value={inv.returns || 0}
                        onChange={(e) => updateInvestment(inv.id, 'returns', e.target.value)}
                        className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs block mb-1">Total Balance ($)</label>
                      <input
                        type="number"
                        value={inv.total_balance || 0}
                        onChange={(e) => updateInvestment(inv.id, 'total_balance', e.target.value)}
                        className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs block mb-1">Admin Note</label>
                      <input
                        value={inv.admin_note || ''}
                        onChange={(e) => updateInvestment(inv.id, 'admin_note', e.target.value)}
                        placeholder="Internal note..."
                        className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 focus:outline-none" />
                    </div>
                  </div>

                  <button
                    onClick={() => saveInvestment(inv)}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
                    <Save size={14} /> Save Investment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Loans Section */}
        <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-yellow-900/30">
            <h2 className="text-white font-semibold text-lg">Loan Applications</h2>
          </div>

          {loans.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No loan applications from this user.</p>
          ) : (
            <div className="divide-y divide-yellow-900/20">
              {loans.map((loan) => (
                <div key={loan.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-white font-medium">${loan.amount_requested?.toLocaleString()} requested</p>
                      <p className="text-gray-400 text-sm mt-1">{loan.purpose}</p>
                      <p className="text-gray-500 text-xs mt-1">Applied: {new Date(loan.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      loan.status === 'approved' ? 'bg-green-900/30 text-green-400' :
                      loan.status === 'rejected' ? 'bg-red-900/30 text-red-400' :
                      loan.status === 'active' ? 'bg-blue-900/30 text-blue-400' :
                      'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {loan.status.toUpperCase()}
                    </span>
                  </div>

                  {loan.status === 'pending' && (
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="Approved amount"
                        id={`approved-${loan.id}`}
                        className="bg-[#050a14] border border-yellow-900/30 rounded-lg px-3 py-2 text-white text-sm w-48 focus:border-yellow-500 focus:outline-none" />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`approved-${loan.id}`) as HTMLInputElement
                          updateLoanStatus(loan.id, 'approved', parseFloat(input.value))
                        }}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm transition-colors">
                        Approve
                      </button>
                      <button
                        onClick={() => updateLoanStatus(loan.id, 'rejected')}
                        className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm transition-colors">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}