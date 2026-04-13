'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const SERVICE_LABELS: Record<string, string> = {
  electricity: 'חשמל',
  plumbing: 'אינסטלציה',
  locksmith: 'מנעול',
  ac: 'מזגן',
  other: 'אחר',
}

const SERVICE_PRICES: Record<string, string> = {
  electricity: '₪200–450',
  plumbing: '₪180–380',
  locksmith: '₪150–350',
  ac: '₪250–500',
  other: '₪150–400',
}

const SERVICE_COLORS: Record<string, string> = {
  electricity: '#ffd700',
  plumbing: '#00bcd4',
  locksmith: '#9c27b0',
  ac: '#00e5ff',
  other: '#00d4b8',
}

const SERVICE_GRADIENTS: Record<string, string> = {
  electricity: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
  plumbing: 'linear-gradient(135deg, #00bcd4 0%, #0099ff 100%)',
  locksmith: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
  ac: 'linear-gradient(135deg, #00e5ff 0%, #00bcd4 100%)',
  other: 'linear-gradient(135deg, #00d4b8 0%, #00acc1 100%)',
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  electricity: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2Z" fill="white" />
    </svg>
  ),
  plumbing: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8 2 6 6 6 9C6 13 9 15 9 18H15C15 15 18 13 18 9C18 6 16 2 12 2Z" fill="white" />
      <path d="M9 18H15V20C15 21.1 14.1 22 13 22H11C9.9 22 9 21.1 9 20V18Z" fill="rgba(255,255,255,0.7)" />
    </svg>
  ),
  locksmith: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="7" cy="12" r="5" stroke="white" strokeWidth="2.5" fill="none" />
      <circle cx="7" cy="12" r="2" fill="white" />
      <rect x="11" y="11" width="10" height="2.5" rx="1.25" fill="white" />
    </svg>
  ),
  ac: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L12 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 8L8 4M12 8L16 4" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12L20 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  other: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.5 8.5L20 7L15.5 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L8.5 12L4 7L10.5 8.5L12 2Z" fill="white" />
    </svg>
  ),
}

interface Technician {
  id: string
  user: {
    id: string
    name: string
  }
  specialty: string[]
  rating: number
  completedJobs: number
  isAvailable: boolean
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#ffd700' : 'rgba(255,215,0,0.2)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div style={{
      background: 'rgba(13,26,46,0.85)',
      border: '1px solid rgba(0,212,184,0.1)',
      borderRadius: 16,
      padding: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 12,
    }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: 'linear-gradient(90deg, #0d1a2e 25%, #1a2f4a 50%, #0d1a2e 75%)',
        backgroundSize: '200%',
        animation: 'shimmer 1.5s infinite',
        flexShrink: 0,
      }} />
      <div style={{ flex: 1 }}>
        <div style={{
          height: 14,
          width: '60%',
          borderRadius: 7,
          marginBottom: 8,
          background: 'linear-gradient(90deg, #0d1a2e 25%, #1a2f4a 50%, #0d1a2e 75%)',
          backgroundSize: '200%',
          animation: 'shimmer 1.5s infinite',
        }} />
        <div style={{
          height: 10,
          width: '40%',
          borderRadius: 5,
          background: 'linear-gradient(90deg, #0d1a2e 25%, #1a2f4a 50%, #0d1a2e 75%)',
          backgroundSize: '200%',
          animation: 'shimmer 1.5s infinite',
        }} />
      </div>
      <div style={{ textAlign: 'left' }}>
        <div style={{
          height: 16,
          width: 60,
          borderRadius: 8,
          marginBottom: 6,
          background: 'linear-gradient(90deg, #0d1a2e 25%, #1a2f4a 50%, #0d1a2e 75%)',
          backgroundSize: '200%',
          animation: 'shimmer 1.5s infinite',
        }} />
        <div style={{
          height: 10,
          width: 40,
          borderRadius: 5,
          background: 'linear-gradient(90deg, #0d1a2e 25%, #1a2f4a 50%, #0d1a2e 75%)',
          backgroundSize: '200%',
          animation: 'shimmer 1.5s infinite',
        }} />
      </div>
    </div>
  )
}

function TechniciansContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const service = searchParams.get('service') || 'other'

  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [noTechs, setNoTechs] = useState(false)

  const serviceName = SERVICE_LABELS[service] || 'שירות'
  const serviceColor = SERVICE_COLORS[service] || '#00d4b8'
  const serviceGradient = SERVICE_GRADIENTS[service] || SERVICE_GRADIENTS.other
  const serviceIcon = SERVICE_ICONS[service] || SERVICE_ICONS.other
  const servicePrice = SERVICE_PRICES[service] || '₪150–400'

  useEffect(() => {
    fetch(`/api/technicians?available=true&specialty=${service}`)
      .then(r => r.ok ? r.json() : { technicians: [] })
      .then(data => {
        const techs: Technician[] = data.technicians || []
        setTechnicians(techs)
        setLoading(false)
        if (techs.length === 0) {
          setNoTechs(true)
          setTimeout(() => {
            router.push(`/customer/problem?service=${service}`)
          }, 3000)
        }
      })
      .catch(() => {
        setLoading(false)
        setNoTechs(true)
        setTimeout(() => {
          router.push(`/customer/problem?service=${service}`)
        }, 3000)
      })
  }, [service, router])

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>

      <main style={{ background: '#080f1e', minHeight: '100vh', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{
          padding: '16px 16px 12px',
          borderBottom: '1px solid rgba(0,212,184,0.08)',
          background: 'rgba(8,15,30,0.95)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          {/* Back + Title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <button
              onClick={() => router.back()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(13,26,46,0.8)',
                border: '1px solid rgba(0,212,184,0.15)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8ba3be" strokeWidth="2.5">
                <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 800, margin: 0, flex: 1 }}>
              טכנאים זמינים
            </h1>
          </div>

          {/* Service badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '6px 14px',
              borderRadius: 20,
              background: `${serviceColor}18`,
              border: `1px solid ${serviceColor}40`,
            }}>
              {serviceIcon}
              <span style={{ color: serviceColor, fontSize: 13, fontWeight: 700 }}>{serviceName}</span>
            </div>
            {!loading && !noTechs && (
              <span style={{ color: '#8ba3be', fontSize: 12 }}>
                {technicians.length} טכנאים זמינים באזורך
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '16px 16px 100px' }}>

          {loading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {!loading && noTechs && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 60,
              gap: 16,
            }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(0,212,184,0.1)',
                border: '1px solid rgba(0,212,184,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d4b8" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                </svg>
              </div>
              <p style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: 0, textAlign: 'center' }}>
                אין טכנאים זמינים כרגע, ננסה למצוא עבורך...
              </p>
              <p style={{ color: '#4d6b85', fontSize: 13, margin: 0, textAlign: 'center' }}>
                מעביר אותך אוטומטית בעוד כמה שניות
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 12,
                background: 'rgba(0,212,184,0.08)',
                border: '1px solid rgba(0,212,184,0.2)',
              }}>
                <div style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  border: '2px solid rgba(0,212,184,0.3)',
                  borderTopColor: '#00d4b8',
                  animation: 'spin-ring 1s linear infinite',
                }} />
                <span style={{ color: '#00d4b8', fontSize: 13 }}>מחפש...</span>
              </div>
            </div>
          )}

          {!loading && !noTechs && technicians.map(tech => (
            <button
              key={tech.id}
              onClick={() => router.push(`/customer/problem?service=${service}&technicianId=${tech.id}`)}
              style={{
                width: '100%',
                background: 'rgba(13,26,46,0.85)',
                border: '1px solid rgba(0,212,184,0.1)',
                borderRadius: 16,
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                cursor: 'pointer',
                marginBottom: 12,
                textAlign: 'right',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,212,184,0.3)'
                ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(13,26,46,1)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,212,184,0.1)'
                ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(13,26,46,0.85)'
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: serviceGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 800,
                fontSize: 18,
                color: '#fff',
                boxShadow: `0 4px 16px ${serviceColor}40`,
              }}>
                {getInitials(tech.user.name)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: '0 0 4px' }}>
                  {tech.user.name}
                </p>
                {/* Specialty tags */}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
                  {tech.specialty.slice(0, 2).map(s => (
                    <span key={s} style={{
                      fontSize: 10,
                      color: serviceColor,
                      background: `${serviceColor}18`,
                      border: `1px solid ${serviceColor}35`,
                      borderRadius: 10,
                      padding: '2px 7px',
                      fontWeight: 600,
                    }}>
                      {SERVICE_LABELS[s] || s}
                    </span>
                  ))}
                </div>
                {/* Stars + jobs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <StarRating rating={tech.rating} />
                  <span style={{ color: '#8ba3be', fontSize: 11 }}>
                    {tech.rating.toFixed(1)} ({tech.completedJobs} עבודות)
                  </span>
                </div>
                <p style={{ color: '#00c853', fontSize: 11, margin: 0, fontWeight: 600 }}>
                  ✓ מאושר ומבוטח
                </p>
              </div>

              {/* Right side */}
              <div style={{ flexShrink: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                {/* Price */}
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>
                  {servicePrice}
                </span>
                {/* ETA */}
                <span style={{ color: '#8ba3be', fontSize: 11 }}>~15 דק׳</span>
                {/* Availability dot */}
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#00c853',
                  boxShadow: '0 0 8px #00c853',
                  animation: 'pulse-dot 2s infinite',
                  marginTop: 2,
                }} />
              </div>
            </button>
          ))}
        </div>

        {/* Bottom sticky CTA */}
        {!loading && !noTechs && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 430,
            padding: '12px 16px 24px',
            background: 'linear-gradient(to top, #080f1e 60%, transparent)',
          }}>
            <button
              onClick={() => router.push(`/customer/problem?service=${service}`)}
              style={{
                width: '100%',
                padding: '15px 24px',
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 15,
                color: '#00d4b8',
                background: 'rgba(0,212,184,0.08)',
                border: '1.5px solid rgba(0,212,184,0.3)',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
              }}
            >
              המשך ללא בחירה
            </button>
            <p style={{ textAlign: 'center', color: '#4d6b85', fontSize: 11, margin: '6px 0 0' }}>
              נבחר אוטומטית הטכנאי הקרוב ביותר
            </p>
          </div>
        )}
      </main>
    </>
  )
}

export default function TechniciansPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080f1e' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '3px solid rgba(0,212,184,0.2)',
          borderTopColor: '#00d4b8',
          animation: 'spin-ring 1s linear infinite',
        }} />
      </div>
    }>
      <TechniciansContent />
    </Suspense>
  )
}
