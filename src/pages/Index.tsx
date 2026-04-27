import { useState, useEffect } from "react";
import { getPublicEvents, type ShodhanEvent } from "@/lib/api";
import HeroSection from "@/components/shodhan/HeroSection";
import AboutSection from "@/components/shodhan/AboutSection";
import WhySection from "@/components/shodhan/WhySection";
import EventsSection from "@/components/shodhan/EventsSection";

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [events, setEvents] = useState<ShodhanEvent[]>([]);

  useEffect(() => {
    getPublicEvents().then(setEvents).catch(() => {});
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Montserrat', sans-serif", background: "#0a0e1a" }}>
      <HeroSection scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <AboutSection />
      <WhySection />
      <EventsSection events={events} />
    </div>
  );
}