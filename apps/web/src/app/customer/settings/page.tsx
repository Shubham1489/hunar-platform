'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Activity, Grid3X3, Calendar, Search, User, Settings,
  Bell, Globe, Moon, Sun, Shield, Lock, Trash2, Save, MapPin,
} from 'lucide-react';

const CUSTOMER_NAV = [
  { icon: Activity, label: 'Dashboard', href: '/customer/dashboard' },
  { icon: Grid3X3, label: 'Services', href: '/customer/services' },
  { icon: Calendar, label: 'Bookings', href: '/customer/bookings' },
  { icon: Search, label: 'Find Workers', href: '/customer/search' },
  { icon: User, label: 'Profile', href: '/customer/profile' },
  { icon: Settings, label: 'Settings', href: '/customer/settings' },
];

export default function CustomerSettingsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Sidebar navItems={CUSTOMER_NAV} accentColor="#0D9488"
        profile={{ name: 'Aisha Patel', subtitle: 'Delhi NCR', gradient: 'linear-gradient(135deg, #0D9488, #14B8A6)', initial: 'A' }} />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Settings</h1>

        <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Notification Preferences */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={18} /> Notifications
            </h2>
            {[
              { label: 'Booking Updates', desc: 'Status changes for your bookings', on: true },
              { label: 'Worker Arrival', desc: 'When the worker is on the way', on: true },
              { label: 'Payment Receipts', desc: 'Payment confirmations and invoices', on: true },
              { label: 'Promotions', desc: 'Special offers and discounts', on: false },
            ].map(({ label, desc, on }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--surface-2)' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{desc}</p>
                </div>
                <div style={{ width: 48, height: 26, borderRadius: 13, background: on ? '#10B981' : 'var(--surface-3)', display: 'flex', alignItems: 'center', padding: '0 3px', cursor: 'pointer' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', marginLeft: on ? 'auto' : 0, transition: 'all 250ms ease' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Location */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={18} /> Location
            </h2>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Default Service Area</label>
              <select style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                <option>Delhi NCR</option>
                <option>Mumbai</option>
                <option>Bangalore</option>
                <option>Hyderabad</option>
              </select>
            </div>
          </div>

          {/* Language */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={18} /> Language
            </h2>
            <select style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* Security */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={18} /> Security
            </h2>
            <button className="btn btn-outline btn-sm" style={{ marginBottom: 8, borderRadius: 999 }}><Lock size={14} /> Change Phone Number</button>
            <br />
            <button className="btn btn-sm" style={{ borderRadius: 999, background: 'rgba(239,68,68,0.1)', color: '#DC2626', border: 'none', marginTop: 8 }}><Trash2 size={14} /> Delete Account</button>
          </div>

          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="btn btn-gradient" style={{ padding: '14px 32px', borderRadius: 14, alignSelf: 'flex-start' }}>
            <Save size={18} /> {saved ? 'Saved ✓' : 'Save Changes'}
          </button>
        </div>
      </main>
    </div>
  );
}
