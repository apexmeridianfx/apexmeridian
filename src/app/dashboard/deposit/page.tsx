"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, DollarSign, Copy, CheckCircle } from 'lucide-react'

export default function DepositPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('')
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const paymentDetails: Record<string, { label: string; value: string }[]> = {
    bitcoin: [
      { label: 'Bitcoin Address', value: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
      { label: 'Network', value: 'Bitcoin (BTC)' },
    ],
    usdt: [
      { label: 'USDT Address (TRC20)', value: 'TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax' },
      { label: 'Network', value: 'TRON (TRC20)' },
    ],
    wire: [
      { label: 'Bank Name', value: 'JPMorgan Chase Bank' },
      { label: 'Account Name', value: 'Apex Meridian Capital LLC' },
      { label: 'Account Number', value: '000-123-4567' },
      { label: 'Routing Number', value: '021000021' },
      { label: 'SWIFT Code', value: 'CHASUS33' },
    ],
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'deposit',
      amount: parseFloat(amount),
      description: `Deposit via ${method} - pending confirmation`,
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
          <DollarSign className="text-yellow-500" size={28} />
          <h2 className="text-white text-2xl font-bold">Make a Deposit</h2>
        </div>

        {submitted ? (
          <div className="bg-[#0a1628] border border-green-500/30 rounded-xl p-8 text-center">
            <CheckCircle className="text-green-400 mx-auto mb-4" size={48} />
            <h3 className="text-white text-xl font-bold mb-2">Deposit Submitted!</h3>
            <p className="text-gray-400 mb-2">Amount: <span className="text-yellow-500 font-bold">${parseFloat(amount).toLocaleString()}</span></p>
            <p className="text-gray-400 text-sm mb-6">Your deposit is being processed. It will reflect in your account within 24-48 hours after confirmation.</p>
            <button onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors">
              Back to Dashboard
            </button>
          </div>
        ) : step === 1 ? (
          <div className="space-y-6">
            <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Enter Deposit Amount</h3>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 font-bold text-lg">$</span>
                <input
                  type="number" placeholder="0.00" value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#050a14] border border-yellow-900/30 rounded-lg pl-8 pr-4 py-4 text-white text-xl focus:border-yellow-500 focus:outline-none" />
              </div>
              <div className="flex gap-2 mt-3">
                {['500', '1000', '5000', '10000'].map((amt) => (
                  <button key={amt} onClick={() => setAmount(amt)}
                    className="px-3 py-1 bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-500 rounded text-sm transition-colors">
                    ${parseInt(amt).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Select Payment Method</h3>
              <div className="space-y-3">
                {[
                  { id: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', desc: 'Fast, global, secure' },
                  { id: 'usdt', label: 'USDT (TRC20)', icon: '₮', desc: 'Stable, low fees' },
                  { id: 'wire', label: 'Bank Wire Transfer', icon: '🏦', desc: 'Traditional bank transfer' },
                ].map((m) => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${method === m.id ? 'border-yellow-500 bg-yellow-900/20' : 'border-yellow-900/30 hover:border-yellow-900/60'}`}>
                    <span className="text-2xl">{m.icon}</span>
                    <div className="text-left">
                      <p className="text-white font-medium">{m.label}</p>
                      <p className="text-gray-400 text-sm">{m.desc}</p>
                    </div>
                    {method === m.id && <CheckCircle className="text-yellow-500 ml-auto" size={20} />}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!amount || !method || parseFloat(amount) <= 0}
              className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 text-white rounded-xl font-bold text-lg transition-colors">
              Continue →
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold">Payment Details</h3>
                <span className="text-yellow-500 font-bold text-xl">${parseFloat(amount).toLocaleString()}</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Send exactly <span className="text-yellow-500 font-bold">${parseFloat(amount).toLocaleString()}</span> to the details below:
              </p>
              <div className="space-y-3">
                {paymentDetails[method]?.map((detail) => (
                  <div key={detail.label} className="bg-[#050a14] rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">{detail.label}</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white font-mono text-sm break-all">{detail.value}</p>
                      <button onClick={() => copyToClipboard(detail.value)}
                        className="text-yellow-500 hover:text-yellow-400 flex-shrink-0">
                        {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-yellow-400 text-sm font-medium mb-1">⚠️ Important</p>
              <p className="text-gray-400 text-sm">After sending payment, click "I've Made Payment" below. Your account will be credited within 24-48 hours after blockchain confirmation.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 py-3 border border-yellow-900/30 hover:border-yellow-500 text-gray-400 hover:text-white rounded-xl transition-colors">
                ← Back
              </button>
              <button onClick={handleConfirm} disabled={submitting}
                className="flex-2 flex-grow py-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white rounded-xl font-bold transition-colors">
                {submitting ? 'Submitting...' : "I've Made Payment ✓"}
              </button>
            </div>
          </div>
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