"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowUpRight, CheckCircle } from 'lucide-react'

export default function WithdrawPage() {
  const router = useRouter()
  const supabase = createClient()
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'withdrawal',
      amount: parseFloat(amount),
      description: `Withdrawal via ${method} to: ${details}`,
    })
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[#050a14] pb-24 md:pb-0">
      <div className="md:hidden bg-[#0a1628] border-b border-yellow-900/30 px-4 py-3 flex items-center justify-between">
        <h1 className="text-yellow-500 font-bold text-lg">Apex Meridian</h1>
        <button onClick={() => router.push('/dashboard')} className="text-gray-400 text-sm">← Overview</button>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <ArrowUpRight className="text-yellow-500" size={28} />
          <h2 className="text-white text-2xl font-bold">Request Withdrawal</h2>
        </div>

        {submitted ? (
          <div className="bg-[#0a1628] border border-green-500/30 rounded-xl p-8 text-center">
            <CheckCircle className="text-green-400 mx-auto mb-4" size={48} />
            <h3 className="text-white text-xl font-bold mb-2">Withdrawal Requested!</h3>
            <p className="text-gray-400 text-sm mb-6">Your withdrawal request of <span className="text-yellow-500 font-bold">${parseFloat(amount).toLocaleString()}</span> is being reviewed. Funds will be sent within 24-72 hours.</p>
            <button onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors">
              Back to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Withdrawal Amount</h3>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 font-bold text-lg">$</span>
                <input type="number" placeholder="0.00" value={amount}
                  onChange={(e) => setAmount(e.target.value)} required
                  className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg pl-8 pr-4 py-4 text-white text-xl focus:border-yellow-500 focus:outline-none" />
              </div>
              <p className="text-gray-500 text-xs mt-2">Minimum withdrawal: $100</p>
            </div>

            <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Withdrawal Method</h3>
              <div className="space-y-3 mb-4">
                {[
                  { id: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿' },
                  { id: 'usdt', label: 'USDT (TRC20)', icon: '₮' },
                  { id: 'wire', label: 'Bank Wire Transfer', icon: '🏦' },
                ].map((m) => (
                  <button type="button" key={m.id} onClick={() => setMethod(m.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${method === m.id ? 'border-yellow-500 bg-yellow-900/20' : 'border-yellow-900/30'}`}>
                    <span className="text-2xl">{m.icon}</span>
                    <p className="text-white font-medium">{m.label}</p>
                    {method === m.id && <CheckCircle className="text-yellow-500 ml-auto" size={20} />}
                  </button>
                ))}
              </div>

              {method && (
                <div>
                  <label className="text-gray-400 text-sm block mb-2">
                    {method === 'wire' ? 'Bank Account Details (Name, Account No, Bank)' : `Your ${method === 'bitcoin' ? 'Bitcoin' : 'USDT'} Wallet Address`}
                  </label>
                  <textarea value={details} onChange={(e) => setDetails(e.target.value)}
                    required placeholder={method === 'wire' ? 'Enter bank name, account number, routing number...' : 'Enter your wallet address...'}
                    rows={3}
                    className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none resize-none text-sm" />
                </div>
              )}
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-400 text-sm font-medium mb-1">⚠️ Please Note</p>
              <p className="text-gray-400 text-sm">Withdrawal requests are reviewed manually. Ensure your wallet address or bank details are correct. Apex Meridian is not responsible for funds sent to wrong addresses.</p>
            </div>

            <button type="submit" disabled={submitting || !amount || !method || !details}
              className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 text-white rounded-xl font-bold text-lg transition-colors">
              {submitting ? 'Submitting...' : 'Submit Withdrawal Request'}
            </button>
          </form>
        )}
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a1628] border-t border-yellow-900/30 flex justify-around py-3 z-50">
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