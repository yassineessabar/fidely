export default function FidelyLogo({
  color = "rgb(11,5,29)",
  height = 24,
}: {
  color?: string;
  height?: number;
}) {
  const iconSize = Math.max(18, height * 0.85);
  const gap = Math.max(4, height * 0.12);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: `${gap}px`,
      }}
    >
      {/* Brand mark — stylized "f" with growth curve */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Fidely"
      >
        {/* Rounded square background */}
        <rect width="40" height="40" rx="10" fill={color} />
        {/* Stylized "f" stem */}
        <rect x="13" y="17" width="5.5" height="15" rx="2.75" fill="rgb(230,255,169)" />
        {/* "f" crossbar */}
        <rect x="10" y="17" width="14" height="5" rx="2.5" fill="rgb(230,255,169)" />
        {/* "f" top curve — ascending hook */}
        <path
          d="M15.75 17C15.75 12 18.5 8.5 23.5 8.5C25 8.5 26.5 9 27.5 9.8"
          stroke="rgb(230,255,169)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Wordmark */}
      <span
        className="font-display"
        style={{
          fontSize: `${height}px`,
          fontWeight: 700,
          color,
          lineHeight: 1,
          letterSpacing: "-0.5px",
          display: "block",
        }}
      >
        fidely
      </span>
    </div>
  );
}
