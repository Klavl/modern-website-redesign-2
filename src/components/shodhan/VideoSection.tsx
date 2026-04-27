import { useState } from "react";
import FadeIn from "./FadeIn";
import Icon from "@/components/ui/icon";

const COVER = "https://cdn.poehali.dev/projects/756e28ae-f342-42b1-ab53-44233856dec1/bucket/f20895ca-6d45-426c-acf2-a17a0dffda27.png";
const EMBED = "https://rutube.ru/play/embed/ff6fb89cc23dfdd417528a5a76f2b029/";

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-20 px-5" style={{ background: "linear-gradient(180deg,#0a0e1a,#0a1a0f)" }}>
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-10">
          <h2 className="uppercase mb-3"
            style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 700, color: "#fff", letterSpacing: "0.08em" }}>
            ЧТО ТАКОЕ ШОДХАН
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ background: "linear-gradient(90deg,#3a8f4a,#5cb86e)" }} />
        </FadeIn>

        <FadeIn>
          <div className="relative rounded-2xl overflow-hidden"
            style={{
              aspectRatio: "16/9",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}>
            {playing ? (
              <iframe
                src={`${EMBED}?autoplay=1`}
                title="Что такое Шодхан"
                allow="clipboard-write; autoplay"
                allowFullScreen
                className="w-full h-full"
                style={{ border: "none", display: "block" }}
              />
            ) : (
              <div className="relative w-full h-full cursor-pointer group" onClick={() => setPlaying(true)}>
                <img
                  src={COVER}
                  alt="Что такое Шодхан"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(8px)",
                      border: "2px solid rgba(255,255,255,0.4)",
                      boxShadow: "0 0 40px rgba(92,184,110,0.3)",
                    }}>
                    <Icon name="Play" size={32} style={{ color: "#fff", marginLeft: 4 }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
