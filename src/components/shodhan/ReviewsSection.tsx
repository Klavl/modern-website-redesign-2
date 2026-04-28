import { useState } from "react";
import FadeIn from "./FadeIn";

const BASE = "https://cdn.poehali.dev/projects/756e28ae-f342-42b1-ab53-44233856dec1/bucket/rutube-thumbs";

const VIDEOS = [
  { url: "https://rutube.ru/video/d8a7ba60e26cfdbcc6e9eea93d9ad9c7/", thumb: `${BASE}/review_0.jpg` },
  { url: "https://rutube.ru/video/8f2484e0e5ca253e32cea2945db51372/", thumb: `${BASE}/review_1.jpg` },
  { url: "https://rutube.ru/video/3322e4227d230669225848181a330d49/", thumb: `${BASE}/review_2.jpg` },
  { url: "https://rutube.ru/video/e3029ca73a9f9f2097a29f970ab02840/", thumb: `${BASE}/review_3.jpg` },
  { url: "https://rutube.ru/video/1b8cb409c646c7a545c1dd1e29323805/", thumb: `${BASE}/review_4.jpg` },
  { url: "https://rutube.ru/video/db5095fa28cd19c42a34ba6be3466e1b/", thumb: `${BASE}/review_5.jpg` },
  { url: "https://rutube.ru/video/adbd840929c7a79a6321185f79c19192/", thumb: `${BASE}/review_6.jpg` },
  { url: "https://rutube.ru/video/c4846d76fde4e0149e8047d76e89b3a9/", thumb: `${BASE}/review_7.jpg` },
];

function getEmbedUrl(url: string) {
  const match = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)/);
  if (!match) return null;
  return `https://rutube.ru/play/embed/${match[1]}/`;
}

function VideoCard({ url, thumb, index }: { url: string; thumb: string; index: number }) {
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
          <div className="relative w-full h-full" onClick={() => setPlaying(true)}>
            <img
              src={thumb}
              alt={`Отзыв ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }} />
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
          {VIDEOS.map((v, i) => (
            <VideoCard key={i} url={v.url} thumb={v.thumb} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
