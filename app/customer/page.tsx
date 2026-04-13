'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import LocationBar from '@/components/LocationBar'

const SERVICES = [
  {
    id: 'electricity',
    name: 'חשמל',
    description: 'קצר, לוח חשמל, שקעים, תאורה ועוד',
    gradient: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
    shadowColor: 'rgba(255,180,0,0.35)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2Z" fill="white" />
      </svg>
    ),
  },
  {
    id: 'plumbing',
    name: 'אינסטלציה',
    description: 'נזילות, סתימות, ברזים, מחממי מים',
    gradient: 'linear-gradient(135deg, #00bcd4 0%, #0099ff 100%)',
    shadowColor: 'rgba(0,153,255,0.35)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8 2 6 6 6 9C6 13 9 15 9 18H15C15 15 18 13 18 9C18 6 16 2 12 2Z" fill="white" />
        <path d="M9 18H15V20C15 21.1 14.1 22 13 22H11C9.9 22 9 21.1 9 20V18Z" fill="rgba(255,255,255,0.7)" />
        <circle cx="12" cy="8" r="2" fill="rgba(255,255,255,0.5)" />
      </svg>
    ),
  },
  {
    id: 'locksmith',
    name: 'מנעול',
    description: 'דלת נתקעת, צילינדר, פתיחת דלת',
    gradient: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
    shadowColor: 'rgba(156,39,176,0.35)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="7" cy="12" r="5" stroke="white" strokeWidth="2.5" fill="none" />
        <circle cx="7" cy="12" r="2" fill="white" />
        <rect x="11" y="11" width="10" height="2.5" rx="1.25" fill="white" />
        <rect x="18" y="13.5" width="3" height="2.5" rx="1.25" fill="white" />
        <rect x="15" y="13.5" width="2.5" height="2" rx="1" fill="white" />
      </svg>
    ),
  },
  {
    id: 'ac',
    name: 'מזגן',
    description: 'לא מקרר, נזילת מים, התקנה',
    gradient: 'linear-gradient(135deg, #00e5ff 0%, #00bcd4 100%)',
    shadowColor: 'rgba(0,229,255,0.35)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L12 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 8L8 4M12 8L16 4" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 16L8 20M12 16L16 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M4 12L20 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 9L2 12M6 15L2 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 9L22 12M18 15L22 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

interface User {
  name: string
  role: string
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'בוקר טוב'
  if (hour >= 12 && hour < 17) return 'צהריים טובים'
  if (hour >= 17 && hour < 21) return 'ערב טוב'
  return 'לילה טוב'
}

export default function CustomerPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [availableCount] = useState(() => Math.floor(Math.random() * 6) + 3)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.user) setUser(d.user)
        else router.push('/auth')
      })
      .catch(() => router.push('/auth'))
  }, [router])

  const firstName = user?.name?.split(' ')[0] || 'אורח'
  const greeting = getGreeting()

  return (
    <main className="flex flex-col min-h-screen" style={{ background: '#080f1e', maxWidth: 430, margin: '0 auto' }}>
      <Header />

      {/* Background ambient glow */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-5%', left: '50%', transform: 'translateX(-50%)',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,184,0.08) 0%, transparent 70%)',
        }} />
      </div>

      <div className="flex-1 px-4 pb-8" style={{ position: 'relative', zIndex: 1 }}>

        {/* Greeting row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, marginBottom: 4 }}>
          <div>
            <p style={{ color: '#8ba3be', fontSize: 13, marginBottom: 2 }}>{greeting},</p>
            <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0 }}>{firstName} 👋</h2>
          </div>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' })
              router.push('/')
            }}
            style={{
              background: 'rgba(13,26,46,0.8)',
              border: '1px solid rgba(0,212,184,0.15)',
              borderRadius: 10,
              padding: '7px 12px',
              color: '#8ba3be',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            התנתק
          </button>
        </div>

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(0,200,83,0.12)', border: '1px solid rgba(0,200,83,0.3)',
            borderRadius: 20, padding: '5px 12px' }}>
            <div className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#00c853', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#00c853', fontWeight: 700 }}>
              {availableCount} טכנאים זמינים עכשיו
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(0,212,184,0.12)', border: '1px solid rgba(0,212,184,0.25)',
            borderRadius: 20, padding: '5px 12px' }}>
            <span style={{ fontSize: 12 }}>⚡</span>
            <span style={{ fontSize: 12, color: '#00d4b8', fontWeight: 700 }}>עד 20 דק׳</span>
          </div>
        </div>

        {/* Location bar */}
        <LocationBar />

        {/* Distance estimate */}
        <p style={{ fontSize: 12, color: '#4d6b85', marginBottom: 18, marginTop: -8 }}>
          טכנאים זמינים ב-2 ק״מ ממך
        </p>

        {/* Title */}
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 16 }}>
          איזה טכנאי צריך היום?
        </h1>

        {/* Service cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          {SERVICES.map(service => (
            <button
              key={service.id}
              onClick={() => router.push(`/customer/problem?service=${service.id}`)}
              className="card-hover fade-in-up"
              style={{
                background: 'linear-gradient(145deg, #0d1f3c 0%, #0a1a32 100%)',
                border: '1px solid rgba(0,212,184,0.12)',
                borderRadius: 18,
                padding: 16,
                textAlign: 'right',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                opacity: 0,
              }}
            >
              {/* Icon in colored square */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: service.gradient,
                  boxShadow: `0 4px 16px ${service.shadowColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                }}
              >
                {service.icon}
              </div>
              <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 15, marginBottom: 5 }}>{service.name}</h3>
              <p style={{ color: '#8ba3be', fontSize: 11, lineHeight: 1.5, margin: 0 }}>{service.description}</p>
            </button>
          ))}
        </div>

        {/* "Other" card - full width */}
        <button
          onClick={() => router.push('/customer/problem?service=other')}
          className="card-hover fade-in-up"
          style={{
            width: '100%',
            background: 'linear-gradient(145deg, #0d1f3c 0%, #0a1a32 100%)',
            border: '1px solid rgba(0,212,184,0.12)',
            borderRadius: 18,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            cursor: 'pointer',
            opacity: 0,
            animationDelay: '0.25s',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #00d4b8 0%, #00acc1 100%)',
              boxShadow: '0 4px 16px rgba(0,212,184,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.5 8.5L20 7L15.5 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L8.5 12L4 7L10.5 8.5L12 2Z" fill="white" />
            </svg>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 15, marginBottom: 4 }}>אחר</h3>
            <p style={{ color: '#8ba3be', fontSize: 12, margin: 0 }}>
              ראוטינג, מוצרי חשמל, תיקונים קטנים ועוד — ספר לנו מה צריך
            </p>
          </div>
          <div style={{ marginRight: 'auto', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4d6b85" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>
      </div>
    </main>
  )
}
