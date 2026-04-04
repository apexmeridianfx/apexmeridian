"use client"
import { useRouter } from 'next/navigation'
import { Building2, ArrowLeft } from 'lucide-react'

export default function RealEstatePage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-[#050a14] flex">
      <div className="w-64 bg-[#0a1628] border-r border-yellow-900/30 p-6">
        <h1 className="text-yellow-500 font-bold text-xl mb-8">Apex Meridian</h1>
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 text-sm">
          <ArrowLeft size={16} /> Back to Overview
        </button>
      </div>
      <div className="flex-1 p-8">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="text-yellow-500" size={28} />
          <h2 className="text-white text-2xl font-bold">Real Estate Investment</h2>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {['Residential Fund', 'Commercial Fund', 'REIT Portfolio'].map((plan, i) => (
            <div key={plan} className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
              <h3 className="text-yellow-500 font-semibold text-lg mb-2">{plan}</h3>
              <p className="text-gray-400 text-sm mb-4">Minimum investment: ${[5000, 15000, 50000][i].toLocaleString()}</p>
              <p className="text-green-400 font-bold text-xl mb-4">{['6-10%', '10-15%', '15-22%'][i]} Annual ROI</p>
              <p className="text-gray-400 text-sm mb-6">Quarterly dividends distributed to investors</p>
              <button className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-medium transition-colors">
                Invest Now
              </button>
            </div>
          ))}
        </div>
        <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Your Real Estate Portfolio</h3>
          <p className="text-gray-400 text-center py-8">No active real estate investments yet. Choose a fund above to get started.</p>
        </div>
      </div>
    </div>
  )
}