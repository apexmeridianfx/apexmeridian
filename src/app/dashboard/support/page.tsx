"use client"
import { useRouter } from 'next/navigation'
import { MessageCircle, Mail, Clock, ArrowLeft, Phone } from 'lucide-react'

export default function SupportPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#050a14] pb-24 md:pb-0">
      <div className="md:hidden bg-[#0a1628] border-b border-yellow-900/30 px-4 py-3 flex items-center justify-between">
        <h1 className="text-yellow-500 font-bold text-lg">Apex Meridian</h1>
        <button onClick={() => router.push('/dashboard')} className="text-gray-400 text-sm">← Overview</button>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <MessageCircle className="text-yellow-500" size={28} />
          <h2 className="text-white text-2xl font-bold">Support Center</h2>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: <MessageCircle size={28} />,
              title: 'Live Chat',
              desc: 'Chat with our team in real time',
              action: 'Start Chat',
              onClick: () => {
                if (typeof window !== 'undefined' && (window as any).Tawk_API) {
                  (window as any).Tawk_API.maximize()
                }
              },
              color: 'text-green-400',
              available: 'Available 24/7'
            },
            {
              icon: <Mail size={28} />,
              title: 'Email Support',
              desc: 'Send us a detailed message',
              action: 'Send Email',
              onClick: () => window.open('mailto:support@apexmeridian.capital'),
              color: 'text-yellow-500',
              available: 'Reply within 24hrs'
            },
            {
              icon: <Phone size={28} />,
              title: 'Phone Support',
              desc: 'Speak with an advisor',
              action: 'Call Us',
              onClick: () => window.open('tel:+18005551234'),
              color: 'text-blue-400',
              available: 'Mon-Fri 9AM-6PM EST'
            },
          ].map((item) => (
            <div key={item.title} className="bg-[#0a1628] border border-yellow-900/30 rounded-xl p-6 text-center">
              <span className={`${item.color} flex justify-center mb-3`}>{item.icon}</span>
              <h3 className="text-white font-semibold mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{item.desc}</p>
              <p className="text-green-400 text-xs mb-4">{item.available}</p>
              <button onClick={item.onClick}
                className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-medium transition-colors">
                {item.action}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-[#0a1628] border border-yellow-900/30 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-yellow-900/30">
            <h3 className="text-white font-semibold text-lg">Frequently Asked Questions</h3>
          </div>
          <div className="divide-y divide-yellow-900/20">
            {[
              {
                q: 'How long does a deposit take to reflect?',
                a: 'Cryptocurrency deposits reflect within 24 hours after blockchain confirmation. Bank wire transfers take 1-3 business days.'
              },
              {
                q: 'How do I withdraw my funds?',
                a: 'Go to Dashboard → Withdraw Funds. Submit your withdrawal request with your wallet address or bank details. Processing takes 24-72 hours.'
              },
              {
                q: 'What is the minimum investment amount?',
                a: 'Forex investments start from $1,000. Real estate funds start from $5,000. Business loans start from $5,000.'
              },
              {
                q: 'How are my returns calculated?',
                a: 'Returns are calculated based on your investment plan and updated monthly by our portfolio management team. You can view your real-time balance on your dashboard.'
              },
              {
                q: 'Is my investment safe?',
                a: 'All investments carry risk. We employ professional risk management strategies, but we cannot guarantee returns. Never invest more than you can afford to lose.'
              },
              {
                q: 'How do I update my account information?',
                a: 'Go to Dashboard → Profile to update your name, phone, and country. Email changes require identity verification — contact support.'
              },
            ].map((faq) => (
              <div key={faq.q} className="px-6 py-4">
                <p className="text-yellow-500 font-medium text-sm mb-2">{faq.q}</p>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
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