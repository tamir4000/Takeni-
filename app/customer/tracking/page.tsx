'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'

interface JobData {
  id: string
  serviceType: string
  status: string
  estimatedTime: string
  customerAddress: string
  technician?: {
    id: string
    rating: number
    totalJobs: number
    address: string
    user: { name: string; phone: string }
  }
}

const SERVICE_LABELS: Record<string, string> = {
  electricity: 'חשמל',
  plumbing: 'אינסטלציה',
  locksmith: 'מנעול',
  ac: 'מזגן',
  other: 'אחר',
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  matched: { label: 'טכנאי נמצא', color: '#00d4b8' },
  onway: { label: 'בדרך אליך', color: '#22c55e' },
  arrived: { label: 'הגיע', color: '#3b82f6' },
  completed: { label: 'הושלם', color: '#a855f7' },
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke="#f59e0b"
          strokeWidth="2"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="text-text-muted text-xs mr-1">{rating.toFixed(1)}</span>
    </div>
  )
}

function TrackingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')

  const [job, setJob] = useState<JobData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchJob = useCallback(async () => {
    if (!jobId) return
    try {
      const res = await fetch(`/api/jobs/${jobId}`)
      if (!res.ok) return
      const data = await res.json()
      setJob(data.job)
      if (data.job?.status === 'searching') {
        router.push(`/customer/search?jobId=${jobId}`)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [jobId, router])

  useEffect(() => {
    if (!jobId) {
      router.push('/customer')
      return
    }
    fetchJob()
    const interval = setInterval(fetchJob, 5000)
    return () => clearInterval(interval)
  }, [jobId, router, fetchJob])

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-bg-dark" style={{ maxWidth: 430, margin: '0 auto' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      </main>
    )
  }

  if (!job) {
    return (
      <main className="flex flex-col min-h-screen bg-bg-dark" style={{ maxWidth: 430, margin: '0 auto' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 text-center">
          <div>
            <p className="text-white font-bold mb-2">הבקשה לא נמצאה</p>
            <button onClick={() => router.push('/customer')} className="text-accent text-sm">
              חזור
            </button>
          </div>
        </div>
      </main>
    )
  }

  const statusInfo = STATUS_LABELS[job.status] || { label: job.status, color: '#7a9dbf' }
  const tech = job.technician

  return (
    <main className="flex flex-col min-h-screen bg-bg-dark" style={{ maxWidth: 430, margin: '0 auto' }}>
      <Header />

      <div className="flex-1 flex flex-col px-4 pb-8">
        {/* Status badge */}
        <div className="flex items-center gap-2 mb-6">
          <div
            className="px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"
            style={{ background: `${statusInfo.color}20`, color: statusInfo.color, border: `1px solid ${statusInfo.color}40` }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: statusInfo.color }}
            />
            {statusInfo.label}
          </div>
        </div>

        {/* Map placeholder */}
        <div
          className="w-full h-48 rounded-2xl mb-5 flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #0d1f3c 0%, #091525 100%)',
            border: '1px solid rgba(0,212,184,0.2)',
          }}
        >
          {/* Simulated map grid */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute border-r border-[rgba(0,212,184,0.3)]"
                style={{ left: `${i * 20}%`, top: 0, bottom: 0, width: 1 }}
              />
            ))}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute border-b border-[rgba(0,212,184,0.3)]"
                style={{ top: `${i * 25}%`, left: 0, right: 0, height: 1 }}
              />
            ))}
          </div>

          {/* Location markers */}
          <div className="relative flex flex-col items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: '#00d4b8', boxShadow: '0 0 20px rgba(0,212,184,0.5)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </div>
            <p className="text-white text-xs font-medium bg-bg-dark/80 px-3 py-1 rounded-full">
              {job.customerAddress}
            </p>
          </div>
        </div>

        {/* Technician card */}
        {tech && (
          <div
            className="p-4 rounded-2xl mb-4"
            style={{
              background: 'linear-gradient(145deg, #0d1f3c 0%, #0a1a32 100%)',
              border: '1px solid rgba(0,212,184,0.2)',
            }}
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl font-black"
                style={{ background: 'rgba(0,212,184,0.15)', color: '#00d4b8' }}
              >
                {tech.user.name.charAt(0)}
              </div>

              <div className="flex-1">
                <button
                  onClick={() => router.push(`/technician/profile/${tech.id}`)}
                  className="text-white font-bold text-base hover:text-accent transition-colors"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {tech.user.name}
                </button>
                <p className="text-text-muted text-xs mb-1">
                  {SERVICE_LABELS[job.serviceType]} • {tech.totalJobs} עבודות
                </p>
                <StarRating rating={tech.rating} />
              </div>

              {/* ETA */}
              <div className="text-left">
                <p className="text-text-muted text-xs mb-0.5">הגעה</p>
                <p className="text-accent font-black text-lg">{job.estimatedTime || '15 דק\''}</p>
              </div>
            </div>

            {/* Call button */}
            <a
              href={`tel:${tech.user.phone}`}
              className="mt-4 w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all active:scale-95"
              style={{
                background: 'rgba(0,212,184,0.1)',
                border: '1px solid rgba(0,212,184,0.3)',
                color: '#00d4b8',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.99-2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z" />
              </svg>
              התקשר לטכנאי
            </a>
          </div>
        )}

        {/* Completed overlay */}
        {job.status === 'completed' && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(8,15,30,0.97)',
              zIndex: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 24px',
              maxWidth: 430,
              margin: '0 auto',
            }}
          >
            {/* Animated checkmark */}
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00d4b8 0%, #009e8a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                boxShadow: '0 0 40px rgba(0,212,184,0.5)',
                animation: 'pulse 2s infinite',
              }}
            >
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 900, marginBottom: 8, textAlign: 'center' }}>
              העבודה הושלמה! 🎉
            </h2>
            {tech && (
              <p style={{ color: '#8ba3be', fontSize: 15, marginBottom: 32, textAlign: 'center' }}>
                {tech.user.name} סיים את העבודה בהצלחה
              </p>
            )}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tech && (
                <button
                  onClick={() => router.push(`/customer/rate?jobId=${jobId}`)}
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: 16,
                    color: '#080f1e',
                    background: 'linear-gradient(135deg, #00d4b8 0%, #009e8a 100%)',
                    boxShadow: '0 6px 24px rgba(0,212,184,0.35)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  דרג את {tech.user.name}
                </button>
              )}
              <button
                onClick={() => router.push('/')}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: 14,
                  fontWeight: 600,
                  fontSize: 15,
                  color: '#00d4b8',
                  background: 'rgba(0,212,184,0.06)',
                  border: '1.5px solid rgba(0,212,184,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                חזרה לראשי
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#00d4b8', borderTopColor: 'transparent' }} />
      </div>
    }>
      <TrackingContent />
    </Suspense>
  )
}
