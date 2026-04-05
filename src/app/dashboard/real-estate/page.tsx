"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Building2, ArrowLeft, CheckCircle, X } from 'lucide-react'

const funds = [
  { name: 'Residential Fund', min: 5000, roi: '6-10', period: 'Quarterly', color: 'border-blue-600' },
  { name: 'Commercial Fund', min: 15000, roi: '10-15', period: 'Quarterly', color: 'border-blue-500' },
  { name: 'REIT Portfolio', min: 50000, roi: '15-22', period: 'Quarterly', color: 'border-blue-400' },
]

export default function RealEstatePage() {
  const router = useRouter()
  const supabase = createClient()
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFund, setSelectedFund] = useState<any>(null)
  const [amount, setAmount] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase
        .from('investments').select('*')
        .eq('user_id', user.id).eq('type', 'real_estate')
      setInvestments(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const handleConfirm = async () => {
    setError('')
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt < selectedFund.min) {
      setError(`Minimum investment for ${selectedFund.name} is $${selectedFund.min.toLocaleString()}`)
      return
    }
    setConfirming(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    await supabase.from('investments').insert({
      user_id: user.id,
      type: 'real_estate',
      plan_name: selectedFund.name,
      amount_invested: amt,
      returns: 0,
      total_balance: amt,
      status: 'active',
      admin_note: 'Pending admin confirmation',
    })

    await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'deposit',
      amount: amt,
      description: `Real estate investment — ${selectedFund.name} — awaiting confirmation`,
    })

    setConfirming(false)
    setConfirmed(true)
    setSelectedFund(null)
    setAmount('')

    const { data } = await supabase
      .from('investments').select('*')
      .eq('user_id', user.id).eq('type', 'real_estate')
    setInvestments(data || [])
  }

  if (loading) return (
    <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-yellow-500 text-lg font-medium tracking-widest uppercase">Your Wealth Is Working.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050a14] pb-24 md:pb-0">
      <div className="md:hidden bg-[#0a1628] border-b border-yellow-900/30 px-4 py-3 flex items-center justify-between">
        <h1 className="text-yellow-500 font-bold text-lg">Apex Meridian</h1>
        <button onClick={() => router.push('/dashboard')} className="text-gray-400 text-sm">← Overview</button>
      </div>

      <div className="flex">
        <div className="hidden md:flex w-64 bg-[#0a1628] border-r border-yellow-900/30 flex-col p-6 min-h-screen">
          <h1 className="text-yellow-500 font-bold text-xl mb-8">Apex Meridian</h1>
          <button onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 text-sm">
            <ArrowLeft size={16} /> Back to Overview
          </button>
        </div>

        <div className="flex-1 p-6">
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="text-yellow-500" size={28} />
            <h2 className="text-white text-2xl font-bold">Real Estate Investment</h2>
          </div>

          {confirmed && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
              <p className="text-green-400 text-sm">Investment submitted! Proceed to Deposit Funds to complete your investment. Our team confirms within 24 hours.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Invested', value: `$${investments.reduce((s,i) => s+(i.amount_invested||0),0).toLocaleString()}` },
              { label: 'Total Returns', value: `$${investments.reduce((s,i) => s+(i.returns||0),0).toLocaleString()}` },
              { label: 'Portfolio Balance', value: `$${investments.reduce((s,i) => s+(i.total_balance||0),0).toLocaleString()}` },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-5">
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-white text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {investments.length > 0 && (
            <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-yellow-900/30">
                <h3 className="text-white font-semibold">Your Real Estate Portfolio</h3>
              </div>
              <div className="divide-y divide-yellow-900/20">
                {investments.map((inv) => (
                  <div key={inv.id} className="px-6 py-4 flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{inv.plan_name}</p>
                      <p className={`text-xs mt-1 ${inv.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>{inv.status}</p>
                      {inv.admin_note && <p className="text-gray-500 text-xs mt-1">{inv.admin_note}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">${inv.amount_invested?.toLocaleString()}</p>
                      <p className="text-green-400 text-sm">+${inv.returns?.toLocaleString()} returns</p>
                      <p className="text-yellow-500 font-bold text-sm">Balance: ${inv.total_balance?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
            <h3 className="text-white font-semibold text-lg mb-6">Available Funds</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {funds.map((fund) => (
                <div key={fund.name}
                  className={`border-2 ${fund.color} rounded-xl p-5 hover:bg-blue-900/10 transition-colors cursor-pointer`}
                  onClick={() => { setSelectedFund(fund); setAmount(String(fund.min)); setConfirmed(false) }}>
                  <h4 className="text-blue-400 font-bold text-lg mb-3">{fund.name}</h4>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-400 text-sm">Min: <span className="text-white">${fund.min.toLocaleString()}</span></p>
                    <p className="text-gray-400 text-sm">ROI: <span className="text-green-400 font-bold">{fund.roi}%</span></p>
                    <p className="text-gray-400 text-sm">Returns: <span className="text-white">{fund.period}</span></p>
                  </div>
                  <button className="w-full py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                    Invest Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedFund && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#0a1628] border border-yellow-900/30 rounded-2xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-xl font-bold">Confirm Investment</h3>
              <button onClick={() => { setSelectedFund(null); setError('') }}>
                <X className="text-gray-400 hover:text-white" size={20} />
              </button>
            </div>

            <div className="bg-[#050a14] rounded-xl p-4 mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Fund</span>
                <span className="text-blue-400 font-semibold">{selectedFund.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Expected ROI</span>
                <span className="text-green-400 font-semibold">{selectedFund.roi}% quarterly</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Minimum</span>
                <span className="text-white">${selectedFund.min.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-gray-400 text-sm block mb-2">Investment Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 font-bold">$</span>
                <input type="number" value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={selectedFund.min}
                  className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg pl-8 pr-4 py-3 text-white focus:border-yellow-500 focus:outline-none text-lg" />
              </div>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-3 mb-6">
              <p className="text-yellow-400 text-xs">After confirming, proceed to <strong>Deposit Funds</strong> to send your investment amount. Your fund activates after payment confirmation.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setSelectedFund(null); setError('') }}
                className="flex-1 py-3 border border-yellow-900/30 text-gray-400 hover:text-white rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirm} disabled={confirming}
                className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white rounded-xl font-bold transition-colors">
                {confirming ? 'Confirming...' : 'Confirm Investment'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a1628] border-t border-yellow-900/30 flex justify-around py-3 z-40">
        {[
          { label: 'Home', icon: '🏠', path: '/dashboard' },
          { label: 'Forex', icon: '📈', path: '/dashboard/forex' },
          { label: 'Property', icon: '🏢', path: '/dashboard/real-estate' },
          { label: 'Loans', icon: '💳', path: '/dashboard/loans' },
          { label: 'Profile', icon: '👤', path: '/dashboard/profile' },
        ].map((item) => (
          <button key={item.label} onClick={() => router.push(item.path)}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-yellow-500">
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}