"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Building2, ArrowLeft } from 'lucide-react'

export default function RealEstatePage() {
  const router = useRouter()
  const supabase = createClient()
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'real_estate')
      setInvestments(data || [])
      setLoading(false)
    }
    load()
  }, [])

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
        <button onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 text-sm">
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
            <Building2 className="text-yellow-500" size={28} />
            <h2 className="text-white text-xl md:text-2xl font-bold">Real Estate Investment</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Invested', value: `$${investments.reduce((s,i) => s+(i.amount_invested||0),0).toLocaleString()}` },
              { label: 'Total Returns', value: `$${investments.reduce((s,i) => s+(i.returns||0),0).toLocaleString()}` },
              { label: 'Portfolio Balance', value: `$${investments.reduce((s,i) => s+(i.total_balance||0),0).toLocaleString()}` },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
                <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                <p className="text-white text-xl md:text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-yellow-900/30">
              <h3 className="text-white text-lg md:text-xl font-semibold">Your Real Estate Portfolio</h3>
            </div>
            {investments.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No active real estate investments yet.</p>
            ) : (
              <div className="divide-y divide-yellow-900/20">
                {investments.map((inv) => (
                  <div key={inv.id} className="px-6 py-4 flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{inv.plan_name}</p>
                      <p className="text-gray-400 text-sm">Status: <span className={`${inv.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>{inv.status}</span></p>
                      {inv.admin_note && <p className="text-gray-500 text-xs mt-1">{inv.admin_note}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Invested</p>
                      <p className="text-white font-semibold">${inv.amount_invested?.toLocaleString()}</p>
                      <p className="text-green-400 text-sm">+${inv.returns?.toLocaleString()} returns</p>
                      <p className="text-yellow-500 font-bold">Balance: ${inv.total_balance?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
            <h3 className="text-white text-lg md:text-xl font-semibold mb-4">Available Funds</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Residential Fund', min: '$5,000', roi: '6-10%' },
                { name: 'Commercial Fund', min: '$15,000', roi: '10-15%' },
                { name: 'REIT Portfolio', min: '$50,000', roi: '15-22%' },
              ].map((plan) => (
                <div key={plan.name} className="border border-yellow-900/30 rounded-xl p-4 text-center">
                  <p className="text-yellow-500 font-semibold mb-1">{plan.name}</p>
                  <p className="text-gray-400 text-sm">Min: {plan.min}</p>
                  <p className="text-green-400 font-bold text-lg my-2">{plan.roi}%</p>
                  <p className="text-gray-500 text-xs">Contact support to invest</p>
                </div>
              ))}
            </div>
          </div>
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