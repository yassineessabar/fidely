export default function StatsCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        border: "1px solid rgb(228,227,223)",
        padding: "24px",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          fontWeight: 600,
          color: "rgb(97,95,109)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </p>
      <p
        className="font-display"
        style={{
          margin: "8px 0 0",
          fontSize: "28px",
          fontWeight: 700,
          color: "rgb(11,5,29)",
        }}
      >
        {value}
      </p>
      {subtitle && (
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "13px",
            color: "rgb(97,95,109)",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
