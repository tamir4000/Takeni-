'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

const SERVICES = [
  {
    id: 'electricity',
    name: 'חשמל',
    description: 'קצר, לוח חשמל, שקעים, תאורה, תנור ועוד',
    color: '#f59e0b',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2Z" fill="#f59e0b" />
      </svg>
    ),
  },
  {
    id: 'plumbing',
    name: 'אינסטלציה',
    description: 'נזילות, סתימות, תיקון ברזים, מחממי מים ועוד',
    color: '#3b82f6',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8 2 6 6 6 9C6 13 9 15 9 18H15C15 15 18 13 18 9C18 6 16 2 12 2Z" fill="#3b82f6" />
        <path d="M9 18H15V20C15 21.1 14.1 22 13 22H11C9.9 22 9 21.1 9 20V18Z" fill="#2563eb" />
        <circle cx="12" cy="8" r="2" fill="white" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'locksmith',
    name: 'מנעול',
    description: 'דלת נתקעת, החלפת צילינדר, פתיחת דלת',
    color: '#eab308',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="7" cy="12" r="5" stroke="#eab308" strokeWidth="2.5" fill="none" />
        <circle cx="7" cy="12" r="2" fill="#eab308" />
        <rect x="11" y="11" width="10" height="2.5" rx="1.25" fill="#eab308" />
        <rect x="18" y="13.5" width="3" height="2.5" rx="1.25" fill="#eab308" />
        <rect x="15" y="13.5" width="2.5" height="2" rx="1" fill="#eab308" />
      </svg>
    ),
  },
  {
    id: 'ac',
    name: 'מזגן',
    description: 'לא מקרר, נזילת מים, התקנה',
    color: '#06b6d4',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L12 22" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 8L8 4M12 8L16 4" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 16L8 20M12 16L16 20" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
        <path d="M4 12L20 12" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 9L2 12M6 15L2 12" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 9L22 12M18 15L22 12" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

interface User {
  name: string
  role: string
}

export default function CustomerPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

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

  return (
    <main className="flex flex-col min-h-screen bg-bg-dark" style={{ maxWidth: 430, margin: '0 auto' }}>
      <Header />

      <div className="flex-1 px-4 pb-8">
        {/* Greeting */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-text-muted text-sm">שלום, {firstName} 👋</p>
          </div>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' })
              router.push('/')
            }}
            className="text-text-muted text-xs flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>← התנתק</span>
          </button>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black text-white mb-4">
          איזה טכנאי צריך היום?
        </h1>

        {/* Badges row */}
        <div className="flex items-center gap-2 mb-5">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(0,212,184,0.15)', color: '#00d4b8', border: '1px solid rgba(0,212,184,0.3)' }}
          >
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            עד 20 דק&apos;
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-text-muted"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
            דיזנגוף 99, תל אביב
          </div>
        </div>

        {/* Service grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {SERVICES.map(service => (
            <button
              key={service.id}
              onClick={() => router.push(`/customer/problem?service=${service.id}`)}
              className="flex flex-col items-end p-4 rounded-2xl text-right transition-all duration-200 active:scale-95 hover:brightness-110"
              style={{
                background: 'linear-gradient(145deg, #0d1f3c 0%, #0a1a32 100%)',
                border: '1px solid rgba(0,212,184,0.15)',
              }}
            >
              <div className="mb-3 self-start">{service.icon}</div>
              <h3 className="text-white font-bold text-base mb-1">{service.name}</h3>
              <p className="text-text-muted text-xs leading-relaxed">{service.description}</p>
            </button>
          ))}
        </div>

        {/* Other service - full width */}
        <button
          onClick={() => router.push('/customer/problem?service=other')}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-right transition-all duration-200 active:scale-95"
          style={{
            background: 'linear-gradient(145deg, #0d1f3c 0%, #0a1a32 100%)',
            border: '1px solid rgba(0,212,184,0.15)',
          }}
        >
          <div className="flex-shrink-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.5 8.5L20 7L15.5 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L8.5 12L4 7L10.5 8.5L12 2Z" fill="#a855f7" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-bold text-base">אחר</h3>
            <p className="text-text-muted text-xs">
              ראוטינג, מוצרי חשמל, תיקונים קטנים ועוד — ספר לנו מה צריך
            </p>
          </div>
        </button>
      </div>
    </main>
  )
}
