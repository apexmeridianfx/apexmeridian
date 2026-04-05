"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { CreditCard, ArrowLeft } from 'lucide-react'

export default function LoansPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loans, setLoans] = useState<any[]>([])
  const [loansLoading, setLoansLoading] = useState(true)

  useEffect(() => {
    async function loadLoans() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      
      const { data } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setLoans(data || [])
      setLoansLoading(false)
    }
    loadLoans()
  }, [])

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = e.currentTarget
    const data = new FormData(form)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('loans').insert({
      user_id: user.id,
      amount_requested: Number(data.get('amount')),
      purpose: data.get('purpose'),
      status: 'pending'
    })

    if (error) { setError(error.message) }
    else { setSuccess(true) }
    setLoading(false)
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
    <div className="min-h-screen bg-[#050a14] flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-64 bg-[#0a1628] 
      border-r border-yellow-900/30 p-6">
        <h1 className="text-yellow-500 font-bold text-xl mb-8">Apex Meridian</h1>
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 text-sm">
          <ArrowLeft size={16} /> Back to Overview
        </button>
      </div>
      <div className="flex-1 w-full flex flex-col">
        {/* Mobile Top Bar */}
        <div className="md:hidden bg-[#0a1628] border-b 
        border-yellow-900/30 px-4 py-3 flex items-center 
        justify-between">
          <h1 className="text-yellow-500 font-bold text-lg">
            Apex Meridian
          </h1>
          <button onClick={() => router.push('/dashboard')} 
            className="text-gray-400 text-sm">
            ← Overview
          </button>
        </div>
        <div className="p-8 space-y-8 pb-20 md:pb-0">
          <div className="flex items-center gap-3 mb-8">
            <CreditCard className="text-yellow-500" size={28} />
            <h2 className="text-white text-xl md:text-2xl font-bold">Business Loans</h2>
          </div>

          {success ? (
            <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-8 text-center">
              <p className="text-green-400 text-lg md:text-xl font-semibold mb-2">Application Submitted!</p>
              <p className="text-gray-400">Your loan application is under review. We will notify you within 24-48 hours.</p>
              <button onClick={() => setSuccess(false)} className="mt-6 px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm">
                Apply for Another
              </button>
            </div>
          ) : (
            <div className="max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Business Loan', range: '$5K - $500K', rate: '8.5% APR' },
                  { label: 'Personal Loan', range: '$1K - $50K', rate: '12% APR' },
                  { label: 'Real Estate Loan', range: '$50K - $2M', rate: '6.5% APR' },
                ].map((type) => (
                  <div key={type.label} className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-4 text-center">
                    <p className="text-yellow-500 font-semibold text-sm">{type.label}</p>
                    <p className="text-white font-bold mt-1">{type.range}</p>
                    <p className="text-green-400 text-sm">{type.rate}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-8">
                <h3 className="text-white text-lg md:text-xl font-semibold mb-6">Apply Now</h3>
                {error && <p className="text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4 text-sm">{error}</p>}
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Loan Amount (USD)</label>
                    <input name="amount" type="number" required placeholder="Enter amount"
                      className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Purpose of Loan</label>
                    <textarea name="purpose" required placeholder="Describe how you will use this loan" rows={4}
                      className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors">
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            </div>
          )}
          {/* Loan Applications */}
          {!loansLoading && loans.length > 0 && (
            <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Your Loan Applications</h3>
              <div className="space-y-3">
                {loans.map((loan) => (
                  <div key={loan.id} className="bg-[#050a14] border border-yellow-900/20 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium">Loan Application</p>
                        <p className="text-gray-400 text-sm">{new Date(loan.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        loan.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30' :
                        loan.status === 'approved' ? 'bg-green-900/30 text-green-400 border border-green-500/30' :
                        loan.status === 'rejected' ? 'bg-red-900/30 text-red-400 border border-red-500/30' :
                        loan.status === 'active' ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' :
                        'bg-gray-900/30 text-gray-400 border border-gray-500/30'
                      }`}>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Amount Requested</p>
                        <p className="text-white font-semibold">${loan.amount_requested?.toLocaleString()}</p>
                      </div>
                      {loan.amount_approved && (
                        <div>
                          <p className="text-gray-400">Amount Approved</p>
                          <p className="text-green-400 font-semibold">${loan.amount_approved.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                    {loan.purpose && (
                      <div className="mt-3 pt-3 border-t border-yellow-900/20">
                        <p className="text-gray-400 text-sm mb-1">Purpose</p>
                        <p className="text-gray-300 text-sm">{loan.purpose}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 
      right-0 bg-[#0a1628] border-t border-yellow-900/30 
      flex justify-around py-3 z-50">
        <button onClick={() => router.push('/dashboard')}
          className="flex flex-col items-center gap-1 
          text-gray-400 hover:text-yellow-500">
          <span className="text-lg">🏠</span>
          <span className="text-xs">Home</span>
        </button>
        <button onClick={() => router.push('/dashboard/forex')}
          className="flex flex-col items-center gap-1 
          text-gray-400 hover:text-yellow-500">
          <span className="text-lg">📈</span>
          <span className="text-xs">Forex</span>
        </button>
        <button onClick={() => router.push('/dashboard/real-estate')}
          className="flex flex-col items-center gap-1 
          text-gray-400 hover:text-yellow-500">
          <span className="text-lg">🏢</span>
          <span className="text-xs">Property</span>
        </button>
        <button onClick={() => router.push('/dashboard/loans')}
          className="flex flex-col items-center gap-1 
          text-gray-400 hover:text-yellow-500">
          <span className="text-lg">💳</span>
          <span className="text-xs">Loans</span>
        </button>
        <button onClick={() => router.push('/dashboard/profile')}
          className="flex flex-col items-center gap-1 
          text-gray-400 hover:text-yellow-500">
          <span className="text-lg">👤</span>
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  )
}