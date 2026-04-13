'use client'
import { useState, useEffect, useRef } from 'react'

interface LocationBarProps {
  onLocationChange?: (lat: number, lng: number, address: string) => void
}

export default function LocationBar({ onLocationChange }: LocationBarProps) {
  const [address, setAddress] = useState('מאתר מיקום...')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setAddress('הזן כתובת ידנית')
      setLoading(false)
      return
    }

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
          const city = data.address?.city || data.address?.town || data.address?.village || ''
          const addr = [road, houseNumber, city].filter(Boolean).join(' ')
          const finalAddr = addr || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          setAddress(finalAddr)
          onLocationChange?.(latitude, longitude, finalAddr)
        } catch {
          setAddress('תל אביב')
        }
        setLoading(false)
      },
      () => {
        setAddress('לחץ לציון מיקום')
        setLoading(false)
      },
      { timeout: 10000 }
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEditClick = () => {
    setEditing(true)
    setInputValue(address)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleInputConfirm = () => {
    const val = inputValue.trim()
    if (val) setAddress(val)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleInputConfirm()
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(13,26,46,0.9)',
        border: '1.5px solid rgba(0,212,184,0.2)',
        borderRadius: 12,
        padding: '11px 14px',
        marginBottom: 8,
        backdropFilter: 'blur(8px)',
        transition: 'border-color 0.2s',
      }}
    >
      {/* GPS / pin icon */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        {loading ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00d4b8"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ animation: 'spin-ring 1.2s linear infinite' }}
          >
            <circle cx="12" cy="12" r="9" strokeDasharray="40 20" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        )}
      </div>

      {/* Address text or input */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onBlur={handleInputConfirm}
            onKeyDown={handleKeyDown}
            placeholder="הזן כתובת..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: 13,
              width: '100%',
              fontFamily: 'inherit',
              direction: 'rtl',
            }}
          />
        ) : (
          <span
            style={{
              color: loading ? '#4d6b85' : '#ffffff',
              fontSize: 13,
              fontWeight: loading ? 400 : 500,
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? (
              <span
                className="shimmer"
                style={{ display: 'inline-block', width: 150, height: 13, borderRadius: 4, verticalAlign: 'middle' }}
              />
            ) : (
              address
            )}
          </span>
        )}
      </div>

      {/* Action button */}
      {!loading && !editing && (
        <button
          onClick={handleEditClick}
          style={{
            flexShrink: 0,
            fontSize: 11,
            color: '#00d4b8',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: 6,
            transition: 'background 0.15s',
          }}
        >
          שנה
        </button>
      )}

      {editing && (
        <button
          onClick={handleInputConfirm}
          style={{
            flexShrink: 0,
            fontSize: 11,
            color: '#00d4b8',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 6px',
          }}
        >
          אישור
        </button>
      )}
    </div>
  )
}
