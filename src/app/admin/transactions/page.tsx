"use client"

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadTransactions() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: adminCheck } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!adminCheck) { router.push('/dashboard'); return }

      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false })
      
      setTransactions(transactionsData || [])
      setLoading(false)
    }
    loadTransactions()
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-green-400 bg-green-900/20'
      case 'withdrawal': return 'text-red-400 bg-red-900/20'
      case 'return': return 'text-yellow-400 bg-yellow-900/20'
      case 'loan_disbursement': return 'text-blue-400 bg-blue-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <TrendingUp size={16} />
      case 'withdrawal': return <TrendingDown size={16} />
      case 'return': return <DollarSign size={16} />
      case 'loan_disbursement': return <CreditCard size={16} />
      default: return <DollarSign size={16} />
    }
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
    <div className="min-h-screen bg-[#050a14] flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 bg-[#0a1628] border-r border-yellow-900/30 flex-col">
        <div className="p-6 border-b border-yellow-900/30">
          <h1 className="text-yellow-500 font-bold text-xl">Apex Meridian</h1>
          <p className="text-gray-400 text-sm">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => router.push('/admin')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-yellow-500 hover:bg-yellow-600/10 rounded-lg text-sm">
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Top Bar */}
        <div className="md:hidden bg-[#0a1628] border-b border-yellow-900/30 px-4 py-3 flex items-center justify-between">
          <h1 className="text-yellow-500 font-bold">
            Transactions
          </h1>
          <button onClick={() => router.push('/admin')}
            className="text-gray-400 text-sm">
            ← Admin
          </button>
        </div>
        {/* Top Bar */}
        <div className="bg-[#0a1628] border-b border-yellow-900/30 px-8 py-4 flex justify-between items-center">
          <h2 className="text-white text-2xl font-bold">All Transactions</h2>
          <p className="text-gray-400 text-sm">Transaction History Management</p>
        </div>

        <div className="p-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { 
                label: 'Total Deposits', 
                value: `$${transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + (t.amount || 0), 0).toLocaleString()}`,
                color: 'text-green-400'
              },
              { 
                label: 'Total Withdrawals', 
                value: `$${transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + (t.amount || 0), 0).toLocaleString()}`,
                color: 'text-red-400'
              },
              { 
                label: 'Total Returns', 
                value: `$${transactions.filter(t => t.type === 'return').reduce((sum, t) => sum + (t.amount || 0), 0).toLocaleString()}`,
                color: 'text-yellow-400'
              },
              { 
                label: 'Loan Disbursements', 
                value: `$${transactions.filter(t => t.type === 'loan_disbursement').reduce((sum, t) => sum + (t.amount || 0), 0).toLocaleString()}`,
                color: 'text-blue-400'
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
                <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Transactions Table */}
          <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-yellow-900/30">
              <h3 className="text-white font-semibold text-lg">Transaction History</h3>
            </div>
            
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No transactions found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-300">
                <thead className="bg-[#050a14] text-gray-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Description</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-900/20">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-yellow-900/10">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-white font-medium">
                            {transaction.profiles?.full_name || 'Unknown User'}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {transaction.profiles?.email || 'No email'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                          {getTypeIcon(transaction.type)}
                          {transaction.type?.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        ${transaction.amount?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-400 max-w-xs truncate hidden md:table-cell">
                        {transaction.description || 'No description'}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
