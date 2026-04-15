export default function AIPanel() {
  return (
    <svg viewBox="0 0 420 440" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Panel container */}
      <rect x="0" y="0" width="420" height="440" rx="20" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* Header */}
      <rect x="20" y="20" width="380" height="48" rx="0" fill="none" />
      <rect x="20" y="20" width="36" height="36" rx="10" fill="url(#aiGrad)" />
      <circle cx="38" cy="38" r="6" fill="none" stroke="white" strokeWidth="1.5" />
      <path d="M35 38 L38 33 L41 38 L38 43 Z" fill="white" opacity="0.8" />
      <text x="68" y="36" fontSize="14" fill="white" fontWeight="600" fontFamily="sans-serif">Kyro AI</text>
      <text x="68" y="50" fontSize="10" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">4 new recommendations</text>
      <circle cx="388" cy="38" r="4" fill="rgb(230,255,169)" />
      <line x1="20" y1="72" x2="400" y2="72" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* Card 1 - Traffic alert */}
      <rect x="20" y="86" width="380" height="76" rx="14" fill="rgba(230,255,169,0.08)" stroke="rgba(230,255,169,0.15)" strokeWidth="1" />
      <rect x="36" y="100" width="32" height="32" rx="8" fill="rgba(230,255,169,0.12)" />
      <path d="M46 110 L52 122 L58 110" stroke="rgb(230,255,169)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <text x="80" y="112" fontSize="12" fill="white" fontWeight="600" fontFamily="sans-serif">Low traffic predicted tomorrow</text>
      <text x="80" y="128" fontSize="10" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">Send a flash promo — traffic drops 23% on Tuesdays</text>
      <text x="80" y="146" fontSize="10" fill="rgb(170,137,242)" fontWeight="600" fontFamily="sans-serif">Send promo now →</text>

      {/* Card 2 - Inactive users */}
      <rect x="20" y="174" width="380" height="76" rx="14" fill="rgba(170,137,242,0.08)" stroke="rgba(170,137,242,0.15)" strokeWidth="1" />
      <rect x="36" y="188" width="32" height="32" rx="8" fill="rgba(170,137,242,0.12)" />
      <circle cx="48" cy="200" r="5" stroke="rgb(170,137,242)" strokeWidth="1.5" fill="none" />
      <circle cx="56" cy="200" r="5" stroke="rgb(170,137,242)" strokeWidth="1.5" fill="none" />
      <text x="80" y="200" fontSize="12" fill="white" fontWeight="600" fontFamily="sans-serif">12 customers haven't returned</text>
      <text x="80" y="216" fontSize="10" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">Visited 2+ times but absent for 10 days</text>
      <text x="80" y="234" fontSize="10" fill="rgb(170,137,242)" fontWeight="600" fontFamily="sans-serif">View customers →</text>

      {/* Card 3 - Reward */}
      <rect x="20" y="262" width="380" height="76" rx="14" fill="rgba(230,255,169,0.08)" stroke="rgba(230,255,169,0.15)" strokeWidth="1" />
      <rect x="36" y="276" width="32" height="32" rx="8" fill="rgba(230,255,169,0.12)" />
      <circle cx="52" cy="292" r="8" stroke="rgb(230,255,169)" strokeWidth="1.5" fill="none" />
      <path d="M48 292 L52 286 L56 292" stroke="rgb(230,255,169)" strokeWidth="1.5" fill="none" />
      <text x="80" y="288" fontSize="12" fill="white" fontWeight="600" fontFamily="sans-serif">Offer a reward today</text>
      <text x="80" y="304" fontSize="10" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">Top 15 customers are due — could drive 8+ visits</text>
      <text x="80" y="322" fontSize="10" fill="rgb(170,137,242)" fontWeight="600" fontFamily="sans-serif">Create reward →</text>

      {/* Card 4 - VIP */}
      <rect x="20" y="350" width="380" height="76" rx="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <rect x="36" y="364" width="32" height="32" rx="8" fill="rgba(255,255,255,0.06)" />
      <path d="M52 372 L54 378 L60 378 L55 382 L57 388 L52 384 L47 388 L49 382 L44 378 L50 378 Z" fill="rgba(255,255,255,0.5)" />
      <text x="80" y="376" fontSize="12" fill="white" fontWeight="600" fontFamily="sans-serif">VIP segment growing</text>
      <text x="80" y="392" fontSize="10" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">9 new VIP customers this month</text>
      <text x="80" y="410" fontSize="10" fill="rgb(170,137,242)" fontWeight="600" fontFamily="sans-serif">Set up perk →</text>

      <defs>
        <linearGradient id="aiGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6C47FF" />
          <stop offset="100%" stopColor="#AA89F2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
