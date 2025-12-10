export function Logo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cork board background */}
      <rect width="100" height="100" rx="8" fill="#DC5F24" />
      
      {/* Paper note */}
      <rect x="15" y="20" width="70" height="60" rx="4" fill="#FEF8F0" />
      
      {/* Pin at top */}
      <circle cx="50" cy="15" r="6" fill="#EF4444" />
      <circle cx="50" cy="15" r="4" fill="#DC2626" />
      
      {/* Text lines representing posts */}
      <line x1="25" y1="35" x2="75" y2="35" stroke="#B74920" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="45" x2="70" y2="45" stroke="#B74920" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="55" x2="75" y2="55" stroke="#B74920" strokeWidth="2" strokeLinecap="round" />
      
      {/* Connection dots (representing community) */}
      <circle cx="30" cy="68" r="3" fill="#DC5F24" />
      <circle cx="50" cy="68" r="3" fill="#DC5F24" />
      <circle cx="70" cy="68" r="3" fill="#DC5F24" />
      
      {/* Connection lines */}
      <line x1="33" y1="68" x2="47" y2="68" stroke="#DC5F24" strokeWidth="1.5" />
      <line x1="53" y1="68" x2="67" y2="68" stroke="#DC5F24" strokeWidth="1.5" />
    </svg>
  )
}
