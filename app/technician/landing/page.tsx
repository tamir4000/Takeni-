'use client'

import Link from 'next/link'
import Header from '@/components/Header'

const FEATURES = [
  { icon: '📍', text: 'עבודות קרובות אליך — לפי מיקום בזמן אמת' },
  { icon: '💳', text: 'תשלום מהיר ובטוח — ישירות לחשבון שלך' },
  { icon: '📅', text: 'לוח עבודה גמיש — אתה קובע מתי לעבוד' },
]

const STATS = [
  { value: '₪800', label: 'ממוצע יומי' },
  { value: '1,200+', label: 'לקוחות' },
  { value: '4.9★', label: 'דירוג ממוצע' },
]

export default function TechnicianLandingPage() {
  return (
    <main
      className="flex flex-col min-h-screen"
      dir="rtl"
      style={{ background: '#080f1e', maxWidth: 430, margin: '0 auto', position: 'relative', overflow: 'hidden' }}
    >
      <Header />

      {/* Background glow */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-5%', right: '-10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,184,0.1) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-10%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,153,255,0.08) 0%, transparent 70%)',
        }} />
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '32px 24px 40px',
          position: 'relative',
          zIndex: 1,
          gap: 0,
        }}
      >
        {/* Technician illustration */}
        <div className="float-anim" style={{ marginBottom: 24 }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 32,
              background: 'linear-gradient(145deg, rgba(0,212,184,0.2) 0%, rgba(0,136,204,0.15) 100%)',
              border: '2px solid rgba(0,212,184,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 60,
              boxShadow: '0 0 40px rgba(0,212,184,0.2)',
            }}
          >
            👷
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          color: '#fff', fontWeight: 900, fontSize: 30, textAlign: 'center',
          letterSpacing: '0.02em', marginBottom: 10, lineHeight: 1.2,
        }}>
          TAKENI לטכנאים
        </h1>
        <p style={{
          color: '#8ba3be', fontSize: 14, textAlign: 'center', lineHeight: 1.7,
          marginBottom: 28, maxWidth: 300,
        }}>
          קבל עבודות חדשות באזור שלך, נהל סטטוס עבודה וראה את הארנק שלך — הכל במקום אחד.
        </p>

        {/* Stats bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(13,26,46,0.85)',
            border: '1px solid rgba(0,212,184,0.14)',
            borderRadius: 40,
            padding: '10px 8px',
            marginBottom: 28,
            backdropFilter: 'blur(12px)',
            width: '100%',
          }}
        >
          {STATS.map((stat, i) => (
            <div key={i} style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#00d4b8' }}>{stat.value}</span>
                <span style={{ fontSize: 10, color: '#4d6b85' }}>{stat.label}</span>
              </div>
              {i < STATS.length - 1 && (
                <div style={{ width: 1, height: 28, background: 'rgba(0,212,184,0.12)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Feature list */}
        <div
          style={{
            width: '100%',
            background: 'rgba(13,26,46,0.7)',
            border: '1px solid rgba(0,212,184,0.12)',
            borderRadius: 18,
            padding: 16,
            marginBottom: 28,
            backdropFilter: 'blur(8px)',
          }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(0,212,184,0.08)' : 'none',
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(0,212,184,0.1)',
                border: '1px solid rgba(0,212,184,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#00d4b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ color: '#c8ddf0', fontSize: 13, lineHeight: 1.5 }}>{f.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link
            href="/technician/register"
            style={{
              width: '100%',
              padding: '15px 24px',
              borderRadius: 14,
              fontWeight: 700,
              fontSize: 15,
              textAlign: 'center',
              color: '#080f1e',
              background: 'linear-gradient(135deg, #00d4b8 0%, #0088cc 100%)',
              boxShadow: '0 6px 24px rgba(0,212,184,0.35)',
              textDecoration: 'none',
              display: 'block',
              transition: 'all 0.2s',
            }}
          >
            התחברות / הרשמה לטכנאים
          </Link>

          <Link
            href="/"
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: 14,
              fontWeight: 600,
              fontSize: 14,
              textAlign: 'center',
              color: '#00d4b8',
              background: 'rgba(0,212,184,0.06)',
              border: '1.5px solid rgba(0,212,184,0.3)',
              textDecoration: 'none',
              display: 'block',
              transition: 'all 0.2s',
            }}
          >
            אני לקוח? עבור לאפליקציית לקוחות
          </Link>
        </div>
      </div>
    </main>
  )
}
