'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Header from '@/components/Header'

const SPECIALTY_LABELS: Record<string, string> = {
  electricity: 'חשמל',
  plumbing: 'אינסטלציה',
  locksmith: 'מנעול',
  ac: 'מזגן',
  other: 'אחר',
}

interface Review {
  id: string
  rating: number
  comment?: string
  createdAt: string
  job?: {
    serviceType: string
    createdAt: string
  }
}

interface TechnicianData {
  id: string
  rating: number
  totalJobs: number
  yearsExperience: number
  specialty: string[]
  status: string
  bio?: string
  reviews: Review[]
  user: {
    name: string
  }
}

export default function TechnicianProfilePage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [technician, setTechnician] = useState<TechnicianData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/technicians/${id}`)
      .then(res => {
        if (!res.ok) { setNotFound(true); return null }
        return res.json()
      })
      .then(data => {
        if (data?.technician) setTechnician(data.technician)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: '#080f1e', maxWidth: 430, margin: '0 auto' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            border: '2px solid #00d4b8', borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      </main>
    )
  }

  if (notFound || !technician) {
    return (
      <main style={{ minHeight: '100vh', background: '#080f1e', maxWidth: 430, margin: '0 auto' }}>
        <Header />
        <div style={{ textAlign: 'center', paddingTop: 80, color: '#8ba3be' }}>
          <p>טכנאי לא נמצא</p>
          <button onClick={() => router.back()} style={{ color: '#00d4b8', background: 'none', border: 'none', cursor: 'pointer', marginTop: 12 }}>חזרה</button>
        </div>
      </main>
    )
  }

  const initials = technician.user.name
    .split(' ')
    .slice(0, 2)
    .map((p: string) => p.charAt(0))
    .join('')

  return (
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#080f1e', maxWidth: 430, margin: '0 auto' }}>
      <Header />

      <div style={{ flex: 1, padding: '0 20px 100px' }}>
        {/* Back button */}
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: '#8ba3be', fontSize: 14,
            marginBottom: 20, marginTop: 16,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          חזרה
        </button>

        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00d4b8 0%, #0088cc 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 900, color: '#080f1e',
            boxShadow: '0 0 30px rgba(0,212,184,0.4)',
            marginBottom: 12,
          }}>
            {initials}
          </div>

          {technician.status === 'approved' && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '4px 12px', borderRadius: 20,
              background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)',
              color: '#22c55e', fontSize: 12, fontWeight: 700, marginBottom: 10,
            }}>
              ✓ מאושר
            </span>
          )}

          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: 0, textAlign: 'center' }}>
            {technician.user.name}
          </h1>
        </div>

        {/* Specialty tags */}
        {technician.specialty.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
            {technician.specialty.map((s: string) => (
              <span
                key={s}
                style={{
                  padding: '5px 12px', borderRadius: 20,
                  background: 'rgba(0,212,184,0.1)', border: '1px solid rgba(0,212,184,0.25)',
                  color: '#00d4b8', fontSize: 12, fontWeight: 600,
                }}
              >
                {SPECIALTY_LABELS[s] || s}
              </span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10, marginBottom: 20,
          }}
        >
          {[
            { value: technician.totalJobs, label: 'עבודות' },
            { value: `${technician.rating.toFixed(1)}★`, label: 'דירוג' },
            { value: technician.yearsExperience, label: 'שנות ניסיון' },
          ].map(stat => (
            <div
              key={stat.label}
              style={{
                padding: '12px 8px', borderRadius: 14, textAlign: 'center',
                background: 'rgba(13,26,46,0.9)', border: '1px solid rgba(0,212,184,0.15)',
              }}
            >
              <p style={{ color: '#00d4b8', fontSize: 20, fontWeight: 900, margin: '0 0 4px' }}>{stat.value}</p>
              <p style={{ color: '#8ba3be', fontSize: 11, margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        {technician.bio && (
          <div
            style={{
              padding: 16, borderRadius: 14, marginBottom: 20,
              background: 'rgba(13,26,46,0.9)', border: '1px solid rgba(0,212,184,0.12)',
            }}
          >
            <p style={{ color: '#8ba3be', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>אודות</p>
            <p style={{ color: '#c8d8e8', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{technician.bio}</p>
          </div>
        )}

        {/* Reviews */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>ביקורות אחרונות</h2>

          {technician.reviews.length === 0 ? (
            <div
              style={{
                padding: '24px 16px', textAlign: 'center',
                border: '1px dashed rgba(0,212,184,0.2)', borderRadius: 14,
                background: 'rgba(0,212,184,0.03)',
              }}
            >
              <p style={{ color: '#4d6b85', fontSize: 14 }}>עדיין אין ביקורות</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {technician.reviews.map((review: Review) => (
                <div
                  key={review.id}
                  style={{
                    padding: 14, borderRadius: 14,
                    background: 'rgba(13,26,46,0.9)', border: '1px solid rgba(0,212,184,0.12)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} style={{ color: i <= review.rating ? '#00d4b8' : '#2a3f5a', fontSize: '1.1rem' }}>★</span>
                      ))}
                    </div>
                    <span style={{ color: '#4d6b85', fontSize: 11 }}>
                      {new Date(review.createdAt).toLocaleDateString('he-IL')}
                    </span>
                  </div>
                  {review.comment && (
                    <p style={{ color: '#c8d8e8', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        padding: '12px 20px 24px',
        background: 'linear-gradient(0deg, rgba(8,15,30,1) 60%, transparent)',
      }}>
        <button
          onClick={() => router.push('/')}
          style={{
            width: '100%', padding: '16px 24px',
            borderRadius: 14, fontWeight: 700, fontSize: 16,
            color: '#080f1e',
            background: 'linear-gradient(135deg, #00d4b8 0%, #009e8a 100%)',
            boxShadow: '0 6px 24px rgba(0,212,184,0.35)',
            border: 'none', cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          הזמן עכשיו
        </button>
      </div>
    </main>
  )
}
