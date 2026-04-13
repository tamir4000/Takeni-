'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'

const STAR_LABELS: Record<number, string> = {
  1: 'גרוע',
  2: 'לא מספק',
  3: 'בסדר',
  4: 'טוב',
  5: 'מצוין!',
}

function RateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')

  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [techName, setTechName] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!jobId) return
    setLoading(true)
    fetch(`/api/jobs/${jobId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.job?.technician?.user?.name) {
          setTechName(data.job.technician.user.name)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [jobId])

  const handleSubmit = async () => {
    if (!rating) {
      setError('אנא בחר דירוג')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, rating, comment: comment.trim() || undefined }),
      })
      if (res.ok) {
        router.push('/')
      } else {
        const data = await res.json()
        setError(data.error || 'שגיאה בשליחת הדירוג')
      }
    } catch {
      setError('שגיאת רשת. נסה שנית.')
    } finally {
      setSubmitting(false)
    }
  }

  const displayStars = hovered || rating

  return (
    <main
      className="flex flex-col min-h-screen"
      style={{ background: '#080f1e', maxWidth: 430, margin: '0 auto' }}
    >
      <Header />

      <div className="flex-1 flex flex-col px-4 pb-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#8ba3be',
            fontSize: 14,
            marginBottom: 24,
            marginTop: 16,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          חזרה
        </button>

        {/* Title */}
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 900, marginBottom: 8, textAlign: 'center' }}>
          איך היה הטכנאי?
        </h1>
        <p style={{ color: '#8ba3be', fontSize: 14, textAlign: 'center', marginBottom: 28, lineHeight: 1.6 }}>
          הדירוג שלך עוזר לטכנאים אחרים ולאיכות השירות
        </p>

        {/* Technician name */}
        {!loading && techName && (
          <div
            style={{
              textAlign: 'center',
              marginBottom: 28,
              padding: '12px 20px',
              background: 'rgba(0,212,184,0.07)',
              border: '1px solid rgba(0,212,184,0.2)',
              borderRadius: 14,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00d4b8 0%, #0088cc 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 900,
                color: '#080f1e',
                margin: '0 auto 10px',
              }}
            >
              {techName.charAt(0)}
            </div>
            <p style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: 0 }}>{techName}</p>
          </div>
        )}

        {/* Stars */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '2.5rem',
                color: star <= displayStars ? '#00d4b8' : '#2a3f5a',
                transition: 'transform 0.15s, color 0.15s',
                transform: star === rating ? 'scale(1.2)' : 'scale(1)',
                padding: '0 2px',
                lineHeight: 1,
              }}
            >
              ★
            </button>
          ))}
        </div>

        {/* Star label */}
        <div style={{ textAlign: 'center', marginBottom: 28, minHeight: 22 }}>
          {displayStars > 0 && (
            <span style={{ color: '#00d4b8', fontSize: 16, fontWeight: 700 }}>
              {STAR_LABELS[displayStars]}
            </span>
          )}
        </div>

        {/* Comment */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', color: '#8ba3be', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            ספר לנו על החוויה שלך (אופציונלי)
          </label>
          <div style={{ position: 'relative' }}>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value.slice(0, 300))}
              placeholder="שתף את החוויה שלך..."
              rows={4}
              style={{
                width: '100%',
                background: 'rgba(13,26,46,0.9)',
                border: '1.5px solid rgba(0,212,184,0.2)',
                borderRadius: 14,
                padding: '14px 16px',
                paddingBottom: 32,
                color: '#fff',
                fontSize: 14,
                lineHeight: 1.6,
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#00d4b8')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,212,184,0.2)')}
            />
            <span style={{
              position: 'absolute',
              bottom: 10,
              left: 14,
              fontSize: 11,
              color: comment.length > 240 ? '#ffa000' : '#4d6b85',
            }}>
              {comment.length}/300
            </span>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 12,
            background: 'rgba(255,59,48,0.1)',
            border: '1px solid rgba(255,59,48,0.3)',
            color: '#ff6b6b',
            fontSize: 13,
            textAlign: 'center',
            marginBottom: 12,
          }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: 14,
            fontWeight: 700,
            fontSize: 16,
            color: '#080f1e',
            background: submitting
              ? 'rgba(0,212,184,0.4)'
              : 'linear-gradient(135deg, #00d4b8 0%, #0088cc 100%)',
            boxShadow: submitting ? 'none' : '0 6px 24px rgba(0,212,184,0.35)',
            border: 'none',
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            marginBottom: 12,
          }}
        >
          {submitting ? 'שולח...' : 'שלח דירוג'}
        </button>

        {/* Skip */}
        <button
          onClick={() => router.push('/')}
          style={{
            width: '100%',
            padding: '14px 24px',
            borderRadius: 14,
            fontWeight: 600,
            fontSize: 14,
            color: '#8ba3be',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          דלג על הדירוג
        </button>
      </div>
    </main>
  )
}

export default function RatePage() {
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
      <RateContent />
    </Suspense>
  )
}
