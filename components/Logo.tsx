interface LogoProps {
  className?: string
  iconSize?: number
  showText?: boolean
  dark?: boolean
}

export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#6366F1" />
      {/* Chain link: left ring */}
      <path
        d="M9 16a4 4 0 0 1 4-4h2v2.5h-2a1.5 1.5 0 0 0 0 3h2V20h-2a4 4 0 0 1-4-4z"
        fill="white"
      />
      {/* Chain link: right ring */}
      <path
        d="M23 16a4 4 0 0 1-4 4h-2v-2.5h2a1.5 1.5 0 0 0 0-3h-2V12h2a4 4 0 0 1 4 4z"
        fill="white"
      />
      {/* Connector bar */}
      <rect x="14.5" y="12" width="3" height="8" rx="1.5" fill="white" />
    </svg>
  )
}

export function Logo({ dark = false, showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoIcon size={32} />
      {showText && (
        <span className={`font-bold text-lg tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
          LinkBio<span className="text-indigo-600">.Pro</span>
        </span>
      )}
    </div>
  )
}
