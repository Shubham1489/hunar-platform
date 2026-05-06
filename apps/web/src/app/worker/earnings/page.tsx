'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Activity, Search, Briefcase, Wallet, User, Settings, Star,
  TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign,
  Download, Calendar, Filter, IndianRupee,
} from 'lucide-react';

const WORKER_NAV = [
  { icon: Activity, label: 'Dashboard', href: '/worker/dashboard' },
  { icon: Search, label: 'Find Jobs', href: '/worker/jobs' },
  { icon: Briefcase, label: 'Applications', href: '/worker/applications' },
  { icon: Wallet, label: 'Earnings', href: '/worker/earnings' },
  { icon: User, label: 'Profile', href: '/worker/profile' },
  { icon: Settings, label: 'Settings', href: '/worker/settings' },
];

const TRANSACTIONS = [
  { id: '1', title: 'Smart Home Wiring', client: 'Aisha Patel', amount: 1200, type: 'credit', date: 'Apr 8, 2026', status: 'completed' },
  { id: '2', title: 'Platform Fee (10%)', client: 'Hunar', amount: -120, type: 'debit', date: 'Apr 8, 2026', status: 'completed' },
  { id: '3', title: 'AC Installation', client: 'Rahul Gupta', amount: 800, type: 'credit', date: 'Apr 6, 2026', status: 'completed' },
  { id: '4', title: 'Platform Fee (10%)', client: 'Hunar', amount: -80, type: 'debit', date: 'Apr 6, 2026', status: 'completed' },
  { id: '5', title: 'Office Wiring', client: 'BuildCraft Infra', amount: 950, type: 'credit', date: 'Apr 3, 2026', status: 'completed' },
  { id: '6', title: 'EV Charger Setup', client: 'GreenCharge', amount: 1500, type: 'credit', date: 'Apr 1, 2026', status: 'pending' },
  { id: '7', title: 'Building Maintenance', client: 'FacilityPro', amount: 900, type: 'credit', date: 'Mar 29, 2026', status: 'completed' },
];

const MONTHLY_DATA = [
  { month: 'Oct', amount: 12500 },
  { month: 'Nov', amount: 15200 },
  { month: 'Dec', amount: 9800 },
  { month: 'Jan', amount: 18100 },
  { month: 'Feb', amount: 14200 },
  { month: 'Mar', amount: 21300 },
  { month: 'Apr', amount: 18500 },
];

export default function EarningsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const maxAmount = Math.max(...MONTHLY_DATA.map(d => d.amount));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Sidebar navItems={WORKER_NAV} accentColor="var(--primary)"
        profile={{ name: 'Ramesh Kumar', subtitle: 'Master Electrician', gradient: 'linear-gradient(135deg, #1E3A8A, #2563EB)', initial: 'R',
          extra: <div style={{ display: 'flex', gap: 16 }}><div><p style={{ fontSize: 11, opacity: 0.6 }}>Rating</p><p style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><Star size={13} fill="gold" color="gold" /> 4.8</p></div><div><p style={{ fontSize: 11, opacity: 0.6 }}>Jobs</p><p style={{ fontSize: 14, fontWeight: 700 }}>47</p></div></div>
        }} />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>Earnings</h1>
          <button className="btn btn-outline btn-pill" style={{ gap: 6 }}><Download size={16} /> Export CSV</button>
        </div>

        {/* Earning Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Earnings', value: '₹45,200', change: '+24%', up: true, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
            { label: 'This Month', value: '₹18,500', change: '+18%', up: true, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
            { label: 'Pending Payout', value: '₹8,500', change: '2 jobs', up: true, color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
            { label: 'Avg per Job', value: '₹962', change: '+12%', up: true, color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
          ].map(({ label, value, change, up, color, bg }) => (
            <div key={label} className="card" style={{ padding: 24 }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 4 }}>{label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{value}</p>
              <p style={{ fontSize: 13, color, display: 'flex', alignItems: 'center', gap: 4 }}>
                {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {change}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>
          {/* Chart */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Earnings Trend</h2>
              <div style={{ display: 'flex', gap: 4, background: 'var(--surface-1)', borderRadius: 10, padding: 4 }}>
                {(['week', 'month', 'year'] as const).map(p => (
                  <button key={p} onClick={() => setPeriod(p)} style={{
                    padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: period === p ? 'white' : 'transparent',
                    boxShadow: period === p ? 'var(--shadow-sm)' : 'none',
                    fontWeight: period === p ? 600 : 400, fontSize: 13, fontFamily: 'var(--font-body)',
                  }}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200 }}>
              {MONTHLY_DATA.map(d => (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)' }}>₹{(d.amount / 1000).toFixed(1)}k</p>
                  <div style={{
                    width: '100%', borderRadius: '8px 8px 0 0',
                    height: `${(d.amount / maxAmount) * 160}px`,
                    background: d.month === 'Apr'
                      ? 'linear-gradient(180deg, #3B82F6, #1E3A8A)'
                      : 'linear-gradient(180deg, rgba(59,130,246,0.3), rgba(30,58,138,0.15))',
                    transition: 'height 500ms ease',
                  }} />
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: d.month === 'Apr' ? 700 : 400 }}>{d.month}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recent Transactions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {TRANSACTIONS.map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--surface-2)' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{t.client} • {t.date}</p>
                  </div>
                  <p style={{
                    fontWeight: 700, fontSize: 14,
                    color: t.amount > 0 ? '#059669' : '#DC2626',
                  }}>
                    {t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
