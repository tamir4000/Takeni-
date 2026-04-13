'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

const SERVICE_LABELS: Record<string, string> = {
  electricity: 'חשמל',
  plumbing: 'אינסטלציה',
  locksmith: 'מנעול',
  ac: 'מזגן',
  other: 'אחר',
}

const SERVICE_ICONS: Record<string, string> = {
  electricity: '⚡',
  plumbing: '🔧',
  locksmith: '🔑',
  ac: '❄️',
  other: '🛠️',
}

interface Job {
  id: string
  serviceType: string
  status: string
  estimatedPrice?: string
  createdAt: string
  review?: { id: string } | null
  technician?: {
    id: string
    user: { name: string }
  } | null
}

export default function CustomerHistoryPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => {
        if (!res.ok) {
          router.push('/auth')
          return null
        }
        return res.json()
      })
      .then(data => {
        if (data?.jobs) {
          const filtered = data.jobs.filter(
            (j: Job) => j.status === 'completed' || j.status === 'cancelled'
          )
          setJobs(filtered)
        }
      })
      .catch(() => router.push('/auth'))
      .finally(() => setLoading(false))
  }, [router])

  return (
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#080f1e', maxWidth: 430, margin: '0 auto' }}>
      <Header />

      <div style={{ flex: 1, padding: '0 20px 40px' }}>
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

        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, marginBottom: 20 }}>ההיסטוריה שלי</h1>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '2px solid #00d4b8', borderTopColor: 'transparent',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
        ) : jobs.length === 0 ? (
          <div style={{
            textAlign: 'center', paddingTop: 60,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontSize: 48 }}>📋</div>
            <p style={{ color: '#8ba3be', fontSize: 15 }}>עדיין לא ביצעת הזמנות</p>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '12px 24px', borderRadius: 14,
                background: 'linear-gradient(135deg, #00d4b8 0%, #009e8a 100%)',
                color: '#080f1e', fontWeight: 700, fontSize: 14,
                border: 'none', cursor: 'pointer', marginTop: 8,
              }}
            >
              הזמן עכשיו
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {jobs.map(job => {
              const isCompleted = job.status === 'completed'
              const hasReview = !!job.review
              const statusColor = isCompleted ? '#22c55e' : '#ef4444'
              const statusLabel = isCompleted ? 'הושלם' : 'בוטל'

              return (
                <div
                  key={job.id}
                  style={{
                    padding: 16, borderRadius: 16,
                    background: 'rgba(13,26,46,0.9)',
                    border: '1px solid rgba(0,212,184,0.15)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{SERVICE_ICONS[job.serviceType] || '🛠️'}</span>
                      <div>
                        <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0 }}>
                          {SERVICE_LABELS[job.serviceType] || job.serviceType}
                        </p>
                        <p style={{ color: '#4d6b85', fontSize: 12, margin: '2px 0 0' }}>
                          {new Date(job.createdAt).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 10px', borderRadius: 20,
                      background: `${statusColor}18`, border: `1px solid ${statusColor}40`,
                      color: statusColor, fontSize: 11, fontWeight: 700, flexShrink: 0,
                    }}>
                      {statusLabel}
                    </span>
                  </div>

                  {job.technician && (
                    <p style={{ color: '#8ba3be', fontSize: 13, marginBottom: 8 }}>
                      טכנאי: {job.technician.user.name}
                    </p>
                  )}

                  {job.estimatedPrice && (
                    <p style={{ color: '#00d4b8', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
                      {job.estimatedPrice.startsWith('₪') ? job.estimatedPrice : `₪${job.estimatedPrice}`}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => router.push(`/customer/problem?service=${job.serviceType}`)}
                      style={{
                        flex: 1, padding: '9px 12px', borderRadius: 10,
                        background: 'rgba(0,212,184,0.08)', border: '1px solid rgba(0,212,184,0.2)',
                        color: '#00d4b8', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      הזמן שוב
                    </button>
                    {isCompleted && !hasReview && (
                      <button
                        onClick={() => router.push(`/customer/rate?jobId=${job.id}`)}
                        style={{
                          flex: 1, padding: '9px 12px', borderRadius: 10,
                          background: 'linear-gradient(135deg, #00d4b8 0%, #009e8a 100%)',
                          color: '#080f1e', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          border: 'none',
                        }}
                      >
                        דרג ★
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
