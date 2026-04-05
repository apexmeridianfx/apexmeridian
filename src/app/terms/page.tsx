import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050a14] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="text-yellow-500 hover:text-yellow-400 text-sm">← Back to Home</Link>
          <h1 className="text-white text-4xl font-bold mt-6 mb-2">Terms of Service</h1>
          <p className="text-gray-400">Last updated: April 2026</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          {[
            {
              title: '1. Acceptance of Terms',
              content: 'By accessing and using the Apex Meridian platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service. Apex Meridian reserves the right to update these terms at any time without prior notice.'
            },
            {
              title: '2. Investment Risk Disclosure',
              content: 'All investments carry risk. The value of investments and the income from them can fall as well as rise. Past performance is not a guarantee of future results. Forex trading, real estate investment, and lending activities involve significant risk of loss. You should not invest money you cannot afford to lose. Apex Meridian does not guarantee returns on any investment product.'
            },
            {
              title: '3. Eligibility',
              content: 'You must be at least 18 years of age and a resident of a jurisdiction where use of our services is legal. By using this platform, you represent and warrant that you meet these requirements. Residents of certain jurisdictions may be restricted from using certain features of the platform.'
            },
            {
              title: '4. Account Registration',
              content: 'You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.'
            },
            {
              title: '5. Deposits and Withdrawals',
              content: 'All deposits are subject to verification and processing times of 24-72 hours. Withdrawal requests are processed within 24-72 business hours. Apex Meridian reserves the right to request additional verification documents before processing withdrawals. Minimum withdrawal amounts apply.'
            },
            {
              title: '6. Prohibited Activities',
              content: 'You agree not to use the Service for any unlawful purpose, including but not limited to money laundering, fraud, or financing of terrorism. You may not attempt to gain unauthorized access to any part of the Service or its related systems. Violation of these prohibitions may result in immediate account termination and legal action.'
            },
            {
              title: '7. Limitation of Liability',
              content: 'Apex Meridian shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the Service. Our total liability to you for any claim arising from use of the Service shall not exceed the amount deposited in your account in the preceding 30 days.'
            },
            {
              title: '8. Governing Law',
              content: 'These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.'
            },
            {
              title: '9. Contact Information',
              content: 'For questions regarding these Terms of Service, please contact us at legal@apexmeridian.capital or through our support chat system.'
            },
          ].map((section) => (
            <div key={section.title} className="bg-[#0a1628] border border-yellow-900/20 rounded-xl p-6">
              <h2 className="text-yellow-500 font-semibold text-lg mb-3">{section.title}</h2>
              <p className="text-gray-400">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/register"
            className="px-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors">
            I Agree — Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}