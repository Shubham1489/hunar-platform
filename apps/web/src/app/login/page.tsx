'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { 
  Phone, ArrowRight, Briefcase, Wrench, Home, Sparkles,
  ShieldCheck, Users, Star
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const ROLES = [
  { id: 'WORKER', label: 'Worker', icon: Wrench, desc: 'Find jobs & earn', color: '#3B82F6' },
  { id: 'EMPLOYER', label: 'Employer', icon: Briefcase, desc: 'Hire skilled workers', color: '#F97316' },
  { id: 'CUSTOMER', label: 'Customer', icon: Home, desc: 'Book services', color: '#0D9488' },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || '');
  const [step, setStep] = useState<'role' | 'phone'>('role');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { requestOtp } = useAuthStore();

  const handleRequestOtp = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const result = await requestOtp(phone);
      router.push(`/verify-otp?phone=${phone}&otpId=${result.otpId}&role=${selectedRole}${result.otp ? `&devOtp=${result.otp}` : ''}`);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Failed to send OTP');
    }
    setIsLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #0B1120 0%, #1E3A8A 100%)',
    }}>
      {/* Left — Branding */}
      <div style={{
        flex: '0 0 45%', padding: 60,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '20%', right: '-10%', width: 300, height: 300,
          borderRadius: '50%', background: 'rgba(249,115,22,0.1)', filter: 'blur(80px)',
        }} />

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 60 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: 20,
          }}>H</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'white' }}>Hunar</span>
        </Link>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 800,
          color: 'white', lineHeight: 1.15, marginBottom: 20,
        }}>
          Welcome to the Future of
          <span style={{
            display: 'block',
            background: 'linear-gradient(135deg, #F97316, #FBBF24)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Skilled Work</span>
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, maxWidth: 400, marginBottom: 40 }}>
          Join India&apos;s most trusted blue-collar job platform. AI-powered matching, secure payments, and verified profiles.
        </p>

        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { icon: ShieldCheck, text: 'Verified' },
            { icon: Sparkles, text: 'AI Powered' },
            { icon: Star, text: '4.8★ Rated' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
              <Icon size={15} color="#10B981" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 40,
      }}>
        <div style={{
          background: 'white', borderRadius: 24, padding: 40,
          width: '100%', maxWidth: 440,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}>
          {step === 'role' ? (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                I am a...
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 28 }}>
                Select your role to get started
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {ROLES.map(({ id, label, icon: Icon, desc, color }) => (
                  <button
                    key={id}
                    onClick={() => { setSelectedRole(id); setStep('phone'); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: 20, borderRadius: 16, border: 'none',
                      background: selectedRole === id ? `${color}10` : 'var(--surface-1)',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all var(--transition-base)',
                      boxShadow: selectedRole === id ? `inset 0 0 0 2px ${color}` : 'none',
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: `${color}15`, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={24} color={color} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{label}</p>
                      <p style={{ color: 'var(--text-tertiary)', fontSize: 13, marginTop: 2 }}>{desc}</p>
                    </div>
                    <ArrowRight size={18} color="var(--text-tertiary)" style={{ marginLeft: 'auto' }} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('role')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                ← Change role
              </button>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                Enter your phone
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 28 }}>
                We&apos;ll send you a 6-digit OTP to verify
              </p>

              <div style={{ marginBottom: 20 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'var(--surface-1)', borderRadius: 12,
                  padding: '4px 4px 4px 16px',
                  border: '2px solid transparent',
                  transition: 'all var(--transition-base)',
                }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: 15 }}>+91</span>
                  <div style={{ width: 1, height: 24, background: 'var(--surface-3)' }} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(val);
                      setError('');
                    }}
                    placeholder="Enter 10-digit number"
                    style={{
                      flex: 1, background: 'none', border: 'none', outline: 'none',
                      fontSize: 16, padding: '14px 0', fontFamily: 'var(--font-body)',
                      color: 'var(--text-primary)', letterSpacing: '0.05em',
                    }}
                    autoFocus
                  />
                  <Phone size={20} color="var(--text-tertiary)" style={{ marginRight: 12 }} />
                </div>

                {error && (
                  <p style={{ color: 'var(--error)', fontSize: 13, marginTop: 8 }}>{error}</p>
                )}
              </div>

              <button
                onClick={handleRequestOtp}
                disabled={phone.length !== 10 || isLoading}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%', borderRadius: 12,
                  opacity: phone.length !== 10 ? 0.5 : 1,
                  pointerEvents: phone.length !== 10 || isLoading ? 'none' : 'auto',
                }}
              >
                {isLoading ? 'Sending OTP...' : 'Get OTP'}
                {!isLoading && <ArrowRight size={18} />}
              </button>

              <p style={{ color: 'var(--text-tertiary)', fontSize: 12, marginTop: 16, textAlign: 'center' }}>
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0B1120 0%, #1E3A8A 100%)' }} />}>
      <LoginContent />
    </Suspense>
  );
}
