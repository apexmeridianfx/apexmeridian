"use client"

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Briefcase, CreditCard, LayoutDashboard, LogOut, DollarSign } from 'lucide-react'

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loans, setLoans] = useState<any[]>([])
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: adminCheck } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!adminCheck) { router.push('/dashboard'); return }

      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      setUsers(profiles || [])

      const { data: loansData } = await supabase
        .from('loans')
        .select('*')
        .order('created_at', { ascending: false })
      setLoans(loansData || [])

      const { data: investmentsData } = await supabase
        .from('investments')
        .select('*')
      setInvestments(investmentsData || [])

      setLoading(false)
    }
    loadAdmin()
  }, [])

  const approveLoan = async (loanId: string) => {
    await supabase.from('loans').update({ status: 'approved' }).eq('id', loanId)
    setLoans(loans.map(l => l.id === loanId ? { ...l, status: 'approved' } : l))
  }

  const rejectLoan = async (loanId: string) => {
    await supabase.from('loans').update({ status: 'rejected' }).eq('id', loanId)
    setLoans(loans.map(l => l.id === loanId ? { ...l, status: 'rejected' } : l))
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#050a14] flex items-center justify-center">
      <p className="text-yellow-500 text-xl">Loading admin panel...</p>
    </div>
  )

  const totalAUM = investments.reduce((sum, i) => sum + (i.total_balance || 0), 0)

  return (
    <div className="min-h-screen bg-[#050a14] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0a1628] border-r border-yellow-900/30 flex flex-col">
        <div className="p-6 border-b border-yellow-900/30">
          <h1 className="text-yellow-500 font-bold text-xl">Apex Meridian</h1>
          <p className="text-gray-400 text-sm">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-yellow-600/20 text-yellow-500 rounded-lg text-sm">
            <LayoutDashboard size={18} /> Dashboard Overview
          </button>
          <button
            onClick={() => router.push('/admin/users')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-yellow-500 hover:bg-yellow-600/10 rounded-lg text-sm">
            <Users size={18} /> Manage Users
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-yellow-500 hover:bg-yellow-600/10 rounded-lg text-sm">
            <CreditCard size={18} /> Manage Loans
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-yellow-500 hover:bg-yellow-600/10 rounded-lg text-sm">
            <Briefcase size={18} /> Transactions
          </button>
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
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-[#0a1628] border-b border-yellow-900/30 px-8 py-4 flex justify-between items-center">
          <h2 className="text-white text-2xl font-bold">Admin Control Panel</h2>
          <p className="text-gray-400 text-sm">Apex Meridian Management System</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: 'Total Users', value: users.length, icon: <Users size={24} /> },
              { label: 'Active Investments', value: investments.filter(i => i.status === 'active').length, icon: <Briefcase size={24} /> },
              { label: 'Pending Loans', value: loans.filter(l => l.status === 'pending').length, icon: <CreditCard size={24} /> },
              { label: 'Total AUM', value: `$${totalAUM.toFixed(2)}`, icon: <DollarSign size={24} /> },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <span className="text-yellow-500">{stat.icon}</span>
                </div>
                <p className="text-white text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Users Table */}
          <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-yellow-900/30">
              <h3 className="text-white font-semibold text-lg">Recent Users</h3>
            </div>
            <table className="w-full text-sm text-gray-300">
              <thead className="bg-[#050a14] text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Country</th>
                  <th className="px-4 py-3 text-left">Joined</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-900/20">
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-400">No users yet</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-yellow-900/10">
                      <td className="px-4 py-3">{u.full_name || 'N/A'}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.country || 'N/A'}</td>
                      <td className="px-4 py-3">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded text-xs">Active</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.push('/admin/users/' + u.id)}
                          className="text-yellow-500 hover:text-yellow-400 text-sm font-medium">
                          Manage →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Loans Table */}
          <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-yellow-900/30">
              <h3 className="text-white font-semibold text-lg">Pending Loan Applications</h3>
            </div>
            <table className="w-full text-sm text-gray-300">
              <thead className="bg-[#050a14] text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Purpose</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-900/20">
                {loans.filter(l => l.status === 'pending').length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-400">No pending loans</td></tr>
                ) : (
                  loans.filter(l => l.status === 'pending').map((loan) => (
                    <tr key={loan.id} className="hover:bg-yellow-900/10">
                      <td className="px-4 py-3">{loan.user_id?.slice(0, 8)}...</td>
                      <td className="px-4 py-3">${loan.amount_requested?.toLocaleString()}</td>
                      <td className="px-4 py-3">{loan.purpose}</td>
                      <td className="px-4 py-3">{new Date(loan.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveLoan(loan.id)}
                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white rounded text-xs">
                            Approve
                          </button>
                          <button
                            onClick={() => rejectLoan(loan.id)}
                            className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-xs">
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}