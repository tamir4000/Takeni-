'use client'

import { useEffect, useState, useRef } from 'react'

const SERVICE_LABELS: Record<string, string> = {
  electricity: '⚡ חשמל',
  plumbing: '🔧 אינסטלציה',
  locksmith: '🔑 מנעולן',
  ac: '❄️ מזגן',
  other: '🔨 אחר',
}

const STATUS_LABELS: Record<string, string> = {
  searching: 'מחפש טכנאי',
  matched: 'נמצא טכנאי',
  onway: 'בדרך',
  arrived: 'הגיע',
  completed: 'הושלם',
  cancelled: 'בוטל',
}

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  searching: { bg: 'rgba(255,160,0,0.15)', color: '#ffa000', border: 'rgba(255,160,0,0.4)' },
  matched: { bg: 'rgba(0,212,184,0.15)', color: '#00d4b8', border: 'rgba(0,212,184,0.4)' },
  onway: { bg: 'rgba(0,136,204,0.15)', color: '#0088cc', border: 'rgba(0,136,204,0.4)' },
  arrived: { bg: 'rgba(0,200,83,0.15)', color: '#00c853', border: 'rgba(0,200,83,0.4)' },
  completed: { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', border: 'rgba(100,116,139,0.4)' },
  cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'rgba(239,68,68,0.4)' },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'עכשיו'
  if (minutes === 1) return 'לפני דקה'
  if (minutes < 60) return `לפני ${minutes} דקות`
  const hours = Math.floor(minutes / 60)
  if (hours === 1) return 'לפני שעה'
  if (hours < 24) return `לפני ${hours} שעות`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'אתמול' : `לפני ${days} ימים`
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [target, duration])

  return value
}

interface StatsData {
  customers: number
  approvedTechnicians: number
  completedJobs: number
  avgRating: number
  activeJobs: ActiveJob[]
  recentCompletions: CompletedJob[]
  technicians: TechnicianItem[]
}

interface ActiveJob {
  id: string
  serviceType: string
  status: string
  createdAt: string
  customer: { name: string }
  technician?: { user: { name: string } } | null
}

interface CompletedJob {
  id: string
  serviceType: string
  completedAt?: string | null
  finalPrice?: number | null
  customer: { name: string }
  technician?: { user: { name: string } } | null
}

interface TechnicianItem {
  id: string
  specialty: string
  rating: number
  totalJobs: number
  isAvailable: boolean
  user: { name: string }
}

function StatCard({ icon, label, value, isFloat }: { icon: string; label: string; value: number; isFloat?: boolean }) {
  const counted = useCountUp(isFloat ? 0 : value)
  const [floatVal, setFloatVal] = useState(0)

  useEffect(() => {
    if (!isFloat) return
    const start = Date.now()
    const duration = 1200
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setFloatVal(Math.round(eased * value * 10) / 10)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value, isFloat])

  const displayValue = isFloat
    ? floatVal.toFixed(1)
    : counted.toLocaleString('he-IL')

  return (
    <div style={{
      background: 'rgba(13,26,46,0.9)',
      border: '1px solid rgba(0,212,184,0.15)',
      borderRadius: 16,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: 'rgba(0,212,184,0.1)',
        border: '1px solid rgba(0,212,184,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        boxShadow: '0 0 16px rgba(0,212,184,0.2)',
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: '2.5rem',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #00d4b8, #0088cc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1.1,
      }}>
        {displayValue}
      </div>
      <div style={{ fontSize: 13, color: '#8ba3be', fontWeight: 500 }}>{label}</div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? STATUS_COLORS.completed
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      borderRadius: 8,
      padding: '3px 10px',
      fontSize: 12,
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

function getInitials(name: string) {
  return name.trim().split(' ').map(w => w[0]).slice(0, 2).join('')
}

function parseSpecialty(specialty: string): string {
  try {
    const arr = JSON.parse(specialty)
    if (Array.isArray(arr) && arr.length > 0) {
      const first = arr[0] as string
      const map: Record<string, string> = {
        electricity: 'חשמל', plumbing: 'אינסטלציה',
        locksmith: 'מנעולן', ac: 'מזגן', other: 'אחר',
      }
      return map[first] ?? first
    }
  } catch {
    // fallback below
  }
  return specialty
}

export default function AdminDashboard() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [clock, setClock] = useState('')
  const [lastRefresh, setLastRefresh] = useState('')

  const fetchData = () => {
    fetch('/api/admin/stats')
      .then(res => res.ok ? res.json() : null)
      .then(d => {
        if (d) {
          setData(d)
          setLastRefresh(new Date().toLocaleTimeString('he-IL'))
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
    const refreshInterval = setInterval(fetchData, 10000)
    const clockInterval = setInterval(() => {
      setClock(new Date().toLocaleTimeString('he-IL'))
    }, 1000)
    setClock(new Date().toLocaleTimeString('he-IL'))
    return () => {
      clearInterval(refreshInterval)
      clearInterval(clockInterval)
    }
  }, [])

  return (
    <main style={{
      background: '#080f1e',
      minHeight: '100vh',
      padding: '0 0 60px',
      direction: 'rtl',
    }}>
      {/* Background glow layers */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-5%', left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 800, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,184,0.08) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,136,204,0.07) 0%, transparent 65%)',
        }} />
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{
          padding: '36px 0 28px',
          borderBottom: '1px solid rgba(0,212,184,0.1)',
          marginBottom: 32,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
              fontWeight: 900,
              margin: 0,
              background: 'linear-gradient(135deg, #00d4b8, #0088cc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}>
              TAKENI — לוח בקרה
            </h1>
            <p style={{ color: '#4d6b85', fontSize: 14, margin: '6px 0 0', fontWeight: 500 }}>
              נתונים בזמן אמת
            </p>
          </div>
          <div style={{ textAlign: 'left', direction: 'ltr' }}>
            <div style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#00d4b8',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.03em',
            }}>
              {clock}
            </div>
            {lastRefresh && (
              <div style={{ fontSize: 11, color: '#4d6b85', marginTop: 2 }}>
                עודכן: {lastRefresh}
              </div>
            )}
          </div>
        </div>

        {/* Stats grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 36,
          }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                background: 'rgba(13,26,46,0.9)',
                border: '1px solid rgba(0,212,184,0.08)',
                borderRadius: 16,
                padding: 24,
                height: 140,
              }} className="shimmer" />
            ))}
          </div>
        ) : data && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 36,
          }}>
            <StatCard icon="👥" label="לקוחות רשומים" value={data.customers} />
            <StatCard icon="👷" label="טכנאים פעילים" value={data.approvedTechnicians} />
            <StatCard icon="📋" label="עבודות שהושלמו" value={data.completedJobs} />
            <StatCard icon="⭐" label="דירוג ממוצע" value={data.avgRating} isFloat />
          </div>
        )}

        {/* Active jobs */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: 16 }}>
            עבודות פעילות עכשיו
            {data && (
              <span style={{
                marginRight: 10,
                fontSize: 12,
                background: 'rgba(0,212,184,0.12)',
                color: '#00d4b8',
                border: '1px solid rgba(0,212,184,0.25)',
                borderRadius: 20,
                padding: '2px 10px',
                fontWeight: 600,
                verticalAlign: 'middle',
              }}>
                {data.activeJobs.length}
              </span>
            )}
          </h2>
          <div style={{
            background: 'rgba(13,26,46,0.9)',
            border: '1px solid rgba(0,212,184,0.12)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {!data || data.activeJobs.length === 0 ? (
              <div style={{
                padding: '40px 24px',
                textAlign: 'center',
                color: '#4d6b85',
                fontSize: 14,
              }}>
                אין עבודות פעילות כרגע
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(0,212,184,0.1)' }}>
                      {['שירות', 'לקוח', 'טכנאי', 'סטטוס', 'זמן'].map(h => (
                        <th key={h} style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#4d6b85',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.activeJobs.map((job, idx) => (
                      <tr key={job.id} style={{
                        background: idx % 2 === 0 ? 'rgba(13,26,46,0.5)' : 'transparent',
                        borderBottom: '1px solid rgba(0,212,184,0.05)',
                      }}>
                        <td style={{ padding: '13px 16px', fontSize: 13, color: '#e2e8f0' }}>
                          {SERVICE_LABELS[job.serviceType] ?? job.serviceType}
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, color: '#e2e8f0', maxWidth: 130 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                            {job.customer.name}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, color: job.technician ? '#e2e8f0' : '#4d6b85' }}>
                          {job.technician?.user.name ?? 'מחפש...'}
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <StatusBadge status={job.status} />
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 12, color: '#4d6b85', whiteSpace: 'nowrap' }}>
                          {timeAgo(job.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Recent completions */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: 16 }}>
            עבודות שהושלמו לאחרונה
          </h2>
          <div style={{
            background: 'rgba(13,26,46,0.9)',
            border: '1px solid rgba(0,212,184,0.12)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {!data || data.recentCompletions.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: '#4d6b85', fontSize: 14 }}>
                אין עבודות שהושלמו עדיין
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(0,212,184,0.1)' }}>
                      {['שירות', 'לקוח', 'טכנאי', 'מחיר', 'הושלם'].map(h => (
                        <th key={h} style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#4d6b85',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentCompletions.map((job, idx) => (
                      <tr key={job.id} style={{
                        background: idx % 2 === 0 ? 'rgba(13,26,46,0.5)' : 'transparent',
                        borderBottom: '1px solid rgba(0,212,184,0.05)',
                      }}>
                        <td style={{ padding: '13px 16px', fontSize: 13, color: '#e2e8f0' }}>
                          {SERVICE_LABELS[job.serviceType] ?? job.serviceType}
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, color: '#e2e8f0', maxWidth: 130 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                            {job.customer.name}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, color: '#e2e8f0' }}>
                          {job.technician?.user.name ?? '—'}
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, color: '#00d4b8', fontWeight: 600 }}>
                          {job.finalPrice != null ? `₪${job.finalPrice}` : '—'}
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 12, color: '#4d6b85', whiteSpace: 'nowrap' }}>
                          {job.completedAt ? timeAgo(job.completedAt) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Technician status */}
        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: 16 }}>
            סטטוס טכנאים
            {data && (
              <span style={{
                marginRight: 10,
                fontSize: 12,
                background: 'rgba(0,200,83,0.1)',
                color: '#00c853',
                border: '1px solid rgba(0,200,83,0.25)',
                borderRadius: 20,
                padding: '2px 10px',
                fontWeight: 600,
                verticalAlign: 'middle',
              }}>
                {data.technicians.filter(t => t.isAvailable).length} זמינים
              </span>
            )}
          </h2>
          <div style={{
            background: 'rgba(13,26,46,0.9)',
            border: '1px solid rgba(0,212,184,0.12)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {!data || data.technicians.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: '#4d6b85', fontSize: 14 }}>
                אין טכנאים מאושרים עדיין
              </div>
            ) : (
              <div>
                {data.technicians.map((tech, idx) => (
                  <div key={tech.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 20px',
                    background: idx % 2 === 0 ? 'rgba(13,26,46,0.5)' : 'transparent',
                    borderBottom: idx < data.technicians.length - 1 ? '1px solid rgba(0,212,184,0.05)' : 'none',
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00d4b8, #0088cc)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#080f1e',
                      flexShrink: 0,
                      position: 'relative',
                    }}>
                      {getInitials(tech.user.name)}
                      {/* Availability dot */}
                      <div style={{
                        position: 'absolute',
                        bottom: 1,
                        left: 1,
                        width: 11,
                        height: 11,
                        borderRadius: '50%',
                        border: '2px solid #080f1e',
                        background: tech.isAvailable ? '#00c853' : '#4d6b85',
                        boxShadow: tech.isAvailable ? '0 0 8px #00c853' : 'none',
                      }} />
                    </div>

                    {/* Name & specialty */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
                        {tech.user.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#4d6b85', marginTop: 1 }}>
                        {parseSpecialty(tech.specialty)}
                      </div>
                    </div>

                    {/* Availability label */}
                    <div style={{
                      fontSize: 12,
                      color: tech.isAvailable ? '#00c853' : '#4d6b85',
                      fontWeight: 600,
                      minWidth: 50,
                      textAlign: 'center',
                    }}>
                      {tech.isAvailable ? 'זמין' : 'לא זמין'}
                    </div>

                    {/* Rating & jobs */}
                    <div style={{ textAlign: 'left', direction: 'ltr', flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#ffa000' }}>
                        ★ {tech.rating.toFixed(1)}
                      </div>
                      <div style={{ fontSize: 11, color: '#4d6b85', marginTop: 1 }}>
                        {tech.totalJobs} עבודות
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
