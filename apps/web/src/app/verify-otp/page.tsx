'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const otpId = searchParams.get('otpId') || '';
  const role = searchParams.get('role') || '';
  const devOtp = searchParams.get('devOtp') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOtp, requestOtp } = useAuthStore();

  // Countdown timer
  useEffect(() => {
    const timer = countdown > 0 ? setTimeout(() => setCountdown(c => c - 1), 1000) : undefined;
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (value && index === 5) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === 6) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      handleVerify(pasted);
    }
  };

  const handleVerify = async (otpString: string) => {
    setIsLoading(true);
    setError('');
    try {
      await verifyOtp(phone, otpString, otpId, role || undefined);
      // Redirect based on role
      const roleRoutes: Record<string, string> = {
        WORKER: '/worker/dashboard',
        EMPLOYER: '/employer/dashboard',
        CUSTOMER: '/customer/dashboard',
      };
      router.push(roleRoutes[role] || '/');
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
    setIsLoading(false);
  };

  const handleResend = async () => {
    try {
      await requestOtp(phone);
      setCountdown(30);
      setError('');
    } catch {
      setError('Failed to resend OTP');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0B1120 0%, #1E3A8A 100%)',
      padding: 24,
    }}>
      <div style={{
        background: 'white', borderRadius: 24, padding: 48,
        width: '100%', maxWidth: 440,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        textAlign: 'center',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20, margin: '0 auto 24px',
          background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ShieldCheck size={32} color="white" />
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
          Verify OTP
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 8 }}>
          We&apos;ve sent a 6-digit code to
        </p>
        <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>+91 {phone}</p>

        {devOtp && (
          <div style={{
            background: 'var(--surface-2)', borderRadius: 10, padding: '8px 16px',
            marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Dev OTP:</span>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '0.15em', color: 'var(--primary)' }}>{devOtp}</span>
          </div>
        )}

        {/* OTP Input */}
        <div style={{
          display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20, marginBottom: 20,
        }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              style={{
                width: 52, height: 60, textAlign: 'center',
                fontSize: 24, fontWeight: 700,
                borderRadius: 12, border: 'none',
                background: digit ? 'rgba(30,58,138,0.08)' : 'var(--surface-1)',
                color: 'var(--primary)',
                outline: 'none',
                boxShadow: digit ? '0 0 0 2px var(--primary-light)' : 'none',
                transition: 'all var(--transition-fast)',
                fontFamily: 'var(--font-display)',
              }}
              maxLength={1}
            />
          ))}
        </div>

        {error && (
          <p style={{ color: 'var(--error)', fontSize: 14, marginBottom: 16 }}>{error}</p>
        )}

        <button
          onClick={() => handleVerify(otp.join(''))}
          disabled={otp.join('').length !== 6 || isLoading}
          className="btn btn-primary btn-lg"
          style={{
            width: '100%', borderRadius: 12, marginBottom: 20,
            opacity: otp.join('').length !== 6 ? 0.5 : 1,
          }}
        >
          {isLoading ? 'Verifying...' : 'Verify & Continue'}
          {!isLoading && <ArrowRight size={18} />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {countdown > 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>
              Resend in <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{countdown}s</span>
            </p>
          ) : (
            <button onClick={handleResend} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--primary)', fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <RotateCcw size={14} /> Resend OTP
            </button>
          )}
        </div>

        <Link href="/login" style={{
          display: 'block', marginTop: 20,
          color: 'var(--text-tertiary)', fontSize: 14, textDecoration: 'none',
        }}>
          ← Back to login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0B1120 0%, #1E3A8A 100%)' }} />}>
      <VerifyOtpContent />
    </Suspense>
  );
}
