'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Activity, Grid3X3, Calendar, Search, User, Settings,
  MapPin, Phone, Edit3, Star, Save,
} from 'lucide-react';

const CUSTOMER_NAV = [
  { icon: Activity, label: 'Dashboard', href: '/customer/dashboard' },
  { icon: Grid3X3, label: 'Services', href: '/customer/services' },
  { icon: Calendar, label: 'Bookings', href: '/customer/bookings' },
  { icon: Search, label: 'Find Workers', href: '/customer/search' },
  { icon: User, label: 'Profile', href: '/customer/profile' },
  { icon: Settings, label: 'Settings', href: '/customer/settings' },
];

export default function CustomerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Aisha Patel');
  const [address, setAddress] = useState('Sector 18, Noida, UP 201301');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Sidebar navItems={CUSTOMER_NAV} accentColor="#0D9488"
        profile={{ name: 'Aisha Patel', subtitle: 'Delhi NCR', gradient: 'linear-gradient(135deg, #0D9488, #14B8A6)', initial: 'A' }} />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>My Profile</h1>
          <button onClick={() => setIsEditing(!isEditing)} className="btn btn-outline btn-pill">
            <Edit3 size={16} /> {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Profile Info */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: 'linear-gradient(135deg, #0D9488, #14B8A6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 28, fontWeight: 700,
              }}>A</div>
              <div style={{ flex: 1 }}>
                {isEditing ? (
                  <input value={name} onChange={e => setName(e.target.value)} style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', border: 'none', outline: 'none', background: 'var(--surface-1)', borderRadius: 8, padding: '4px 8px', width: '100%', marginBottom: 8 }} />
                ) : (
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{name}</h2>
                )}
                <p style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14 }}>
                  <Phone size={14} /> +91 9876543210 <span style={{ fontSize: 12, color: 'var(--success)' }}>✓ Verified</span>
                </p>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Address</label>
              {isEditing ? (
                <input value={address} onChange={e => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
              ) : (
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={14} /> {address}
                </p>
              )}
            </div>

            {isEditing && (
              <button onClick={() => setIsEditing(false)} className="btn btn-gradient" style={{ padding: '12px 24px', borderRadius: 14 }}>
                <Save size={16} /> Save Changes
              </button>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Bookings', value: '12', color: '#0D9488' },
              { label: 'Avg Rating Given', value: '4.6 ★', color: '#F59E0B' },
              { label: 'Total Spent', value: '₹15,680', color: '#3B82F6' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card" style={{ padding: 20, textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color, marginBottom: 4 }}>{value}</p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Saved Addresses */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Saved Addresses</h2>
            {[
              { label: 'Home', address: 'Sector 18, Noida, UP 201301', icon: '🏠' },
              { label: 'Office', address: 'Connaught Place, New Delhi 110001', icon: '🏢' },
            ].map(a => (
              <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--surface-2)' }}>
                <span style={{ fontSize: 24 }}>{a.icon}</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{a.label}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{a.address}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Favorite Workers */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Favorite Workers</h2>
            {[
              { name: 'Suresh Yadav', skill: 'Electrician', rating: 4.9 },
              { name: 'Raju Singh', skill: 'Carpenter', rating: 4.8 },
            ].map(w => (
              <div key={w.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--surface-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #0D9488, #14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{w.name[0]}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{w.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{w.skill}</p>
                  </div>
                </div>
                <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><Star size={12} fill="#F59E0B" color="#F59E0B" /> {w.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
