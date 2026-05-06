'use client';

import Link from 'next/link';
import {
  Home, Search, Calendar, Star, MapPin, Bell,
  LogOut, Settings, User, Activity, Clock,
  Zap, Wrench, Paintbrush, Wind, ChefHat,
  Hammer, Shield, Truck, ArrowRight, CheckCircle,
} from 'lucide-react';

const SERVICE_CATEGORIES = [
  { icon: Zap, name: 'Electrician', color: '#F59E0B' },
  { icon: Wrench, name: 'Plumber', color: '#3B82F6' },
  { icon: Wind, name: 'AC Repair', color: '#06B6D4' },
  { icon: Hammer, name: 'Carpenter', color: '#8B5CF6' },
  { icon: Paintbrush, name: 'Painter', color: '#EC4899' },
  { icon: ChefHat, name: 'Cook', color: '#EF4444' },
  { icon: Shield, name: 'Security', color: '#10B981' },
  { icon: Truck, name: 'Moving', color: '#F97316' },
];

const ACTIVE_BOOKINGS = [
  {
    id: '1', service: 'AC Servicing', worker: 'Vikram Singh', workerRating: 4.8,
    status: 'IN_PROGRESS', date: 'Today, 2:00 PM', amount: '₹800',
  },
  {
    id: '2', service: 'Kitchen Plumbing', worker: 'Ajay Kumar', workerRating: 4.6,
    status: 'CONFIRMED', date: 'Tomorrow, 10:00 AM', amount: '₹650',
  },
];

const RECENT_WORKERS = [
  { name: 'Vikram Singh', skill: 'AC Technician', rating: 4.8, rate: '₹800/day', distance: '2.3 km' },
  { name: 'Deepak Verma', skill: 'Electrician', rating: 4.9, rate: '₹900/day', distance: '3.1 km' },
  { name: 'Sita Devi', skill: 'Cook', rating: 4.7, rate: '₹500/day', distance: '1.5 km' },
];

export default function CustomerDashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: 'white', padding: '24px 16px', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18 }}>H</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--primary)' }}>Hunar</span>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #0D9488, #5EEAD4)', borderRadius: 16, padding: 20, marginBottom: 24, color: 'white' }}>
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>Aisha Patel</p>
          <p style={{ fontSize: 12, opacity: 0.8 }}>Homeowner</p>
          <p style={{ fontSize: 12, opacity: 0.7, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={12} /> Indiranagar, Bangalore
          </p>
        </div>

        <nav style={{ flex: 1 }}>
          {[
            { icon: Activity, label: 'Dashboard', href: '/customer/dashboard', active: true },
            { icon: Search, label: 'Find Workers', href: '/customer/search' },
            { icon: Calendar, label: 'My Bookings', href: '/customer/bookings' },
            { icon: Star, label: 'My Reviews', href: '/customer/reviews' },
            { icon: User, label: 'Profile', href: '/customer/profile' },
            { icon: Settings, label: 'Settings', href: '/customer/settings' },
          ].map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10,
              color: active ? 'var(--tertiary)' : 'var(--text-secondary)',
              background: active ? 'rgba(13,148,136,0.08)' : 'transparent',
              textDecoration: 'none', fontSize: 14, fontWeight: active ? 600 : 500,
              marginBottom: 4, transition: 'all var(--transition-fast)',
            }}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>

        <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--error)', gap: 12 }}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Hello, Aisha 👋</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>What can we help you with today?</p>
          </div>
          <button style={{ position: 'relative', background: 'white', border: 'none', width: 44, height: 44, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <Bell size={20} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Search Bar (UrbanClap-style) */}
        <div className="card" style={{ padding: 24, marginBottom: 32, background: 'linear-gradient(135deg, #0D9488, #2DD4BF)', borderRadius: 20, color: 'white' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
            🔍 Find a Professional
          </h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.2)', borderRadius: 14,
              padding: '14px 20px', backdropFilter: 'blur(10px)',
            }}>
              <Search size={18} color="rgba(255,255,255,0.7)" />
              <input placeholder="What service do you need?" style={{
                background: 'none', border: 'none', outline: 'none',
                color: 'white', fontSize: 15, width: '100%', fontFamily: 'var(--font-body)',
              }} />
            </div>
            <button className="btn" style={{ background: 'white', color: 'var(--tertiary)', fontWeight: 700, borderRadius: 14, padding: '14px 24px' }}>
              Search <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Service Categories Grid */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
            Popular Services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {SERVICE_CATEGORIES.map(({ icon: Icon, name, color }) => (
              <div key={name} className="card" style={{
                padding: 20, cursor: 'pointer', textAlign: 'center',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, margin: '0 auto 12px',
                  background: `${color}12`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={26} color={color} />
                </div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{name}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Active Bookings */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={20} color="var(--tertiary)" /> Active Bookings
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ACTIVE_BOOKINGS.map(b => (
                <div key={b.id} className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 15 }}>{b.service}</h3>
                    <span style={{
                      padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                      background: b.status === 'IN_PROGRESS' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)',
                      color: b.status === 'IN_PROGRESS' ? '#2563EB' : '#B45309',
                    }}>{b.status.replace('_', ' ')}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>
                    {b.worker} • <Star size={11} fill="#F59E0B" color="#F59E0B" style={{ display: 'inline', verticalAlign: 'middle' }} /> {b.workerRating}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {b.date}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 15 }}>{b.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Workers */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={20} color="var(--secondary)" /> Nearby Professionals
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {RECENT_WORKERS.map(w => (
                <div key={w.name} className="card" style={{ padding: 20, display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, var(--surface-2), var(--surface-3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                    {w.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <p style={{ fontWeight: 700, fontSize: 15 }}>{w.name}</p>
                      <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 14 }}>{w.rate}</p>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      {w.skill} • <Star size={11} fill="#F59E0B" color="#F59E0B" style={{ display: 'inline', verticalAlign: 'middle' }} /> {w.rating}
                    </p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>
                      <MapPin size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {w.distance} away
                    </p>
                  </div>
                  <button className="btn btn-sm btn-outline btn-pill" style={{ flexShrink: 0 }}>Book</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
