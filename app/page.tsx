import Link from 'next/link'
import Header from '@/components/Header'

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-bg-dark" style={{ maxWidth: 430, margin: '0 auto' }}>
      <Header />

      {/* Hero section with teal glow */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10 relative overflow-hidden">
        {/* Background glow effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(0,212,184,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Icon circle */}
        <div className="relative mb-10 mt-6">
          <div
            className="w-52 h-52 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, #00d4b8 0%, #009e8a 60%, #006e62 100%)',
              boxShadow: '0 0 60px rgba(0,212,184,0.4), 0 0 120px rgba(0,212,184,0.2)',
            }}
          >
            {/* Scooter/technician SVG icon */}
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              {/* Body */}
              <ellipse cx="50" cy="72" rx="28" ry="8" fill="rgba(0,80,70,0.5)" />
              {/* Scooter body */}
              <rect x="22" y="52" width="56" height="20" rx="10" fill="#003d36" />
              <rect x="28" y="46" width="44" height="20" rx="8" fill="#004d44" />
              {/* Handle */}
              <rect x="62" y="38" width="12" height="24" rx="6" fill="#003d36" />
              <rect x="58" y="36" width="20" height="8" rx="4" fill="#003d36" />
              {/* Wheels */}
              <circle cx="30" cy="72" r="10" fill="#003d36" stroke="#00d4b8" strokeWidth="2" />
              <circle cx="30" cy="72" r="5" fill="#002a25" />
              <circle cx="70" cy="72" r="10" fill="#003d36" stroke="#00d4b8" strokeWidth="2" />
              <circle cx="70" cy="72" r="5" fill="#002a25" />
              {/* Person */}
              <circle cx="52" cy="35" r="10" fill="#004d44" />
              <rect x="44" y="44" width="16" height="14" rx="4" fill="#004d44" />
              {/* Helmet shine */}
              <circle cx="49" cy="31" r="3" fill="rgba(255,255,255,0.3)" />
            </svg>
          </div>
        </div>

        {/* Main text */}
        <h1 className="text-4xl font-black text-white text-center leading-tight mb-4">
          טכנאי בדרך אליך,{' '}
          <span style={{ color: '#00d4b8' }}>עכשיו.</span>
        </h1>

        <p className="text-center text-text-muted text-sm leading-relaxed mb-10 px-2">
          בחר סוג תקלה, קבל הערכת מחיר וזמן הגעה — וטכנאי מאושר יגיע עד אליך, מהר ובטחה.
        </p>

        {/* CTA Buttons */}
        <div className="w-full flex flex-col gap-3">
          <Link
            href="/auth"
            className="w-full py-4 rounded-2xl text-center font-bold text-lg text-bg-dark transition-all duration-200 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #00d4b8 0%, #009e8a 100%)' }}
          >
            התחברות / הרשמה
          </Link>

          <Link
            href="/auth?role=technician"
            className="w-full py-4 rounded-2xl text-center font-semibold text-sm border-2 transition-all duration-200 active:scale-95"
            style={{ borderColor: 'rgba(0,212,184,0.4)', color: '#00d4b8', background: 'rgba(0,212,184,0.05)' }}
          >
            אני טכנאי — עבור לאפליקציית טכנאים
          </Link>
        </div>
      </div>
    </main>
  )
}
