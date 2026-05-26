import { useState } from "react";
import Icon from "@/components/ui/icon";
import FadeIn from "./FadeIn";
import CityMap from "./CityMap";
import WhySection from "./WhySection";
import { DMITRY_PHOTO, ELEMENTS_16, AFTER_MEDITATION, INSTRUCTORS_FULL } from "./shared";

const VIDEO_COVER = "https://cdn.poehali.dev/projects/756e28ae-f342-42b1-ab53-44233856dec1/bucket/f20895ca-6d45-426c-acf2-a17a0dffda27.png";
const VIDEO_EMBED = "https://rutube.ru/play/embed/ff6fb89cc23dfdd417528a5a76f2b029/";

export default function AboutSection() {
  const [playing, setPlaying] = useState(false);
  return (
    <>
      {/* ══════════ ЧТО ТАКОЕ ШОДХАН ══════════ */}
      <section id="about" className="py-24 px-5 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg,#0a0e1a 0%,#0d1520 50%,#0a1a0f 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse,#1a6b2a,transparent)" }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-8"
            style={{ background: "radial-gradient(ellipse,#0a3a6b,transparent)" }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn className="text-center mb-16">
            <h2 className="font-display mb-4"
              style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              ЧТО ТАКОЕ ШОДХАН?
            </h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ background: "linear-gradient(90deg,#3a8f4a,#5cb86e)" }} />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <p className="text-base leading-loose mb-5" style={{ color: "rgba(255,255,255,0.75)" }}>
                <strong style={{ color: "#5cb86e" }}>Шодхан</strong> — это уникальный метод активной медитации,
                разработанный специально для современного человека. Название происходит от санскритского слова,
                означающего «очищение».
              </p>
              <p className="text-base leading-loose mb-5" style={{ color: "rgba(255,255,255,0.75)" }}>
                В отличие от традиционной медитации, где нужно «отключить» ум усилием воли, Шодхан
                работает через активное взаимодействие с первоэлементами: землёй, водой, огнём, воздухом и эфиром.
              </p>
              <p className="text-base leading-loose mb-8" style={{ color: "rgba(255,255,255,0.75)" }}>
                Практика включает движение, дыхание, голос, звук и медитативное погружение — всё это
                вместе создаёт мощный инструмент трансформации сознания.
              </p>
              <a href="#contact"
                className="inline-block px-8 py-3.5 rounded-full font-semibold text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
                style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff" }}>
                Попробовать
              </a>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="relative rounded-2xl overflow-hidden"
                style={{ aspectRatio: "16/9", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {playing ? (
                  <iframe
                    src={`${VIDEO_EMBED}?autoplay=1`}
                    title="Что такое Шодхан"
                    allow="clipboard-write; autoplay"
                    allowFullScreen
                    className="w-full h-full"
                    style={{ border: "none", display: "block" }}
                  />
                ) : (
                  <div className="relative w-full h-full cursor-pointer group" onClick={() => setPlaying(true)}>
                    <img
                      src={VIDEO_COVER}
                      alt="Что такое Шодхан"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{ width: 72, height: 72, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "2px solid rgba(255,255,255,0.45)", boxShadow: "0 0 40px rgba(92,184,110,0.3)" }}>
                        <Icon name="Play" size={28} style={{ color: "#fff", marginLeft: 4 }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Об авторе — Дмитрий Хара */}
          <FadeIn delay={0.1} className="mt-20">
            <div className="text-center mb-10">
              <h2 className="mb-1"
                style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 700, color: "#5cb86e", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                ОБ АВТОРЕ
              </h2>
              <h3
                style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(36px,6vw,64px)", fontWeight: 700, color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                ДМИТРИЙ ХАРА
              </h3>
            </div>

            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-start">
              {/* Left facts */}
              <div className="flex flex-col gap-4">
                {[
                  "Спикер международного саммита «В потоке» (совместно с Джо Диспенза, Брюсом Липтоном, Греггом Брейденом, Дипаком Чопра, Далай Ламой и другими спикерами мирового уровня)",
                  "Более 10 лет Дмитрий занимается вопросами развития личности. Его книги рекомендуют к прочтению на своих занятиях ведущие тренеры и коучи России.",
                  "Автор активной медитации первоэлементов «Шодхан», которую проводят более 200 инструкторов по всему миру",
                  "Отец пятерых детей",
                ].map((text, i) => (
                  <div key={i} className="flex gap-3 items-start rounded-xl px-4 py-3"
                    style={{ background: "rgba(92,184,110,0.08)", border: "1px solid rgba(92,184,110,0.18)" }}>
                    <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(92,184,110,0.2)", border: "1px solid rgba(92,184,110,0.4)" }}>
                      <Icon name="Check" size={11} style={{ color: "#5cb86e" }} />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "'Montserrat',sans-serif" }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Center photo */}
              <div className="relative flex flex-col items-center mx-auto" style={{ width: 260 }}>
                <div className="relative rounded-2xl overflow-hidden"
                  style={{ width: 260, height: 360, border: "2px solid rgba(92,184,110,0.25)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
                  <img src={DMITRY_PHOTO} alt="Дмитрий Хара"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center top" }}
                    onError={e => { (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=ДХ&background=2d4a2d&color=fff&size=260`; }} />
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(10,20,15,0.85) 0%, transparent 50%)" }} />
                </div>
                {/* Quote */}
                <div className="mt-4 rounded-xl px-4 py-3 text-center"
                  style={{ background: "rgba(92,184,110,0.12)", border: "1px solid rgba(92,184,110,0.25)", maxWidth: 260 }}>
                  <p className="text-xs leading-relaxed italic"
                    style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Montserrat',sans-serif" }}>
                    «Эта медитация пришла ко мне, как ответ на запрос о медитации, которая не отрывала бы от земли, и позволяла бы сохранять социальную активность и пробуждённое состояние сознания одновременно»
                  </p>
                </div>
              </div>

              {/* Right facts */}
              <div className="flex flex-col gap-4">
                {[
                  "С 2013 года ведёт авторские программы и ретриты",
                  "Основатель нового подхода к предпринимательству «Живой Бизнес»",
                  "Более 15 лет — меценат центра «Анима» (для творческого развития детей с ограниченными возможностями здоровья)",
                  "Писатель. Автор книг-бестселлеров, меняющих сознание — «П.Ш.», «Трэш», «Сияние», «ПерепроШивка», «64 Дара Бытия», метафорических карт «Камертон Вселенной»",
                ].map((text, i) => (
                  <div key={i} className="flex gap-3 items-start rounded-xl px-4 py-3"
                    style={{ background: "rgba(92,184,110,0.08)", border: "1px solid rgba(92,184,110,0.18)" }}>
                    <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(92,184,110,0.2)", border: "1px solid rgba(92,184,110,0.4)" }}>
                      <Icon name="Check" size={11} style={{ color: "#5cb86e" }} />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "'Montserrat',sans-serif" }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════ КАРТА МИРА ══════════ */}
      <CityMap />

      {/* ══════════ 16 ЭЛЕМЕНТОВ ══════════ */}
      <section id="elements" className="py-24 px-5 relative"
        style={{ background: "linear-gradient(180deg,#081218,#0a0e1a)" }}>
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="font-display mb-4"
              style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              16 СТАДИЙ ПРАКТИКИ
            </h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ background: "linear-gradient(90deg,#3a8f4a,#5cb86e)" }} />
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {ELEMENTS_16.map((el, i) => (
              <FadeIn key={i} delay={(i % 4) * 0.07} className="h-full">
                <div className="rounded-xl p-5 h-full group transition-all duration-300 hover:-translate-y-1 flex gap-3"
                  style={{
                    background: "linear-gradient(145deg,rgba(20,35,25,0.9),rgba(10,18,30,0.85))",
                    border: "1px solid rgba(92,184,110,0.12)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(92,184,110,0.35)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(92,184,110,0.12)")}>
                  <span className="font-display font-bold text-3xl leading-none shrink-0"
                    style={{ fontFamily: "'Oswald',sans-serif", color: "rgba(92,184,110,0.35)", lineHeight: 1 }}>
                    {el.n}
                  </span>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {el.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ ШОДХАН НУЖЕН ТЕБЕ ══════════ */}
      <WhySection />

      {/* ══════════ ПОСЛЕ МЕДИТАЦИИ ══════════ */}
      <section id="after" className="py-24 px-5 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg,#0a0e1a,#0a1a0f)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-8"
            style={{ background: "radial-gradient(ellipse,#1a6b2a,transparent)" }} />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn className="text-center mb-16">
            <h2 className="font-display mb-4"
              style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              ПОСЛЕ МЕДИТАЦИИ ТЫ
            </h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ background: "linear-gradient(90deg,#3a8f4a,#5cb86e)" }} />
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 items-stretch">
            {AFTER_MEDITATION.map((item, i) => (
              <FadeIn key={i} delay={i * 0.06} className="h-full">
                <div className="rounded-xl p-5 text-center h-full group transition-all duration-300 hover:-translate-y-1 flex flex-col items-center"
                  style={{
                    background: "linear-gradient(145deg,rgba(20,45,25,0.85),rgba(10,25,15,0.8))",
                    border: "1px solid rgba(92,184,110,0.15)",
                  }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 shrink-0"
                    style={{ background: "rgba(92,184,110,0.12)", border: "1px solid rgba(92,184,110,0.25)" }}>
                    <Icon name="Check" size={16} />
                  </div>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
                    {item}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center">
            <a href="#contact"
              className="inline-block px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff", boxShadow: "0 8px 30px rgba(60,150,80,0.4)" }}>
              Записаться на медитацию
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ══════════ ИНСТРУКТОРЫ ══════════ */}
      <section id="instructors" className="py-24 px-5"
        style={{ background: "linear-gradient(180deg,#0a1a0f,#0a0e1a)" }}>
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="font-display mb-4"
              style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              ИНСТРУКТОРЫ ШОДХАН
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              Сертифицированные инструкторы в твоём городе
            </p>
            <div className="w-20 h-1 mx-auto rounded-full mt-4" style={{ background: "linear-gradient(90deg,#3a8f4a,#5cb86e)" }} />
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {INSTRUCTORS_FULL.map((ins, i) => (
              <FadeIn key={i} delay={(i % 5) * 0.06}>
                <div className="flex flex-col items-center group cursor-default">
                  <div className="relative transition-transform duration-300 group-hover:scale-105"
                    style={{
                      width: "100%",
                      maxWidth: 200,
                      aspectRatio: "1/1",
                      borderRadius: "50%",
                      border: "2px solid rgba(100,140,255,0.45)",
                      boxShadow: "0 0 0 4px rgba(100,140,255,0.1), 0 8px 24px rgba(0,0,0,0.4)",
                      overflow: "hidden",
                      background: "#0d1a10",
                    }}>
                    <img
                      src={ins.img}
                      alt="Инструктор Шодхан"
                      className="w-full h-full object-cover object-top"
                      onError={e => {
                        (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=ШД&background=1a3a22&color=5cb86e&size=200`;
                      }}
                    />
                  </div>
                  {i === 0 && (
                    <span className="mt-2 text-xs font-medium text-center"
                      style={{ color: "#5cb86e", fontFamily: "'Montserrat',sans-serif" }}>
                      Основатель
                    </span>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/instructors"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff", boxShadow: "0 6px 24px rgba(60,150,80,0.35)" }}>
              <Icon name="Users" size={16} />
              Показать всех
            </a>
            <a href="#contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
              style={{ border: "1px solid rgba(92,184,110,0.4)", color: "#5cb86e", background: "rgba(92,184,110,0.05)" }}>
              <Icon name="UserPlus" size={16} />
              Стать инструктором
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ══════════ КАК ПРОХОДИТ ПРАКТИКА ══════════ */}
      <section className="py-24 px-5 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg,#0a0e1a,#0a1a0f)" }}>
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="font-display mb-4"
              style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              КАК ПРОХОДИТ ПРАКТИКА
            </h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ background: "linear-gradient(90deg,#3a8f4a,#5cb86e)" }} />
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=70", title: "Групповые сессии", desc: "Медитации в группе создают особое поле осознанности. Совместная практика усиливает эффект многократно." },
              { img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=70", title: "Индивидуальная работа", desc: "Персональные сессии позволяют работать с конкретными запросами и глубоко погрузиться в практику." },
              { img: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=70", title: "Природные интенсивы", desc: "Выездные практики на природе — горы, лес, море. Первоэлементы в их живом воплощении усиливают медитацию." },
              { img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=70", title: "Онлайн-практики", desc: "Практикуй Шодхан из любой точки мира. Онлайн-формат сохраняет глубину и эффективность метода." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                  style={{ border: "1px solid rgba(92,184,110,0.1)" }}>
                  <div className="relative overflow-hidden" style={{ height: 200 }}>
                    <img src={item.img} alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ filter: "brightness(0.65) saturate(0.8)" }} />
                    <div className="absolute inset-0 flex items-end p-5"
                      style={{ background: "linear-gradient(to top,rgba(0,0,0,0.7),transparent)" }}>
                      <h3 className="font-bold text-xl"
                        style={{ fontFamily: "'Oswald',sans-serif", color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-20 px-5 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0d2a15 0%,#0a1825 50%,#0d2a15 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: "radial-gradient(ellipse,#1a6b2a,transparent)" }} />
        </div>
        <div className="max-w-2xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="font-display mb-4"
              style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(32px,5vw,60px)", fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              ГОТОВ НАЧАТЬ ПРАКТИКУ?
            </h2>
            <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.65)" }}>
              Присоединяйся к Шодхан в своём городе. Первая сессия — лучший способ
              почувствовать силу активной медитации.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contact"
                className="px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
                style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff", boxShadow: "0 8px 30px rgba(60,150,80,0.5)" }}>
                Записаться на сессию
              </a>
              <a href="https://t.me/shodhan" target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 rounded-full font-medium text-sm tracking-widest uppercase inline-flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#fff", background: "rgba(255,255,255,0.05)" }}>
                <Icon name="Send" size={14} />
                Telegram-канал
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}