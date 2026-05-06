'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Activity, Search, Briefcase, Wallet, User, Settings, Star,
  Bell, Globe, Shield, Moon, Sun, Phone, Lock, Trash2, Save,
} from 'lucide-react';

const WORKER_NAV = [
  { icon: Activity, label: 'Dashboard', href: '/worker/dashboard' },
  { icon: Search, label: 'Find Jobs', href: '/worker/jobs' },
  { icon: Briefcase, label: 'Applications', href: '/worker/applications' },
  { icon: Wallet, label: 'Earnings', href: '/worker/earnings' },
  { icon: User, label: 'Profile', href: '/worker/profile' },
  { icon: Settings, label: 'Settings', href: '/worker/settings' },
];

export default function WorkerSettingsPage() {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState({ jobs: true, applications: true, payments: true, marketing: false });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Sidebar navItems={WORKER_NAV} accentColor="var(--primary)"
        profile={{ name: 'Ramesh Kumar', subtitle: 'Master Electrician', gradient: 'linear-gradient(135deg, #1E3A8A, #2563EB)', initial: 'R',
          extra: <div style={{ display: 'flex', gap: 16 }}><div><p style={{ fontSize: 11, opacity: 0.6 }}>Rating</p><p style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><Star size={13} fill="gold" color="gold" /> 4.8</p></div></div>
        }} />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Settings</h1>

        <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Account */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} /> Account
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Phone Number</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input value="+91 9876543210" disabled style={{ padding: '10px 14px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)', background: 'var(--surface-1)', flex: 1 }} />
                  <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>✓ Verified</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Email (Optional)</label>
                <input placeholder="ramesh@example.com" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={18} /> Notifications
            </h2>
            {[
              { key: 'jobs', label: 'New Job Matches', desc: 'Get notified when AI finds matching jobs' },
              { key: 'applications', label: 'Application Updates', desc: 'Status changes on your applications' },
              { key: 'payments', label: 'Payment Alerts', desc: 'Payment received and payout notifications' },
              { key: 'marketing', label: 'Tips & Offers', desc: 'Platform tips and promotional offers' },
            ].map(({ key, label, desc }) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--surface-2)' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{desc}</p>
                </div>
                <div onClick={() => setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] })}
                  style={{
                    width: 48, height: 26, borderRadius: 13, cursor: 'pointer',
                    background: notifications[key as keyof typeof notifications] ? '#10B981' : 'var(--surface-3)',
                    display: 'flex', alignItems: 'center', padding: '0 3px',
                  }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', marginLeft: notifications[key as keyof typeof notifications] ? 'auto' : 0, transition: 'all 250ms ease' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Preferences */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={18} /> Preferences
            </h2>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Appearance</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setTheme('light')} style={{
                    flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    border: theme === 'light' ? '2px solid var(--primary)' : '2px solid var(--surface-3)',
                    background: theme === 'light' ? 'rgba(30,58,138,0.05)' : 'white', fontFamily: 'var(--font-body)', fontSize: 14,
                  }}><Sun size={16} /> Light</button>
                  <button onClick={() => setTheme('dark')} style={{
                    flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    border: theme === 'dark' ? '2px solid var(--primary)' : '2px solid var(--surface-3)',
                    background: theme === 'dark' ? 'rgba(30,58,138,0.05)' : 'white', fontFamily: 'var(--font-body)', fontSize: 14,
                  }}><Moon size={16} /> Dark</button>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={18} /> Security
            </h2>
            <button className="btn btn-outline btn-sm" style={{ marginBottom: 8, borderRadius: 999 }}>
              <Lock size={14} /> Change Phone Number
            </button>
            <br />
            <button className="btn btn-sm" style={{ borderRadius: 999, background: 'rgba(239,68,68,0.1)', color: '#DC2626', border: 'none', marginTop: 8 }}>
              <Trash2 size={14} /> Delete Account
            </button>
          </div>

          {/* Save button */}
          <button onClick={handleSave} className="btn btn-gradient" style={{ padding: '14px 32px', borderRadius: 14, alignSelf: 'flex-start' }}>
            <Save size={18} /> {saved ? 'Saved ✓' : 'Save Changes'}
          </button>
        </div>
      </main>
    </div>
  );
}
