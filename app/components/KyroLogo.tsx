export default function KyroLogo({
  color = "rgb(11,5,29)",
  height = 24,
}: {
  color?: string;
  height?: number;
}) {
  return (
    <span
      className="font-display"
      style={{
        fontSize: `${height}px`,
        fontWeight: 700,
        color,
        lineHeight: 1,
        letterSpacing: "-0.02em",
        display: "block",
      }}
    >
      Kyro
    </span>
  );
}
