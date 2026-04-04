"use client"

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Building2, CreditCard, DollarSign, Bell, LogOut, LayoutDashboard, User } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [investments, setInvestments] = useState<any[]>([])
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (!user || error) { router.push('/login'); return }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()
      setProfile(profile)

      const { data: investments } = await supabase
        .from('investments').select('*').eq('user_id', user.id)
      setInvestments(investments || [])

      const { data: loans } = await supabase
        .from('loans').select('*').eq('user_id', user.id)
      setLoans(loans || [])

      setLoading(false)
    }
    loadDashboard()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-yellow-500 text-lg font-medium tracking-widest uppercase">
        Your Wealth Is Working.
      </p>
    </div>
  )

  const totalPortfolio = investments.reduce((sum, inv) => sum + (inv.total_balance || 0), 0)
  const forexReturns = investments.filter(i => i.type === 'forex').reduce((sum, inv) => sum + (inv.returns || 0), 0)
  const realEstateValue = investments.filter(i => i.type === 'real_estate').reduce((sum, inv) => sum + (inv.total_balance || 0), 0)
  const activeLoans = loans.filter(l => l.status === 'active').reduce((sum, l) => sum + (l.amount_approved || 0), 0)

  return (
    <div className="min-h-screen bg-[#050a14] flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 bg-[#0a1628] 
      border-r border-yellow-900/30 flex-col">
        <div className="p-6 border-b border-yellow-900/30">
          <h1 className="text-yellow-500 font-bold text-xl">Apex Meridian</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { label: 'Overview', icon: <LayoutDashboard size={18} />, path: '/dashboard', active: true },
            { label: 'Forex Trading', icon: <TrendingUp size={18} />, path: '/dashboard/forex' },
            { label: 'Real Estate', icon: <Building2 size={18} />, path: '/dashboard/real-estate' },
            { label: 'Loans', icon: <CreditCard size={18} />, path: '/dashboard/loans' },
            { label: 'Profile', icon: <User size={18} />, path: '/dashboard/profile' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${item.active ? 'bg-yellow-600/20 text-yellow-500' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-600/10'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-yellow-900/30">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 rounded-lg text-sm">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
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
        {/* Top Bar */}
        <div className="bg-[#0a1628] border-b border-yellow-900/30 px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-white text-xl md:text-2xl font-semibold">Welcome back, {profile?.full_name || user?.email}</h2>
            <p className="text-gray-400 text-sm">Here is your portfolio overview</p>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={20} className="text-gray-400" />
            <span className="text-gray-400 text-sm">{user?.email}</span>
          </div>
        </div>

        <div className="p-8 space-y-8 pb-20 md:pb-0">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Portfolio', value: `$${totalPortfolio.toFixed(2)}`, icon: <DollarSign size={24} />, color: 'text-yellow-500' },
              { label: 'Forex Returns', value: `$${forexReturns.toFixed(2)}`, icon: <TrendingUp size={24} />, color: 'text-green-400' },
              { label: 'Real Estate Value', value: `$${realEstateValue.toFixed(2)}`, icon: <Building2 size={24} />, color: 'text-blue-400' },
              { label: 'Active Loans', value: `$${activeLoans.toFixed(2)}`, icon: <CreditCard size={24} />, color: 'text-purple-400' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                <p className="text-white text-xl md:text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
            <h3 className="text-white text-lg md:text-xl font-semibold mb-4">Recent Activity</h3>
            {investments.length === 0 && loans.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {investments.map((inv) => (
                  <div key={inv.id} className="flex justify-between items-center py-3 border-b border-yellow-900/20">
                    <div>
                      <p className="text-white text-sm">{inv.plan_name || inv.type}</p>
                      <p className="text-gray-400 text-xs">{inv.type === 'forex' ? 'Forex Investment' : 'Real Estate'}</p>
                    </div>
                    <p className="text-green-400 font-semibold">${inv.total_balance?.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
            <h3 className="text-white text-lg md:text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Invest in Forex', path: '/dashboard/forex' },
                { label: 'Invest in Real Estate', path: '/dashboard/real-estate' },
                { label: 'Apply for Loan', path: '/dashboard/loans' },
                { label: 'Deposit Funds', path: '/dashboard/deposit', color: 'bg-green-600 hover:bg-green-500' },
                { label: 'Withdraw Funds', path: '/dashboard/withdraw', color: 'bg-red-600 hover:bg-red-500' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => router.push(action.path)}
                  className={`px-6 py-3 ${action.color || 'bg-yellow-600 hover:bg-yellow-500'} text-white rounded-lg text-sm font-medium transition-colors`}>
                  {action.label}
                </button>
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