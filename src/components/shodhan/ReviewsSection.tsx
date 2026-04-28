import { useState } from "react";
import FadeIn from "./FadeIn";

const VIDEOS = [
  "https://rutube.ru/video/d8a7ba60e26cfdbcc6e9eea93d9ad9c7/",
  "https://rutube.ru/video/8f2484e0e5ca253e32cea2945db51372/",
  "https://rutube.ru/video/3322e4227d230669225848181a330d49/",
  "https://rutube.ru/video/e3029ca73a9f9f2097a29f970ab02840/",
  "https://rutube.ru/video/1b8cb409c646c7a545c1dd1e29323805/",
  "https://rutube.ru/video/db5095fa28cd19c42a34ba6be3466e1b/",
  "https://rutube.ru/video/adbd840929c7a79a6321185f79c19192/",
  "https://rutube.ru/video/c4846d76fde4e0149e8047d76e89b3a9/",
];

function getEmbedUrl(url: string) {
  const match = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)/);
  if (!match) return null;
  return `https://rutube.ru/play/embed/${match[1]}/`;
}

function VideoCard({ url, index }: { url: string; index: number }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getEmbedUrl(url);

  return (
    <FadeIn delay={(index % 4) * 0.08}>
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer group"
        style={{
          aspectRatio: "9/16",
          background: "#0d1520",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        {playing && embedUrl ? (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            title={`Отзыв ${index + 1}`}
            allow="clipboard-write; autoplay"
            allowFullScreen
            className="w-full h-full"
            style={{ border: "none", display: "block" }}
          />
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center"
            onClick={() => setPlaying(true)}>
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(160deg, rgba(20,35,25,0.9) 0%, rgba(8,15,25,0.95) 100%)" }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
              <div
                className="rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  width: 64, height: 64,
                  background: "linear-gradient(135deg,#3a8f4a,#5cb86e)",
                  boxShadow: "0 0 30px rgba(92,184,110,0.4)",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 3 }}>
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
              <div className="text-center px-4">
                <p className="text-xs font-semibold uppercase tracking-widest"
                  style={{ fontFamily: "'Oswald',sans-serif", color: "rgba(255,255,255,0.5)" }}>
                  Отзыв #{index + 1}
                </p>
              </div>
            </div>
            {/* Зелёный акцент */}
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full"
              style={{ background: "#5cb86e", boxShadow: "0 0 8px rgba(92,184,110,0.8)" }} />
          </div>
        )}
      </div>
    </FadeIn>
  );
}

export default function ReviewsSection() {
  return (
    <section id="reviews" className="py-24 px-5"
      style={{ background: "linear-gradient(180deg,#0a1a0f,#081218)" }}>
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-14">
          <h2 className="font-display mb-4"
            style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            ОТЗЫВЫ
          </h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Что говорят люди после практики
          </p>
          <div className="w-20 h-1 mx-auto rounded-full mt-4" style={{ background: "linear-gradient(90deg,#3a8f4a,#5cb86e)" }} />
        </FadeIn>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {VIDEOS.map((url, i) => (
            <VideoCard key={i} url={url} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
