'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import {
  Search, MapPin, Clock, Star, Zap, Filter, Sparkles,
  Briefcase, ChevronDown, Mic, X, Activity, Wallet,
  User, Settings, DollarSign, SlidersHorizontal,
} from 'lucide-react';

const WORKER_NAV = [
  { icon: Activity, label: 'Dashboard', href: '/worker/dashboard' },
  { icon: Search, label: 'Find Jobs', href: '/worker/jobs' },
  { icon: Briefcase, label: 'Applications', href: '/worker/applications' },
  { icon: Wallet, label: 'Earnings', href: '/worker/earnings' },
  { icon: User, label: 'Profile', href: '/worker/profile' },
  { icon: Settings, label: 'Settings', href: '/worker/settings' },
];

const ALL_JOBS = [
  { id: '1', title: 'Smart Home Wiring — 3BHK Apartment', company: 'TechHome Solutions', city: 'Noida', salary: '₹1,200/day', matchScore: 95, skills: ['Smart Home', 'Wiring', 'Electrician'], type: 'CONTRACT', posted: '2h ago', urgent: true, description: 'Complete smart home wiring setup including Wi-Fi switches, automated lights, and EV charger point.' },
  { id: '2', title: 'Commercial Electrical Work — Office Complex', company: 'BuildCraft Infra', city: 'Delhi', salary: '₹950/day', matchScore: 88, skills: ['Electrician', 'Circuit Board'], type: 'PERMANENT', posted: '5h ago', urgent: false, description: 'Complete electrical setup for a new 5-floor commercial office building.' },
  { id: '3', title: 'EV Charger Installation', company: 'GreenCharge India', city: 'Gurgaon', salary: '₹1,500/day', matchScore: 82, skills: ['EV Charger', 'Electrician'], type: 'CONTRACT', posted: '1d ago', urgent: false, description: 'Install 20 EV charger stations across a corporate tech park.' },
  { id: '4', title: 'Solar Panel Maintenance', company: 'SunPower Solutions', city: 'Faridabad', salary: '₹1,100/day', matchScore: 76, skills: ['Solar Panel', 'Electrician'], type: 'ONEDAY', posted: '2d ago', urgent: false, description: 'Routine maintenance and cleaning of solar panels on rooftop installation.' },
  { id: '5', title: 'Factory Wiring Overhaul', company: 'IndiaForge Ltd', city: 'Delhi', salary: '₹1,000/day', matchScore: 72, skills: ['Electrician', 'Wiring'], type: 'PERMANENT', posted: '3d ago', urgent: true, description: 'Complete rewiring of manufacturing floor including heavy machinery connections.' },
  { id: '6', title: 'Apartment Complex Plumbing', company: 'HomeServe India', city: 'Noida', salary: '₹800/day', matchScore: 45, skills: ['Plumber', 'Pipe Fitting'], type: 'CONTRACT', posted: '4d ago', urgent: false, description: 'Plumbing overhaul for a 100-unit apartment building.' },
  { id: '7', title: 'Mall Maintenance Electrician', company: 'FacilityPro', city: 'Gurgaon', salary: '₹900/day', matchScore: 68, skills: ['Electrician'], type: 'PERMANENT', posted: '5d ago', urgent: false, description: 'Regular electrical maintenance for a large shopping mall.' },
  { id: '8', title: 'Home AC Installation & Repair', company: 'CoolBreeze Services', city: 'Delhi', salary: '₹1,100/day', matchScore: 55, skills: ['AC Technician', 'Electrician'], type: 'CONTRACT', posted: '1w ago', urgent: false, description: 'AC installations and repairs for residential customers.' },
];

const CITIES = ['All Cities', 'Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Bangalore', 'Mumbai'];
const JOB_TYPES = ['All Types', 'PERMANENT', 'CONTRACT', 'ONEDAY'];

export default function JobSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedType, setSelectedType] = useState('All Types');
  const [salaryRange, setSalaryRange] = useState([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'recent'>('match');

  const filteredJobs = ALL_JOBS
    .filter(j => {
      if (searchQuery && !j.title.toLowerCase().includes(searchQuery.toLowerCase()) && !j.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
      if (selectedCity !== 'All Cities' && j.city !== selectedCity) return false;
      if (selectedType !== 'All Types' && j.type !== selectedType) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'match') return b.matchScore - a.matchScore;
      if (sortBy === 'salary') return parseInt(b.salary.replace(/[^0-9]/g, '')) - parseInt(a.salary.replace(/[^0-9]/g, ''));
      return 0;
    });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Sidebar
        navItems={WORKER_NAV}
        accentColor="var(--primary)"
        profile={{
          name: 'Ramesh Kumar', subtitle: 'Master Electrician',
          gradient: 'linear-gradient(135deg, #1E3A8A, #2563EB)', initial: 'R',
          extra: (
            <div style={{ display: 'flex', gap: 16 }}>
              <div><p style={{ fontSize: 11, opacity: 0.6 }}>Rating</p><p style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><Star size={13} fill="gold" color="gold" /> 4.8</p></div>
              <div><p style={{ fontSize: 11, opacity: 0.6 }}>Jobs</p><p style={{ fontSize: 14, fontWeight: 700 }}>47</p></div>
            </div>
          ),
        }}
      />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Find Jobs</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{filteredJobs.length} jobs matching your skills</p>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            background: 'white', borderRadius: 14, padding: '14px 20px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <Search size={18} color="var(--text-tertiary)" />
            <input
              placeholder="Search by job title, skill, or company..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'none', border: 'none', outline: 'none',
                fontSize: 15, width: '100%', fontFamily: 'var(--font-body)',
                color: 'var(--text-primary)',
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={16} color="var(--text-tertiary)" />
              </button>
            )}
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn btn-outline btn-pill" style={{ gap: 6 }}>
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {/* Filter Bar */}
        {showFilters && (
          <div className="card" style={{ padding: 20, marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>City</p>
              <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 8, border: '2px solid var(--surface-3)', background: 'white', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>Job Type</p>
              <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 8, border: '2px solid var(--surface-3)', background: 'white', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                {JOB_TYPES.map(t => <option key={t} value={t}>{t === 'ONEDAY' ? 'One Day' : t === 'All Types' ? t : t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>Sort By</p>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as 'match' | 'salary' | 'recent')}
                style={{ padding: '8px 12px', borderRadius: 8, border: '2px solid var(--surface-3)', background: 'white', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                <option value="match">Best Match</option>
                <option value="salary">Highest Salary</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>
        )}

        {/* Job Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredJobs.map(job => (
            <Link key={job.id} href={`/worker/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'linear-gradient(135deg, var(--surface-2), var(--surface-3))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 700, flexShrink: 0,
                }}>{job.company[0]}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{job.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                        {job.company} • <MapPin size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {job.city}
                      </p>
                    </div>
                    <span className={`match-badge ${job.matchScore >= 85 ? 'high' : job.matchScore >= 60 ? 'medium' : 'low'}`}>
                      <Sparkles size={11} /> {job.matchScore}% Match
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-tertiary)', fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>{job.description}</p>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    {job.skills.map(s => <span key={s} className="chip" style={{ fontSize: 11, padding: '2px 8px' }}>{s}</span>)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 15 }}>{job.salary}</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}><Clock size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {job.posted}</span>
                    <span className="chip" style={{ fontSize: 11, padding: '2px 8px' }}>
                      {job.type === 'ONEDAY' ? 'One Day' : job.type.charAt(0) + job.type.slice(1).toLowerCase()}
                    </span>
                    {job.urgent && <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}><Zap size={11} /> Urgent</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {filteredJobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <Search size={48} color="var(--surface-3)" style={{ marginBottom: 16 }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No jobs found</h3>
              <p style={{ color: 'var(--text-tertiary)' }}>Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
