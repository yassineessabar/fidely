import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh" }}>{children}</div>
      <Footer />
    </>
  );
}
