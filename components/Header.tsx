'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface HeaderProps {
  showTabs?: boolean
}

export default function Header({ showTabs = true }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [showNotif, setShowNotif] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user?.role) setUserRole(data.user.role)
      })
      .catch(() => {})
  }, [])

  const isTechnician = pathname?.startsWith('/technician')

  const handleCustomerClick = () => {
    router.push('/')
  }

  const handleTechnicianClick = () => {
    if (userRole === 'technician') {
      router.push('/technician')
    } else {
      router.push('/technician/landing')
    }
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        height: 56,
        background: 'rgba(8,15,30,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,212,184,0.1)',
        maxWidth: 430,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        {/* Right side: Role toggle pill */}
        {showTabs ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(13,26,46,0.9)',
              borderRadius: 20,
              padding: '3px',
              border: '1px solid rgba(0,212,184,0.18)',
              gap: 2,
            }}
          >
            <button
              onClick={handleCustomerClick}
              style={{
                padding: '5px 14px',
                borderRadius: 16,
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
                background: !isTechnician
                  ? 'linear-gradient(135deg, #00d4b8 0%, #0088cc 100%)'
                  : 'transparent',
                color: !isTechnician ? '#080f1e' : '#8ba3be',
              }}
            >
              לקוח
            </button>
            <button
              onClick={handleTechnicianClick}
              style={{
                padding: '5px 14px',
                borderRadius: 16,
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
                background: isTechnician
                  ? 'linear-gradient(135deg, #00d4b8 0%, #0088cc 100%)'
                  : 'transparent',
                color: isTechnician ? '#080f1e' : '#8ba3be',
              }}
            >
              טכנאי
            </button>
          </div>
        ) : (
          <div style={{ width: 80 }} />
        )}

        {/* Center: Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span
            style={{
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: '0.12em',
              background: 'linear-gradient(135deg, #00d4b8 0%, #0099ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
            }}
          >
            TAKENI
          </span>
          <span style={{ fontSize: 9, color: '#4d6b85', marginTop: 1, letterSpacing: '0.04em' }}>
            טכנאי עכשיו, מכל סוג
          </span>
        </div>

        {/* Left side: Notification bell */}
        <button
          onClick={() => setShowNotif(v => !v)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: showNotif
              ? 'rgba(0,212,184,0.12)'
              : 'rgba(13,26,46,0.9)',
            border: '1px solid rgba(0,212,184,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.2s, border-color 0.2s',
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={showNotif ? '#00d4b8' : '#8ba3be'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {/* Red badge */}
          <span
            style={{
              position: 'absolute',
              top: 6,
              left: 6,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#ff3b30',
              border: '1.5px solid #080f1e',
            }}
          />
        </button>
      </div>

      {/* Notification dropdown */}
      {showNotif && (
        <div
          style={{
            position: 'absolute',
            top: 58,
            left: 12,
            width: 260,
            background: 'rgba(13,26,46,0.98)',
            border: '1px solid rgba(0,212,184,0.2)',
            borderRadius: 14,
            padding: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(20px)',
            zIndex: 100,
          }}
        >
          <p style={{ fontSize: 12, color: '#4d6b85', marginBottom: 8, fontWeight: 600 }}>התראות</p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4b8', marginTop: 4, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13, color: '#fff', fontWeight: 600, marginBottom: 2 }}>טכנאי בדרך אליך</p>
              <p style={{ fontSize: 11, color: '#8ba3be' }}>משה לוי מגיע תוך ~18 דקות</p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
