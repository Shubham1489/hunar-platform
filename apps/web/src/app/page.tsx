'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Zap, Wrench, Paintbrush, Hammer, Wind, Shield, Truck, ChefHat,
  Star, ArrowRight, MapPin, Users, Briefcase, TrendingUp,
  Search, Mic, Play, CheckCircle, Sparkles, ChevronRight,
  Menu, X
} from 'lucide-react';

const CATEGORIES = [
  { icon: Zap, name: 'Electrician', color: '#F59E0B', count: '5,200+' },
  { icon: Wrench, name: 'Plumber', color: '#3B82F6', count: '4,100+' },
  { icon: Hammer, name: 'Carpenter', color: '#8B5CF6', count: '3,800+' },
  { icon: Paintbrush, name: 'Painter', color: '#EC4899', count: '3,200+' },
  { icon: Wind, name: 'AC Repair', color: '#06B6D4', count: '2,900+' },
  { icon: Shield, name: 'Security', color: '#10B981', count: '2,100+' },
  { icon: Truck, name: 'Driver', color: '#F97316', count: '4,500+' },
  { icon: ChefHat, name: 'Cook', color: '#EF4444', count: '1,800+' },
];

const STATS = [
  { value: '450K+', label: 'Skilled Workers', icon: Users },
  { value: '12K+', label: 'Active Jobs', icon: Briefcase },
  { value: '50+', label: 'Cities Covered', icon: MapPin },
  { value: '98%', label: 'Match Accuracy', icon: TrendingUp },
];

const TESTIMONIALS = [
  { 
    name: 'Ramesh Kumar', role: 'Master Electrician', city: 'Delhi',
    text: 'Hunar gave me 3x more work than I used to get. The AI recommendations match me to jobs I actually want.',
    rating: 5, earnings: '₹45,000/month'
  },
  { 
    name: 'Priya Sharma', role: 'HR Manager, BuildRight', city: 'Mumbai',
    text: 'We hired 20 verified workers in just one week. The AI screening saved us 80% of our time.',
    rating: 5, earnings: '40 hires/month'
  },
  { 
    name: 'Aisha Patel', role: 'Homeowner', city: 'Bangalore',
    text: 'Found a 5-star plumber within 30 minutes. The OTP payment system gives me full peace of mind.',
    rating: 5, earnings: '₹500 avg booking'
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Sign Up in 30 Seconds', desc: 'Just your phone number. No email, no forms. OTP verification gets you in.' },
  { step: '02', title: 'AI Matches You', desc: 'Our recommendation engine finds the best jobs or workers based on skills, location, and ratings.' },
  { step: '03', title: 'Book & Pay Securely', desc: 'OTP-verified completion. Escrow payments ensure fair pay for every job.' },
];

export default function HomePage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ═══════════════════ NAVIGATION ═══════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 24px', height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'all var(--transition-base)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: 18,
            fontFamily: 'var(--font-display)',
          }}>H</div>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 22, color: scrolled ? 'var(--primary)' : 'white',
            letterSpacing: '-0.03em',
          }}>Hunar</span>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 32,
          ...(typeof window !== 'undefined' && window.innerWidth < 768 ? { display: 'none' } : {}),
        }} className="desktop-nav">
          {['For Workers', 'For Employers', 'For Customers', 'About'].map(item => (
            <a key={item} href="#" style={{
              color: scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.85)',
              textDecoration: 'none', fontSize: 14, fontWeight: 500,
              transition: 'color var(--transition-fast)',
            }}>{item}</a>
          ))}
          <Link href="/login" className="btn btn-primary btn-sm btn-pill">Get Started</Link>
        </div>

        <button 
          onClick={() => setMobileMenu(!mobileMenu)}
          style={{ 
            display: 'none', background: 'none', border: 'none', cursor: 'pointer',
            color: scrolled ? 'var(--text-primary)' : 'white',
          }}
          className="mobile-menu-btn"
        >
          {mobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #0B1120 0%, #1E3A8A 50%, #2563EB 100%)',
        position: 'relative', overflow: 'hidden',
        padding: '120px 24px 80px',
      }}>
        {/* Animated gradient orbs */}
        <div style={{
          position: 'absolute', top: '10%', right: '10%', width: 400, height: 400,
          borderRadius: '50%', background: 'rgba(249, 115, 22, 0.12)',
          filter: 'blur(80px)', animation: 'float 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', left: '5%', width: 300, height: 300,
          borderRadius: '50%', background: 'rgba(13, 148, 136, 0.1)',
          filter: 'blur(60px)', animation: 'float 8s ease-in-out infinite reverse',
        }} />

        <div style={{
          maxWidth: 1200, margin: '0 auto', width: '100%',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60,
          alignItems: 'center',
        }}>
          {/* Left — Copy */}
          <div className="animate-slideUp">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 999,
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
              color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500,
              marginBottom: 24,
            }}>
              <Sparkles size={14} color="#F59E0B" />
              AI-Powered Matching • 98% Accuracy
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 800, color: 'white', lineHeight: 1.1,
              letterSpacing: '-0.03em', marginBottom: 24,
            }}>
              India&apos;s Smartest
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #F97316, #FBBF24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Blue-Collar</span>
              <br />
              Job Platform
            </h1>

            <p style={{
              fontSize: 18, color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.7, maxWidth: 480, marginBottom: 40,
            }}>
              Connect with verified workers, discover AI-matched jobs, and get things done 
              with OTP-secured payments. From electricians to chefs — all in one platform.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
              <Link href="/login" className="btn btn-gradient btn-lg btn-pill">
                Find Skilled Workers
                <ArrowRight size={18} />
              </Link>
              <Link href="/login?role=WORKER" className="btn btn-outline btn-lg btn-pill" style={{
                color: 'white', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.3)',
              }}>
                I&apos;m a Worker
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              {[
                { icon: CheckCircle, text: 'Verified Workers' },
                { icon: Shield, text: 'Secure Payments' },
                { icon: Sparkles, text: 'AI Recommendations' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: 'rgba(255,255,255,0.6)', fontSize: 13,
                }}>
                  <Icon size={15} color="#10B981" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Search / Visual */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            {/* Search Card */}
            <div style={{
              background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(30px)',
              borderRadius: 24, padding: 32,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 16, fontWeight: 500 }}>
                What do you need help with?
              </p>

              <div style={{
                display: 'flex', gap: 8, marginBottom: 24,
              }}>
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.1)', borderRadius: 999,
                  padding: '14px 20px',
                }}>
                  <Search size={18} color="rgba(255,255,255,0.5)" />
                  <input
                    placeholder="e.g. Electrician, Plumber..."
                    style={{
                      background: 'none', border: 'none', outline: 'none',
                      color: 'white', fontSize: 15, width: '100%',
                    }}
                  />
                </div>
                <button style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F97316, #FBBF24)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Mic size={20} color="white" />
                </button>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.05)', borderRadius: 16,
                padding: '12px 16px', marginBottom: 24,
              }}>
                <MapPin size={16} color="#F97316" />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                  Detecting your location...
                </span>
              </div>

              {/* Quick category chips */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['AC Repair ❄️', 'Plumber 🔧', 'Electrician ⚡', 'Carpenter 🪚'].map(cat => (
                  <span key={cat} style={{
                    padding: '8px 14px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: 13, cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}>{cat}</span>
                ))}
              </div>
            </div>

            {/* Floating stats */}
            <div style={{
              display: 'flex', gap: 16, marginTop: 24, justifyContent: 'center',
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                borderRadius: 16, padding: '12px 20px', textAlign: 'center',
              }}>
                <p style={{ color: '#F97316', fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)' }}>4.8</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Avg Rating</p>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                borderRadius: 16, padding: '12px 20px', textAlign: 'center',
              }}>
                <p style={{ color: '#10B981', fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)' }}>30m</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Avg Response</p>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                borderRadius: 16, padding: '12px 20px', textAlign: 'center',
              }}>
                <p style={{ color: '#3B82F6', fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)' }}>100%</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Secure Pay</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS BAR ═══════════════════ */}
      <section style={{
        background: 'var(--surface-0)', padding: '48px 24px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32,
        }}>
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <Icon size={24} color="var(--primary)" style={{ marginBottom: 8 }} />
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800,
                color: 'var(--primary)', letterSpacing: '-0.02em',
              }}>{value}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ SERVICE CATEGORIES ═══════════════════ */}
      <section style={{
        padding: '100px 24px',
        background: 'var(--surface-1)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              Services
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
              Find the Right Professional
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', fontSize: 16 }}>
              500+ skilled categories with AI-powered matching to find the perfect professional for any job.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
          }} className="stagger-children">
            {CATEGORIES.map(({ icon: Icon, name, color, count }) => (
              <div key={name} className="card" style={{
                padding: 28, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center',
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: `${color}15`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16, transition: 'all var(--transition-base)',
                }}>
                  <Icon size={28} color={color} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{name}</h3>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>{count} professionals</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/login" className="btn btn-outline btn-pill">
              View All Categories <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section style={{ padding: '100px 24px', background: 'var(--surface-0)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ color: 'var(--tertiary)', fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              How It Works
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16 }}>
              Simple as 1-2-3
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="animate-fadeIn" style={{ animationDelay: `${i * 0.15}s`, textAlign: 'center' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 24, margin: '0 auto 24px',
                  background: `linear-gradient(135deg, ${['#1E3A8A', '#F97316', '#0D9488'][i]}, ${['#3B82F6', '#FBBF24', '#5EEAD4'][i]})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
                  boxShadow: `0 8px 24px ${['rgba(30,58,138,0.3)', 'rgba(249,115,22,0.3)', 'rgba(13,148,136,0.3)'][i]}`,
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ AI FEATURES ═══════════════════ */}
      <section style={{
        padding: '100px 24px',
        background: 'linear-gradient(135deg, #0B1120 0%, #1E3A8A 100%)',
        color: 'white',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 999,
              background: 'rgba(249, 115, 22, 0.15)',
              color: '#FBBF24', fontSize: 13, fontWeight: 600,
              marginBottom: 16,
            }}>
              <Sparkles size={14} />
              Powered by AI
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16 }}>
              Intelligence at Every Step
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto', fontSize: 16 }}>
              Our AI doesn&apos;t just match — it understands skills, predicts fair wages, and ranks candidates.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { title: 'Smart Job Matching', desc: 'TF-IDF skill vectors + location scoring deliver 98% accurate recommendations.', icon: '🎯', color: '#3B82F6' },
              { title: 'Voice Skill Input', desc: 'Speak your skills in Hindi, Tamil, or English. Our NLP extracts & maps them instantly.', icon: '🎤', color: '#F97316' },
              { title: 'Fair Salary Prediction', desc: 'XGBoost model predicts fair wage ranges based on skills, experience & city.', icon: '💰', color: '#10B981' },
            ].map(({ title, desc, icon, color }) => (
              <div key={title} style={{
                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
                borderRadius: 20, padding: 32,
                transition: 'all var(--transition-base)',
              }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section style={{ padding: '100px 24px', background: 'var(--surface-1)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ color: 'var(--accent-gold)', fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              Success Stories
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16 }}>
              Trusted by Thousands
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {TESTIMONIALS.map(({ name, role, city, text, rating, earnings }) => (
              <div key={name} className="card" style={{ padding: 28 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: rating }, (_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                  &ldquo;{text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15 }}>{name}</p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>{role} • {city}</p>
                  </div>
                  <span className="chip chip-success" style={{ fontSize: 12 }}>{earnings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA SECTION ═══════════════════ */}
      <section style={{
        padding: '100px 24px', textAlign: 'center',
        background: 'var(--surface-0)',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 800, marginBottom: 20, lineHeight: 1.15,
          }}>
            Ready to Transform How
            <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>India Works?</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, marginBottom: 40, lineHeight: 1.7 }}>
            Join 450,000+ workers, employers, and customers who are already using Hunar.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link href="/login" className="btn btn-gradient btn-lg btn-pill">
              Start Free Today <ArrowRight size={18} />
            </Link>
            <Link href="/login?role=EMPLOYER" className="btn btn-outline btn-lg btn-pill">
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer style={{
        background: 'var(--surface-dark-0)', color: 'var(--text-on-dark)',
        padding: '60px 24px 30px',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40,
          marginBottom: 40,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: 16,
              }}>H</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20 }}>Hunar</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.7, maxWidth: 300 }}>
              AI-powered platform connecting India&apos;s skilled workforce with meaningful work opportunities.
            </p>
          </div>

          {[
            { title: 'Platform', links: ['For Workers', 'For Employers', 'For Customers', 'Pricing'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>{title}</p>
              {links.map(link => (
                <a key={link} href="#" style={{
                  display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 14,
                  textDecoration: 'none', marginBottom: 10,
                }}>{link}</a>
              ))}
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 20, textAlign: 'center',
          color: 'rgba(255,255,255,0.3)', fontSize: 13,
        }}>
          © 2026 Hunar Technologies Pvt. Ltd. All rights reserved.
        </div>
      </footer>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          section > div > div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
          section > div > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
          section > div > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          footer > div { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
