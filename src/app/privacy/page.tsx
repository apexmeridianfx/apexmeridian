import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050a14] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="text-yellow-500 hover:text-yellow-400 text-sm">← Back to Home</Link>
          <h1 className="text-white text-4xl font-bold mt-6 mb-2">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: April 2026 — GDPR Compliant</p>
        </div>

        <div className="space-y-8">
          {[
            {
              title: '1. Information We Collect',
              content: 'We collect information you provide directly: full name, email address, phone number, country of residence, and financial transaction data. We also automatically collect usage data including IP address, browser type, pages visited, and time spent on the platform. This data is used solely to provide and improve our services.'
            },
            {
              title: '2. How We Use Your Information',
              content: 'Your information is used to: create and manage your account, process deposits and withdrawals, communicate important account updates, comply with legal and regulatory requirements, prevent fraud and ensure platform security, and improve our services. We do not sell your personal information to third parties under any circumstances.'
            },
            {
              title: '3. Data Storage and Security',
              content: 'Your data is stored on secure servers with industry-standard encryption (AES-256). We use Supabase infrastructure with SOC 2 Type II compliance. All data transmission is encrypted via TLS 1.3. We retain your data for the duration of your account and 7 years thereafter as required by financial regulations.'
            },
            {
              title: '4. Your GDPR Rights (EU/EEA Residents)',
              content: 'If you are located in the EU or EEA, you have the right to: access your personal data, correct inaccurate data, request deletion of your data (right to be forgotten), restrict processing of your data, data portability, and object to processing. To exercise these rights, contact us at privacy@apexmeridian.capital. We will respond within 30 days.'
            },
            {
              title: '5. Cookies',
              content: 'We use essential cookies required for platform functionality including authentication sessions. We do not use advertising or tracking cookies. You can disable cookies in your browser settings but this may affect platform functionality. We use no third-party advertising networks.'
            },
            {
              title: '6. Third-Party Services',
              content: 'We use the following third-party services: Supabase (database and authentication), Vercel (hosting), and Tawk.to (customer support chat). Each of these services has their own privacy policy and data handling practices. We encourage you to review their policies.'
            },
            {
              title: '7. Data Transfers',
              content: 'Your data may be transferred to and processed in countries outside your country of residence, including the United States. We ensure appropriate safeguards are in place including Standard Contractual Clauses approved by the European Commission for transfers from the EU/EEA.'
            },
            {
              title: '8. Contact Our Data Protection Officer',
              content: 'For privacy-related inquiries, contact our Data Protection Officer at privacy@apexmeridian.capital. For EU residents, you also have the right to lodge a complaint with your local data protection authority.'
            },
          ].map((section) => (
            <div key={section.title} className="bg-[#0a1628] border border-yellow-900/20 rounded-xl p-6">
              <h2 className="text-yellow-500 font-semibold text-lg mb-3">{section.title}</h2>
              <p className="text-gray-400 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}