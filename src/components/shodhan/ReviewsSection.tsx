import { useState, useEffect } from "react";
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
  const [thumb, setThumb] = useState<string | null>(null);
  const embedUrl = getEmbedUrl(url);

  useEffect(() => {
    fetch(`https://rutube.ru/api/oembed/?url=${encodeURIComponent(url)}&format=json`)
      .then(r => r.json())
      .then(d => { if (d.thumbnail_url) setThumb(d.thumbnail_url); })
      .catch(() => {});
  }, [url]);

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
          <div className="relative w-full h-full" onClick={() => setPlaying(true)}>
            {/* Обложка */}
            {thumb ? (
              <img
                src={thumb}
                alt={`Отзыв ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full"
                style={{ background: "linear-gradient(160deg, rgba(20,35,25,0.9) 0%, rgba(8,15,25,0.95) 100%)" }} />
            )}
            {/* Затемнение */}
            <div className="absolute inset-0 transition-opacity duration-300"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.1) 100%)" }} />
            {/* Кнопка play */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  width: 60, height: 60,
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  border: "2px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 0 30px rgba(92,184,110,0.35)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 3 }}>
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
            </div>
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
