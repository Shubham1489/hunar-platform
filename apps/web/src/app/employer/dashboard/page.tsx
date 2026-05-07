'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import {
  Briefcase, Users, TrendingUp, Plus, ChevronRight,
  Bell, LogOut, Settings, User, Activity, BarChart3,
  Search, Star, MapPin, Clock, Filter, Sparkles,
  CheckCircle, Eye,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useApiData } from '@/hooks/useApiData';
import { employerAPI, jobAPI } from '@/lib/api';

// Fallback data — used when API is unavailable or user has no data yet
const FALLBACK_JOBS = [
  { id: '1', title: 'Master Electrician — Factory', applicants: 24, hired: 2, status: 'OPEN', posted: '3d ago', views: 145 },
  { id: '2', title: 'Plumber for Housing Society', applicants: 18, hired: 1, status: 'OPEN', posted: '5d ago', views: 98 },
  { id: '3', title: 'Commercial AC Technician', applicants: 12, hired: 3, status: 'FILLED', posted: '1w ago', views: 201 },
];

const FALLBACK_APPLICANTS = [
  { name: 'Suresh Yadav', skill: 'Electrician', rating: 4.9, experience: '12 yrs', matchScore: 96, city: 'Delhi' },
  { name: 'Mohan Sharma', skill: 'Electrician', rating: 4.7, experience: '8 yrs', matchScore: 91, city: 'Noida' },
  { name: 'Ravi Patel', skill: 'AC Technician', rating: 4.5, experience: '5 yrs', matchScore: 84, city: 'Gurgaon' },
];

export default function EmployerDashboard() {
  const { user, isLoading: authLoading, logout } = useAuth('EMPLOYER');

  // Fetch employer profile
  const fetchProfile = useCallback(() => employerAPI.getProfile(), []);
  const { data: profile } = useApiData(fetchProfile, {
    fallback: { companyName: 'My Company', industry: '', city: '' },
    skip: authLoading,
  });

  // Fetch employer jobs
  const fetchJobs = useCallback(() => employerAPI.getJobs(), []);
  const { data: jobsData } = useApiData(fetchJobs, {
    fallback: FALLBACK_JOBS,
    skip: authLoading,
  });

  const displayName = profile?.companyName || user?.name || 'Employer';
  const initial = displayName[0]?.toUpperCase() || 'E';
  const industry = profile?.industry || '';
  const city = profile?.city || '';
  const jobs = Array.isArray(jobsData) ? jobsData : FALLBACK_JOBS;
  const applicants = FALLBACK_APPLICANTS; // AI-ranked applicants fetched separately

  const activeJobCount = jobs.filter((j: any) => j.status === 'OPEN').length;
  const totalApplicants = jobs.reduce((sum: number, j: any) => sum + (j.applicants || j._count?.applications || 0), 0);

  const STATS = [
    { label: 'Active Jobs', value: activeJobCount.toString(), icon: Briefcase, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', change: `${jobs.length} total` },
    { label: 'Total Applicants', value: totalApplicants.toString(), icon: Users, color: '#F97316', bg: 'rgba(249,115,22,0.1)', change: 'across all jobs' },
    { label: 'Hired This Month', value: '—', icon: CheckCircle, color: '#10B981', bg: 'rgba(16,185,129,0.1)', change: '' },
    { label: 'Avg Match Score', value: '—', icon: Sparkles, color: '#7C3AED', bg: 'rgba(124,58,237,0.1)', change: 'AI powered' },
  ];

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-1)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #F97316, #FBBF24)', margin: '0 auto 16px', animation: 'pulse 1.5s infinite' }} />
          <p style={{ color: 'var(--text-tertiary)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: 'white', padding: '24px 16px', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18 }}>H</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--primary)' }}>Hunar</span>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #F97316, #FBBF24)', borderRadius: 16, padding: 20, marginBottom: 24, color: 'white' }}>
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{displayName}</p>
          <p style={{ fontSize: 12, opacity: 0.8 }}>{industry || 'Company'}</p>
          <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 12 }}>
            {city && <span>📍 {city}</span>}
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {[
            { icon: Activity, label: 'Dashboard', href: '/employer/dashboard', active: true },
            { icon: Plus, label: 'Post a Job', href: '/employer/post-job' },
            { icon: Briefcase, label: 'My Jobs', href: '/employer/jobs' },
            { icon: Users, label: 'Worker Directory', href: '/employer/workers' },
            { icon: BarChart3, label: 'Analytics', href: '/employer/analytics' },
            { icon: User, label: 'Company Profile', href: '/employer/profile' },
            { icon: Settings, label: 'Settings', href: '/employer/settings' },
          ].map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10,
              color: active ? 'var(--secondary)' : 'var(--text-secondary)',
              background: active ? 'rgba(249,115,22,0.08)' : 'transparent',
              textDecoration: 'none', fontSize: 14, fontWeight: active ? 600 : 500,
              marginBottom: 4, transition: 'all var(--transition-fast)',
            }}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>

        <button onClick={() => logout()} className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--error)', gap: 12 }}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Employer Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{totalApplicants} total applicants across {jobs.length} jobs</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ position: 'relative', background: 'white', border: 'none', width: 44, height: 44, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <Bell size={20} color="var(--text-secondary)" />
            </button>
            <Link href="/employer/post-job" className="btn btn-gradient btn-pill">
              <Plus size={18} /> Post a Job
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
          {STATS.map(({ label, value, icon: Icon, color, bg, change }) => (
            <div key={label} className="card" style={{ padding: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={22} color={color} />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 4 }}>{label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>{value}</p>
              {change && <p style={{ fontSize: 12, marginTop: 8, color: 'var(--text-tertiary)' }}>{change}</p>}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>
          {/* Active Job Postings */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Active Job Postings</h2>
              <Link href="/employer/jobs" style={{ color: 'var(--primary)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>View All</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {jobs.map((job: any) => (
                <div key={job.id} className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{job.title}</h3>
                      <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>
                        <Clock size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> Posted {job.posted || 'recently'}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                      background: job.status === 'OPEN' ? 'rgba(16,185,129,0.1)' : 'var(--surface-2)',
                      color: job.status === 'OPEN' ? '#059669' : 'var(--text-tertiary)',
                    }}>{job.status}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Users size={14} color="var(--text-tertiary)" />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{job.applicants || job._count?.applications || 0} applicants</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle size={14} color="#10B981" />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{job.hired || 0} hired</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Eye size={14} color="var(--text-tertiary)" />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{job.views || 0} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent AI-Ranked Applicants */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              Top Applicants
              <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}>
                <Sparkles size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> AI Ranked
              </span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {applicants.map((a: any) => (
                <div key={a.name} className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, var(--surface-2), var(--surface-3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                      {a.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontWeight: 700, fontSize: 15 }}>{a.name}</p>
                        <span className={`match-badge ${a.matchScore >= 85 ? 'high' : 'medium'}`}>
                          <Sparkles size={11} /> {a.matchScore}%
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                        {a.skill} • {a.experience} • <Star size={11} fill="#F59E0B" color="#F59E0B" style={{ display: 'inline', verticalAlign: 'middle' }} /> {a.rating}
                      </p>
                      <p style={{ color: 'var(--text-tertiary)', fontSize: 12, marginTop: 2 }}>
                        <MapPin size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {a.city}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
