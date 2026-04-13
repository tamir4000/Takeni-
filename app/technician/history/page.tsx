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
  estimatedTime?: string
  customerAddress: string
  createdAt: string
}

function calcMidpoint(price: string): number {
  if (!price) return 0
  const cleaned = price.replace(/[^\d–\-]/g, '')
  const parts = cleaned.split(/[–\-]/)
  if (parts.length === 2) {
    const lo = parseInt(parts[0]) || 0
    const hi = parseInt(parts[1]) || 0
    return Math.round((lo + hi) / 2)
  }
  return parseInt(price.replace(/\D/g, '')) || 0
}

export default function TechnicianHistoryPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [totalEarnings, setTotalEarnings] = useState(0)

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => {
        if (!res.ok) {
          router.push('/auth?role=technician')
          return null
        }
        return res.json()
      })
      .then(data => {
        if (data?.jobs) {
          const completed = data.jobs.filter((j: Job) => j.status === 'completed')
          setJobs(completed)
          const total = completed.reduce((sum: number, j: Job) => sum + calcMidpoint(j.estimatedPrice || ''), 0)
          setTotalEarnings(total)
        }
      })
      .catch(() => router.push('/auth?role=technician'))
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

        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, marginBottom: 20 }}>היסטוריה ורווחים</h1>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '2px solid #00d4b8', borderTopColor: 'transparent',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
        ) : (
          <>
            {/* Earnings summary card */}
            <div
              style={{
                padding: 20, borderRadius: 16, marginBottom: 24,
                background: 'linear-gradient(135deg, rgba(0,212,184,0.12) 0%, rgba(0,136,204,0.08) 100%)',
                border: '1px solid rgba(0,212,184,0.25)',
              }}
            >
              <p style={{ color: '#8ba3be', fontSize: 12, marginBottom: 6 }}>סה״כ הרוויחת</p>
              <p style={{ color: '#00d4b8', fontSize: 34, fontWeight: 900, margin: '0 0 8px' }}>
                ₪{totalEarnings.toLocaleString()}
              </p>
              <p style={{ color: '#4d6b85', fontSize: 12, margin: 0 }}>
                מ-{jobs.length} עבודות שהושלמו
              </p>
            </div>

            {jobs.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: 40 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
                <p style={{ color: '#8ba3be', fontSize: 15 }}>עדיין אין עבודות שהושלמו</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {jobs.map(job => (
                  <div
                    key={job.id}
                    style={{
                      padding: 14, borderRadius: 14,
                      background: 'rgba(13,26,46,0.9)',
                      border: '1px solid rgba(0,212,184,0.12)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 22 }}>{SERVICE_ICONS[job.serviceType] || '🛠️'}</span>
                        <div>
                          <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0 }}>
                            {SERVICE_LABELS[job.serviceType] || job.serviceType}
                          </p>
                          <p style={{
                            color: '#4d6b85', fontSize: 12, margin: '2px 0 0',
                            maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {job.customerAddress}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        {job.estimatedPrice && (
                          <p style={{ color: '#00d4b8', fontWeight: 700, fontSize: 14, margin: '0 0 3px' }}>
                            {job.estimatedPrice.startsWith('₪') ? job.estimatedPrice : `₪${job.estimatedPrice}`}
                          </p>
                        )}
                        {job.estimatedTime && (
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 8px', borderRadius: 10,
                            background: 'rgba(0,212,184,0.1)', border: '1px solid rgba(0,212,184,0.2)',
                            color: '#00d4b8', fontSize: 11, fontWeight: 600,
                          }}>
                            {job.estimatedTime}
                          </span>
                        )}
                      </div>
                    </div>
                    <p style={{ color: '#4d6b85', fontSize: 11, margin: '8px 0 0' }}>
                      {new Date(job.createdAt).toLocaleDateString('he-IL')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
