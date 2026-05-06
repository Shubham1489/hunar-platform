'use client';

import Sidebar from '@/components/Sidebar';
import {
  Activity, Briefcase, Users, BarChart3, Settings, Plus,
  TrendingUp, ArrowUpRight, ArrowDownRight, Eye,
  UserCheck, Clock, Star, DollarSign, PieChart,
} from 'lucide-react';

const EMPLOYER_NAV = [
  { icon: Activity, label: 'Dashboard', href: '/employer/dashboard' },
  { icon: Briefcase, label: 'My Jobs', href: '/employer/jobs' },
  { icon: Plus, label: 'Post Job', href: '/employer/jobs/new' },
  { icon: Users, label: 'Workers', href: '/employer/workers' },
  { icon: BarChart3, label: 'Analytics', href: '/employer/analytics' },
  { icon: Settings, label: 'Settings', href: '/employer/settings' },
];

const MONTHLY_HIRES = [
  { month: 'Oct', hires: 2, spent: 45000 },
  { month: 'Nov', hires: 4, spent: 82000 },
  { month: 'Dec', hires: 1, spent: 22000 },
  { month: 'Jan', hires: 5, spent: 110000 },
  { month: 'Feb', hires: 3, spent: 67000 },
  { month: 'Mar', hires: 6, spent: 135000 },
  { month: 'Apr', hires: 4, spent: 92000 },
];

const TOP_SKILLS = [
  { skill: 'Electrician', hires: 12, percentage: 40 },
  { skill: 'Wiring', hires: 8, percentage: 27 },
  { skill: 'Smart Home', hires: 5, percentage: 17 },
  { skill: 'AC Repair', hires: 3, percentage: 10 },
  { skill: 'Plumber', hires: 2, percentage: 6 },
];

const SKILL_COLORS = ['#7C3AED', '#A855F7', '#C084FC', '#DDD6FE', '#EDE9FE'];

export default function AnalyticsPage() {
  const maxHires = Math.max(...MONTHLY_HIRES.map(d => d.hires));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Sidebar navItems={EMPLOYER_NAV} accentColor="#7C3AED"
        profile={{ name: 'Priya Sharma', subtitle: 'TechHome Solutions', gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)', initial: 'P' }} />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Hiring Analytics</h1>

        {/* Top Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Jobs Posted', value: '23', change: '+3 this month', icon: Briefcase, color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
            { label: 'Total Hires', value: '30', change: '+6 this month', icon: UserCheck, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
            { label: 'Avg Time to Hire', value: '3.2 days', change: '-0.5 days', icon: Clock, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
            { label: 'Total Spent', value: '₹5.5L', change: '+₹92K this month', icon: DollarSign, color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
          ].map(({ label, value, change, icon: Icon, color, bg }) => (
            <div key={label} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={color} />
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 4 }}>{label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{value}</p>
              <p style={{ fontSize: 12, color, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ArrowUpRight size={14} /> {change}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>
          {/* Hiring Trend */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Monthly Hiring Trend</h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 220 }}>
              {MONTHLY_HIRES.map(d => (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED' }}>{d.hires}</p>
                  <div style={{
                    width: '100%', borderRadius: '8px 8px 0 0',
                    height: `${(d.hires / maxHires) * 170}px`,
                    background: d.month === 'Apr'
                      ? 'linear-gradient(180deg, #A855F7, #7C3AED)'
                      : 'linear-gradient(180deg, rgba(168,85,247,0.3), rgba(124,58,237,0.15))',
                    transition: 'height 500ms ease',
                  }} />
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{d.month}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>₹{(d.spent / 1000).toFixed(0)}k</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Skills Hired</h2>

            {/* Simple pie visualization */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ width: 140, height: 140, borderRadius: '50%', background: `conic-gradient(${TOP_SKILLS.map((s, i) => `${SKILL_COLORS[i]} ${TOP_SKILLS.slice(0, i).reduce((a, b) => a + b.percentage, 0)}% ${TOP_SKILLS.slice(0, i + 1).reduce((a, b) => a + b.percentage, 0)}%`).join(', ')})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: '#7C3AED' }}>30</p>
                    <p style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Total</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {TOP_SKILLS.map((s, i) => (
                <div key={s.skill} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: SKILL_COLORS[i], flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{s.skill}</span>
                      <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{s.hires} hires ({s.percentage}%)</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${s.percentage}%`, background: SKILL_COLORS[i], borderRadius: 2, transition: 'width 500ms ease' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hiring Funnel */}
        <div className="card" style={{ padding: 24, marginTop: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Hiring Funnel (This Month)</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {[
              { label: 'Jobs Posted', value: 5, color: '#7C3AED' },
              { label: 'Applications', value: 48, color: '#A855F7' },
              { label: 'Shortlisted', value: 16, color: '#F59E0B' },
              { label: 'Interviewed', value: 10, color: '#3B82F6' },
              { label: 'Hired', value: 6, color: '#10B981' },
            ].map(({ label, value, color }, i) => (
              <div key={label} style={{ flex: 1 }}>
                <div style={{
                  height: 48, borderRadius: 10, background: color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: 20,
                }}>{value}</div>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 6 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
