import Icon from "@/components/ui/icon";
import FadeIn from "./FadeIn";
import { DMITRY_PHOTO, INSTRUCTORS_MAIN, NAV } from "./shared";

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
            <a href="#contact"
              className="px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-200"
              style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff", letterSpacing: "0.12em" }}>
              Записаться
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
            <a href="#contact" className="mt-2 py-3 rounded-full text-xs font-semibold text-center tracking-widest uppercase"
              style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff" }}>
              Записаться
            </a>
          </div>
        )}
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Фон — горы */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
            alt="горы"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.45) saturate(1.1)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,10,25,0.35) 0%, rgba(0,8,20,0.1) 35%, rgba(0,8,20,0.55) 75%, #0a0e1a 100%)" }} />

        </div>

        {/* Фото Дмитрия — правая сторона, скрыто на маленьких экранах */}
        <div className="absolute bottom-0 right-0 z-10 pointer-events-none hidden sm:block"
          style={{ width: "clamp(280px, 48vw, 820px)" }}>
          <img
            src={DMITRY_PHOTO}
            alt="Дмитрий Хара"
            className="w-full object-contain object-bottom"
            style={{ maxHeight: "100vh" }}
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-32 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(92,184,110,0.18) 0%, transparent 70%)" }} />
        </div>

        {/* Контент */}
        <div className="relative z-20 flex flex-col justify-center min-h-screen px-6 md:px-16"
          style={{ maxWidth: "clamp(300px, 55vw, 720px)" }}>
          <div className="pt-20 pb-10">
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
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
              Шодхан в твоём городе! Выбери своего инструктора
            </p>

            {/* Мобильное фото */}
            <div className="sm:hidden mb-6 flex justify-center">
              <div className="rounded-2xl overflow-hidden"
                style={{ width: "min(260px, 70vw)", aspectRatio: "3/4", border: "2px solid rgba(92,184,110,0.25)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
                <img src={DMITRY_PHOTO} alt="Дмитрий Хара" className="w-full h-full object-cover object-top" />
              </div>
            </div>

            <div className="flex flex-col xs:flex-row gap-3 mb-8">
              <a href="#about"
                className="px-6 py-3.5 rounded-full font-semibold tracking-widest uppercase transition-all duration-300 hover:scale-105 text-center"
                style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff", boxShadow: "0 6px 24px rgba(60,150,80,0.45)", fontSize: "clamp(11px,1.4vw,13px)" }}>
                Узнать о методе
              </a>
              <a href="#instructors"
                className="px-6 py-3.5 rounded-full font-medium tracking-widest uppercase transition-all duration-300 hover:scale-105 text-center"
                style={{ border: "1px solid rgba(255,255,255,0.35)", color: "#fff", backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.07)", fontSize: "clamp(11px,1.4vw,13px)" }}>
                Выбрать инструктора
              </a>
            </div>

            {/* Круглые фото инструкторов */}
            <div>
              <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Montserrat',sans-serif", letterSpacing: "0.08em" }}>
                ИНСТРУКТОРЫ
              </p>
              <div className="flex flex-wrap gap-2">
                {INSTRUCTORS_MAIN.slice(0, 9).map((ins, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-110"
                      style={{ width: 44, height: 44, border: "2px solid rgba(255,255,255,0.3)", boxShadow: "0 3px 12px rgba(0,0,0,0.5)" }}>
                      <img src={ins.img} alt=""
                        className="w-full h-full object-cover object-top"
                        onError={e => { (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=ШД&background=1a3a22&color=5cb86e&size=44`; }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
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