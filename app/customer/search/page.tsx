'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')

  const [techCount, setTechCount] = useState(12)
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

    // Increment tech counter for visual effect
    const countInterval = setInterval(() => {
      setTechCount(c => {
        if (c >= 47) return 47
        return c + Math.floor(Math.random() * 4) + 1
      })
    }, 400)

    // Elapsed time counter
    const elapsedInterval = setInterval(() => {
      setElapsed(e => e + 1)
    }, 1000)

    // Poll for status
    const pollInterval = setInterval(checkStatus, 3000)
    checkStatus()

    return () => {
      clearInterval(countInterval)
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
    <main className="flex flex-col min-h-screen" style={{ background: '#080f1e', maxWidth: 430, margin: '0 auto' }}>
      <Header />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px 80px',
      }}>

        {/* Radar animation */}
        <div style={{ position: 'relative', width: 200, height: 200, marginBottom: 36 }}>
          {/* Expanding radar rings */}
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid rgba(0,212,184,0.4)',
                animation: `radar-ring 2.5s ease-out ${i * 0.8}s infinite`,
              }}
            />
          ))}

          {/* Static outer ring */}
          <div style={{
            position: 'absolute',
            inset: 16,
            borderRadius: '50%',
            border: '1px solid rgba(0,212,184,0.1)',
          }} />
          <div style={{
            position: 'absolute',
            inset: 36,
            borderRadius: '50%',
            border: '1px solid rgba(0,212,184,0.08)',
          }} />

          {/* Spinning arc */}
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            style={{ position: 'absolute', inset: 0, animation: 'spin-ring 2s linear infinite' }}
          >
            <circle
              cx="100"
              cy="100"
              r="82"
              fill="none"
              stroke="rgba(0,212,184,0.12)"
              strokeWidth="3"
            />
            <circle
              cx="100"
              cy="100"
              r="82"
              fill="none"
              stroke="#00d4b8"
              strokeWidth="3"
              strokeDasharray="60 452"
              strokeLinecap="round"
            />
          </svg>

          {/* Center circle */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,212,184,0.2) 0%, rgba(0,212,184,0.05) 100%)',
              border: '2px solid rgba(0,212,184,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00d4b8" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Small tech dots around radar */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180
            const x = 100 + 78 * Math.cos(rad)
            const y = 100 + 78 * Math.sin(rad)
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x - 4,
                  top: y - 4,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: i % 2 === 0 ? '#00d4b8' : '#0099ff',
                  opacity: 0.7,
                  animation: `pulse-dot ${1.5 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            )
          })}
        </div>

        {/* Counter */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: 0, marginBottom: 6 }}>
            בודק{' '}
            <span className="gradient-text" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {techCount}
            </span>
            {' '}טכנאים...
          </h1>
          <p style={{ color: '#8ba3be', fontSize: 14, margin: 0 }}>
            סורקים את כל הטכנאים באזור שלך
          </p>
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%',
          maxWidth: 300,
          height: 4,
          borderRadius: 2,
          background: 'rgba(0,212,184,0.1)',
          marginTop: 20,
          marginBottom: 20,
          overflow: 'hidden',
        }}>
          <div
            className="progress-fill"
            style={{
              height: '100%',
              borderRadius: 2,
              background: 'linear-gradient(90deg, #00d4b8 0%, #0099ff 100%)',
              width: 0,
            }}
          />
        </div>

        {/* Location chip */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 20,
            background: 'rgba(0,212,184,0.08)',
            border: '1px solid rgba(0,212,184,0.2)',
            marginBottom: 12,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00d4b8" strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span style={{ color: '#00d4b8', fontSize: 13, fontWeight: 600 }}>
            מחפש באזור שלך
          </span>
          <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4b8', flexShrink: 0 }} />
        </div>

        {/* Timer */}
        {elapsed > 0 && (
          <p style={{ color: '#4d6b85', fontSize: 12, marginBottom: 20 }}>
            מחפש כבר {elapsed} שניות...
          </p>
        )}

        {/* Cancel button */}
        <button
          onClick={handleCancel}
          style={{
            background: 'rgba(13,26,46,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '10px 24px',
            color: '#8ba3be',
            fontSize: 14,
            cursor: 'pointer',
            transition: 'color 0.2s, border-color 0.2s',
            marginTop: 8,
          }}
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#080f1e' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '3px solid rgba(0,212,184,0.2)',
          borderTopColor: '#00d4b8',
          animation: 'spin-ring 1s linear infinite',
        }} />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
