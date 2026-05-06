'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import {
  Activity, Grid3X3, Calendar, MapPin, Clock, Star,
  Search, Settings, User, Sparkles, CheckCircle,
  Phone, Shield, Filter, SlidersHorizontal, X,
} from 'lucide-react';

const CUSTOMER_NAV = [
  { icon: Activity, label: 'Dashboard', href: '/customer/dashboard' },
  { icon: Grid3X3, label: 'Services', href: '/customer/services' },
  { icon: Calendar, label: 'Bookings', href: '/customer/bookings' },
  { icon: Search, label: 'Find Workers', href: '/customer/search' },
  { icon: User, label: 'Profile', href: '/customer/profile' },
  { icon: Settings, label: 'Settings', href: '/customer/settings' },
];

const ALL_WORKERS = [
  { id: '1', name: 'Suresh Yadav', skill: 'Electrician', skills: ['Electrician', 'Wiring', 'Smart Home'], rating: 4.9, reviews: 120, distance: '1.2 km', rate: 800, available: true, responseTime: '30 min', experience: 12, verified: true, city: 'Delhi' },
  { id: '2', name: 'Amit Verma', skill: 'Plumber', skills: ['Plumber', 'Pipe Fitting'], rating: 4.7, reviews: 85, distance: '2.5 km', rate: 700, available: true, responseTime: '45 min', experience: 8, verified: true, city: 'Delhi' },
  { id: '3', name: 'Raju Singh', skill: 'Carpenter', skills: ['Carpenter', 'Woodwork', 'Furniture'], rating: 4.8, reviews: 98, distance: '3.1 km', rate: 900, available: true, responseTime: '1 hr', experience: 15, verified: true, city: 'Noida' },
  { id: '4', name: 'Manoj Kumar', skill: 'Painter', skills: ['Painter', 'Wall Design'], rating: 4.6, reviews: 63, distance: '4.2 km', rate: 600, available: true, responseTime: '2 hr', experience: 10, verified: false, city: 'Delhi' },
  { id: '5', name: 'Vikram Gupta', skill: 'AC Technician', skills: ['AC Repair', 'AC Installation'], rating: 4.5, reviews: 52, distance: '5.0 km', rate: 750, available: false, responseTime: '3 hr', experience: 7, verified: true, city: 'Gurgaon' },
  { id: '6', name: 'Deepak Nair', skill: 'Electrician', skills: ['Electrician', 'EV Charger', 'Solar Panel'], rating: 4.9, reviews: 145, distance: '1.8 km', rate: 1000, available: true, responseTime: '20 min', experience: 14, verified: true, city: 'Delhi' },
  { id: '7', name: 'Rajendra Pal', skill: 'Mason', skills: ['Mason', 'Tile Work'], rating: 4.4, reviews: 40, distance: '6.5 km', rate: 650, available: true, responseTime: '1 hr', experience: 9, verified: false, city: 'Noida' },
];

export default function SearchWorkersPage() {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [maxRate, setMaxRate] = useState(2000);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'rate'>('rating');

  const filtered = ALL_WORKERS
    .filter(w => {
      if (query && !w.name.toLowerCase().includes(query.toLowerCase()) && !w.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))) return false;
      if (w.rating < minRating) return false;
      if (w.rate > maxRate) return false;
      if (onlyAvailable && !w.available) return false;
      if (onlyVerified && !w.verified) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'rate') return a.rate - b.rate;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Sidebar navItems={CUSTOMER_NAV} accentColor="#0D9488"
        profile={{ name: 'Aisha Patel', subtitle: 'Delhi NCR', gradient: 'linear-gradient(135deg, #0D9488, #14B8A6)', initial: 'A' }} />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Find Workers</h1>

        {/* Search */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'white', borderRadius: 14, padding: '14px 20px', boxShadow: 'var(--shadow-sm)' }}>
            <Search size={18} color="var(--text-tertiary)" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, skill, or service..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 15, width: '100%', fontFamily: 'var(--font-body)' }} />
            {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} color="var(--text-tertiary)" /></button>}
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn btn-outline btn-pill" style={{ gap: 6 }}>
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="card" style={{ padding: 20, marginBottom: 24, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'end' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>Min Rating</p>
              <select value={minRating} onChange={e => setMinRating(Number(e.target.value))}
                style={{ padding: '8px 12px', borderRadius: 8, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                <option value={0}>Any</option><option value={4}>4+ ★</option><option value={4.5}>4.5+ ★</option>
              </select>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>Max Rate</p>
              <select value={maxRate} onChange={e => setMaxRate(Number(e.target.value))}
                style={{ padding: '8px 12px', borderRadius: 8, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                <option value={2000}>Any</option><option value={500}>Under ₹500</option><option value={800}>Under ₹800</option><option value={1000}>Under ₹1,000</option>
              </select>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>Sort By</p>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                style={{ padding: '8px 12px', borderRadius: 8, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                <option value="rating">Highest Rating</option><option value="distance">Nearest</option><option value="rate">Lowest Rate</option>
              </select>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} /> Available only
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={onlyVerified} onChange={e => setOnlyVerified(e.target.checked)} /> Verified only
            </label>
          </div>
        )}

        <p style={{ color: 'var(--text-tertiary)', fontSize: 14, marginBottom: 16 }}>{filtered.length} workers found</p>

        {/* Worker Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(w => (
            <Link key={w.id} href={`/customer/book/${w.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: 'linear-gradient(135deg, #0D9488, #14B8A6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 22, position: 'relative',
                  }}>
                    {w.name[0]}
                    {w.verified && <Shield size={14} color="white" fill="#F59E0B" style={{ position: 'absolute', bottom: -2, right: -2 }} />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700 }}>{w.name}</h3>
                      {w.available && <span style={{ fontSize: 10, background: 'rgba(16,185,129,0.1)', color: '#059669', padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>Available</span>}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      {w.skill} • {w.experience} yrs experience • <MapPin size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {w.distance}
                    </p>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      {w.skills.map(s => <span key={s} className="chip" style={{ fontSize: 11, padding: '2px 6px' }}>{s}</span>)}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontWeight: 800, color: '#0D9488', fontSize: 18 }}>₹{w.rate}<span style={{ fontSize: 12, fontWeight: 400 }}>/day</span></p>
                  <p style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginBottom: 4 }}>
                    <Star size={12} fill="#F59E0B" color="#F59E0B" /> {w.rating} ({w.reviews})
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>⏱ {w.responseTime} response</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
