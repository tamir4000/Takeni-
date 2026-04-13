'use client'
import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem('takeni_splash')
    if (!seen) {
      setVisible(true)
      sessionStorage.setItem('takeni_splash', '1')
      setTimeout(() => setFading(true), 2000)
      setTimeout(() => setVisible(false), 2600)
    }
  }, [])

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes progress { from { width: 0% } to { width: 100% } }
      `}</style>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#080f1e',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.6s ease',
        opacity: fading ? 0 : 1,
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 8 }}>
          <span style={{
            fontSize: '3rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #00d4b8 0%, #0088cc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}>
            TAKENI
          </span>
        </div>

        {/* Subtitle */}
        <p style={{
          color: '#8ba3be',
          fontSize: 15,
          fontWeight: 500,
          marginBottom: 40,
          letterSpacing: '0.02em',
        }}>
          טכנאי עכשיו, מכל סוג
        </p>

        {/* Scooter SVG illustration */}
        <div style={{
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 35%, #00e5cc 0%, #00a896 45%, #006e62 100%)',
          boxShadow: '0 0 80px rgba(0,212,184,0.5), 0 0 150px rgba(0,212,184,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
            {/* Shadow */}
            <ellipse cx="50" cy="76" rx="26" ry="6" fill="rgba(0,60,52,0.5)" />
            {/* Scooter body base */}
            <rect x="20" y="54" width="58" height="18" rx="9" fill="#003d36" />
            <rect x="26" y="47" width="46" height="20" rx="8" fill="#004d44" />
            {/* Scooter accent stripe */}
            <rect x="26" y="53" width="46" height="3" rx="1.5" fill="rgba(0,212,184,0.4)" />
            {/* Handle */}
            <rect x="60" y="38" width="10" height="22" rx="5" fill="#003d36" />
            <rect x="56" y="36" width="18" height="7" rx="3.5" fill="#003d36" />
            {/* Handle grip */}
            <rect x="56" y="36" width="5" height="7" rx="2.5" fill="rgba(0,212,184,0.5)" />
            {/* Wheels */}
            <circle cx="30" cy="72" r="10" fill="#003d36" stroke="#00d4b8" strokeWidth="2.5" />
            <circle cx="30" cy="72" r="5" fill="#001f1c" />
            <circle cx="30" cy="72" r="2" fill="rgba(0,212,184,0.4)" />
            <circle cx="70" cy="72" r="10" fill="#003d36" stroke="#00d4b8" strokeWidth="2.5" />
            <circle cx="70" cy="72" r="5" fill="#001f1c" />
            <circle cx="70" cy="72" r="2" fill="rgba(0,212,184,0.4)" />
            {/* Rider helmet */}
            <circle cx="50" cy="34" r="11" fill="#004d44" />
            <circle cx="50" cy="34" r="11" fill="none" stroke="rgba(0,212,184,0.3)" strokeWidth="1.5" />
            {/* Helmet visor */}
            <path d="M42 36 Q50 42 58 36" fill="rgba(0,212,184,0.25)" />
            {/* Helmet shine */}
            <circle cx="46" cy="30" r="3.5" fill="rgba(255,255,255,0.25)" />
            {/* Body */}
            <rect x="42" y="44" width="16" height="14" rx="4" fill="#004d44" />
            {/* Backpack */}
            <rect x="52" y="43" width="10" height="14" rx="3" fill="#003a34" />
          </svg>
        </div>

        {/* Loading bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(0,212,184,0.2)' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #00d4b8, #0088cc)',
            animation: 'progress 2s ease-in-out forwards',
          }} />
        </div>
      </div>
    </>
  )
}
