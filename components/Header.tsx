'use client'

import { useRouter, usePathname } from 'next/navigation'

interface HeaderProps {
  showTabs?: boolean
}

export default function Header({ showTabs = true }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isCustomer = pathname?.startsWith('/customer') || pathname === '/' || pathname === '/auth'
  const isTechnician = pathname?.startsWith('/technician')

  const handleCustomerClick = () => {
    router.push('/')
  }

  const handleTechnicianClick = () => {
    router.push('/auth?role=technician')
  }

  return (
    <header className="w-full px-4 py-3 flex items-center justify-between" style={{ maxWidth: 430, margin: '0 auto' }}>
      {/* Right side: Tab buttons */}
      {showTabs ? (
        <div className="flex items-center gap-1 bg-bg-card rounded-xl p-1 border border-[rgba(0,212,184,0.15)]">
          <button
            onClick={handleCustomerClick}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              !isTechnician
                ? 'bg-accent text-bg-dark'
                : 'text-text-muted hover:text-white'
            }`}
          >
            לקוח
          </button>
          <button
            onClick={handleTechnicianClick}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isTechnician
                ? 'bg-accent text-bg-dark'
                : 'text-text-muted hover:text-white'
            }`}
          >
            טכנאי
          </button>
        </div>
      ) : (
        <div />
      )}

      {/* Center: Logo */}
      <div className="flex flex-col items-center">
        <span className="text-xl font-black tracking-wider text-white">TAKENI</span>
        <span className="text-[10px] text-text-muted -mt-0.5">טכנאי עכשיו, מכל סוג</span>
      </div>

      {/* Left side: Bell icon */}
      <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-bg-card border border-[rgba(0,212,184,0.15)] hover:border-accent transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a9dbf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>
    </header>
  )
}
