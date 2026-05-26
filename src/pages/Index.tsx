import { useState, useEffect } from "react";
import { getPublicEvents, getPublicInstructors, type ShodhanEvent, type Instructor } from "@/lib/api";
import HeroSection from "@/components/shodhan/HeroSection";
import AboutSection from "@/components/shodhan/AboutSection";
import ReviewsSection from "@/components/shodhan/ReviewsSection";
import FaqSection from "@/components/shodhan/FaqSection";
import EventsSection from "@/components/shodhan/EventsSection";

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [events, setEvents] = useState<ShodhanEvent[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    getPublicEvents().then(setEvents).catch(() => {});
    getPublicInstructors().then(list => {
      const top10 = [...list]
        .sort((a, b) => (b.experience_years ?? 0) - (a.experience_years ?? 0))
        .slice(0, 10);
      setInstructors(top10);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Montserrat', sans-serif", background: "#0a0e1a" }}>
      <HeroSection scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <AboutSection instructors={instructors} />
      <ReviewsSection />
      <FaqSection />
      <EventsSection events={events} />
    </div>
  );
}