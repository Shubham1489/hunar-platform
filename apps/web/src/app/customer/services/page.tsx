'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import {
  Activity, Grid3X3, Calendar, MapPin, Clock, Star,
  Search, Settings, User, Sparkles, ChevronRight, Phone,
  Shield, CheckCircle, Zap, Filter,
} from 'lucide-react';

const CUSTOMER_NAV = [
  { icon: Activity, label: 'Dashboard', href: '/customer/dashboard' },
  { icon: Grid3X3, label: 'Services', href: '/customer/services' },
  { icon: Calendar, label: 'Bookings', href: '/customer/bookings' },
  { icon: Search, label: 'Find Workers', href: '/customer/search' },
  { icon: User, label: 'Profile', href: '/customer/profile' },
  { icon: Settings, label: 'Settings', href: '/customer/settings' },
];

const SERVICES = [
  { id: 'electrician', name: 'Electrician', icon: '⚡', workers: 234, startingAt: 500, popular: true },
  { id: 'plumber', name: 'Plumber', icon: '🔧', workers: 189, startingAt: 400, popular: true },
  { id: 'carpenter', name: 'Carpenter', icon: '🪚', workers: 145, startingAt: 600, popular: true },
  { id: 'painter', name: 'Painter', icon: '🎨', workers: 167, startingAt: 500, popular: false },
  { id: 'ac-repair', name: 'AC Repair', icon: '❄️', workers: 98, startingAt: 600, popular: true },
  { id: 'mason', name: 'Mason', icon: '🧱', workers: 112, startingAt: 550, popular: false },
  { id: 'welder', name: 'Welder', icon: '🔥', workers: 76, startingAt: 700, popular: false },
  { id: 'smart-home', name: 'Smart Home Setup', icon: '🏠', workers: 45, startingAt: 1000, popular: true },
  { id: 'pest-control', name: 'Pest Control', icon: '🐛', workers: 67, startingAt: 800, popular: false },
  { id: 'cleaning', name: 'Deep Cleaning', icon: '🧹', workers: 223, startingAt: 300, popular: true },
  { id: 'security', name: 'CCTV / Security', icon: '📷', workers: 58, startingAt: 800, popular: false },
  { id: 'solar', name: 'Solar Panel', icon: '☀️', workers: 34, startingAt: 1200, popular: false },
];

const NEARBY_WORKERS = [
  { id: '1', name: 'Suresh Yadav', skill: 'Electrician', rating: 4.9, jobs: 120, distance: '1.2 km', rate: '₹800/day', available: true, responseTime: '30 min' },
  { id: '2', name: 'Amit Verma', skill: 'Plumber', rating: 4.7, jobs: 85, distance: '2.5 km', rate: '₹700/day', available: true, responseTime: '45 min' },
  { id: '3', name: 'Raju Singh', skill: 'Carpenter', rating: 4.8, jobs: 98, distance: '3.1 km', rate: '₹900/day', available: true, responseTime: '1 hr' },
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = SERVICES.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Sidebar navItems={CUSTOMER_NAV} accentColor="#0D9488"
        profile={{ name: 'Aisha Patel', subtitle: 'Delhi NCR', gradient: 'linear-gradient(135deg, #0D9488, #14B8A6)', initial: 'A' }} />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>All Services</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Find the best professionals for any job</p>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'white', borderRadius: 14, padding: '14px 20px',
          boxShadow: 'var(--shadow-sm)', marginBottom: 32,
        }}>
          <Search size={18} color="var(--text-tertiary)" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search services..."
            style={{ background: 'none', border: 'none', outline: 'none', fontSize: 15, width: '100%', fontFamily: 'var(--font-body)' }} />
        </div>

        {/* Service Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
          {filteredServices.map(s => (
            <Link key={s.id} href={`/customer/search?service=${s.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ padding: 24, textAlign: 'center', position: 'relative' }}>
                {s.popular && (
                  <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, fontWeight: 700, background: 'rgba(249,115,22,0.1)', color: '#F97316', padding: '2px 8px', borderRadius: 999 }}>Popular</span>
                )}
                <div style={{ fontSize: 40, marginBottom: 12 }}>{s.icon}</div>
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>{s.workers} workers nearby</p>
                <p style={{ fontSize: 13, color: '#0D9488', fontWeight: 600 }}>Starting ₹{s.startingAt}/day</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Top Rated Workers Nearby */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Top Rated Workers Near You</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {NEARBY_WORKERS.map(w => (
            <Link key={w.id} href={`/customer/book/${w.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #0D9488, #14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 20 }}>
                    {w.name[0]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{w.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {w.skill} • <Star size={12} fill="#F59E0B" color="#F59E0B" /> {w.rating} ({w.jobs} jobs) • <MapPin size={12} /> {w.distance}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: '#0D9488', fontSize: 15 }}>{w.rate}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{w.available ? '🟢 Available' : '🔴 Busy'} • {w.responseTime}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
