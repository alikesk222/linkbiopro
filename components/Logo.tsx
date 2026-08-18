interface LogoProps {
  className?: string
  iconSize?: number
  showText?: boolean
  dark?: boolean
}

export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="9" fill="#17171C" />
      <path
        d="M9 16a4 4 0 0 1 4-4h2v2.5h-2a1.5 1.5 0 0 0 0 3h2V20h-2a4 4 0 0 1-4-4z"
        fill="#F0641E"
      />
      <path
        d="M23 16a4 4 0 0 1-4 4h-2v-2.5h2a1.5 1.5 0 0 0 0-3h-2V12h2a4 4 0 0 1 4 4z"
        fill="white"
      />
      <rect x="14.5" y="12" width="3" height="8" rx="1.5" fill="#F0641E" />
    </svg>
  )
}

export function Logo({ dark = false, showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoIcon size={32} />
      {showText && (
        <span className={`font-display font-bold text-lg tracking-tight ${dark ? 'text-white' : 'text-ink'}`}>
          LinkBio<span className="text-brand-500">.Pro</span>
        </span>
      )}
    </div>
  )
}
