'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Activity, Briefcase, Users, BarChart3, Settings, Plus,
  Star, MapPin, Shield, Filter, Search, Phone,
  SlidersHorizontal, X, CheckCircle, MessageSquare, Send,
} from 'lucide-react';

const EMPLOYER_NAV = [
  { icon: Activity, label: 'Dashboard', href: '/employer/dashboard' },
  { icon: Briefcase, label: 'My Jobs', href: '/employer/jobs' },
  { icon: Plus, label: 'Post Job', href: '/employer/jobs/new' },
  { icon: Users, label: 'Workers', href: '/employer/workers' },
  { icon: BarChart3, label: 'Analytics', href: '/employer/analytics' },
  { icon: Settings, label: 'Settings', href: '/employer/settings' },
];

const WORKERS = [
  { id: '1', name: 'Suresh Yadav', skills: ['Electrician', 'Smart Home', 'Wiring'], rating: 4.9, reviews: 120, experience: 12, rate: 800, city: 'Delhi', distance: '1.2 km', available: true, verified: true },
  { id: '2', name: 'Deepak Nair', skills: ['Electrician', 'EV Charger', 'Solar Panel'], rating: 4.9, reviews: 145, experience: 14, rate: 1000, city: 'Delhi', distance: '1.8 km', available: true, verified: true },
  { id: '3', name: 'Raju Singh', skills: ['Carpenter', 'Woodwork', 'Furniture'], rating: 4.8, reviews: 98, experience: 15, rate: 900, city: 'Noida', distance: '3.1 km', available: true, verified: true },
  { id: '4', name: 'Amit Verma', skills: ['Plumber', 'Pipe Fitting'], rating: 4.7, reviews: 85, experience: 8, rate: 700, city: 'Delhi', distance: '2.5 km', available: true, verified: true },
  { id: '5', name: 'Manoj Kumar', skills: ['Painter', 'Wall Design'], rating: 4.6, reviews: 63, experience: 10, rate: 600, city: 'Delhi', distance: '4.2 km', available: true, verified: false },
  { id: '6', name: 'Vikram Gupta', skills: ['AC Repair', 'AC Installation'], rating: 4.5, reviews: 52, experience: 7, rate: 750, city: 'Gurgaon', distance: '5.0 km', available: false, verified: true },
  { id: '7', name: 'Rajesh Pal', skills: ['Mason', 'Tile Work'], rating: 4.4, reviews: 40, experience: 9, rate: 650, city: 'Noida', distance: '6.5 km', available: true, verified: false },
  { id: '8', name: 'Sunil Kumar', skills: ['Welder', 'Fabrication'], rating: 4.3, reviews: 35, experience: 11, rate: 850, city: 'Delhi', distance: '3.8 km', available: true, verified: true },
];

export default function WorkerDirectoryPage() {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'rate' | 'experience'>('rating');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [offerSent, setOfferSent] = useState<string[]>([]);

  const filtered = WORKERS
    .filter(w => {
      if (query && !w.name.toLowerCase().includes(query.toLowerCase()) && !w.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))) return false;
      if (onlyAvailable && !w.available) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'rate') return a.rate - b.rate;
      return b.experience - a.experience;
    });

  const sendOffer = (id: string) => setOfferSent([...offerSent, id]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Sidebar navItems={EMPLOYER_NAV} accentColor="#7C3AED"
        profile={{ name: 'Priya Sharma', subtitle: 'TechHome Solutions', gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)', initial: 'P' }} />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Worker Directory</h1>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'white', borderRadius: 14, padding: '12px 20px', boxShadow: 'var(--shadow-sm)' }}>
            <Search size={18} color="var(--text-tertiary)" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or skill..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 14, width: '100%', fontFamily: 'var(--font-body)' }} />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
            style={{ padding: '12px 16px', borderRadius: 12, border: '2px solid var(--surface-3)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
            <option value="rating">Top Rated</option>
            <option value="rate">Lowest Rate</option>
            <option value="experience">Most Experienced</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} /> Available only
          </label>
        </div>

        <p style={{ color: 'var(--text-tertiary)', fontSize: 14, marginBottom: 16 }}>{filtered.length} workers</p>

        {/* Worker Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {filtered.map(w => (
            <div key={w.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 20, position: 'relative',
                  }}>
                    {w.name[0]}
                    {w.verified && <Shield size={14} color="white" fill="#F59E0B" style={{ position: 'absolute', bottom: -2, right: -2 }} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{w.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      <Star size={12} fill="#F59E0B" color="#F59E0B" style={{ display: 'inline', verticalAlign: 'middle' }} /> {w.rating} ({w.reviews}) • {w.experience} yrs
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: '#7C3AED', fontSize: 16 }}>₹{w.rate}<span style={{ fontSize: 11, fontWeight: 400 }}>/day</span></p>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                    background: w.available ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
                    color: w.available ? '#059669' : '#6B7280',
                  }}>{w.available ? 'Available' : 'Busy'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {w.skills.map(s => <span key={s} className="chip" style={{ fontSize: 11, padding: '2px 6px' }}>{s}</span>)}
              </div>

              <p style={{ color: 'var(--text-tertiary)', fontSize: 12, marginBottom: 12 }}>
                <MapPin size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {w.city} • {w.distance}
              </p>

              <div style={{ display: 'flex', gap: 8 }}>
                {offerSent.includes(w.id) ? (
                  <button disabled className="btn btn-sm" style={{ flex: 1, borderRadius: 999, background: 'rgba(16,185,129,0.1)', color: '#059669', border: 'none' }}>
                    <CheckCircle size={14} /> Offer Sent
                  </button>
                ) : (
                  <button onClick={() => sendOffer(w.id)} className="btn btn-sm btn-gradient" style={{ flex: 1, borderRadius: 999 }}>
                    <Send size={14} /> Send Offer
                  </button>
                )}
                <button className="btn btn-sm btn-outline" style={{ borderRadius: 999 }}>
                  <Phone size={14} /> Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
