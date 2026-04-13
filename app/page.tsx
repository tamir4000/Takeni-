import Link from 'next/link'
import Header from '@/components/Header'

export default function LandingPage() {
  return (
    <main
      className="flex flex-col min-h-screen"
      style={{ background: '#080f1e', maxWidth: 430, margin: '0 auto', position: 'relative', overflow: 'hidden' }}
    >
      <Header />

      {/* Animated background layers */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,184,0.13) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '-20%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,153,255,0.09) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '-15%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,184,0.07) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute',
          top: '25%',
          right: '-10%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,136,204,0.08) 0%, transparent 70%)',
        }} />
      </div>

      <div
        className="flex-1 flex flex-col items-center justify-center px-6 pb-10"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Floating illustration */}
        <div className="float-anim" style={{ marginBottom: 20, marginTop: 8 }}>
          <div
            style={{
              width: 210,
              height: 210,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 35%, #00e5cc 0%, #00a896 45%, #006e62 100%)',
              boxShadow: '0 0 80px rgba(0,212,184,0.5), 0 0 150px rgba(0,212,184,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
              {/* Shadow */}
              <ellipse cx="50" cy="76" rx="26" ry="6" fill="rgba(0,60,52,0.5)" />
              {/* Scooter body base */}
              <rect x="20" y="54" width="58" height="18" rx="9" fill="#003d36" />
              <rect x="26" y="47" width="46" height="20" rx="8" fill="#004d44" />
              {/* Scooter accent stripe */}
              <rect x="26" y="53" width="46" height="3" rx="1.5" fill="rgba(0,212,184,0.4)" />
              {/* Handle */}
              <rect x="60" y="38" width="10" height="22" rx="5" fill="#003d36" />
              <rect x="56" y="36" width="18" height="7" rx="3.5" fill="#003d36" />
              {/* Handle grip */}
              <rect x="56" y="36" width="5" height="7" rx="2.5" fill="rgba(0,212,184,0.5)" />
              {/* Wheels */}
              <circle cx="30" cy="72" r="10" fill="#003d36" stroke="#00d4b8" strokeWidth="2.5" />
              <circle cx="30" cy="72" r="5" fill="#001f1c" />
              <circle cx="30" cy="72" r="2" fill="rgba(0,212,184,0.4)" />
              <circle cx="70" cy="72" r="10" fill="#003d36" stroke="#00d4b8" strokeWidth="2.5" />
              <circle cx="70" cy="72" r="5" fill="#001f1c" />
              <circle cx="70" cy="72" r="2" fill="rgba(0,212,184,0.4)" />
              {/* Rider helmet */}
              <circle cx="50" cy="34" r="11" fill="#004d44" />
              <circle cx="50" cy="34" r="11" fill="none" stroke="rgba(0,212,184,0.3)" strokeWidth="1.5" />
              {/* Helmet visor */}
              <path d="M42 36 Q50 42 58 36" fill="rgba(0,212,184,0.25)" />
              {/* Helmet shine */}
              <circle cx="46" cy="30" r="3.5" fill="rgba(255,255,255,0.25)" />
              {/* Body */}
              <rect x="42" y="44" width="16" height="14" rx="4" fill="#004d44" />
              {/* Backpack */}
              <rect x="52" y="43" width="10" height="14" rx="3" fill="#003a34" />
            </svg>
          </div>
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(13,26,46,0.85)',
            border: '1px solid rgba(0,212,184,0.14)',
            borderRadius: 40,
            padding: '8px 20px',
            marginBottom: 26,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 14px' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#00d4b8' }}>500+</span>
            <span style={{ fontSize: 10, color: '#4d6b85' }}>טכנאים</span>
          </div>
          <div style={{ width: 1, height: 28, background: 'rgba(0,212,184,0.12)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 14px' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#00d4b8' }}>4.9★</span>
            <span style={{ fontSize: 10, color: '#4d6b85' }}>ממוצע</span>
          </div>
          <div style={{ width: 1, height: 28, background: 'rgba(0,212,184,0.12)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 14px' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#00d4b8' }}>20 דק׳</span>
            <span style={{ fontSize: 10, color: '#4d6b85' }}>הגעה</span>
          </div>
        </div>

        {/* Main heading */}
        <h1
          style={{
            fontSize: 40,
            fontWeight: 900,
            textAlign: 'center',
            lineHeight: 1.15,
            marginBottom: 12,
            color: '#ffffff',
          }}
        >
          טכנאי בדרך אליך,
          <br />
          <span className="gradient-text">עכשיו.</span>
        </h1>

        <p
          style={{
            textAlign: 'center',
            color: '#8ba3be',
            fontSize: 14,
            lineHeight: 1.7,
            marginBottom: 32,
            maxWidth: 300,
          }}
        >
          בחר סוג תקלה, קבל הערכת מחיר וזמן הגעה — וטכנאי מאושר יגיע עד אליך, מהר ובטחה.
        </p>

        {/* CTA Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link
            href="/auth"
            style={{
              display: 'block',
              width: '100%',
              padding: '15px 24px',
              borderRadius: 14,
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 16,
              color: '#080f1e',
              background: 'linear-gradient(135deg, #00d4b8 0%, #0088cc 100%)',
              boxShadow: '0 6px 28px rgba(0,212,184,0.4)',
              transition: 'all 0.2s',
              textDecoration: 'none',
            }}
          >
            התחברות / הרשמה
          </Link>

          <Link
            href="/auth?role=technician"
            style={{
              display: 'block',
              width: '100%',
              padding: '14px 24px',
              borderRadius: 14,
              textAlign: 'center',
              fontWeight: 600,
              fontSize: 14,
              color: '#00d4b8',
              background: 'rgba(0,212,184,0.06)',
              border: '1.5px solid rgba(0,212,184,0.3)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
              textDecoration: 'none',
            }}
          >
            אני טכנאי — עבור לאפליקציית טכנאים
          </Link>
        </div>

        {/* Trust badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            marginTop: 28,
          }}
        >
          {['✓ מאושר', '✓ מבוטח', '✓ 24/7'].map(badge => (
            <span
              key={badge}
              style={{
                fontSize: 12,
                color: '#4d6b85',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}
