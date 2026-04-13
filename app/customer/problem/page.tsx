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

function ProblemForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const service = searchParams.get('service') || 'other'

  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState('urgent')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const serviceName = SERVICE_LABELS[service] || 'שירות'
  const priceRange = SERVICE_PRICES[service] || '₪150–400'
  const timeRange = SERVICE_TIMES[service] || '15–25 דק\''

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

  return (
    <main className="flex flex-col min-h-screen bg-bg-dark" style={{ maxWidth: 430, margin: '0 auto' }}>
      <Header />

      <div className="flex-1 flex flex-col px-4 pb-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-muted text-sm mb-5 hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {serviceName}
        </button>

        {/* Section: Problem description */}
        <div className="mb-5">
          <h2 className="text-white font-bold text-base mb-3">תאר את התקלה</h2>

          <div className="mb-4">
            <label className="block text-text-muted text-sm mb-2">מה הבעיה?</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={
                service === 'electricity'
                  ? 'לדוגמה: יש קצר בלוח החשמל, הנורות מהבהבות...'
                  : service === 'plumbing'
                  ? 'לדוגמה: יש נזילה מתחת לכיור, הברז לא נסגר...'
                  : service === 'locksmith'
                  ? 'לדוגמה: הדלת נתקעת, צריך להחליף מנעול...'
                  : service === 'ac'
                  ? 'לדוגמה: המזגן לא מקרר, יש טפטוף מים...'
                  : 'תאר את הבעיה שלך...'
              }
              rows={4}
              className="w-full px-4 py-3.5 rounded-xl bg-bg-card border border-[rgba(0,212,184,0.2)] text-white placeholder:text-[#3d5a75] focus:outline-none focus:border-accent resize-none transition-colors text-sm"
            />
          </div>

          {/* Urgency */}
          <div className="mb-4">
            <label className="block text-text-muted text-sm mb-2">רמת דחיפות</label>
            <div
              className="w-full px-4 py-3.5 rounded-xl bg-bg-card border border-[rgba(0,212,184,0.2)] flex items-center justify-between cursor-pointer"
              onClick={e => {
                const sel = e.currentTarget.querySelector('select')
                if (sel) sel.focus()
              }}
            >
              <select
                value={urgency}
                onChange={e => setUrgency(e.target.value)}
                className="w-full bg-transparent text-white text-sm focus:outline-none appearance-none cursor-pointer"
              >
                <option value="urgent">דחוף — צריך עכשיו</option>
                <option value="today">היום</option>
                <option value="flexible">גמיש</option>
              </select>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7a9dbf" strokeWidth="2" className="flex-shrink-0">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-text-muted text-sm mb-2">תמונות (אופציונלי)</label>
            <label
              className="w-full py-8 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-colors"
              style={{
                border: '2px dashed rgba(0,212,184,0.3)',
                background: 'rgba(0,212,184,0.03)',
              }}
            >
              <input type="file" accept="image/*" multiple className="hidden" />
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,184,0.6)" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="text-accent text-sm font-medium">הוסף תמונות</span>
              <span className="text-text-muted text-xs">עד 3 תמונות</span>
            </label>
          </div>
        </div>

        {/* Price/Time estimate */}
        <div
          className="p-4 rounded-2xl mb-5"
          style={{
            background: 'linear-gradient(145deg, #0d1f3c 0%, #0a1a32 100%)',
            border: '1px solid rgba(0,212,184,0.2)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-xs mb-1">הערכת מחיר</p>
              <p className="text-white text-2xl font-black">{priceRange}</p>
            </div>
            <div className="text-left">
              <p className="text-text-muted text-xs mb-1">זמן הגעה משוער</p>
              <div
                className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
                style={{ background: 'rgba(0,212,184,0.15)', color: '#00d4b8' }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {timeRange}
              </div>
            </div>
          </div>
          <p className="text-text-muted text-xs mt-3 leading-relaxed">
            המחיר הסופי ייקבע על ידי הטכנאי לאחר בדיקה במקום
          </p>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-400 text-sm text-center mb-4">
            {error}
          </div>
        )}

        {/* Search button */}
        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-lg text-bg-dark disabled:opacity-60 transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #00d4b8 0%, #009e8a 100%)' }}
        >
          {loading ? 'מחפש...' : 'חפש טכנאי זמין'}
        </button>
      </div>
    </main>
  )
}


export default function ProblemPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#00d4b8', borderTopColor: 'transparent' }} />
      </div>
    }>
      <ProblemForm />
    </Suspense>
  )
}
