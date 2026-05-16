import React from 'react'
import { LogOut } from 'lucide-react'


function Navbar({ user, onLogout }) {

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <header
      className="fixed top-0 inset-x-0 z-50"
      style={{
        background: 'rgba(11,15,26,0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(96,165,250,0.07)',
      }}
    >
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">

        {/* Left — brand */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}
          >
            {/* Mini drone SVG */}
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" fill="white" />
              <path d="M4 4 Q10 1 10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M16 4 Q10 1 10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M4 16 Q10 19 10 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M16 16 Q10 19 10 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">Drone Biomass</span>
        </div>

        {/* Right — user info + logout */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#1e40af)' }}
          >
            {initials}
          </div>

          {/* Name — hidden on very small screens */}
          <span className="hidden sm:block text-sm text-slate-300 font-medium">
            {user.name}
          </span>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-500/10"
            title="Logout"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar