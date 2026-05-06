'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import {
  Activity, Briefcase, Users, BarChart3, Settings, Star,
  Plus, X, MapPin, DollarSign, Clock, CheckCircle, Sparkles,
} from 'lucide-react';

const EMPLOYER_NAV = [
  { icon: Activity, label: 'Dashboard', href: '/employer/dashboard' },
  { icon: Briefcase, label: 'My Jobs', href: '/employer/jobs' },
  { icon: Plus, label: 'Post Job', href: '/employer/jobs/new' },
  { icon: Users, label: 'Workers', href: '/employer/workers' },
  { icon: BarChart3, label: 'Analytics', href: '/employer/analytics' },
  { icon: Settings, label: 'Settings', href: '/employer/settings' },
];

const SKILL_OPTIONS = [
  'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Welder', 'Mason',
  'AC Technician', 'Wiring', 'Pipe Fitting', 'Tile Work', 'Woodwork',
  'Smart Home', 'EV Charger', 'Solar Panel', 'CCTV Installation',
];

export default function PostJobPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [jobType, setJobType] = useState('CONTRACT');
  const [salaryType, setSalaryType] = useState('DAILY');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [expMin, setExpMin] = useState('0');
  const [expMax, setExpMax] = useState('');
  const [city, setCity] = useState('');
  const [openings, setOpenings] = useState('1');

  const [salaryPrediction, setSalaryPrediction] = useState<{min: number; median: number; max: number} | null>(null);

  const addSkill = (s: string) => {
    if (!selectedSkills.includes(s)) setSelectedSkills([...selectedSkills, s]);
    setSkillSearch('');
  };

  const removeSkill = (s: string) => setSelectedSkills(selectedSkills.filter(sk => sk !== s));

  const predictSalary = () => {
    // Simulate AI salary prediction
    const base = selectedSkills.includes('Electrician') ? 800 : selectedSkills.includes('Plumber') ? 700 : 600;
    const exp = parseInt(expMin) || 0;
    const mult = 1 + exp * 0.06;
    const median = Math.round(base * mult);
    setSalaryPrediction({ min: Math.round(median * 0.85), median, max: Math.round(median * 1.2) });
    setSalaryMin(String(Math.round(median * 0.85)));
    setSalaryMax(String(Math.round(median * 1.2)));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => router.push('/employer/dashboard'), 2000);
  };

  const filteredSkills = SKILL_OPTIONS.filter(s =>
    s.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedSkills.includes(s)
  );

  if (submitted) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
        <Sidebar navItems={EMPLOYER_NAV} accentColor="#7C3AED"
          profile={{ name: 'Priya Sharma', subtitle: 'TechHome Solutions', gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)', initial: 'P' }} />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={40} color="var(--success)" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Job Posted! 🎉</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Your job is now live. AI is matching you with the best candidates.</p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 14, marginTop: 8 }}>Redirecting to dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Sidebar navItems={EMPLOYER_NAV} accentColor="#7C3AED"
        profile={{ name: 'Priya Sharma', subtitle: 'TechHome Solutions', gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)', initial: 'P' }} />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Post a New Job</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Fill in the details and our AI will match you with the best candidates</p>

          {/* Progress Steps */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {['Job Details', 'Skills & Requirements', 'Salary & Location'].map((label, i) => (
              <div key={label} style={{ flex: 1 }}>
                <div style={{
                  height: 4, borderRadius: 2, marginBottom: 8,
                  background: i + 1 <= step ? 'linear-gradient(90deg, #7C3AED, #A855F7)' : 'var(--surface-3)',
                  transition: 'all 300ms ease',
                }} />
                <p style={{ fontSize: 12, fontWeight: 600, color: i + 1 <= step ? '#7C3AED' : 'var(--text-tertiary)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="card" style={{ padding: 32 }}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Job Title *</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Master Electrician for Apartment Wiring"
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '2px solid var(--surface-3)', outline: 'none', fontSize: 15, fontFamily: 'var(--font-body)' }} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Description *</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5}
                  placeholder="Describe the job responsibilities, work conditions, and any other relevant details..."
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '2px solid var(--surface-3)', outline: 'none', fontSize: 15, fontFamily: 'var(--font-body)', resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Job Type *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { value: 'PERMANENT', label: 'Permanent', desc: 'Full-time role' },
                    { value: 'CONTRACT', label: 'Contract', desc: 'Fixed duration' },
                    { value: 'ONEDAY', label: 'One Day', desc: 'Single day job' },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => setJobType(opt.value)}
                      style={{
                        flex: 1, padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                        border: jobType === opt.value ? '2px solid #7C3AED' : '2px solid var(--surface-3)',
                        background: jobType === opt.value ? 'rgba(124,58,237,0.05)' : 'white',
                        textAlign: 'left',
                      }}>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{opt.label}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(2)} className="btn btn-gradient" style={{ padding: '14px 32px', borderRadius: 14, marginLeft: 'auto', display: 'block' }}
                disabled={!title.trim() || !description.trim()}>
                Next →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="card" style={{ padding: 32 }}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Required Skills *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  {selectedSkills.map(s => (
                    <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'rgba(124,58,237,0.1)', color: '#7C3AED', fontWeight: 600, fontSize: 13 }}>
                      {s} <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeSkill(s)} />
                    </span>
                  ))}
                </div>
                <input value={skillSearch} onChange={e => setSkillSearch(e.target.value)} placeholder="Search skills..."
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid var(--surface-3)', outline: 'none', fontSize: 14, fontFamily: 'var(--font-body)' }} />
                {skillSearch && (
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {filteredSkills.slice(0, 6).map(s => (
                      <button key={s} onClick={() => addSkill(s)} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid var(--surface-3)', background: 'white', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' }}>
                        <Plus size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Min Experience (years)</label>
                  <input type="number" value={expMin} onChange={e => setExpMin(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
                </div>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Max Experience (years)</label>
                  <input type="number" value={expMax} onChange={e => setExpMax(e.target.value)} placeholder="Optional"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
                <button onClick={() => setStep(1)} className="btn btn-outline" style={{ padding: '14px 32px', borderRadius: 14 }}>← Back</button>
                <button onClick={() => { setStep(3); if (selectedSkills.length > 0) predictSalary(); }} className="btn btn-gradient" style={{ padding: '14px 32px', borderRadius: 14 }}
                  disabled={selectedSkills.length === 0}>Next →</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="card" style={{ padding: 32 }}>
              {/* AI Salary Prediction */}
              {salaryPrediction && (
                <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.05), rgba(167,139,250,0.05))', borderRadius: 16, padding: 20, marginBottom: 24 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Sparkles size={14} /> AI Salary Recommendation</p>
                  <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Min</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: '#7C3AED' }}>₹{salaryPrediction.min}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Median</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: '#7C3AED' }}>₹{salaryPrediction.median}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Max</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: '#7C3AED' }}>₹{salaryPrediction.max}</p>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Salary Type</label>
                  <select value={salaryType} onChange={e => setSalaryType(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                    <option value="DAILY">Daily</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="HOURLY">Hourly</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Min Salary (₹)</label>
                  <input type="number" value={salaryMin} onChange={e => setSalaryMin(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
                </div>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Max Salary (₹)</label>
                  <input type="number" value={salaryMax} onChange={e => setSalaryMax(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>City *</label>
                  <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Delhi, Noida"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
                </div>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Openings</label>
                  <input type="number" value={openings} onChange={e => setOpenings(e.target.value)} min="1"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
                <button onClick={() => setStep(2)} className="btn btn-outline" style={{ padding: '14px 32px', borderRadius: 14 }}>← Back</button>
                <button onClick={handleSubmit} className="btn btn-gradient" style={{ padding: '14px 32px', borderRadius: 14 }}
                  disabled={!city.trim()}>
                  <CheckCircle size={18} /> Post Job
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
