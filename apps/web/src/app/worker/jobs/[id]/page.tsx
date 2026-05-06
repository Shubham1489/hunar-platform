'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, MapPin, Clock, Star, Sparkles, Zap, CheckCircle,
  Briefcase, DollarSign, Calendar, Users, Building, Share2, Bookmark, Send,
} from 'lucide-react';

const JOBS_DB: Record<string, any> = {
  '1': {
    id: '1', title: 'Smart Home Wiring — 3BHK Apartment', company: 'TechHome Solutions', companyRating: 4.6, companyJobs: 23,
    city: 'Noida', address: 'Sector 62, Noida, UP', salary: '₹1,200/day', salaryType: 'DAILY', matchScore: 95,
    skills: ['Smart Home', 'Wiring', 'Electrician'], type: 'CONTRACT', posted: '2h ago', urgent: true, openings: 2, applicants: 12,
    experienceMin: 3, description: 'Complete smart home wiring setup including Wi-Fi switches, automated lights, and EV charger point for a luxury 3BHK apartment in Sector 62, Noida.',
    requirements: ['Minimum 3 years experience in residential wiring', 'Knowledge of smart home systems (Alexa, Google Home compatible)', 'Own tools and safety equipment', 'Punctual and reliable'],
    benefits: ['Daily wages paid via secure escrow', 'Lunch provided on-site', 'Transportation reimbursement', 'Performance bonus on completion'],
  },
  '2': {
    id: '2', title: 'Commercial Electrical Work — Office Complex', company: 'BuildCraft Infra', companyRating: 4.4, companyJobs: 56,
    city: 'Delhi', address: 'Connaught Place, New Delhi', salary: '₹950/day', salaryType: 'DAILY', matchScore: 88,
    skills: ['Electrician', 'Circuit Board'], type: 'PERMANENT', posted: '5h ago', urgent: false, openings: 3, applicants: 18,
    experienceMin: 5, description: 'Complete electrical setup for a new 5-floor commercial office building. Must be experienced with 3-phase wiring and fire safety compliance.',
    requirements: ['Minimum 5 years experience', '3-phase wiring knowledge', 'Fire safety training certificate', 'Team leadership skills'],
    benefits: ['Permanent position', 'PF + ESI benefits', 'Overtime pay at 1.5x', 'Annual bonus'],
  },
};

// fallback for IDs not in map
function getJob(id: string) {
  return JOBS_DB[id] || JOBS_DB['1'];
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  const job = getJob(params.id as string);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-1)' }}>
      {/* Top Nav */}
      <div style={{ background: 'white', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-sm)' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
          <ArrowLeft size={18} /> Back to Jobs
        </button>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* Main Content */}
          <div>
            {/* Job Header Card */}
            <div className="card" style={{ padding: 28, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, var(--surface-2), var(--surface-3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, flexShrink: 0 }}>
                    {job.company[0]}
                  </div>
                  <div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{job.title}</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {job.company} • <Star size={13} fill="#F59E0B" color="#F59E0B" /> {job.companyRating} • {job.companyJobs} jobs posted
                    </p>
                  </div>
                </div>
                <span className={`match-badge ${job.matchScore >= 85 ? 'high' : 'medium'}`} style={{ fontSize: 14, padding: '5px 14px' }}>
                  <Sparkles size={13} /> {job.matchScore}% Match
                </span>
              </div>

              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14 }}><MapPin size={15} /> {job.address}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14 }}><Clock size={15} /> Posted {job.posted}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14 }}><Users size={15} /> {job.applicants} applicants</span>
                {job.urgent && <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#DC2626', fontSize: 14, fontWeight: 600 }}><Zap size={15} /> Urgent Hiring</span>}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {job.skills.map((s: string) => <span key={s} className="chip chip-primary" style={{ fontSize: 13 }}>{s}</span>)}
              </div>
            </div>

            {/* Description */}
            <div className="card" style={{ padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Job Description</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 15 }}>{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="card" style={{ padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Requirements</h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {job.requirements.map((r: string, i: number) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'var(--text-secondary)', fontSize: 15 }}>
                    <CheckCircle size={16} color="var(--success)" style={{ marginTop: 3, flexShrink: 0 }} /> {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Benefits</h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {job.benefits.map((b: string, i: number) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'var(--text-secondary)', fontSize: 15 }}>
                    <Star size={16} color="#F59E0B" style={{ marginTop: 3, flexShrink: 0 }} /> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Salary Card */}
            <div className="card" style={{ padding: 24 }}>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 13, marginBottom: 4 }}>Salary</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--primary)' }}>{job.salary}</p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>{job.salaryType}</p>
            </div>

            {/* Job Info */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: Briefcase, label: 'Job Type', value: job.type === 'ONEDAY' ? 'One Day' : job.type.charAt(0) + job.type.slice(1).toLowerCase() },
                  { icon: Calendar, label: 'Experience', value: `${job.experienceMin}+ years` },
                  { icon: Users, label: 'Openings', value: `${job.openings} positions` },
                  { icon: MapPin, label: 'Location', value: job.city },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color="var(--text-tertiary)" />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{label}</p>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Section */}
            <div className="card" style={{ padding: 24 }}>
              {applied ? (
                <div style={{ textAlign: 'center' }}>
                  <CheckCircle size={40} color="var(--success)" style={{ marginBottom: 12 }} />
                  <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Applied!</p>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>You&apos;ll be notified when the employer responds</p>
                </div>
              ) : (
                <>
                  <button onClick={() => setApplied(true)} className="btn btn-gradient" style={{ width: '100%', padding: '14px', fontSize: 16, borderRadius: 14, marginBottom: 12 }}>
                    <Send size={18} /> Apply Now
                  </button>
                  <button onClick={() => setSaved(!saved)} className="btn btn-outline" style={{ width: '100%', padding: '14px', borderRadius: 14 }}>
                    <Bookmark size={18} fill={saved ? 'var(--primary)' : 'none'} /> {saved ? 'Saved' : 'Save Job'}
                  </button>
                </>
              )}
            </div>

            {/* Share */}
            <button className="btn btn-ghost" style={{ justifyContent: 'center', gap: 8, padding: 14 }}>
              <Share2 size={16} /> Share this Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
