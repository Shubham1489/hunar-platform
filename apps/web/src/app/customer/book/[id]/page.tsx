'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Star, MapPin, Shield, Clock, Phone, Calendar,
  CheckCircle, CreditCard, Sparkles, MessageSquare, Award,
} from 'lucide-react';

const WORKERS_DB: Record<string, any> = {
  '1': {
    id: '1', name: 'Suresh Yadav', skill: 'Electrician',
    skills: ['Electrician', 'Wiring', 'Smart Home'],
    rating: 4.9, reviews: 120, distance: '1.2 km', rate: 800,
    available: true, responseTime: '30 min', experience: 12,
    verified: true, city: 'Delhi', jobsCompleted: 120,
    bio: 'Expert electrician specializing in residential and commercial wiring. 12+ years experience with smart home installations.',
    recentReviews: [
      { name: 'Rahul G.', rating: 5, text: 'Excellent work! Very professional.', date: '1 week ago' },
      { name: 'Neha S.', rating: 5, text: 'Fixed complex wiring issue quickly.', date: '2 weeks ago' },
      { name: 'Amit K.', rating: 4, text: 'Good work, on time.', date: '1 month ago' },
    ],
  },
  '2': {
    id: '2', name: 'Amit Verma', skill: 'Plumber',
    skills: ['Plumber', 'Pipe Fitting'],
    rating: 4.7, reviews: 85, distance: '2.5 km', rate: 700,
    available: true, responseTime: '45 min', experience: 8,
    verified: true, city: 'Delhi', jobsCompleted: 85,
    bio: 'Reliable plumber with expertise in pipe fitting, water heater installation, and bathroom renovations.',
    recentReviews: [
      { name: 'Priya M.', rating: 5, text: 'Great plumber, very clean work.', date: '3 days ago' },
      { name: 'Sanjay R.', rating: 4, text: 'Good service, fixed the leak.', date: '2 weeks ago' },
    ],
  },
  '3': {
    id: '3', name: 'Raju Singh', skill: 'Carpenter',
    skills: ['Carpenter', 'Woodwork', 'Furniture'],
    rating: 4.8, reviews: 98, distance: '3.1 km', rate: 900,
    available: true, responseTime: '1 hr', experience: 15,
    verified: true, city: 'Noida', jobsCompleted: 98,
    bio: 'Master carpenter with 15 years of experience in custom furniture, kitchen cabinets, and wooden flooring.',
    recentReviews: [
      { name: 'Deepa J.', rating: 5, text: 'Beautiful custom bookshelf!', date: '1 week ago' },
      { name: 'Vikram S.', rating: 5, text: 'Best carpenter in the area.', date: '3 weeks ago' },
    ],
  },
};

function getWorker(id: string) {
  return WORKERS_DB[id] || WORKERS_DB['1'];
}

export default function BookWorkerPage() {
  const params = useParams();
  const router = useRouter();
  const worker = getWorker(params.id as string);

  const [step, setStep] = useState<'details' | 'schedule' | 'confirm' | 'success'>('details');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const platformFee = Math.round(worker.rate * 0.1);
  const total = worker.rate + platformFee;

  if (step === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--surface-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 440, padding: 32 }}>
          <div style={{
            width: 88, height: 88, borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <CheckCircle size={48} color="#059669" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Booking Confirmed! 🎉</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 8 }}>
            {worker.name} will arrive on {date} at {time}
          </p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 14, marginBottom: 24 }}>
            You&apos;ll receive a notification when the worker is on the way.
          </p>

          <div className="card" style={{ padding: 20, marginBottom: 24, textAlign: 'left' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 12 }}>Booking Summary</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Service charge</span>
              <span style={{ fontWeight: 600 }}>₹{worker.rate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Platform fee (10%)</span>
              <span style={{ fontWeight: 600 }}>₹{platformFee}</span>
            </div>
            <div style={{ height: 1, background: 'var(--surface-3)', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: '#0D9488' }}>₹{total}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => router.push('/customer/bookings')} className="btn btn-gradient" style={{ flex: 1, padding: 14, borderRadius: 14 }}>
              View Bookings
            </button>
            <button onClick={() => router.push('/customer/dashboard')} className="btn btn-outline" style={{ flex: 1, padding: 14, borderRadius: 14 }}>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-1)' }}>
      {/* Top Bar */}
      <div style={{ background: 'white', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-sm)' }}>
        <button onClick={() => step === 'details' ? router.back() : setStep(step === 'confirm' ? 'schedule' : 'details')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
          <ArrowLeft size={18} /> Back
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {['Details', 'Schedule', 'Confirm'].map((label, i) => {
              const stepNames = ['details', 'schedule', 'confirm'] as const;
              const isActive = stepNames.indexOf(step) >= i;
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: isActive ? '#0D9488' : 'var(--surface-3)',
                    color: isActive ? 'white' : 'var(--text-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{label}</span>
                  {i < 2 && <div style={{ width: 40, height: 2, background: isActive ? '#0D9488' : 'var(--surface-3)', borderRadius: 1, margin: '0 4px' }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
          {/* Main Content */}
          <div>
            {step === 'details' && (
              <>
                {/* Worker Profile Card */}
                <div className="card" style={{ padding: 28, marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 72, height: 72, borderRadius: 20,
                      background: 'linear-gradient(135deg, #0D9488, #14B8A6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: 28, position: 'relative',
                    }}>
                      {worker.name[0]}
                      {worker.verified && <Shield size={18} color="white" fill="#F59E0B" style={{ position: 'absolute', bottom: -3, right: -3 }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>{worker.name}</h1>
                        {worker.verified && <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(245,158,11,0.1)', color: '#B45309', padding: '2px 8px', borderRadius: 999 }}>Verified</span>}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8 }}>{worker.skill} • {worker.experience} years exp • <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {worker.distance}</p>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}><Star size={14} fill="#F59E0B" color="#F59E0B" /> {worker.rating} ({worker.reviews} reviews)</span>
                        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>✅ {worker.jobsCompleted} jobs</span>
                        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>⏱ {worker.responseTime}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginTop: 16 }}>{worker.bio}</p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                    {worker.skills.map((s: string) => <span key={s} className="chip" style={{ fontSize: 12 }}>{s}</span>)}
                  </div>
                </div>

                {/* Describe Your Need */}
                <div className="card" style={{ padding: 28, marginBottom: 20 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Describe Your Need</h2>
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="Tell the worker what you need done... (e.g., 'Need to fix flickering lights in bedroom and install a new ceiling fan in living room')"
                    rows={4} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '2px solid var(--surface-3)', outline: 'none', fontSize: 15, fontFamily: 'var(--font-body)', resize: 'vertical', lineHeight: 1.6 }} />
                </div>

                {/* Reviews */}
                <div className="card" style={{ padding: 28 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recent Reviews</h2>
                  {worker.recentReviews.map((r: any, i: number) => (
                    <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: i < worker.recentReviews.length - 1 ? '1px solid var(--surface-2)' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= r.rating ? '#F59E0B' : 'none'} color={s <= r.rating ? '#F59E0B' : '#D1D5DB'} />)}
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{r.text}</p>
                      <p style={{ color: 'var(--text-tertiary)', fontSize: 12, marginTop: 4 }}>{r.date}</p>
                    </div>
                  ))}
                </div>

                <button onClick={() => setStep('schedule')} className="btn btn-gradient" style={{ width: '100%', padding: 16, borderRadius: 14, marginTop: 20, fontSize: 16 }}>
                  Continue to Schedule →
                </button>
              </>
            )}

            {step === 'schedule' && (
              <div className="card" style={{ padding: 32 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Choose Date & Time</h2>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>Preferred Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '2px solid var(--surface-3)', fontSize: 15, fontFamily: 'var(--font-body)' }} />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>Preferred Time</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map(t => (
                      <button key={t} onClick={() => setTime(t)}
                        style={{
                          padding: '12px 8px', borderRadius: 10, border: time === t ? '2px solid #0D9488' : '2px solid var(--surface-3)',
                          background: time === t ? 'rgba(13,148,136,0.05)' : 'white',
                          cursor: 'pointer', fontWeight: time === t ? 700 : 400, fontSize: 14,
                          fontFamily: 'var(--font-body)', color: time === t ? '#0D9488' : 'var(--text-secondary)',
                        }}>{t}</button>
                    ))}
                  </div>
                </div>

                <button onClick={() => setStep('confirm')} className="btn btn-gradient" style={{ width: '100%', padding: 16, borderRadius: 14, fontSize: 16 }}
                  disabled={!date || !time}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {step === 'confirm' && (
              <div className="card" style={{ padding: 32 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Confirm & Pay</h2>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>Payment Method</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { value: 'UPI', label: 'UPI', icon: '📱' },
                      { value: 'CARD', label: 'Card', icon: '💳' },
                      { value: 'NETBANKING', label: 'Net Banking', icon: '🏦' },
                      { value: 'CASH', label: 'Cash', icon: '💵' },
                    ].map(m => (
                      <button key={m.value} onClick={() => setPaymentMethod(m.value)}
                        style={{
                          flex: 1, padding: '14px 12px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                          border: paymentMethod === m.value ? '2px solid #0D9488' : '2px solid var(--surface-3)',
                          background: paymentMethod === m.value ? 'rgba(13,148,136,0.05)' : 'white',
                        }}>
                        <div style={{ fontSize: 24, marginBottom: 4 }}>{m.icon}</div>
                        <p style={{ fontWeight: 600, fontSize: 13 }}>{m.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'var(--surface-1)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Order Summary</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{worker.skill} service ({worker.name})</span>
                    <span style={{ fontWeight: 600 }}>₹{worker.rate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Platform fee (10%)</span>
                    <span style={{ fontWeight: 600 }}>₹{platformFee}</span>
                  </div>
                  <div style={{ height: 1, background: 'var(--surface-3)', margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: 18 }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: 18, color: '#0D9488' }}>₹{total}</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(13,148,136,0.05)', borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Shield size={20} color="#0D9488" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Secure Escrow Payment</p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>Your payment is held securely until the job is completed and verified with OTP.</p>
                  </div>
                </div>

                <button onClick={() => setStep('success')} className="btn btn-gradient" style={{ width: '100%', padding: 16, borderRadius: 14, fontSize: 16 }}>
                  <CreditCard size={18} /> Pay ₹{total} & Book
                </button>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div>
            <div className="card" style={{ padding: 20, position: 'sticky', top: 96 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #0D9488, #14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 20 }}>{worker.name[0]}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15 }}>{worker.name}</p>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>{worker.skill}</p>
                </div>
              </div>

              <div style={{ height: 1, background: 'var(--surface-2)', margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Rate</span>
                <span style={{ fontWeight: 700, color: '#0D9488' }}>₹{worker.rate}/day</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Rating</span>
                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><Star size={12} fill="#F59E0B" color="#F59E0B" /> {worker.rating}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Response</span>
                <span style={{ fontWeight: 600 }}>{worker.responseTime}</span>
              </div>
              {date && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Date</span>
                  <span style={{ fontWeight: 600 }}>{date}</span>
                </div>
              )}
              {time && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Time</span>
                  <span style={{ fontWeight: 600 }}>{time}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
