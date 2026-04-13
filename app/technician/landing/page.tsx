'use client'

import Link from 'next/link'
import Header from '@/components/Header'

export default function TechnicianLandingPage() {
  return (
    <main
      className="flex flex-col min-h-screen"
      dir="rtl"
      style={{ background: '#0a1628', maxWidth: 430, margin: '0 auto' }}
    >
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12 gap-8">
        {/* Icon block */}
        <div
          className="flex items-center justify-center rounded-3xl"
          style={{
            width: 120,
            height: 120,
            background: 'linear-gradient(145deg, rgba(0,212,184,0.2) 0%, rgba(0,158,138,0.1) 100%)',
            border: '2px solid rgba(0,212,184,0.4)',
            fontSize: 56,
          }}
        >
          👷
        </div>

        {/* Title & subtitle */}
        <div className="text-center">
          <h1 className="text-white font-black text-3xl mb-3 tracking-wide">
            TAKENI לטכנאים
          </h1>
          <p className="text-[#7a9dbf] text-base leading-relaxed">
            קבל עבודות חדשות באזור שלך, נהל סטטוס עבודה וראה את הארנק שלך — הכל במקום אחד.
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3 mt-2">
          <Link
            href="/technician/register"
            className="w-full py-4 rounded-2xl font-bold text-base text-center text-[#0a1628] transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #00d4b8 0%, #009e8a 100%)' }}
          >
            התחברות / הרשמה לטכנאים
          </Link>

          <Link
            href="/"
            className="w-full py-4 rounded-2xl font-bold text-base text-center transition-all active:scale-95"
            style={{
              background: 'transparent',
              border: '1.5px solid rgba(0,212,184,0.5)',
              color: '#00d4b8',
            }}
          >
            אני לקוח? עבור לאפליקציית לקוחות
          </Link>
        </div>
      </div>
    </main>
  )
}
