'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

interface User {
  name: string
  id: string
  role: string
  technician?: {
    id: string
    isAvailable: boolean
    rating: number
    totalJobs: number
    specialty: string[]
  }
}

interface Job {
  id: string
  serviceType: string
  description: string
  urgency: string
  status: string
  customerAddress: string
  estimatedPrice: string
  estimatedTime: string
  createdAt: string
  customer: { name: string; phone: string }
}

interface TechnicianStatus {
  isAvailable: boolean
  rating: number
  totalJobs: number
  specialty: string[]
}

const SERVICE_LABELS: Record<string, string> = {
  electricity: 'חשמל',
  plumbing: 'אינסטלציה',
  locksmith: 'מנעול',
  ac: 'מזגן',
  other: 'אחר',
}

const URGENCY_LABELS: Record<string, { label: string; color: string }> = {
  urgent: { label: 'דחוף', color: '#ef4444' },
  today: { label: 'היום', color: '#f59e0b' },
  flexible: { label: 'גמיש', color: '#22c55e' },
}

export default function TechnicianPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [techStatus, setTechStatus] = useState<TechnicianStatus | null>(null)
  const [pendingJobs, setPendingJobs] = useState<Job[]>([])
  const [toggling, setToggling] = useState(false)
  const [loading, setLoading] = useState(true)
  const [totalEarnings, setTotalEarnings] = useState(0)

  const fetchAll = useCallback(async () => {
    try {
      const [meRes, jobsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/jobs'),
      ])

      if (!meRes.ok) {
        router.push('/auth?role=technician')
        return
      }
      const meData = await meRes.json()
      if (!meData.user || meData.user.role !== 'technician') {
        router.push('/auth?role=technician')
        return
      }
      setUser(meData.user)

      const tech = meData.user.technician
      if (tech) {
        setTechStatus({
          isAvailable: tech.isAvailable,
          rating: tech.rating,
          totalJobs: tech.totalJobs,
          specialty: tech.specialty || [],
        })
      }

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json()
        const allJobs: Job[] = jobsData.jobs || []
        setPendingJobs(allJobs.filter((j) => j.status === 'searching'))
        const completedJobs = allJobs.filter((j) => j.status === 'completed')
        const earnings = completedJobs.reduce((sum, j) => {
          if (!j.estimatedPrice) return sum
          const match = j.estimatedPrice.replace(/[^\d–-]/g, '').split(/[–-]/)
          if (match.length === 2) {
            const lo = parseInt(match[0]) || 0
            const hi = parseInt(match[1]) || 0
            return sum + Math.round((lo + hi) / 2)
          }
          const single = parseInt(j.estimatedPrice.replace(/\D/g, '')) || 0
          return sum + single
        }, 0)
        setTotalEarnings(earnings)
      }
    } catch {
      router.push('/auth?role=technician')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 3000)
    return () => clearInterval(interval)
  }, [fetchAll])

  const toggleAvailability = async () => {
    if (!techStatus || !user?.technician) return
    setToggling(true)
    try {
      const res = await fetch('/api/technicians', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !techStatus.isAvailable }),
      })
      if (res.ok) {
        const data = await res.json()
        setTechStatus(prev =>
          prev ? { ...prev, isAvailable: data.technician.isAvailable } : null
        )
      }
    } catch {
      // ignore
    } finally {
      setToggling(false)
    }
  }

  const respondToJob = async (jobId: string, accept: boolean) => {
    if (!user?.technician) return
    try {
      if (accept) {
        // Accept: assign technician and update status to matched
        const res = await fetch(`/api/technicians/${user.technician.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'accept', jobId }),
        })
        if (res.ok) {
          router.push(`/technician/job/${jobId}`)
        }
      } else {
        // Decline: just remove from local list
        setPendingJobs(prev => prev.filter(j => j.id !== jobId))
      }
    } catch {
      // ignore
    }
  }

  const firstName = user?.name?.split(' ')[0] || 'טכנאי'

  return (
    <main className="flex flex-col min-h-screen bg-bg-dark" style={{ maxWidth: 430, margin: '0 auto' }}>
      <Header />

      <div className="flex-1 px-4 pb-8">
        {/* Greeting */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-text-muted text-sm">שלום, {firstName}</p>
            {techStatus && (
              <p className="text-text-muted text-xs">
                {techStatus.totalJobs} עבודות • {techStatus.rating.toFixed(1)} ★
              </p>
            )}
          </div>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' })
              router.push('/')
            }}
            className="text-text-muted text-xs hover:text-white transition-colors"
          >
            ← התנתק
          </button>
        </div>

        {/* Availability toggle */}
        <div
          className="p-5 rounded-2xl mb-6"
          style={{
            background: techStatus?.isAvailable
              ? 'linear-gradient(145deg, rgba(0,212,184,0.1) 0%, rgba(0,158,138,0.05) 100%)'
              : 'linear-gradient(145deg, #0d1f3c 0%, #0a1a32 100%)',
            border: techStatus?.isAvailable
              ? '1px solid rgba(0,212,184,0.4)'
              : '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-base mb-0.5">
                {techStatus?.isAvailable ? 'זמין לעבודה' : 'לא זמין'}
              </h3>
              <p className="text-text-muted text-xs">
                {techStatus?.isAvailable
                  ? 'מקבל בקשות חדשות מלקוחות'
                  : 'לא מופיע בחיפושים'}
              </p>
            </div>

            {/* Toggle switch */}
            <button
              onClick={toggleAvailability}
              disabled={toggling || loading}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none ${
                techStatus?.isAvailable ? 'bg-accent' : 'bg-bg-card-alt'
              }`}
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                  techStatus?.isAvailable ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Stats */}
        {techStatus && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'עבודות', value: techStatus.totalJobs },
              { label: 'דירוג', value: `${techStatus.rating.toFixed(1)}★` },
              { label: 'התמחות', value: techStatus.specialty.length },
            ].map(stat => (
              <div
                key={stat.label}
                className="p-3 rounded-xl text-center"
                style={{
                  background: 'rgba(0,212,184,0.05)',
                  border: '1px solid rgba(0,212,184,0.15)',
                }}
              >
                <p className="text-accent font-black text-xl">{stat.value}</p>
                <p className="text-text-muted text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Earnings summary */}
        {techStatus && (
          <div
            className="p-4 rounded-2xl mb-6 flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,184,0.12) 0%, rgba(0,136,204,0.08) 100%)',
              border: '1px solid rgba(0,212,184,0.25)',
            }}
          >
            <div>
              <p className="text-text-muted text-xs mb-1">הרוויחת בסה״כ</p>
              <p className="text-accent font-black text-2xl">₪{totalEarnings.toLocaleString()}</p>
            </div>
            <button
              onClick={() => router.push('/technician/history')}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
              style={{
                background: 'rgba(0,212,184,0.15)',
                border: '1px solid rgba(0,212,184,0.3)',
                color: '#00d4b8',
              }}
            >
              היסטוריה
            </button>
          </div>
        )}

        {/* Pending jobs */}
        {techStatus?.isAvailable && (
          <div>
            <h2 className="text-white font-bold text-base mb-4">
              {pendingJobs.length > 0 ? `בקשות ממתינות (${pendingJobs.length})` : 'ממתין לבקשות...'}
            </h2>

            {pendingJobs.length === 0 ? (
              <div
                className="p-6 rounded-2xl text-center"
                style={{ border: '1px dashed rgba(0,212,184,0.2)', background: 'rgba(0,212,184,0.03)' }}
              >
                <div className="text-3xl mb-2">📡</div>
                <p className="text-text-muted text-sm">מאזין לבקשות חדשות...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingJobs.map(job => {
                  const urgency = URGENCY_LABELS[job.urgency] || { label: job.urgency, color: '#7a9dbf' }
                  return (
                    <div
                      key={job.id}
                      className="p-4 rounded-2xl"
                      style={{
                        background: 'linear-gradient(145deg, #0d1f3c 0%, #0a1a32 100%)',
                        border: '1px solid rgba(0,212,184,0.2)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white font-bold">
                            {SERVICE_LABELS[job.serviceType] || job.serviceType}
                          </h3>
                          <p className="text-text-muted text-xs mt-0.5">{job.customerAddress}</p>
                        </div>
                        <span
                          className="px-2 py-1 rounded-lg text-xs font-bold flex-shrink-0"
                          style={{ background: `${urgency.color}20`, color: urgency.color }}
                        >
                          {urgency.label}
                        </span>
                      </div>

                      <p className="text-text-muted text-sm mb-3 line-clamp-2">{job.description}</p>

                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-accent font-bold text-sm">{job.estimatedPrice}</span>
                        <span className="text-text-muted text-xs">•</span>
                        <span className="text-text-muted text-xs">{job.estimatedTime}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => respondToJob(job.id, true)}
                          className="flex-1 py-2.5 rounded-xl font-bold text-sm text-bg-dark transition-all active:scale-95"
                          style={{ background: 'linear-gradient(135deg, #00d4b8 0%, #009e8a 100%)' }}
                        >
                          קבל עבודה
                        </button>
                        <button
                          onClick={() => respondToJob(job.id, false)}
                          className="px-4 py-2.5 rounded-xl font-medium text-sm text-text-muted transition-all active:scale-95"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          דחה
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
