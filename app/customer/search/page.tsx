'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')

  const [dots, setDots] = useState('.')
  const [elapsed, setElapsed] = useState(0)

  const checkStatus = useCallback(async () => {
    if (!jobId) return
    try {
      const res = await fetch(`/api/jobs/${jobId}`)
      if (!res.ok) return
      const data = await res.json()
      if (data.job?.status === 'matched' || data.job?.status === 'onway') {
        router.push(`/customer/tracking?jobId=${jobId}`)
      }
    } catch {
      // ignore
    }
  }, [jobId, router])

  useEffect(() => {
    if (!jobId) {
      router.push('/customer')
      return
    }

    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots(d => (d.length >= 3 ? '.' : d + '.'))
    }, 500)

    // Elapsed time counter
    const elapsedInterval = setInterval(() => {
      setElapsed(e => e + 1)
    }, 1000)

    // Poll for status
    const pollInterval = setInterval(checkStatus, 3000)
    checkStatus() // immediate check

    return () => {
      clearInterval(dotsInterval)
      clearInterval(elapsedInterval)
      clearInterval(pollInterval)
    }
  }, [jobId, router, checkStatus])

  const handleCancel = async () => {
    if (!jobId) return
    await fetch(`/api/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
    router.push('/customer')
  }

  return (
    <main className="flex flex-col min-h-screen bg-bg-dark" style={{ maxWidth: 430, margin: '0 auto' }}>
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        {/* Spinner */}
        <div className="relative mb-10">
          {/* Outer ping ring */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              width: 120,
              height: 120,
              border: '2px solid rgba(0,212,184,0.3)',
              animationDuration: '2s',
            }}
          />
          {/* Spinning arc */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="animate-spin"
            style={{ animationDuration: '1.5s' }}
          >
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="rgba(0,212,184,0.15)"
              strokeWidth="4"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#00d4b8"
              strokeWidth="4"
              strokeDasharray="80 234"
              strokeLinecap="round"
            />
          </svg>
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00d4b8" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-black text-white mb-3 text-center">
          מחפש טכנאי זמין{dots}
        </h1>

        <p className="text-text-muted text-sm text-center mb-6">
          סורקים את כל הטכנאים באזור שלך
        </p>

        {/* Location chip */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-10"
          style={{ background: 'rgba(0,212,184,0.1)', border: '1px solid rgba(0,212,184,0.25)', color: '#00d4b8' }}
        >
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          מחפש באזור דיזנגוף, תל אביב
        </div>

        {/* Timer */}
        {elapsed > 0 && (
          <p className="text-text-muted text-xs mb-8">
            מחפש כבר {elapsed} שניות...
          </p>
        )}

        {/* Cancel */}
        <button
          onClick={handleCancel}
          className="text-text-muted text-sm underline hover:text-white transition-colors"
        >
          בטל חיפוש
        </button>
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#00d4b8', borderTopColor: 'transparent' }} />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
