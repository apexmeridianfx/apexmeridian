"use client"

import {
  LayoutDashboard,
  TrendingUp,
  Building2,
  Landmark,
  User,
  LogOut,
  Bell,
  DollarSign,
  Home,
  CreditCard,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard", active: true },
  { icon: TrendingUp, label: "Forex Trading", href: "/dashboard/forex", active: false },
  { icon: Building2, label: "Real Estate", href: "/dashboard/real-estate", active: false },
  { icon: Landmark, label: "Loans", href: "/dashboard/loans", active: false },
  { icon: User, label: "Profile", href: "/dashboard/profile", active: false },
]

const quickActions = [
  { label: "Invest in Forex", href: "/dashboard/forex" },
  { label: "Invest in Real Estate", href: "/dashboard/real-estate" },
  { label: "Apply for Loan", href: "/dashboard/loans" },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [investments, setInvestments] = useState<any[]>([])
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const summaryCards = [
    {
      title: "Total Portfolio Value",
      value: `$${investments.reduce((sum: number, inv: any) => 
      sum + (inv.total_balance || 0), 0).toFixed(2)}`,
      icon: DollarSign,
      description: "Your total investment value",
    },
    {
      title: "Forex Returns",
      value: `$${investments.filter((i: any) => i.type === 'forex')
      .reduce((sum: number, inv: any) => sum + (inv.returns || 0), 0)
      .toFixed(2)}`,
      icon: TrendingUp,
      description: "Returns from forex trading",
    },
    {
      title: "Real Estate Value",
      value: `$${investments.filter((i: any) => i.type === 'real_estate')
      .reduce((sum: number, inv: any) => 
      sum + (inv.total_balance || 0), 0).toFixed(2)}`,
      icon: Home,
      description: "Total real estate holdings",
    },
    {
      title: "Active Loans",
      value: `$${loans.filter((l: any) => l.status === 'active')
      .reduce((sum: number, l: any) => 
      sum + (l.amount_approved || 0), 0).toFixed(2)}`,
      icon: CreditCard,
      description: "Current loan balance",
    },
  ]

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (!user || error) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profile)

      const { data: investments } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
      setInvestments(investments || [])

      const { data: loans } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', user.id)
      setLoans(loans || [])

      setLoading(false)
    }
    loadDashboard()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#050a14] flex items-center justify-center">
      <p className="text-gold text-xl">
        Loading your dashboard...
      </p>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#050a14]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-playfair text-xl font-bold text-primary">
                Apex Meridian
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Sign Out */}
          <div className="border-t border-border p-4">
            <button 
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-8 backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
                <User className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">{profile?.full_name || user?.email}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h2 className="font-playfair text-3xl font-bold text-foreground">
              Welcome back, <span className="text-primary">{profile?.full_name || user?.email}</span>
            </h2>
            <p className="mt-2 text-muted-foreground">
              Here&apos;s an overview of your investment portfolio
            </p>
          </div>

          {/* Summary Cards */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <card.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-foreground">
                    {card.value}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground">
                Recent Activity
              </h3>
              <div className="mt-6 flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mt-4 text-muted-foreground">
                  No transactions yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your recent activities will appear here
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground">
                Quick Actions
              </h3>
              <div className="mt-6 space-y-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-5 py-4 text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
                  >
                    {action.label}
                    <span className="text-primary">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
