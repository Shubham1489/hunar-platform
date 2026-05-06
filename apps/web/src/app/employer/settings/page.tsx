'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Activity, Briefcase, Users, BarChart3, Settings, Plus,
  Building, MapPin, Phone, Mail, Globe, Shield, Save,
  Bell, Moon, Sun, Lock, Trash2, Edit3, CheckCircle,
} from 'lucide-react';

const EMPLOYER_NAV = [
  { icon: Activity, label: 'Dashboard', href: '/employer/dashboard' },
  { icon: Briefcase, label: 'My Jobs', href: '/employer/jobs' },
  { icon: Plus, label: 'Post Job', href: '/employer/jobs/new' },
  { icon: Users, label: 'Workers', href: '/employer/workers' },
  { icon: BarChart3, label: 'Analytics', href: '/employer/analytics' },
  { icon: Settings, label: 'Settings', href: '/employer/settings' },
];

export default function EmployerSettingsPage() {
  const [companyName, setCompanyName] = useState('TechHome Solutions');
  const [industry, setIndustry] = useState('Home Services & Technology');
  const [city, setCity] = useState('Delhi NCR');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Sidebar navItems={EMPLOYER_NAV} accentColor="#7C3AED"
        profile={{ name: 'Priya Sharma', subtitle: 'TechHome Solutions', gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)', initial: 'P' }} />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Settings</h1>

        <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Company Profile */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building size={18} /> Company Profile
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Company Name</label>
                <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Industry</label>
                  <input value={industry} onChange={e => setIndustry(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Location</label>
                  <input value={city} onChange={e => setCity(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>GST Number (Optional)</label>
                <input placeholder="22AAAAA0000A1Z5"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={18} /> Notifications
            </h2>
            {[
              { label: 'New Applications', desc: 'When workers apply to your jobs' },
              { label: 'Worker Messages', desc: 'Direct messages from workers' },
              { label: 'Payment Receipts', desc: 'Payment and invoice notifications' },
            ].map(({ label, desc }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--surface-2)' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{desc}</p>
                </div>
                <div style={{ width: 48, height: 26, borderRadius: 13, background: '#10B981', display: 'flex', alignItems: 'center', padding: '0 3px', cursor: 'pointer' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', marginLeft: 'auto' }} />
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleSave} className="btn btn-gradient" style={{ padding: '14px 32px', borderRadius: 14, alignSelf: 'flex-start' }}>
            <Save size={18} /> {saved ? 'Saved ✓' : 'Save Changes'}
          </button>
        </div>
      </main>
    </div>
  );
}
