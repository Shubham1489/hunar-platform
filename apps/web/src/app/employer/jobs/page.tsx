'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import {
  Activity, Briefcase, Users, BarChart3, Settings,
  Plus, Star, MapPin, Filter, Search, ChevronRight,
  Eye, MoreHorizontal, Pause, Play, Trash,
} from 'lucide-react';

const EMPLOYER_NAV = [
  { icon: Activity, label: 'Dashboard', href: '/employer/dashboard' },
  { icon: Briefcase, label: 'My Jobs', href: '/employer/jobs' },
  { icon: Plus, label: 'Post Job', href: '/employer/jobs/new' },
  { icon: Users, label: 'Workers', href: '/employer/workers' },
  { icon: BarChart3, label: 'Analytics', href: '/employer/analytics' },
  { icon: Settings, label: 'Settings', href: '/employer/settings' },
];

const MY_JOBS = [
  { id: '1', title: 'Smart Home Wiring — 3BHK', status: 'OPEN', applicants: 12, shortlisted: 3, hired: 1, salary: '₹1,200/day', city: 'Noida', openings: 2, posted: 'Apr 5, 2026' },
  { id: '2', title: 'Office Electrical Setup', status: 'OPEN', applicants: 18, shortlisted: 5, hired: 0, salary: '₹950/day', city: 'Delhi', openings: 3, posted: 'Apr 3, 2026' },
  { id: '3', title: 'Factory Maintenance', status: 'PAUSED', applicants: 8, shortlisted: 2, hired: 2, salary: '₹800/day', city: 'Gurgaon', openings: 0, posted: 'Mar 28, 2026' },
  { id: '4', title: 'EV Charger Installation — Campus', status: 'FILLED', applicants: 25, shortlisted: 6, hired: 4, salary: '₹1,500/day', city: 'Noida', openings: 0, posted: 'Mar 20, 2026' },
  { id: '5', title: 'Solar Panel Setup — Warehouse', status: 'CLOSED', applicants: 15, shortlisted: 4, hired: 3, salary: '₹1,100/day', city: 'Delhi', openings: 0, posted: 'Mar 10, 2026' },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  OPEN: { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
  PAUSED: { bg: 'rgba(245,158,11,0.1)', color: '#B45309' },
  FILLED: { bg: 'rgba(59,130,246,0.1)', color: '#2563EB' },
  CLOSED: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' },
};

export default function EmployerJobsPage() {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const filtered = filterStatus === 'ALL' ? MY_JOBS : MY_JOBS.filter(j => j.status === filterStatus);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Sidebar navItems={EMPLOYER_NAV} accentColor="#7C3AED"
        profile={{ name: 'Priya Sharma', subtitle: 'TechHome Solutions', gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)', initial: 'P' }} />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>My Job Postings</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{MY_JOBS.length} total jobs</p>
          </div>
          <Link href="/employer/jobs/new" className="btn btn-gradient" style={{ padding: '12px 24px', borderRadius: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={18} /> Post New Job
          </Link>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['ALL', 'OPEN', 'PAUSED', 'FILLED', 'CLOSED'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{
                padding: '8px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: filterStatus === s ? '#7C3AED' : 'white',
                color: filterStatus === s ? 'white' : 'var(--text-secondary)',
                fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-body)', boxShadow: filterStatus === s ? 'none' : 'var(--shadow-sm)',
              }}>{s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}</button>
          ))}
        </div>

        {/* Job Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(job => {
            const sc = STATUS_COLORS[job.status] || STATUS_COLORS.CLOSED;
            return (
              <div key={job.id} className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700 }}>{job.title}</h3>
                      <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color }}>{job.status}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {job.city} • {job.salary} • Posted {job.posted}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm btn-outline" style={{ borderRadius: 999 }}><Eye size={14} /> View</button>
                  </div>
                </div>

                {/* Applicant Funnel */}
                <div style={{ display: 'flex', gap: 32, marginTop: 16, padding: '16px 0', borderTop: '1px solid var(--surface-2)' }}>
                  {[
                    { label: 'Applicants', value: job.applicants, color: '#3B82F6' },
                    { label: 'Shortlisted', value: job.shortlisted, color: '#F59E0B' },
                    { label: 'Hired', value: job.hired, color: '#10B981' },
                    { label: 'Openings Left', value: job.openings, color: '#6B7280' },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <p style={{ fontSize: 22, fontWeight: 800, color }}>{value}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
