export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white", fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      {children}
    </div>
  );
}
