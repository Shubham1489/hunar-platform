'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Activity, Grid3X3, Calendar, Search, User, Settings,
  Clock, Star, Phone, CheckCircle, XCircle,
  AlertCircle, Shield, Key,
} from 'lucide-react';

const CUSTOMER_NAV = [
  { icon: Activity, label: 'Dashboard', href: '/customer/dashboard' },
  { icon: Grid3X3, label: 'Services', href: '/customer/services' },
  { icon: Calendar, label: 'Bookings', href: '/customer/bookings' },
  { icon: Search, label: 'Find Workers', href: '/customer/search' },
  { icon: User, label: 'Profile', href: '/customer/profile' },
  { icon: Settings, label: 'Settings', href: '/customer/settings' },
];

const BOOKINGS = [
  { id: '1', worker: 'Suresh Yadav', skill: 'Electrician', status: 'IN_PROGRESS', date: 'Apr 9, 2026', time: '10:00 AM', amount: 880, rating: null, otp: null },
  { id: '2', worker: 'Amit Verma', skill: 'Plumber', status: 'CONFIRMED', date: 'Apr 10, 2026', time: '2:00 PM', amount: 770, rating: null, otp: null },
  { id: '3', worker: 'Raju Singh', skill: 'Carpenter', status: 'COMPLETED', date: 'Apr 5, 2026', time: '9:00 AM', amount: 990, rating: 5, otp: null },
  { id: '4', worker: 'Manoj Kumar', skill: 'Painter', status: 'COMPLETED', date: 'Mar 28, 2026', time: '11:00 AM', amount: 660, rating: 4, otp: null },
  { id: '5', worker: 'Vikram Gupta', skill: 'AC Technician', status: 'CANCELLED', date: 'Mar 25, 2026', time: '3:00 PM', amount: 825, rating: null, otp: null },
];

const STATUS_CONFIG: Record<string, { bg: string; color: string; icon: any; label: string }> = {
  PENDING: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280', icon: Clock, label: 'Pending' },
  CONFIRMED: { bg: 'rgba(59,130,246,0.1)', color: '#2563EB', icon: CheckCircle, label: 'Confirmed' },
  IN_PROGRESS: { bg: 'rgba(249,115,22,0.1)', color: '#EA580C', icon: AlertCircle, label: 'In Progress' },
  COMPLETED: { bg: 'rgba(16,185,129,0.1)', color: '#059669', icon: CheckCircle, label: 'Completed' },
  CANCELLED: { bg: 'rgba(239,68,68,0.1)', color: '#DC2626', icon: XCircle, label: 'Cancelled' },
};

export default function BookingsPage() {
  const [filter, setFilter] = useState('ALL');
  const [otpModal, setOtpModal] = useState<string | null>(null);
  const [ratingModal, setRatingModal] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingReview, setRatingReview] = useState('');

  const filtered = filter === 'ALL' ? BOOKINGS : BOOKINGS.filter(b => b.status === filter);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}>
      <Sidebar navItems={CUSTOMER_NAV} accentColor="#0D9488"
        profile={{ name: 'Aisha Patel', subtitle: 'Delhi NCR', gradient: 'linear-gradient(135deg, #0D9488, #14B8A6)', initial: 'A' }} />

      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 24 }}>My Bookings</h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Active', value: BOOKINGS.filter(b => ['CONFIRMED', 'IN_PROGRESS'].includes(b.status)).length, color: '#3B82F6' },
            { label: 'Completed', value: BOOKINGS.filter(b => b.status === 'COMPLETED').length, color: '#10B981' },
            { label: 'Total Spent', value: `₹${BOOKINGS.filter(b => b.status === 'COMPLETED').reduce((a, b) => a + b.amount, 0).toLocaleString()}`, color: '#F97316' },
            { label: 'Avg Rating Given', value: '4.5 ★', color: '#F59E0B' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card" style={{ padding: 20, textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color }}>{value}</p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['ALL', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{
                padding: '8px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: filter === s ? '#0D9488' : 'white',
                color: filter === s ? 'white' : 'var(--text-secondary)',
                fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-body)', boxShadow: filter === s ? 'none' : 'var(--shadow-sm)',
              }}>{s === 'ALL' ? 'All' : s === 'IN_PROGRESS' ? 'In Progress' : s.charAt(0) + s.slice(1).toLowerCase()}</button>
          ))}
        </div>

        {/* Booking Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(b => {
            const status = STATUS_CONFIG[b.status] || STATUS_CONFIG.PENDING;
            const StatusIcon = status.icon;
            return (
              <div key={b.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #0D9488, #14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 20 }}>
                      {b.worker[0]}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{b.worker}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                        {b.skill} • <Calendar size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {b.date} at {b.time}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 700, color: '#0D9488', fontSize: 16 }}>₹{b.amount}</p>
                      {b.rating && <p style={{ fontSize: 12, color: '#F59E0B' }}>{'★'.repeat(b.rating)}</p>}
                    </div>
                    <span style={{
                      padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                      background: status.bg, color: status.color, display: 'flex', alignItems: 'center', gap: 4,
                    }}><StatusIcon size={14} /> {status.label}</span>
                  </div>
                </div>

                {/* Actions */}
                {b.status === 'IN_PROGRESS' && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--surface-2)', display: 'flex', gap: 12 }}>
                    <button onClick={() => setOtpModal(b.id)} className="btn btn-gradient btn-sm" style={{ borderRadius: 999 }}>
                      <Key size={14} /> Generate Completion OTP
                    </button>
                    <button className="btn btn-sm btn-outline" style={{ borderRadius: 999 }}>
                      <Phone size={14} /> Call Worker
                    </button>
                  </div>
                )}
                {b.status === 'COMPLETED' && !b.rating && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--surface-2)' }}>
                    <button onClick={() => setRatingModal(b.id)} className="btn btn-sm btn-outline" style={{ borderRadius: 999 }}>
                      <Star size={14} /> Rate & Review
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* OTP Modal */}
        {otpModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card" style={{ padding: 32, maxWidth: 400, width: '100%', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Key size={32} color="#0D9488" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Completion OTP</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>Share this OTP with the worker to confirm job completion</p>
              <div style={{
                fontSize: 36, fontWeight: 800, letterSpacing: 12, fontFamily: 'var(--font-display)',
                color: '#0D9488', background: 'var(--surface-1)', borderRadius: 14, padding: '16px 24px', marginBottom: 16,
              }}>847293</div>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 20 }}>
                <Shield size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Payment will be released after OTP verification
              </p>
              <button onClick={() => setOtpModal(null)} className="btn btn-gradient" style={{ width: '100%', padding: 14, borderRadius: 14 }}>
                Done
              </button>
            </div>
          </div>
        )}

        {/* Rating Modal */}
        {ratingModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card" style={{ padding: 32, maxWidth: 400, width: '100%' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Rate Your Experience</h2>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setRatingValue(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <Star size={32} fill={s <= ratingValue ? '#F59E0B' : 'none'} color={s <= ratingValue ? '#F59E0B' : '#D1D5DB'} />
                  </button>
                ))}
              </div>

              <textarea value={ratingReview} onChange={e => setRatingReview(e.target.value)}
                placeholder="Write a review (optional)..." rows={3}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid var(--surface-3)', outline: 'none', fontSize: 14, fontFamily: 'var(--font-body)', resize: 'vertical', marginBottom: 16 }} />

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setRatingModal(null)} className="btn btn-outline" style={{ flex: 1, padding: 14, borderRadius: 14 }}>Cancel</button>
                <button onClick={() => setRatingModal(null)} className="btn btn-gradient" style={{ flex: 1, padding: 14, borderRadius: 14 }}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
