'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

const INPUT_STYLE: React.CSSProperties = {
  background: '#0d1f3c',
  border: '1.5px solid rgba(0,212,184,0.2)',
  borderRadius: 12,
  color: '#ffffff',
  padding: '14px 16px',
  fontSize: 15,
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
}

const SPECIALTY_OPTIONS = [
  { value: 'electricity', label: 'חשמל', icon: '⚡' },
  { value: 'plumbing', label: 'אינסטלציה', icon: '🔧' },
  { value: 'locksmith', label: 'מנעול', icon: '🔑' },
  { value: 'ac', label: 'מזגן', icon: '❄️' },
  { value: 'other', label: 'אחר', icon: '🛠️' },
]

interface FormData {
  name: string
  phone: string
  email: string
  specialty: string
  yearsExperience: number
  password: string
}

interface Files {
  profile: File | null
  identity: File | null
  license: File | null
}

export default function TechnicianRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    specialty: '',
    yearsExperience: 1,
    password: '',
  })

  const [files, setFiles] = useState<Files>({
    profile: null,
    identity: null,
    license: null,
  })

  const updateField = (field: keyof FormData, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmitStep1 = () => {
    if (!form.name.trim()) { setError('שם מלא הוא שדה חובה'); return }
    if (!form.phone.trim()) { setError('מספר נייד הוא שדה חובה'); return }
    if (!form.specialty) { setError('אנא בחר התמחות'); return }
    if (!form.password || form.password.length < 6) { setError('סיסמה חייבת להכיל לפחות 6 תווים'); return }
    setError('')
    setStep(2)
  }

  const handleSubmitStep2 = async () => {
    setLoading(true)
    setError('')
    try {
      const fullPhone = `+972${form.phone.replace(/^0/, '')}`

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: fullPhone,
          email: form.email || undefined,
          password: form.password,
          role: 'technician',
          specialty: form.specialty,
          yearsExperience: form.yearsExperience,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'שגיאה בשרת')
        return
      }

      setStep(3)
    } catch {
      setError('שגיאה בשרת, אנא נסה שוב')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveDemo = async () => {
    setLoading(true)
    try {
      await fetch('/api/technicians/approve-demo', { method: 'POST' })
      router.push('/technician')
    } catch {
      router.push('/technician')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="flex flex-col min-h-screen"
      dir="rtl"
      style={{ background: '#080f1e', maxWidth: 430, margin: '0 auto' }}
    >
      <Header />

      <div style={{ flex: 1, padding: '16px 20px 48px' }}>

        {/* Step indicator — always visible */}
        <div style={{ marginBottom: 24 }}>
          {/* Step dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 8 }}>
            {[1, 2, 3].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : undefined }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: s < step
                    ? 'linear-gradient(135deg, #00d4b8 0%, #0088cc 100%)'
                    : s === step
                      ? 'rgba(0,212,184,0.2)'
                      : 'rgba(13,26,46,0.8)',
                  border: s <= step
                    ? '2px solid #00d4b8'
                    : '2px solid rgba(0,212,184,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s',
                }}>
                  {s < step ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="#080f1e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 700, color: s === step ? '#00d4b8' : '#4d6b85' }}>{s}</span>
                  )}
                </div>
                {i < 2 && (
                  <div style={{
                    flex: 1,
                    height: 2,
                    background: s < step ? '#00d4b8' : 'rgba(0,212,184,0.12)',
                    transition: 'background 0.3s',
                    margin: '0 4px',
                  }} />
                )}
              </div>
            ))}
          </div>
          <p style={{ color: '#4d6b85', fontSize: 11, fontWeight: 600 }}>שלב {step} מתוך 3</p>
        </div>

        {/* Step 1 - Basic Info */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 24, marginBottom: 6 }}>הרשמה לטכנאים</h1>
              <p style={{ color: '#8ba3be', fontSize: 13, lineHeight: 1.6 }}>
                מלא את הפרטים שלך כדי להצטרף לרשת הטכנאים שלנו
              </p>
            </div>

            {/* Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ color: '#8ba3be', fontSize: 13, fontWeight: 600 }}>שם מלא</label>
              <input
                type="text"
                placeholder="יוסי כהן"
                value={form.name}
                onChange={e => updateField('name', e.target.value)}
                style={INPUT_STYLE}
                onFocus={e => (e.currentTarget.style.borderColor = '#00d4b8')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,212,184,0.2)')}
              />
            </div>

            {/* Phone with Israeli flag */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ color: '#8ba3be', fontSize: 13, fontWeight: 600 }}>מספר נייד</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '14px 12px',
                  borderRadius: 12,
                  background: 'rgba(0,212,184,0.08)',
                  border: '1.5px solid rgba(0,212,184,0.25)',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 18, lineHeight: 1 }}>🇮🇱</span>
                  <span style={{ color: '#00d4b8', fontSize: 14, fontWeight: 700 }}>+972</span>
                </div>
                <input
                  type="tel"
                  placeholder="50-123-4567"
                  value={form.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  style={{ ...INPUT_STYLE, flex: 1 }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#00d4b8')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,212,184,0.2)')}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ color: '#8ba3be', fontSize: 13, fontWeight: 600 }}>
                אימייל <span style={{ color: '#4d6b85', fontWeight: 400 }}>(אופציונלי)</span>
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={e => updateField('email', e.target.value)}
                style={INPUT_STYLE}
                onFocus={e => (e.currentTarget.style.borderColor = '#00d4b8')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,212,184,0.2)')}
              />
            </div>

            {/* Specialty pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ color: '#8ba3be', fontSize: 13, fontWeight: 600 }}>התמחות</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SPECIALTY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateField('specialty', opt.value)}
                    className={`specialty-pill${form.specialty === opt.value ? ' active' : ''}`}
                  >
                    <span style={{ marginLeft: 4 }}>{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Years Experience counter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ color: '#8ba3be', fontSize: 13, fontWeight: 600 }}>שנות ניסיון</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <button
                  onClick={() => updateField('yearsExperience', Math.max(0, form.yearsExperience - 1))}
                  style={{
                    width: 44,
                    height: 48,
                    borderRadius: '12px 0 0 12px',
                    background: 'rgba(0,212,184,0.1)',
                    border: '1.5px solid rgba(0,212,184,0.25)',
                    borderRight: 'none',
                    color: '#00d4b8',
                    fontSize: 22,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  −
                </button>
                <div style={{
                  flex: 1,
                  height: 48,
                  background: '#0d1f3c',
                  border: '1.5px solid rgba(0,212,184,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: 700,
                }}>
                  {form.yearsExperience}
                </div>
                <button
                  onClick={() => updateField('yearsExperience', Math.min(60, form.yearsExperience + 1))}
                  style={{
                    width: 44,
                    height: 48,
                    borderRadius: '0 12px 12px 0',
                    background: 'rgba(0,212,184,0.1)',
                    border: '1.5px solid rgba(0,212,184,0.25)',
                    borderLeft: 'none',
                    color: '#00d4b8',
                    fontSize: 22,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ color: '#8ba3be', fontSize: 13, fontWeight: 600 }}>סיסמה</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="לפחות 6 תווים"
                  value={form.password}
                  onChange={e => updateField('password', e.target.value)}
                  style={{ ...INPUT_STYLE, paddingLeft: 44 }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#00d4b8')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,212,184,0.2)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4d6b85" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" strokeLinecap="round" />
                      <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4d6b85" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)',
                color: '#ff6b6b', fontSize: 13, textAlign: 'center',
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmitStep1}
              style={{
                width: '100%',
                padding: '15px 24px',
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 15,
                color: '#080f1e',
                background: 'linear-gradient(135deg, #00d4b8 0%, #0088cc 100%)',
                boxShadow: '0 6px 24px rgba(0,212,184,0.35)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              המשך להעלאת מסמכים
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

        {/* Step 2 - Document Upload */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <button
                onClick={() => setStep(1)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: '#8ba3be', fontSize: 13, background: 'none',
                  border: 'none', cursor: 'pointer', padding: 0, marginBottom: 12,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                חזרה
              </button>
              <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 24, marginBottom: 6 }}>העלאת מסמכים</h1>
              <p style={{ color: '#8ba3be', fontSize: 13, lineHeight: 1.6 }}>
                נדרשים מסמכים לאימות זהות ורישיונות מקצועיים
              </p>
            </div>

            {/* Profile photo */}
            <UploadBox
              label="תמונת פרופיל"
              accept="image/*"
              hint="JPG, PNG עד 5MB"
              icon={
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,184,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              }
              file={files.profile}
              onFile={f => setFiles(prev => ({ ...prev, profile: f }))}
              btnLabel="לחץ להעלאת תמונה"
            />

            {/* Identity */}
            <UploadBox
              label="תעודת זהות"
              accept=".pdf,image/*"
              hint="PDF, JPG, PNG עד 5MB"
              icon={
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,184,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M8 9h8M8 13h5" />
                </svg>
              }
              file={files.identity}
              onFile={f => setFiles(prev => ({ ...prev, identity: f }))}
              btnLabel="לחץ להעלאת קובץ"
            />

            {/* Professional license */}
            <UploadBox
              label="רישיון מקצועי"
              accept=".pdf,image/*"
              hint="PDF, JPG, PNG עד 5MB"
              icon={
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,184,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M8 9h8M8 13h8M8 17h5" />
                  <circle cx="17" cy="17" r="3" />
                  <path d="m19 19 1.5 1.5" />
                </svg>
              }
              file={files.license}
              onFile={f => setFiles(prev => ({ ...prev, license: f }))}
              btnLabel="לחץ להעלאת קובץ"
            />

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)',
                color: '#ff6b6b', fontSize: 13, textAlign: 'center',
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmitStep2}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px 24px',
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 15,
                color: '#080f1e',
                background: loading ? 'rgba(0,212,184,0.4)' : 'linear-gradient(135deg, #00d4b8 0%, #0088cc 100%)',
                boxShadow: loading ? 'none' : '0 6px 24px rgba(0,212,184,0.35)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
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
                  שולח...
                </>
              ) : 'שלח בקשה'}
            </button>
          </div>
        )}

        {/* Step 3 - Success */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 16, gap: 20 }}>
            {/* Success animation */}
            <div style={{ position: 'relative', width: 100, height: 100 }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '3px solid rgba(0,212,184,0.15)',
              }} />
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '3px solid transparent',
                borderTopColor: '#00d4b8',
                borderRightColor: 'rgba(0,212,184,0.4)',
                animation: 'spin-ring 2s linear infinite',
              }} />
              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 38,
              }}>
                ✅
              </div>
            </div>

            <div>
              <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 26, marginBottom: 10 }}>בקשתך נשלחה!</h1>
              <p style={{ color: '#8ba3be', fontSize: 14, lineHeight: 1.6, maxWidth: 300 }}>
                המסמכים שלך נמצאים בבדיקה. נעדכן אותך ב-SMS ובאימייל ברגע שהחשבון יאושר.
              </p>
            </div>

            <span style={{
              padding: '8px 20px',
              borderRadius: 20,
              fontWeight: 700,
              fontSize: 13,
              background: 'rgba(245,158,11,0.12)',
              color: '#f59e0b',
              border: '1px solid rgba(245,158,11,0.3)',
            }}>
              זמן אישור משוער: 24-48 שעות ⏳
            </span>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              <button
                onClick={handleApproveDemo}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '15px 24px',
                  borderRadius: 14,
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #ff9500, #ff6b00)',
                  boxShadow: '0 6px 20px rgba(255,149,0,0.3)',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'טוען...' : 'דלג על אישור (דמו) 🚀'}
              </button>

              <a
                href="/"
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: 14,
                  fontWeight: 600,
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#00d4b8',
                  background: 'rgba(0,212,184,0.06)',
                  border: '1.5px solid rgba(0,212,184,0.3)',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                חזרה למסך הראשי
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

/* ---- UploadBox sub-component ---- */
interface UploadBoxProps {
  label: string
  accept: string
  hint: string
  icon: React.ReactNode
  file: File | null
  onFile: (f: File) => void
  btnLabel: string
}

function UploadBox({ label, accept, hint, icon, file, onFile, btnLabel }: UploadBoxProps) {
  const inputId = `upload-${label}`
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ color: '#8ba3be', fontSize: 13, fontWeight: 600 }}>{label}</label>
      <label
        htmlFor={inputId}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '20px 16px',
          borderRadius: 14,
          cursor: 'pointer',
          border: file ? '1.5px solid rgba(0,200,83,0.4)' : '1.5px dashed rgba(0,212,184,0.35)',
          background: file ? 'rgba(0,200,83,0.05)' : 'rgba(0,212,184,0.04)',
          transition: 'all 0.2s',
        }}
      >
        {icon}
        {file ? (
          <span style={{ color: '#00c853', fontSize: 13, fontWeight: 600, textAlign: 'center', padding: '0 16px', wordBreak: 'break-all' }}>
            ✓ {file.name}
          </span>
        ) : (
          <>
            <span style={{ color: '#00d4b8', fontSize: 13, fontWeight: 600 }}>{btnLabel}</span>
            <span style={{ color: '#4d6b85', fontSize: 11 }}>{hint}</span>
          </>
        )}
        <input
          id={inputId}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0]
            if (f) onFile(f)
          }}
        />
      </label>
    </div>
  )
}
