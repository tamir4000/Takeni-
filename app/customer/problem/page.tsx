'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'

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

const SERVICE_TIMES: Record<string, string> = {
  electricity: '15–25 דק\'',
  plumbing: '15–30 דק\'',
  locksmith: '10–20 דק\'',
  ac: '20–35 דק\'',
  other: '15–25 דק\'',
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2Z" fill="white" />
    </svg>
  ),
  plumbing: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8 2 6 6 6 9C6 13 9 15 9 18H15C15 15 18 13 18 9C18 6 16 2 12 2Z" fill="white" />
      <path d="M9 18H15V20C15 21.1 14.1 22 13 22H11C9.9 22 9 21.1 9 20V18Z" fill="rgba(255,255,255,0.7)" />
    </svg>
  ),
  locksmith: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="7" cy="12" r="5" stroke="white" strokeWidth="2.5" fill="none" />
      <circle cx="7" cy="12" r="2" fill="white" />
      <rect x="11" y="11" width="10" height="2.5" rx="1.25" fill="white" />
    </svg>
  ),
  ac: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L12 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 8L8 4M12 8L16 4" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12L20 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  other: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.5 8.5L20 7L15.5 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L8.5 12L4 7L10.5 8.5L12 2Z" fill="white" />
    </svg>
  ),
}

const URGENCY_OPTIONS = [
  { value: 'urgent', label: '🔴 דחוף — עכשיו' },
  { value: 'today', label: '🟡 היום' },
  { value: 'flexible', label: '🟢 גמיש' },
]

const PLACEHOLDERS: Record<string, string> = {
  electricity: 'לדוגמה: יש קצר בלוח החשמל, הנורות מהבהבות...',
  plumbing: 'לדוגמה: יש נזילה מתחת לכיור, הברז לא נסגר...',
  locksmith: 'לדוגמה: הדלת נתקעת, צריך להחליף מנעול...',
  ac: 'לדוגמה: המזגן לא מקרר, יש טפטוף מים...',
  other: 'תאר את הבעיה שלך...',
}

function ProblemForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const service = searchParams.get('service') || 'other'

  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState('urgent')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState<File[]>([])

  const serviceName = SERVICE_LABELS[service] || 'שירות'
  const priceRange = SERVICE_PRICES[service] || '₪150–400'
  const timeRange = SERVICE_TIMES[service] || '15–25 דק\''
  const serviceGradient = SERVICE_GRADIENTS[service] || SERVICE_GRADIENTS.other
  const serviceIcon = SERVICE_ICONS[service] || SERVICE_ICONS.other

  const charCount = description.length
  const maxChars = 300

  const handleSearch = async () => {
    if (!description.trim()) {
      setError('נא לתאר את הבעיה')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: service,
          description: description.trim(),
          urgency,
          customerAddress: 'דיזנגוף 99, תל אביב',
          customerLat: 32.0823,
          customerLng: 34.7741,
          estimatedPrice: priceRange,
          estimatedTime: timeRange,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth')
          return
        }
        setError(data.error || 'שגיאה ביצירת הבקשה')
        return
      }

      router.push(`/customer/search?jobId=${data.job.id}`)
    } catch {
      setError('שגיאת רשת. נסה שנית.')
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setPhotos(prev => [...prev, ...files].slice(0, 3))
  }

  return (
    <main className="flex flex-col min-h-screen" style={{ background: '#080f1e', maxWidth: 430, margin: '0 auto' }}>
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
            marginBottom: 16,
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

        {/* Service badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: serviceGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {serviceIcon}
          </div>
          <div>
            <p style={{ color: '#4d6b85', fontSize: 11, margin: 0 }}>שירות נבחר</p>
            <p style={{ color: '#fff', fontSize: 16, fontWeight: 800, margin: 0 }}>{serviceName}</p>
          </div>
        </div>

        {/* Problem description */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', color: '#8ba3be', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            מה הבעיה?
          </label>
          <div style={{ position: 'relative' }}>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, maxChars))}
              placeholder={PLACEHOLDERS[service]}
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
              color: charCount > maxChars * 0.8 ? '#ffa000' : '#4d6b85',
            }}>
              {charCount}/{maxChars}
            </span>
          </div>
        </div>

        {/* Urgency pills */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', color: '#8ba3be', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
            רמת דחיפות
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {URGENCY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setUrgency(opt.value)}
                className={`urgency-pill${urgency === opt.value ? ' active' : ''}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photo upload */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', color: '#8ba3be', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
            תמונות (אופציונלי)
          </label>

          {/* Thumbnails row */}
          {photos.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              {photos.map((photo, i) => (
                <div
                  key={i}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 10,
                    background: 'rgba(0,212,184,0.12)',
                    border: '1px solid rgba(0,212,184,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4b8" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span style={{ fontSize: 9, color: '#00d4b8', marginTop: 4, textAlign: 'center', padding: '0 4px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 56 }}>
                    {photo.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {photos.length < 3 && (
            <label
              style={{
                width: '100%',
                padding: '20px 16px',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                cursor: 'pointer',
                border: '2px dashed rgba(0,212,184,0.3)',
                background: 'rgba(0,212,184,0.03)',
                transition: 'background 0.2s',
              }}
            >
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoAdd} />
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,184,0.7)" strokeWidth="1.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <div>
                <span style={{ color: '#00d4b8', fontSize: 14, fontWeight: 600, display: 'block' }}>
                  הוסף תמונות
                </span>
                <span style={{ color: '#4d6b85', fontSize: 11 }}>עד 3 תמונות</span>
              </div>
            </label>
          )}
        </div>

        {/* Price estimate card */}
        <div
          style={{
            background: 'rgba(13,26,46,0.85)',
            border: '1px solid rgba(0,212,184,0.18)',
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <p style={{ color: '#4d6b85', fontSize: 11, marginBottom: 4 }}>הערכת מחיר</p>
              <p style={{ color: '#fff', fontSize: 28, fontWeight: 900, margin: 0 }}>{priceRange}</p>
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: '#4d6b85', fontSize: 11, marginBottom: 6 }}>זמן הגעה משוער</p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(0,212,184,0.15)',
                  border: '1px solid rgba(0,212,184,0.3)',
                  borderRadius: 20,
                  padding: '5px 12px',
                }}
              >
                <div className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d4b8', flexShrink: 0 }} />
                <span style={{ color: '#00d4b8', fontSize: 12, fontWeight: 700 }}>{timeRange}</span>
              </div>
            </div>
          </div>

          {/* Price range bar */}
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(0,212,184,0.1)', marginBottom: 10, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: '65%',
              borderRadius: 2,
              background: 'linear-gradient(90deg, #00d4b8 0%, #0088cc 100%)',
            }} />
          </div>

          <p style={{ color: '#4d6b85', fontSize: 11, margin: 0, lineHeight: 1.5 }}>
            המחיר הסופי ייקבע על ידי הטכנאי לאחר בדיקה במקום
          </p>
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

        {/* CTA button */}
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: 14,
            fontWeight: 700,
            fontSize: 16,
            color: '#080f1e',
            background: loading
              ? 'rgba(0,212,184,0.4)'
              : 'linear-gradient(135deg, #00d4b8 0%, #0088cc 100%)',
            boxShadow: loading ? 'none' : '0 6px 24px rgba(0,212,184,0.35)',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ animation: 'spin-ring 1s linear infinite' }}>
                <circle cx="12" cy="12" r="9" strokeDasharray="40 20" />
              </svg>
              מחפש...
            </>
          ) : (
            <>
              חפש טכנאי זמין
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
      </div>
    </main>
  )
}

export default function ProblemPage() {
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
      <ProblemForm />
    </Suspense>
  )
}
