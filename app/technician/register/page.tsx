'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

const INPUT_STYLE = {
  background: '#0d1f3c',
  border: '1px solid rgba(0,212,184,0.2)',
  borderRadius: 12,
  color: '#ffffff',
  padding: '14px 16px',
  fontSize: 15,
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
}

const SPECIALTY_OPTIONS = [
  { value: '', label: 'בחר התמחות' },
  { value: 'electricity', label: 'חשמל' },
  { value: 'plumbing', label: 'אינסטלציה' },
  { value: 'locksmith', label: 'מנעול' },
  { value: 'ac', label: 'מזגן' },
  { value: 'other', label: 'אחר' },
]

interface FormData {
  name: string
  phone: string
  email: string
  specialty: string
  yearsExperience: string
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

  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    specialty: '',
    yearsExperience: '',
    password: '',
  })

  const [files, setFiles] = useState<Files>({
    profile: null,
    identity: null,
    license: null,
  })

  const updateField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmitStep1 = () => {
    if (!form.name.trim()) { setError('שם מלא הוא שדה חובה'); return }
    if (!form.phone.trim()) { setError('מספר נייד הוא שדה חובה'); return }
    if (!form.specialty) { setError('אנא בחר התמחות'); return }
    setError('')
    setStep(2)
  }

  const handleSubmitStep2 = async () => {
    setLoading(true)
    setError('')
    try {
      const fullPhone = `+972${form.phone.replace(/^0/, '')}`
      const password = form.password || `takeni_${Date.now()}`

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: fullPhone,
          email: form.email || undefined,
          password,
          role: 'technician',
          specialty: form.specialty,
          yearsExperience: form.yearsExperience ? parseInt(form.yearsExperience, 10) : 0,
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
      style={{ background: '#0a1628', maxWidth: 430, margin: '0 auto' }}
    >
      <Header />

      <div className="flex-1 px-5 pb-12">
        {/* Step 1 - Basic Info */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div className="mb-2">
              <h1 className="text-white font-black text-2xl mb-2">הרשמה לטכנאים</h1>
              <p className="text-[#7a9dbf] text-sm leading-relaxed">
                מלא את הפרטים שלך כדי להצטרף לרשת הטכנאים שלנו
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-1">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className="h-1.5 flex-1 rounded-full transition-all duration-300"
                  style={{ background: s <= step ? '#00d4b8' : 'rgba(0,212,184,0.15)' }}
                />
              ))}
            </div>
            <p className="text-[#7a9dbf] text-xs -mt-3">שלב 1 מתוך 3</p>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#7a9dbf] text-sm font-medium">שם מלא</label>
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

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#7a9dbf] text-sm font-medium">מספר נייד</label>
              <div className="flex items-center gap-2">
                <span
                  className="flex-shrink-0 px-3 py-3.5 rounded-xl font-bold text-sm"
                  style={{
                    background: 'rgba(0,212,184,0.12)',
                    border: '1px solid rgba(0,212,184,0.3)',
                    color: '#00d4b8',
                  }}
                >
                  +972
                </span>
                <input
                  type="tel"
                  placeholder="הקלד/י מספר ללא אפסים"
                  value={form.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  style={{ ...INPUT_STYLE, flex: 1 }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#00d4b8')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,212,184,0.2)')}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#7a9dbf] text-sm font-medium">אימייל</label>
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

            {/* Specialty */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#7a9dbf] text-sm font-medium">התמחות</label>
              <select
                value={form.specialty}
                onChange={e => updateField('specialty', e.target.value)}
                style={{ ...INPUT_STYLE, cursor: 'pointer' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#00d4b8')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,212,184,0.2)')}
              >
                {SPECIALTY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} style={{ background: '#0d1f3c' }}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Years Experience */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#7a9dbf] text-sm font-medium">שנות ניסיון</label>
              <input
                type="number"
                placeholder="5"
                min="0"
                max="60"
                value={form.yearsExperience}
                onChange={e => updateField('yearsExperience', e.target.value)}
                style={INPUT_STYLE}
                onFocus={e => (e.currentTarget.style.borderColor = '#00d4b8')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,212,184,0.2)')}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#7a9dbf] text-sm font-medium">סיסמה</label>
              <input
                type="password"
                placeholder="לפחות 6 תווים"
                value={form.password}
                onChange={e => updateField('password', e.target.value)}
                style={INPUT_STYLE}
                onFocus={e => (e.currentTarget.style.borderColor = '#00d4b8')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,212,184,0.2)')}
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleSubmitStep1}
              className="w-full py-4 rounded-2xl font-bold text-base text-[#0a1628] transition-all active:scale-95 mt-2"
              style={{ background: 'linear-gradient(135deg, #00d4b8 0%, #009e8a 100%)' }}
            >
              המשך להעלאת מסמכים
            </button>
          </div>
        )}

        {/* Step 2 - Document Upload */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div className="mb-2">
              <button
                onClick={() => setStep(1)}
                className="text-[#7a9dbf] text-sm mb-4 flex items-center gap-1 hover:text-white transition-colors"
              >
                ← חזרה
              </button>
              <h1 className="text-white font-black text-2xl mb-2">העלאת מסמכים</h1>
              <p className="text-[#7a9dbf] text-sm leading-relaxed">
                נדרשים מסמכים לאימות זהות ורישיונות מקצועיים
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-1">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className="h-1.5 flex-1 rounded-full transition-all duration-300"
                  style={{ background: s <= step ? '#00d4b8' : 'rgba(0,212,184,0.15)' }}
                />
              ))}
            </div>
            <p className="text-[#7a9dbf] text-xs -mt-3">שלב 2 מתוך 3</p>

            {/* Profile photo */}
            <UploadBox
              label="תמונת פרופיל"
              accept="image/*"
              hint="JPG, PNG עד 5MB"
              icon={
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,184,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,184,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,184,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleSubmitStep2}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-base text-[#0a1628] transition-all active:scale-95 mt-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #00d4b8 0%, #009e8a 100%)' }}
            >
              {loading ? 'שולח...' : 'שלח בקשה'}
            </button>
          </div>
        )}

        {/* Step 3 - Success */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center gap-6 pt-8 text-center">
            {/* Step indicator */}
            <div className="flex items-center gap-2 w-full mb-1">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className="h-1.5 flex-1 rounded-full"
                  style={{ background: '#00d4b8' }}
                />
              ))}
            </div>

            {/* Spinning teal circle */}
            <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '3px solid rgba(0,212,184,0.15)',
                }}
              />
              <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                  border: '3px solid transparent',
                  borderTopColor: '#00d4b8',
                  borderRightColor: 'rgba(0,212,184,0.4)',
                }}
              />
              <span style={{ fontSize: 36 }}>✅</span>
            </div>

            <div>
              <h1 className="text-white font-black text-2xl mb-3">בקשתך נשלחה!</h1>
              <p className="text-[#7a9dbf] text-sm leading-relaxed max-w-[320px]">
                המסמכים שלך נמצאים בבדיקה. נעדכן אותך ב-SMS ובאימייל ברגע שהחשבון יאושר.
              </p>
            </div>

            {/* Estimated time chip */}
            <span
              className="px-4 py-2 rounded-full font-bold text-sm"
              style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              זמן אישור משוער: 24-48 שעות ⏳
            </span>

            <div className="w-full flex flex-col gap-3 mt-2">
              {/* Orange demo button */}
              <button
                onClick={handleApproveDemo}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-base text-white transition-all active:scale-95 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #ff9500, #ff6b00)' }}
              >
                {loading ? 'טוען...' : 'דלג על אישור (דמו) 🚀'}
              </button>

              {/* Back to home */}
              <a
                href="/"
                className="w-full py-4 rounded-2xl font-bold text-base text-center transition-all active:scale-95"
                style={{
                  background: 'transparent',
                  border: '1.5px solid rgba(0,212,184,0.4)',
                  color: '#00d4b8',
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
    <div className="flex flex-col gap-1.5">
      <label className="text-[#7a9dbf] text-sm font-medium">{label}</label>
      <label
        htmlFor={inputId}
        className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl cursor-pointer transition-all"
        style={{
          border: '1.5px dashed rgba(0,212,184,0.4)',
          background: 'rgba(0,212,184,0.05)',
        }}
      >
        {icon}
        {file ? (
          <span className="text-green-400 text-sm font-medium text-center px-4 break-all">
            {file.name}
          </span>
        ) : (
          <>
            <span className="text-[#00d4b8] text-sm font-medium">{btnLabel}</span>
            <span className="text-[#7a9dbf] text-xs">{hint}</span>
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
