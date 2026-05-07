'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Briefcase, DollarSign, Star, MapPin, Clock, TrendingUp,
  Search, Mic, Bell, LogOut, User, Settings, ChevronRight,
  ArrowUpRight, Activity, Calendar, Zap, CheckCircle,
  Sparkles, Filter, Wrench, BarChart3, Wallet,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useApiData } from '@/hooks/useApiData';
import { workerAPI, jobAPI } from '@/lib/api';

// Fallback data — used when API is unavailable or user has no data yet
const FALLBACK_EARNINGS = { total: 0, pending: 0, thisMonth: 0, lastMonth: 0 };
const FALLBACK_STATS = { jobsCompleted: 0, activeApplications: 0, rating: 0, reviewCount: 0 };

const FALLBACK_RECOMMENDATIONS = [
  {
    id: '1', title: 'Smart Home Wiring — 3BHK Apartment', company: 'TechHome Solutions',
    city: 'Noida', salary: '₹1,200/day', matchScore: 95, skills: ['Smart Home', 'Wiring', 'Electrician'],
    type: 'Contract', posted: '2h ago', urgent: true,
  },
  {
    id: '2', title: 'Commercial Electrical Work — Office Complex', company: 'BuildCraft Infra',
    city: 'Delhi', salary: '₹950/day', matchScore: 88, skills: ['Electrician', 'Circuit Board'],
    type: 'Permanent', posted: '5h ago', urgent: false,
  },
  {
    id: '3', title: 'EV Charger Installation', company: 'GreenCharge India',
    city: 'Gurgaon', salary: '₹1,500/day', matchScore: 82, skills: ['EV Charger', 'Electrician'],
    type: 'Contract', posted: '1d ago', urgent: false,
  },
  {
    id: '4', title: 'Solar Panel Maintenance', company: 'SunPower Solutions',
    city: 'Faridabad', salary: '₹1,100/day', matchScore: 76, skills: ['Solar Panel', 'Electrician'],
    type: 'One Day', posted: '2d ago', urgent: false,
  },
];

const FALLBACK_APPLICATIONS = [
  { id: '1', title: 'Factory Electrician', company: 'IndiaForge Ltd', status: 'SHORTLISTED', date: '2d ago' },
  { id: '2', title: 'Building Rewiring', company: 'HomeServe India', status: 'APPLIED', date: '3d ago' },
  { id: '3', title: 'Mall Maintenance', company: 'FacilityPro', status: 'HIRED', date: '5d ago' },
];

const NAV_ITEMS = [
  { icon: Activity, label: 'Dashboard', href: '/worker/dashboard', active: true },
  { icon: Search, label: 'Find Jobs', href: '/worker/jobs' },
  { icon: Briefcase, label: 'Applications', href: '/worker/applications' },
  { icon: Wallet, label: 'Earnings', href: '/worker/earnings' },
  { icon: User, label: 'Profile', href: '/worker/profile' },
  { icon: Settings, label: 'Settings', href: '/worker/settings' },
];

function MatchBadge({ score }: { score: number }) {
  const level = score >= 85 ? 'high' : score >= 60 ? 'medium' : 'low';
  return (
    <span className={`match-badge ${level}`}>
      <Sparkles size={11} /> {score}% Match
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    APPLIED: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
    SHORTLISTED: { bg: 'rgba(245,158,11,0.1)', color: '#B45309' },
    HIRED: { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
    REJECTED: { bg: 'rgba(239,68,68,0.1)', color: '#DC2626' },
  };
  const style = colors[status] || colors.APPLIED;
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600,
      background: style.bg, color: style.color,
    }}>{status}</span>
  );
}

export default function WorkerDashboard() {
  const { user, isLoading: authLoading, logout } = useAuth('WORKER');

  // Fetch worker profile from API
  const fetchProfile = useCallback(() => workerAPI.getProfile(), []);
  const { data: profile } = useApiData(fetchProfile, {
    fallback: { user: { name: 'Worker' }, ratingAvg: 0, ratingCount: 0, jobsCompleted: 0 },
    skip: authLoading,
  });

  // Fetch earnings
  const fetchEarnings = useCallback(() => workerAPI.getEarnings(), []);
  const { data: earnings } = useApiData(fetchEarnings, {
    fallback: FALLBACK_EARNINGS,
    skip: authLoading,
  });

  // Fetch applications
  const fetchApps = useCallback(() => workerAPI.getApplications(), []);
  const { data: applications } = useApiData(fetchApps, {
    fallback: FALLBACK_APPLICATIONS,
    skip: authLoading,
  });

  const displayName = user?.name || profile?.user?.name || 'Worker';
  const firstName = displayName.split(' ')[0];
  const initial = displayName[0]?.toUpperCase() || 'W';
  const rating = profile?.ratingAvg || FALLBACK_STATS.rating;
  const reviewCount = profile?.ratingCount || FALLBACK_STATS.reviewCount;
  const jobsCompleted = profile?.jobsCompleted || FALLBACK_STATS.jobsCompleted;

  const stats = {
    ...FALLBACK_EARNINGS,
    ...(typeof earnings === 'object' && earnings !== null ? earnings : {}),
  };

  const appsList = Array.isArray(applications) ? applications : FALLBACK_APPLICATIONS;
  const recommendations = FALLBACK_RECOMMENDATIONS; // AI recommendations fetched separately

  const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  };
  const [greeting] = useState(getGreeting);

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-1)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', margin: '0 auto 16px', animation: 'pulse 1.5s infinite' }} />
          <p style={{ color: 'var(--text-tertiary)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      {/* ─── Sidebar ─── */}
      <aside style={{
        width: 260, background: 'white', padding: '24px 16px',
        display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', marginBottom: 32 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: 18,
          }}>H</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--primary)' }}>Hunar</span>
        </div>

        {/* Profile card */}
        <div style={{
          background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
          borderRadius: 16, padding: 20, marginBottom: 24,
          color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 700,
            }}>{initial}</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15 }}>{displayName}</p>
              <p style={{ fontSize: 12, opacity: 0.7 }}>{user?.role || 'Worker'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, opacity: 0.6 }}>Rating</p>
              <p style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={13} fill="gold" color="gold" /> {rating || '—'}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 11, opacity: 0.6 }}>Jobs</p>
              <p style={{ fontSize: 14, fontWeight: 700 }}>{jobsCompleted}</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1 }}>
          {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 10,
              color: active ? 'var(--primary)' : 'var(--text-secondary)',
              background: active ? 'rgba(30,58,138,0.08)' : 'transparent',
              textDecoration: 'none', fontSize: 14, fontWeight: active ? 600 : 500,
              marginBottom: 4, transition: 'all var(--transition-fast)',
            }}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <button onClick={() => logout()} className="btn btn-ghost" style={{
          justifyContent: 'flex-start', color: 'var(--error)', gap: 12,
        }}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* ─── Main Content ─── */}
      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        {/* Top bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 32,
        }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
              {greeting}, {firstName} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              You have <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{recommendations.length} new matches</span> today
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button style={{
              position: 'relative', background: 'white', border: 'none',
              width: 44, height: 44, borderRadius: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <Bell size={20} color="var(--text-secondary)" />
              <span style={{
                position: 'absolute', top: 8, right: 8, width: 8, height: 8,
                borderRadius: '50%', background: 'var(--error)',
              }} />
            </button>
          </div>
        </div>

        {/* ─── Stats Grid ─── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
          marginBottom: 32,
        }} className="stagger-children">
          {[
            {
              label: 'Total Earnings', value: `₹${(stats.total || 0).toLocaleString()}`,
              icon: Wallet, color: '#10B981', bg: 'rgba(16,185,129,0.1)',
              change: stats.total ? '+24%' : 'No earnings yet', changeColor: '#059669',
            },
            {
              label: 'This Month', value: `₹${(stats.thisMonth || 0).toLocaleString()}`,
              icon: TrendingUp, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)',
              change: stats.thisMonth ? '+18%' : '—', changeColor: '#2563EB',
            },
            {
              label: 'Jobs Completed', value: jobsCompleted.toString(),
              icon: CheckCircle, color: '#F97316', bg: 'rgba(249,115,22,0.1)',
              change: jobsCompleted ? `${jobsCompleted} total` : 'No jobs yet',
            },
            {
              label: 'Rating', value: rating ? rating.toString() : '—',
              icon: Star, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',
              change: reviewCount ? `${reviewCount} reviews` : 'No reviews yet',
            },
          ].map(({ label, value, icon: Icon, color, bg, change, changeColor }) => (
            <div key={label} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: bg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color={color} />
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 4 }}>{label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>{value}</p>
              {change && (
                <p style={{ fontSize: 12, marginTop: 8, color: changeColor || 'var(--text-tertiary)' }}>
                  {change}
                </p>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          {/* ─── AI Job Recommendations ─── */}
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>
                  AI Recommended Jobs
                </h2>
                <span style={{
                  padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                  background: 'rgba(249,115,22,0.1)', color: '#F97316',
                }}>
                  <Sparkles size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> AI Powered
                </span>
              </div>
              <Link href="/worker/jobs" style={{
                color: 'var(--primary)', fontSize: 14, fontWeight: 600,
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
              }}>
                View All <ChevronRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recommendations.map((job) => (
                <div key={job.id} className="card" style={{
                  padding: 20, cursor: 'pointer',
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                }}>
                  {/* Company avatar */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'linear-gradient(135deg, var(--surface-2), var(--surface-3))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                  }}>
                    {job.company[0]}
                  </div>

                  {/* Job details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{job.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                          {job.company} • <MapPin size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {job.city}
                        </p>
                      </div>
                      <MatchBadge score={job.matchScore} />
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8, marginBottom: 10 }}>
                      {job.skills.map(s => (
                        <span key={s} className="chip" style={{ fontSize: 11, padding: '2px 8px' }}>{s}</span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 14 }}>
                        {job.salary}
                      </span>
                      <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>
                        <Clock size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {job.posted}
                      </span>
                      <span className="chip" style={{ fontSize: 11, padding: '2px 8px' }}>{job.type}</span>
                      {job.urgent && (
                        <span style={{
                          fontSize: 11, color: '#DC2626', fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: 3,
                        }}>
                          <Zap size={11} /> Urgent
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Right Sidebar ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Availability toggle */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15 }}>Availability</p>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>You&apos;re visible to employers</p>
                </div>
                <div style={{
                  width: 52, height: 28, borderRadius: 14, background: '#10B981',
                  display: 'flex', alignItems: 'center', padding: '0 3px',
                  cursor: 'pointer', transition: 'all var(--transition-base)',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', background: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)', marginLeft: 'auto',
                    transition: 'all var(--transition-base)',
                  }} />
                </div>
              </div>
            </div>

            {/* Next Scheduled Job */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={16} color="var(--primary)" /> Next Job
              </h3>
              <div style={{
                background: 'var(--surface-1)', borderRadius: 12, padding: 16,
              }}>
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Mall Maintenance</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>FacilityPro • Connaught Place</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={12} /> Tomorrow, 9 AM
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>₹1,000/day</span>
                </div>
              </div>
            </div>

            {/* Applications tracker */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>My Applications</h3>
                <Link href="/worker/applications" style={{
                  color: 'var(--primary)', fontSize: 13, fontWeight: 600, textDecoration: 'none',
                }}>See all</Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {appsList.map((app: any) => (
                  <div key={app.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0',
                  }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{app.title}</p>
                      <p style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>{app.company} • {app.date}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { icon: Mic, label: 'Add Skills by Voice', color: '#F97316' },
                  { icon: BarChart3, label: 'Salary Insights', color: '#3B82F6' },
                  { icon: Wrench, label: 'Edit Skills', color: '#0D9488' },
                  { icon: User, label: 'Edit Profile', color: '#7C3AED' },
                ].map(({ icon: Icon, label, color }) => (
                  <button key={label} style={{
                    background: `${color}08`, border: 'none',
                    borderRadius: 12, padding: 14,
                    cursor: 'pointer', textAlign: 'center',
                    transition: 'all var(--transition-fast)',
                  }}>
                    <Icon size={20} color={color} style={{ marginBottom: 6 }} />
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
