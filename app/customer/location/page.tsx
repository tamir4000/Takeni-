'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LocationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [apartment, setApartment] = useState('')
  const [floor, setFloor] = useState('')
  const [notes, setNotes] = useState('')
  const [gpsLoading, setGpsLoading] = useState(false)

  useEffect(() => {
    const s = searchParams.get('street') || ''
    const c = searchParams.get('city') || ''
    setStreet(s)
    setCity(c)
  }, [searchParams])

  const handleGpsClick = () => {
    if (!navigator.geolocation) return
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=he`
          )
          const data = await res.json()
          const road = data.address?.road || ''
          const houseNumber = data.address?.house_number || ''
          const cityName =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            ''
          setStreet([road, houseNumber].filter(Boolean).join(' '))
          setCity(cityName)
        } catch {
          // silently fail
        }
        setGpsLoading(false)
      },
      () => {
        setGpsLoading(false)
      },
      { timeout: 10000 }
    )
  }

  const handleSave = () => {
    const addressData = { street, city, apartment, floor, notes }
    localStorage.setItem('takeni_address', JSON.stringify(addressData))
    router.back()
  }

  const inputStyle: React.CSSProperties = {
    background: '#0d1a2e',
    border: '1.5px solid rgba(0,212,184,0.2)',
    borderRadius: 12,
    padding: '14px 16px',
    color: '#ffffff',
    fontSize: 15,
    width: '100%',
    fontFamily: 'inherit',
    direction: 'rtl',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    color: '#8ba3be',
    fontSize: 13,
    marginBottom: 6,
    display: 'block',
    direction: 'rtl',
  }

  return (
    <main
      style={{
        background: '#080f1e',
        minHeight: '100vh',
        maxWidth: 430,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        direction: 'rtl',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '20px 16px 16px',
          borderBottom: '1px solid rgba(0,212,184,0.1)',
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: 'rgba(13,26,46,0.8)',
            border: '1px solid rgba(0,212,184,0.15)',
            borderRadius: 10,
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#ffffff',
            fontSize: 18,
            flexShrink: 0,
          }}
          aria-label="חזור"
        >
          ←
        </button>
        <div>
          <h1 style={{ color: '#ffffff', fontSize: 18, fontWeight: 800, margin: 0 }}>
            שינוי כתובת
          </h1>
          <p style={{ color: '#8ba3be', fontSize: 13, margin: 0, marginTop: 2 }}>
            עדכן את המיקום שלך
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Street */}
        <div>
          <label style={labelStyle}>רחוב ומספר בית</label>
          <input
            type="text"
            value={street}
            onChange={e => setStreet(e.target.value)}
            placeholder="דיזנגוף 99"
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = '#00d4b8')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,212,184,0.2)')}
          />
        </div>

        {/* City */}
        <div>
          <label style={labelStyle}>עיר</label>
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="תל אביב"
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = '#00d4b8')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,212,184,0.2)')}
          />
        </div>

        {/* Apartment */}
        <div>
          <label style={labelStyle}>דירה (אופציונלי)</label>
          <input
            type="text"
            value={apartment}
            onChange={e => setApartment(e.target.value)}
            placeholder="לדוגמה: דירה 5"
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = '#00d4b8')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,212,184,0.2)')}
          />
        </div>

        {/* Floor */}
        <div>
          <label style={labelStyle}>קומה (אופציונלי)</label>
          <input
            type="text"
            value={floor}
            onChange={e => setFloor(e.target.value)}
            placeholder="לדוגמה: קומה 3"
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = '#00d4b8')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,212,184,0.2)')}
          />
        </div>

        {/* Notes */}
        <div>
          <label style={labelStyle}>הערות נוספות (אופציונלי)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="לדוגמה: כניסה מהחצר האחורית"
            rows={3}
            style={{
              ...inputStyle,
              resize: 'vertical',
              lineHeight: 1.5,
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#00d4b8')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,212,184,0.2)')}
          />
        </div>

        {/* GPS Card */}
        <div
          style={{
            border: '1.5px solid rgba(0,212,184,0.3)',
            background: 'rgba(0,212,184,0.05)',
            borderRadius: 16,
            padding: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 12,
            }}
          >
            <div>
              <p style={{ color: '#ffffff', fontSize: 14, fontWeight: 700, margin: 0, marginBottom: 4 }}>
                שימוש במיקום נוכחי
              </p>
              <p style={{ color: '#8ba3be', fontSize: 12, margin: 0 }}>
                זיהוי אוטומטי של המיקום שלך
              </p>
            </div>
            <span style={{ fontSize: 20 }}>📍</span>
          </div>
          <button
            onClick={handleGpsClick}
            disabled={gpsLoading}
            style={{
              width: '100%',
              border: '1.5px solid #00d4b8',
              color: '#00d4b8',
              background: 'transparent',
              borderRadius: 10,
              padding: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: gpsLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              direction: 'rtl',
              opacity: gpsLoading ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {gpsLoading ? 'מאתר מיקום...' : '📍 השתמש במיקום הנוכחי'}
          </button>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #00d4b8, #0088cc)',
            color: '#080f1e',
            fontWeight: 700,
            borderRadius: 14,
            padding: 16,
            fontSize: 16,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginTop: 4,
          }}
        >
          שמור כתובת
        </button>
      </div>
    </main>
  )
}
