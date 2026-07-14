import Icon from "@/components/ui/icon";
import { GROUP_PHOTO, NAV } from "./shared";

type Props = {
  scrolled: boolean;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
};

export default function HeroSection({ scrolled, menuOpen, setMenuOpen }: Props) {
  return (
    <>
      {/* ══════════ NAV ══════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
        style={{
          background: scrolled ? "rgba(8,10,22,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}>
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-widest uppercase"
              style={{ fontFamily: "'Oswald', sans-serif", color: "#fff", letterSpacing: "0.15em" }}>
              ШОДХАН
            </span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            {NAV.map(n => (
              <a key={n.href} href={n.href}
                className="text-xs font-medium tracking-widest uppercase transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}>
                {n.label}
              </a>
            ))}
            <a href="#instructors"
              className="btn-shodhan px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-200 hover:scale-105"
              style={{ color: "#fff", letterSpacing: "0.12em" }}>
              Выбрать инструктора
            </a>
          </div>
          <button className="md:hidden p-1" style={{ color: "#fff" }} onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-5 pb-5 flex flex-col gap-3"
            style={{ background: "rgba(8,10,22,0.98)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {NAV.map(n => (
              <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)}
                className="text-xs font-medium tracking-widest uppercase py-2"
                style={{ color: "rgba(255,255,255,0.75)" }}>
                {n.label}
              </a>
            ))}
            <a href="#instructors" onClick={() => setMenuOpen(false)}
              className="btn-shodhan mt-2 py-3 rounded-full text-xs font-semibold text-center tracking-widest uppercase"
              style={{ color: "#fff" }}>
              Выбрать инструктора
            </a>
          </div>
        )}
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Фон — общее фото группы */}
        <div className="absolute inset-0">
          <img
            src={GROUP_PHOTO}
            alt="Шодхан — практика в группе"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.4) saturate(1.05)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,10,25,0.55) 0%, rgba(0,8,20,0.35) 40%, rgba(0,8,20,0.65) 75%, #0a0e1a 100%)" }} />
        </div>

        {/* Контент — по центру */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 text-center mx-auto"
          style={{ maxWidth: "clamp(300px, 90vw, 820px)" }}>
          <div className="pt-24 pb-10 flex flex-col items-center">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ fontFamily: "'Oswald',sans-serif", color: "#5cb86e", letterSpacing: "0.2em" }}>
              Авторский метод
            </p>
            <h1 className="font-display leading-none mb-4"
              style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(56px, 12vw, 160px)", fontWeight: 700, color: "#fff", textShadow: "0 0 80px rgba(92,184,110,0.2)", letterSpacing: "0.05em" }}>
              ШОДХАН
            </h1>

            <p className="font-medium mb-2"
              style={{ fontFamily: "'Montserrat', sans-serif", color: "rgba(255,255,255,0.88)", fontSize: "clamp(14px,2vw,20px)" }}>
              Активная медитация первоэлементов
            </p>
            <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>
              Автор метода — <strong style={{ color: "rgba(255,255,255,0.8)" }}>Дмитрий Хара</strong>
            </p>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
              Шодхан в твоём городе! Выбери своего инструктора
            </p>

            <a href="#instructors"
              className="btn-shodhan px-8 py-4 rounded-full font-semibold tracking-widest uppercase transition-all duration-300 hover:scale-105 text-center"
              style={{ color: "#fff", boxShadow: "0 6px 30px rgba(60,150,80,0.5)", fontSize: "clamp(12px,1.6vw,14px)" }}>
              Выбрать инструктора
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
          style={{ opacity: 1, color: "rgba(255,255,255,0.3)" }}>
          <div className="w-px h-10 animate-pulse"
            style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)" }} />
        </div>
      </section>
    </>
  );
}