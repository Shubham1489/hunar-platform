'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Search, Briefcase, Activity, Wallet, User, Settings, Star,
  Clock, MapPin, ChevronDown, CheckCircle, XCircle, AlertCircle,
  Filter,
} from 'lucide-react';

const WORKER_NAV = [
  { icon: Activity, label: 'Dashboard', href: '/worker/dashboard' },
  { icon: Search, label: 'Find Jobs', href: '/worker/jobs' },
  { icon: Briefcase, label: 'Applications', href: '/worker/applications' },
  { icon: Wallet, label: 'Earnings', href: '/worker/earnings' },
  { icon: User, label: 'Profile', href: '/worker/profile' },
  { icon: Settings, label: 'Settings', href: '/worker/settings' },
];

const APPLICATIONS = [
  { id: '1', title: 'Smart Home Wiring — 3BHK', company: 'TechHome Solutions', city: 'Noida', salary: '₹1,200/day', status: 'SHORTLISTED', appliedDate: 'Apr 5, 2026', matchScore: 95, lastUpdate: '1d ago' },
  { id: '2', title: 'Factory Electrician', company: 'IndiaForge Ltd', city: 'Delhi', salary: '₹1,000/day', status: 'APPLIED', appliedDate: 'Apr 3, 2026', matchScore: 72, lastUpdate: '3d ago' },
  { id: '3', title: 'Mall Maintenance', company: 'FacilityPro', city: 'Gurgaon', salary: '₹900/day', status: 'HIRED', appliedDate: 'Apr 1, 2026', matchScore: 68, lastUpdate: '5d ago' },
  { id: '4', title: 'Building Rewiring', company: 'HomeServe India', city: 'Delhi', salary: '₹850/day', status: 'REJECTED', appliedDate: 'Mar 28, 2026', matchScore: 55, lastUpdate: '1w ago' },
  { id: '5', title: 'EV Charger Setup', company: 'GreenCharge India', city: 'Gurgaon', salary: '₹1,500/day', status: 'APPLIED', appliedDate: 'Apr 7, 2026', matchScore: 82, lastUpdate: '12h ago' },
  { id: '6', title: 'Office Complex Wiring', company: 'BuildCraft Infra', city: 'Delhi', salary: '₹950/day', status: 'SHORTLISTED', appliedDate: 'Apr 6, 2026', matchScore: 88, lastUpdate: '2d ago' },
];

const STATUS_CONFIG: Record<string, { bg: string; color: string; icon: any; label: string }> = {
  APPLIED: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6', icon: Clock, label: 'Applied' },
  SHORTLISTED: { bg: 'rgba(245,158,11,0.1)', color: '#B45309', icon: AlertCircle, label: 'Shortlisted' },
  HIRED: { bg: 'rgba(16,185,129,0.1)', color: '#059669', icon: CheckCircle, label: 'Hired' },
  REJECTED: { bg: 'rgba(239,68,68,0.1)', color: '#DC2626', icon: XCircle, label: 'Rejected' },
};

export default function ApplicationsPage() {
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filtered = filterStatus === 'ALL' ? APPLICATIONS : APPLICATIONS.filter(a => a.status === filterStatus);

  const stats = {
    total: APPLICATIONS.length,
    applied: APPLICATIONS.filter(a => a.status === 'APPLIED').length,
    shortlisted: APPLICATIONS.filter(a => a.status === 'SHORTLISTED').length,
    hired: APPLICATIONS.filter(a => a.status === 'HIRED').length,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Sidebar navItems={WORKER_NAV} accentColor="var(--primary)"
        profile={{ name: 'Ramesh Kumar', subtitle: 'Master Electrician', gradient: 'linear-gradient(135deg, #1E3A8A, #2563EB)', initial: 'R',
          extra: <div style={{ display: 'flex', gap: 16 }}><div><p style={{ fontSize: 11, opacity: 0.6 }}>Rating</p><p style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><Star size={13} fill="gold" color="gold" /> 4.8</p></div><div><p style={{ fontSize: 11, opacity: 0.6 }}>Jobs</p><p style={{ fontSize: 14, fontWeight: 700 }}>47</p></div></div>
        }} />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 24 }}>My Applications</h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total', value: stats.total, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
            { label: 'Applied', value: stats.applied, color: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
            { label: 'Shortlisted', value: stats.shortlisted, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
            { label: 'Hired', value: stats.hired, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="card" style={{ padding: 20, textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color }}>{value}</p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['ALL', 'APPLIED', 'SHORTLISTED', 'HIRED', 'REJECTED'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{
                padding: '8px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: filterStatus === s ? 'var(--primary)' : 'white',
                color: filterStatus === s ? 'white' : 'var(--text-secondary)',
                fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-body)',
                boxShadow: filterStatus === s ? 'none' : 'var(--shadow-sm)',
              }}>{s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}</button>
          ))}
        </div>

        {/* Application List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(app => {
            const status = STATUS_CONFIG[app.status];
            const StatusIcon = status.icon;
            return (
              <div key={app.id} className="card" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--surface-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>{app.company[0]}</div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{app.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{app.company} • <MapPin size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {app.city}</p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: 12, marginTop: 4 }}>Applied: {app.appliedDate} • Updated: {app.lastUpdate}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 14 }}>{app.salary}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{app.matchScore}% match</p>
                  </div>
                  <span style={{
                    padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                    background: status.bg, color: status.color,
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}><StatusIcon size={14} /> {status.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
