'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Header from '@/components/Header'

interface Job {
  id: string
  serviceType: string
  description: string
  urgency: string
  status: string
  customerAddress: string
  estimatedPrice: string
  estimatedTime: string
  customer: { name: string; phone: string }
}

const SERVICE_LABELS: Record<string, string> = {
  electricity: 'חשמל',
  plumbing: 'אינסטלציה',
  locksmith: 'מנעול',
  ac: 'מזגן',
  other: 'אחר',
}

export default function TechnicianJobPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const fetchJob = useCallback(async () => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`)
      if (!res.ok) {
        router.push('/technician')
        return
      }
      const data = await res.json()
      setJob(data.job)
    } catch {
      router.push('/technician')
    } finally {
      setLoading(false)
    }
  }, [jobId, router])

  useEffect(() => {
    fetchJob()
  }, [fetchJob])

  const updateStatus = async (status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        const data = await res.json()
        setJob(data.job)
        if (status === 'completed') {
          setTimeout(() => router.push('/technician'), 1500)
        }
      }
    } catch {
      // ignore
    } finally {
      setUpdating(false)
    }
  }

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

  if (!job) return null

  return (
    <main className="flex flex-col min-h-screen bg-bg-dark" style={{ maxWidth: 430, margin: '0 auto' }}>
      <Header />

      <div className="flex-1 px-4 pb-8">
        {/* Back */}
        <button
          onClick={() => router.push('/technician')}
          className="flex items-center gap-2 text-text-muted text-sm mb-5 hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          חזור לדאשבורד
        </button>

        {/* Job details card */}
        <div
          className="p-4 rounded-2xl mb-4"
          style={{
            background: 'linear-gradient(145deg, #0d1f3c 0%, #0a1a32 100%)',
            border: '1px solid rgba(0,212,184,0.2)',
          }}
        >
          <h2 className="text-white font-black text-xl mb-1">
            {SERVICE_LABELS[job.serviceType] || job.serviceType}
          </h2>
          <p className="text-text-muted text-sm mb-4">{job.customerAddress}</p>

          <div className="flex gap-3 mb-4">
            <div
              className="flex-1 p-3 rounded-xl text-center"
              style={{ background: 'rgba(0,212,184,0.08)', border: '1px solid rgba(0,212,184,0.15)' }}
            >
              <p className="text-accent font-black text-lg">{job.estimatedPrice}</p>
              <p className="text-text-muted text-xs">מחיר</p>
            </div>
            <div
              className="flex-1 p-3 rounded-xl text-center"
              style={{ background: 'rgba(0,212,184,0.08)', border: '1px solid rgba(0,212,184,0.15)' }}
            >
              <p className="text-accent font-black text-lg">{job.estimatedTime}</p>
              <p className="text-text-muted text-xs">זמן הגעה</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-text-muted text-xs mb-1">תיאור הבעיה</p>
            <p className="text-white text-sm leading-relaxed">{job.description}</p>
          </div>
        </div>

        {/* Customer card */}
        <div
          className="p-4 rounded-2xl mb-6"
          style={{
            background: 'linear-gradient(145deg, #0d1f3c 0%, #0a1a32 100%)',
            border: '1px solid rgba(0,212,184,0.2)',
          }}
        >
          <p className="text-text-muted text-xs mb-3">פרטי לקוח</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-accent"
                style={{ background: 'rgba(0,212,184,0.15)' }}
              >
                {job.customer.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-semibold">{job.customer.name}</p>
                <p className="text-text-muted text-xs">{job.customerAddress}</p>
              </div>
            </div>
            <a
              href={`tel:${job.customer.phone}`}
              className="p-2.5 rounded-xl transition-colors"
              style={{ background: 'rgba(0,212,184,0.1)', border: '1px solid rgba(0,212,184,0.3)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4b8" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.99-2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Action buttons based on status */}
        {job.status === 'onway' && (
          <button
            onClick={() => updateStatus('arrived')}
            disabled={updating}
            className="w-full py-4 rounded-2xl font-bold text-lg text-bg-dark mb-3 disabled:opacity-60 transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #00d4b8 0%, #009e8a 100%)' }}
          >
            הגעתי ללקוח
          </button>
        )}

        {job.status === 'arrived' && (
          <button
            onClick={() => updateStatus('completed')}
            disabled={updating}
            className="w-full py-4 rounded-2xl font-bold text-lg text-bg-dark mb-3 disabled:opacity-60 transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #00d4b8 0%, #009e8a 100%)' }}
          >
            סמן כהושלם ✓
          </button>
        )}

        {job.status === 'completed' && (
          <div
            className="w-full py-4 rounded-2xl text-center font-bold text-lg"
            style={{ background: 'rgba(0,212,184,0.1)', color: '#00d4b8', border: '1px solid rgba(0,212,184,0.3)' }}
          >
            ✓ העבודה הושלמה
          </div>
        )}
      </div>
    </main>
  )
}
