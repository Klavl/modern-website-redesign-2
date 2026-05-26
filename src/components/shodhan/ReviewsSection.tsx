import { useState, useRef, useEffect } from "react";

const BASE = "https://cdn.poehali.dev/projects/756e28ae-f342-42b1-ab53-44233856dec1/bucket/review-thumbs";

const VIDEOS = [
  { url: "https://rutube.ru/video/d8a7ba60e26cfdbcc6e9eea93d9ad9c7/", thumb: "https://cdn.poehali.dev/files/be81bf2f-786d-4213-bf96-0d4bd69fca2d.png" },
  { url: "https://rutube.ru/video/8f2484e0e5ca253e32cea2945db51372/", thumb: "https://cdn.poehali.dev/files/502b918d-b9b8-4a4a-9bf1-d2b55e19ab56.png" },
  { url: "https://rutube.ru/video/3322e4227d230669225848181a330d49/", thumb: "https://cdn.poehali.dev/files/4b3d69d0-3fe6-43d7-91cc-3899627ba69f.png" },
  { url: "https://rutube.ru/video/e3029ca73a9f9f2097a29f970ab02840/", thumb: "https://cdn.poehali.dev/files/fbf9416d-15fa-445c-a8f3-891541efcbe3.png" },
  { url: "https://rutube.ru/video/1b8cb409c646c7a545c1dd1e29323805/", thumb: "https://cdn.poehali.dev/files/c91c1995-3d98-4b44-8b87-261d3324f0bb.png" },
  { url: "https://rutube.ru/video/db5095fa28cd19c42a34ba6be3466e1b/", thumb: "https://cdn.poehali.dev/files/e3025405-1d6d-473a-9876-1f081ac07ed6.png" },
  { url: "https://rutube.ru/video/adbd840929c7a79a6321185f79c19192/", thumb: "https://cdn.poehali.dev/files/e988c1ba-ff18-4d30-a981-1371a234b499.png" },
  { url: "https://rutube.ru/video/c4846d76fde4e0149e8047d76e89b3a9/", thumb: "https://cdn.poehali.dev/files/f7cf5a93-c303-44c7-83c7-e6a9a1690eb3.png" },
];

function getEmbedUrl(url: string) {
  const match = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)/);
  if (!match) return null;
  return `https://rutube.ru/play/embed/${match[1]}/`;
}

function VideoCard({ url, thumb, index }: { url: string; thumb: string; index: number }) {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const embedUrl = getEmbedUrl(url);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        aspectRatio: "9/16",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        background: "#0d1520",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${(index % 4) * 0.08}s, transform 0.6s ease ${(index % 4) * 0.08}s`,
      }}
    >
      {playing && embedUrl ? (
        <iframe
          src={`${embedUrl}?autoplay=1`}
          title={`Отзыв ${index + 1}`}
          allow="clipboard-write; autoplay"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: "none", display: "block", position: "absolute", inset: 0 }}
        />
      ) : (
        <div
          onClick={() => setPlaying(true)}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${thumb})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
          }} />
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "2px solid rgba(255,255,255,0.5)",
              boxShadow: "0 0 30px rgba(92,184,110,0.35)",
              transition: "transform 0.2s",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 3 }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section id="reviews" style={{ padding: "96px 20px", background: "linear-gradient(180deg,#0a1a0f,#081218)" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 12px" }}>
            ОТЗЫВЫ
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: 0 }}>
            Что говорят люди после практики
          </p>
          <div style={{ width: 80, height: 4, margin: "16px auto 0", borderRadius: 9999, background: "linear-gradient(90deg,#3a8f4a,#5cb86e)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
          {VIDEOS.map((v, i) => (
            <VideoCard key={i} url={v.url} thumb={v.thumb} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}