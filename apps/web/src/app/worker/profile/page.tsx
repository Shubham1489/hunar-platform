'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Search, Briefcase, Activity, Wallet, User, Settings, Star,
  Edit3, MapPin, Mic, Plus, X, CheckCircle, Camera,
  Wrench, Zap, Shield, Award,
} from 'lucide-react';

const WORKER_NAV = [
  { icon: Activity, label: 'Dashboard', href: '/worker/dashboard' },
  { icon: Search, label: 'Find Jobs', href: '/worker/jobs' },
  { icon: Briefcase, label: 'Applications', href: '/worker/applications' },
  { icon: Wallet, label: 'Earnings', href: '/worker/earnings' },
  { icon: User, label: 'Profile', href: '/worker/profile' },
  { icon: Settings, label: 'Settings', href: '/worker/settings' },
];

const SKILLS = [
  { name: 'Electrician', level: 'EXPERT', years: 8 },
  { name: 'Wiring', level: 'EXPERT', years: 6 },
  { name: 'Smart Home', level: 'INTERMEDIATE', years: 3 },
  { name: 'EV Charger', level: 'INTERMEDIATE', years: 2 },
];

const REVIEWS = [
  { id: '1', name: 'Aisha Patel', rating: 5, review: 'Excellent work! Very professional and completed on time.', date: '2 weeks ago', service: 'AC Servicing' },
  { id: '2', name: 'Rahul Gupta', rating: 5, review: 'Amazing electrician. Very knowledgeable about smart home systems.', date: '1 month ago', service: 'Smart Home Wiring' },
  { id: '3', name: 'Priya M.', rating: 4, review: 'Good work, slightly delayed but quality was great.', date: '2 months ago', service: 'Wiring' },
];

export default function WorkerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Ramesh Kumar');
  const [bio, setBio] = useState('Experienced master electrician with 8+ years in residential and commercial projects. Specializing in smart home installations and EV charger setups.');
  const [dailyRate, setDailyRate] = useState('900');
  const [city, setCity] = useState('Delhi');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [extractedSkills, setExtractedSkills] = useState<{ skill: string; confidence: number }[]>([]);

  const startVoiceInput = () => {
    setIsListening(true);
    // Simulate voice → skill extraction
    setTimeout(() => {
      setVoiceText('main solar panel bhi lagata hoon aur welding ka kaam bhi karta hoon');
      setExtractedSkills([
        { skill: 'Solar Panel', confidence: 0.95 },
        { skill: 'Welding', confidence: 0.88 },
      ]);
      setIsListening(false);
    }, 2500);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Sidebar navItems={WORKER_NAV} accentColor="var(--primary)"
        profile={{ name: 'Ramesh Kumar', subtitle: 'Master Electrician', gradient: 'linear-gradient(135deg, #1E3A8A, #2563EB)', initial: 'R',
          extra: <div style={{ display: 'flex', gap: 16 }}><div><p style={{ fontSize: 11, opacity: 0.6 }}>Rating</p><p style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><Star size={13} fill="gold" color="gold" /> 4.8</p></div><div><p style={{ fontSize: 11, opacity: 0.6 }}>Jobs</p><p style={{ fontSize: 14, fontWeight: 700 }}>47</p></div></div>
        }} />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>My Profile</h1>
          <button onClick={() => setIsEditing(!isEditing)} className="btn btn-outline btn-pill">
            <Edit3 size={16} /> {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Profile Info */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: 20,
                    background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: 32, fontWeight: 700
                  }}>R</div>
                  {isEditing && (
                    <button style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: 8, background: 'var(--secondary)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Camera size={12} color="white" />
                    </button>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  {isEditing ? (
                    <input value={name} onChange={e => setName(e.target.value)} className="input" style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }} />
                  ) : (
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{name}</h2>
                  )}
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={14} /> {isEditing ? (
                      <input value={city} onChange={e => setCity(e.target.value)} style={{ border: 'none', outline: 'none', background: 'var(--surface-1)', borderRadius: 6, padding: '4px 8px', fontSize: 14, fontFamily: 'var(--font-body)' }} />
                    ) : city}
                  </p>
                  <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                    <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}><Star size={13} fill="#F59E0B" color="#F59E0B" /> 4.8 (42 reviews)</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>📋 47 jobs completed</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>⏰ 8 years experience</span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>About</p>
                {isEditing ? (
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                    style={{ width: '100%', padding: 12, borderRadius: 10, border: '2px solid var(--surface-3)', outline: 'none', fontSize: 14, fontFamily: 'var(--font-body)', resize: 'vertical', lineHeight: 1.6 }} />
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{bio}</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>Daily Rate</p>
                  {isEditing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 14 }}>₹</span>
                      <input value={dailyRate} onChange={e => setDailyRate(e.target.value)} style={{ width: 80, padding: '6px 8px', borderRadius: 6, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>/day</span>
                    </div>
                  ) : (
                    <p style={{ fontWeight: 700, fontSize: 18, color: 'var(--primary)' }}>₹{dailyRate}/day</p>
                  )}
                </div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>Availability</p>
                  <div onClick={() => isEditing && setIsAvailable(!isAvailable)} style={{
                    width: 52, height: 28, borderRadius: 14,
                    background: isAvailable ? '#10B981' : 'var(--surface-3)',
                    display: 'flex', alignItems: 'center', padding: '0 3px',
                    cursor: isEditing ? 'pointer' : 'default',
                  }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', marginLeft: isAvailable ? 'auto' : 0, transition: 'all 250ms ease' }} />
                  </div>
                </div>
              </div>

              {isEditing && (
                <button onClick={() => setIsEditing(false)} className="btn btn-gradient" style={{ marginTop: 20, width: '100%', padding: 14, borderRadius: 14 }}>
                  <CheckCircle size={18} /> Save Changes
                </button>
              )}
            </div>

            {/* Skills */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Skills</h2>
                <button onClick={startVoiceInput} className="btn btn-sm" style={{
                  background: isListening ? 'rgba(239,68,68,0.1)' : 'rgba(249,115,22,0.1)',
                  color: isListening ? '#DC2626' : '#F97316', borderRadius: 999,
                }}>
                  <Mic size={14} /> {isListening ? 'Listening...' : 'Add by Voice'}
                </button>
              </div>

              {/* Voice extraction result */}
              {extractedSkills.length > 0 && (
                <div style={{ background: 'rgba(249,115,22,0.05)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>🎤 You said:</p>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12, fontStyle: 'italic' }}>&ldquo;{voiceText}&rdquo;</p>
                  <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>AI Extracted Skills:</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {extractedSkills.map(s => (
                      <button key={s.skill} className="btn btn-sm btn-outline btn-pill" style={{ gap: 4 }}>
                        <Plus size={12} /> {s.skill} ({Math.round(s.confidence * 100)}%)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isListening && (
                <div style={{ textAlign: 'center', padding: 24, background: 'rgba(239,68,68,0.05)', borderRadius: 12, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#DC2626', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-glow 1.5s infinite' }}>
                    <Mic size={24} color="white" />
                  </div>
                  <p style={{ fontWeight: 600 }}>Listening... Speak your skills</p>
                  <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>e.g. &ldquo;main electrician hoon, wiring ka kaam karta hoon&rdquo;</p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {SKILLS.map(skill => (
                  <div key={skill.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--surface-1)', borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Wrench size={16} color="var(--primary)" />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>{skill.name}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{skill.years} years</p>
                      </div>
                    </div>
                    <span className={`chip ${skill.level === 'EXPERT' ? 'chip-success' : 'chip-primary'}`} style={{ fontSize: 11 }}>
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Verification */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Verification</h3>
              {[
                { icon: CheckCircle, label: 'Phone Verified', done: true },
                { icon: Shield, label: 'ID Verified', done: true },
                { icon: Award, label: 'Skill Certified', done: false },
              ].map(({ icon: Icon, label, done }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                  <Icon size={18} color={done ? 'var(--success)' : 'var(--surface-3)'} />
                  <span style={{ fontSize: 14, color: done ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Recent Reviews */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Reviews</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {REVIEWS.map(r => (
                  <div key={r.id} style={{ paddingBottom: 12, borderBottom: '1px solid var(--surface-2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</p>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill={i <= r.rating ? '#F59E0B' : 'none'} color={i <= r.rating ? '#F59E0B' : 'var(--surface-3)'} />)}
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 4 }}>{r.review}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{r.service} • {r.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
