'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CreditCard,
  LogOut,
  ChevronDown,
  Check,
  X,
} from 'lucide-react';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  joinedDate: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

interface LoanApplication {
  id: string;
  user: string;
  amountRequested: number;
  purpose: string;
  date: string;
}

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [users] = useState<User[]>([]);
  const [loans] = useState<LoanApplication[]>([]);

  const stats: StatCard[] = [
    {
      label: 'Total Users',
      value: 0,
      icon: <Users className="w-6 h-6 text-primary" />,
    },
    {
      label: 'Active Investments',
      value: 0,
      icon: <Briefcase className="w-6 h-6 text-primary" />,
    },
    {
      label: 'Pending Loans',
      value: 0,
      icon: <CreditCard className="w-6 h-6 text-primary" />,
    },
    {
      label: 'Total Assets Under Management',
      value: '$0.00',
      icon: <LayoutDashboard className="w-6 h-6 text-primary" />,
    },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'loans', label: 'Manage Loans', icon: Briefcase },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
  ];

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleApprove = (id: string) => {
    console.log('Approve loan:', id);
  };

  const handleReject = (id: string) => {
    console.log('Reject loan:', id);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary">Apex Meridian</h1>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeNav === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Control Panel</h1>
            <p className="text-sm text-muted-foreground">Apex Meridian Management System</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">Admin</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 text-primary" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="p-2 bg-secondary rounded-lg">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Users Table */}
          <div className="bg-card border border-border rounded-lg mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Recent Users</h2>
            </div>
            {users.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-muted-foreground">No users yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Country
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Joined Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-secondary transition-colors">
                        <td className="px-6 py-4 text-sm text-foreground">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{user.country}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{user.joinedDate}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.status === 'Active'
                                ? 'bg-green-900 text-green-200'
                                : user.status === 'Pending'
                                  ? 'bg-yellow-900 text-yellow-200'
                                  : 'bg-gray-700 text-gray-200'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-primary hover:text-accent transition-colors">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pending Loan Applications Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Pending Loan Applications</h2>
            </div>
            {loans.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-muted-foreground">No pending loans</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Amount Requested
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Purpose
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-secondary transition-colors">
                        <td className="px-6 py-4 text-sm text-foreground">{loan.user}</td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          ${loan.amountRequested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">{loan.purpose}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{loan.date}</td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => handleApprove(loan.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(loan.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
