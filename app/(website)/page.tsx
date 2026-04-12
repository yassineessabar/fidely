import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Logos from "../components/Logos";
import Calculator from "../components/Calculator";
import DashboardPreview from "../components/DashboardPreview";
import FidelyAI from "../sections/FidelyAI";
import CTA from "../components/CTA";
import FAQ from "../components/FAQ";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Logos />
      <Calculator />
      <DashboardPreview />
      <FidelyAI />
      <CTA />
      <FAQ />
    </main>
  );
}
