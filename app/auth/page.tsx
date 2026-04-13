'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role')

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [role, setRole] = useState<'customer' | 'technician'>(
    roleParam === 'technician' ? 'technician' : 'customer'
  )
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (roleParam === 'technician') {
      setRole('technician')
      setMode('register')
    }
  }, [roleParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body =
        mode === 'login'
          ? { phone, password }
          : { name, phone, password, role }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'שגיאה. נסה שנית.')
        return
      }

      // Redirect based on role
      if (data.user?.role === 'technician') {
        router.push('/technician')
      } else {
        router.push('/customer')
      }
    } catch {
      setError('שגיאת רשת. נסה שנית.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col min-h-screen bg-bg-dark" style={{ maxWidth: 430, margin: '0 auto' }}>
      <Header />

      <div className="flex-1 flex flex-col px-6 pt-4 pb-10">
        {/* Mode tabs */}
        <div className="flex rounded-2xl bg-bg-card border border-[rgba(0,212,184,0.15)] p-1 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
              mode === 'login' ? 'bg-accent text-bg-dark' : 'text-text-muted'
            }`}
          >
            כניסה
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
              mode === 'register' ? 'bg-accent text-bg-dark' : 'text-text-muted'
            }`}
          >
            הרשמה
          </button>
        </div>

        {/* Role selector (only on register) */}
        {mode === 'register' && (
          <div className="flex rounded-2xl bg-bg-card border border-[rgba(0,212,184,0.15)] p-1 mb-6">
            <button
              onClick={() => setRole('customer')}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${
                role === 'customer' ? 'bg-accent text-bg-dark' : 'text-text-muted'
              }`}
            >
              לקוח
            </button>
            <button
              onClick={() => setRole('technician')}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${
                role === 'technician' ? 'bg-accent text-bg-dark' : 'text-text-muted'
              }`}
            >
              טכנאי
            </button>
          </div>
        )}

        <h2 className="text-2xl font-bold text-white mb-6">
          {mode === 'login'
            ? 'ברוך השב 👋'
            : role === 'technician'
            ? 'הצטרף כטכנאי'
            : 'הצטרף ל-TAKENI'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label className="block text-text-muted text-sm mb-2">שם מלא</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="ישראל ישראלי"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-bg-card border border-[rgba(0,212,184,0.2)] text-white placeholder:text-[#3d5a75] focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-text-muted text-sm mb-2">מספר טלפון</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="050-1234567"
              required
              dir="ltr"
              className="w-full px-4 py-3.5 rounded-xl bg-bg-card border border-[rgba(0,212,184,0.2)] text-white placeholder:text-[#3d5a75] focus:outline-none focus:border-accent transition-colors text-left"
            />
          </div>

          <div>
            <label className="block text-text-muted text-sm mb-2">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full px-4 py-3.5 rounded-xl bg-bg-card border border-[rgba(0,212,184,0.2)] text-white placeholder:text-[#3d5a75] focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-lg text-bg-dark mt-2 disabled:opacity-60 transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #00d4b8 0%, #009e8a 100%)' }}
          >
            {loading ? 'מתחבר...' : mode === 'login' ? 'כניסה' : 'הרשמה'}
          </button>
        </form>

        <p className="text-center text-text-muted text-sm mt-6">
          {mode === 'login' ? 'אין לך חשבון עדיין? ' : 'כבר יש לך חשבון? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-accent font-medium"
          >
            {mode === 'login' ? 'הירשם' : 'כנס'}
          </button>
        </p>

        {mode === 'login' && (
          <div
            className="mt-6 p-4 rounded-xl border"
            style={{ borderColor: 'rgba(0,212,184,0.2)', background: 'rgba(0,212,184,0.05)' }}
          >
            <p className="text-text-muted text-xs text-center mb-1">פרטי כניסה לדוגמה</p>
            <p className="text-accent text-xs text-center">לקוח: 0500000001 / demo123</p>
            <p className="text-accent text-xs text-center">טכנאי: 0501234567 / demo123</p>
          </div>
        )}
      </div>
    </main>
  )
}
