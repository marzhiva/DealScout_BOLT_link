import React from 'react'

interface LogoProps {
  className?: string
  showWordmark?: boolean
}

export function Logo({ className = '', showWordmark = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-9 w-9 flex-shrink-0" />
      {showWordmark && (
        <span className="text-xl font-bold tracking-tight text-white">
          Deal<span className="text-emerald-500">Scout</span>
        </span>
      )}
    </div>
  )
}

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="DealScout logo"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="39" height="39" rx="9" fill="#0A192F" />
      <rect
        x="0.5"
        y="0.5"
        width="39"
        height="39"
        rx="9"
        stroke="#10B981"
        strokeOpacity="0.35"
      />
      <g
        stroke="#10B981"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.55"
      >
        <path d="M8 12V9.5A1.5 1.5 0 0 1 9.5 8H12" />
        <path d="M32 12V9.5A1.5 1.5 0 0 0 30.5 8H28" />
        <path d="M8 28v2.5A1.5 1.5 0 0 0 9.5 32H12" />
        <path d="M32 28v2.5A1.5 1.5 0 0 1 30.5 32H28" />
      </g>
      <g>
        <rect x="13" y="22" width="4" height="7" rx="1" fill="#3B5878" />
        <rect x="18.5" y="17" width="4" height="12" rx="1" fill="#64879F" />
        <rect x="24" y="12" width="4" height="17" rx="1" fill="#10B981" />
      </g>
      <path
        d="M13 21.5L18.5 17L24 18.5L29 12"
        stroke="#10B981"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="29" cy="12" r="1.8" fill="#10B981" />
    </svg>
  )
}
