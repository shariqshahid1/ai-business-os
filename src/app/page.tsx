import { LandingNavbar } from "@/components/site/landing-navbar";
import {
  Hero,
  Features,
  AISection,
  Pricing,
  Testimonials,
  FAQ,
  CTA,
  Footer,
} from "@/components/site/landing";
import { TrustedBy, Stats, Newsletter } from "@/components/site/landing-extra";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <Hero />
      <TrustedBy />
      <Features />
      <AISection />
      <Stats />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <CTA />
      <Footer />
    </main>
  );
}
