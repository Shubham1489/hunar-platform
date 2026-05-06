'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Star, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface SidebarProps {
  navItems: NavItem[];
  profile: {
    name: string;
    subtitle: string;
    gradient: string;
    initial: string;
    extra?: React.ReactNode;
  };
  accentColor?: string;
}

export default function Sidebar({ navItems, profile, accentColor = 'var(--primary)' }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 260, background: 'white', padding: '24px 16px',
      display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)',
      position: 'sticky', top: 0, height: '100vh', flexShrink: 0,
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', marginBottom: 32, textDecoration: 'none' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 800, fontSize: 18,
        }}>H</div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--primary)' }}>Hunar</span>
      </Link>

      {/* Profile Card */}
      <div style={{
        background: profile.gradient, borderRadius: 16,
        padding: 20, marginBottom: 24, color: 'white',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: profile.extra ? 12 : 0 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700,
          }}>{profile.initial}</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15 }}>{profile.name}</p>
            <p style={{ fontSize: 12, opacity: 0.7 }}>{profile.subtitle}</p>
          </div>
        </div>
        {profile.extra}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto' }}>
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href;
          return (
            <Link key={label} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 10,
              color: isActive ? accentColor : 'var(--text-secondary)',
              background: isActive ? `${accentColor}12` : 'transparent',
              textDecoration: 'none', fontSize: 14,
              fontWeight: isActive ? 600 : 500,
              marginBottom: 4, transition: 'all 150ms ease',
            }}>
              <Icon size={18} /> {label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => { localStorage.clear(); window.location.href = '/'; }}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px', borderRadius: 10, width: '100%',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--error)', fontSize: 14, fontWeight: 500,
          fontFamily: 'var(--font-body)',
        }}
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
