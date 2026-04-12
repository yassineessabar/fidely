export default function PhoneMockup({ variant = "wallet" }: { variant?: "wallet" | "notification" | "scan" }) {
  return (
    <svg viewBox="0 0 280 560" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", maxWidth: "280px" }}>
      {/* Phone body */}
      <rect x="0" y="0" width="280" height="560" rx="40" fill="#1a1a2e" />
      <rect x="4" y="4" width="272" height="552" rx="36" fill="url(#screenGrad)" />

      {/* Dynamic island */}
      <rect x="100" y="12" width="80" height="24" rx="12" fill="#1a1a2e" />

      {/* Status bar */}
      <text x="24" y="30" fontSize="11" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif" fontWeight="500">9:41</text>
      <text x="236" y="30" fontSize="11" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif" fontWeight="500" textAnchor="end">100%</text>

      {variant === "wallet" && (
        <>
          {/* Wallet card container */}
          <rect x="20" y="56" width="240" height="320" rx="20" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {/* Logo + brand */}
          <rect x="36" y="76" width="36" height="36" rx="10" fill="white" />
          <text x="46" y="100" fontSize="16" fill="#6C47FF" fontWeight="800" fontFamily="sans-serif">f</text>
          <text x="84" y="91" fontSize="14" fill="white" fontWeight="600" fontFamily="sans-serif">Fidely Card</text>
          <text x="84" y="106" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif">Café Bloom</text>

          {/* Points section */}
          <rect x="36" y="128" width="208" height="100" rx="14" fill="rgba(255,255,255,0.08)" />
          <text x="52" y="150" fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif" letterSpacing="1">POINTS BALANCE</text>
          <text x="52" y="186" fontSize="36" fill="white" fontWeight="700" fontFamily="sans-serif">247</text>
          {/* Progress bar */}
          <rect x="52" y="198" width="176" height="5" rx="2.5" fill="rgba(255,255,255,0.15)" />
          <rect x="52" y="198" width="115" height="5" rx="2.5" fill="white" />
          <text x="52" y="218" fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">53 more to your reward</text>

          {/* Stats grid */}
          <rect x="36" y="244" width="64" height="52" rx="10" fill="rgba(255,255,255,0.08)" />
          <text x="68" y="266" fontSize="16" fill="white" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">12</text>
          <text x="68" y="282" fontSize="8" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif" textAnchor="middle">Visits</text>

          <rect x="108" y="244" width="64" height="52" rx="10" fill="rgba(255,255,255,0.08)" />
          <text x="140" y="266" fontSize="16" fill="white" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">3</text>
          <text x="140" y="282" fontSize="8" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif" textAnchor="middle">Rewards</text>

          <rect x="180" y="244" width="64" height="52" rx="10" fill="rgba(255,255,255,0.08)" />
          <text x="212" y="266" fontSize="14" fill="white" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">Gold</text>
          <text x="212" y="282" fontSize="8" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif" textAnchor="middle">Tier</text>

          {/* Notification card */}
          <rect x="20" y="394" width="240" height="68" rx="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <rect x="36" y="410" width="28" height="28" rx="7" fill="rgba(255,255,255,0.15)" />
          <text x="44" y="430" fontSize="14">🎁</text>
          <text x="76" y="424" fontSize="10" fill="white" fontWeight="600" fontFamily="sans-serif">Café Bloom</text>
          <text x="76" y="440" fontSize="10" fill="rgba(255,255,255,0.6)" fontFamily="sans-serif">Your free coffee is ready!</text>

          {/* Apple Wallet badge */}
          <rect x="36" y="480" width="208" height="40" rx="10" fill="rgba(0,0,0,0.25)" />
          <text x="140" y="505" fontSize="11" fill="white" fontWeight="500" fontFamily="sans-serif" textAnchor="middle">Add to Apple Wallet</text>
        </>
      )}

      {variant === "notification" && (
        <>
          {/* Lock screen style */}
          <text x="140" y="100" fontSize="48" fill="white" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">9:41</text>
          <text x="140" y="124" fontSize="14" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif" textAnchor="middle">Tuesday, March 25</text>

          {/* Notification 1 */}
          <rect x="16" y="180" width="248" height="76" rx="18" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <rect x="32" y="196" width="28" height="28" rx="8" fill="url(#brandGrad)" />
          <text x="40" y="215" fontSize="11" fill="white" fontWeight="700" fontFamily="sans-serif">f</text>
          <text x="72" y="206" fontSize="11" fill="white" fontWeight="600" fontFamily="sans-serif">Café Bloom</text>
          <text x="228" y="206" fontSize="8" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">now</text>
          <text x="72" y="222" fontSize="10" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">Your free coffee is waiting! ☕</text>
          <text x="72" y="240" fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">Tap to view your reward</text>

          {/* Notification 2 */}
          <rect x="16" y="272" width="248" height="76" rx="18" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <rect x="32" y="288" width="28" height="28" rx="8" fill="url(#brandGrad)" />
          <text x="40" y="307" fontSize="11" fill="white" fontWeight="700" fontFamily="sans-serif">f</text>
          <text x="72" y="298" fontSize="11" fill="white" fontWeight="600" fontFamily="sans-serif">Café Bloom</text>
          <text x="228" y="298" fontSize="8" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">2h</text>
          <text x="72" y="314" fontSize="10" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">Double points this weekend! 🎉</text>
          <text x="72" y="332" fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">Visit us before Sunday</text>

          {/* Notification 3 */}
          <rect x="16" y="364" width="248" height="68" rx="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <rect x="32" y="378" width="28" height="28" rx="8" fill="url(#brandGrad)" />
          <text x="40" y="397" fontSize="11" fill="white" fontWeight="700" fontFamily="sans-serif">f</text>
          <text x="72" y="390" fontSize="11" fill="white" fontWeight="600" fontFamily="sans-serif">Café Bloom</text>
          <text x="228" y="390" fontSize="8" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">1d</text>
          <text x="72" y="406" fontSize="10" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">You earned 20 points today 🌟</text>

          {/* Bottom bar */}
          <rect x="88" y="528" width="104" height="5" rx="2.5" fill="rgba(255,255,255,0.3)" />
        </>
      )}

      {variant === "scan" && (
        <>
          {/* Camera viewfinder */}
          <rect x="16" y="48" width="248" height="300" rx="20" fill="rgba(0,0,0,0.3)" />

          {/* QR frame corners */}
          <path d="M56 108 H56 V78 H86" stroke="rgb(230,255,169)" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M194 78 H224 V108" stroke="rgb(230,255,169)" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M224 248 V278 H194" stroke="rgb(230,255,169)" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M86 278 H56 V248" stroke="rgb(230,255,169)" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* QR code (abstract representation) */}
          <rect x="90" y="112" width="100" height="100" rx="8" fill="white" />
          <g transform="translate(100, 122)">
            {[0,1,2,3,4,5,6,7].map((row) =>
              [0,1,2,3,4,5,6,7].map((col) => {
                const filled = (row + col) % 3 === 0 || (row < 3 && col < 3) || (row < 3 && col > 4) || (row > 4 && col < 3);
                return filled ? <rect key={`${row}-${col}`} x={col * 10} y={row * 10} width="8" height="8" rx="1.5" fill="#0B051D" /> : null;
              })
            )}
          </g>

          {/* Scan line animation hint */}
          <rect x="60" y="178" width="160" height="2" rx="1" fill="rgb(230,255,169)" opacity="0.8" />

          {/* Instructions */}
          <text x="140" y="320" fontSize="14" fill="white" fontWeight="600" fontFamily="sans-serif" textAnchor="middle">Scan QR code</text>
          <text x="140" y="340" fontSize="11" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif" textAnchor="middle">Point your camera at the code</text>

          {/* Bottom card preview */}
          <rect x="20" y="370" width="240" height="120" rx="18" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <rect x="36" y="386" width="32" height="32" rx="8" fill="white" />
          <text x="45" y="407" fontSize="14" fill="#6C47FF" fontWeight="800" fontFamily="sans-serif">f</text>
          <text x="80" y="398" fontSize="12" fill="white" fontWeight="600" fontFamily="sans-serif">Café Bloom</text>
          <text x="80" y="414" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif">Add to your wallet</text>

          <rect x="36" y="436" width="208" height="38" rx="10" fill="white" />
          <text x="140" y="460" fontSize="12" fill="#0B051D" fontWeight="600" fontFamily="sans-serif" textAnchor="middle">Add to Apple Wallet</text>

          <rect x="88" y="528" width="104" height="5" rx="2.5" fill="rgba(255,255,255,0.3)" />
        </>
      )}

      <defs>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="280" y2="560" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6C47FF" />
          <stop offset="40%" stopColor="#8B6FFF" />
          <stop offset="100%" stopColor="#AA89F2" />
        </linearGradient>
        <linearGradient id="brandGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6C47FF" />
          <stop offset="100%" stopColor="#AA89F2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
