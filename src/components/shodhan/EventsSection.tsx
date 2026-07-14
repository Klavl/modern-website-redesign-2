import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";
import FadeIn from "./FadeIn";
import { MONTH_RU } from "./shared";
import { type ShodhanEvent } from "@/lib/api";

type Props = {
  events: ShodhanEvent[];
};

export default function EventsSection({ events }: Props) {
  const [city, setCity] = useState<string>("all");

  const cities = useMemo(() => {
    const set = new Set(events.map(e => e.city).filter(Boolean));
    return Array.from(set).sort();
  }, [events]);

  const filtered = city === "all" ? events : events.filter(e => e.city === city);

  return (
    <>
      {/* ══════════ БЛИЖАЙШИЕ МЕРОПРИЯТИЯ ══════════ */}
      <section id="events" className="py-24 px-5"
        style={{ background: "linear-gradient(180deg,#0a1a0f,#081218)" }}>
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-10">
            <h2 className="font-display mb-3"
              style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              БЛИЖАЙШИЕ<br />МЕРОПРИЯТИЯ
            </h2>
            <div className="w-20 h-1 rounded-full" style={{ background: "linear-gradient(90deg,#3a8f4a,#5cb86e)" }} />
          </FadeIn>

          {/* Фильтр по городам */}
          {cities.length > 0 && (
            <FadeIn className="mb-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCity("all")}
                  className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-200"
                  style={{
                    fontFamily: "'Oswald',sans-serif",
                    letterSpacing: "0.08em",
                    background: city === "all" ? "linear-gradient(135deg,#3a8f4a,#5cb86e)" : "rgba(255,255,255,0.05)",
                    color: city === "all" ? "#fff" : "rgba(255,255,255,0.5)",
                    border: city === "all" ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
                  }}>
                  Показать все
                </button>
                {cities.map(c => (
                  <button
                    key={c}
                    onClick={() => setCity(c)}
                    className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-200"
                    style={{
                      fontFamily: "'Oswald',sans-serif",
                      letterSpacing: "0.08em",
                      background: city === c ? "linear-gradient(135deg,#3a8f4a,#5cb86e)" : "rgba(255,255,255,0.05)",
                      color: city === c ? "#fff" : "rgba(255,255,255,0.5)",
                      border: city === c ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
                    }}>
                    {c}
                  </button>
                ))}
              </div>
            </FadeIn>
          )}

          {events.length === 0 ? (
            <FadeIn>
              <div className="text-center py-16 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.07)" }}>
                <Icon name="CalendarX" size={36} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Мероприятий пока нет.<br />Скоро появятся новые события.
                </p>
              </div>
            </FadeIn>
          ) : filtered.length === 0 ? (
            <FadeIn>
              <div className="text-center py-16 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.07)" }}>
                <Icon name="MapPin" size={36} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                  В городе «{city}» мероприятий пока нет.
                </p>
              </div>
            </FadeIn>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {filtered.map((ev, i) => (
                <FadeIn key={ev.id} delay={(i % 3) * 0.08} className="h-full">
                  <div className="rounded-2xl overflow-hidden flex flex-col h-full group transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: ev.is_mass
                        ? "linear-gradient(145deg,rgba(30,22,5,0.97),rgba(8,15,25,0.9))"
                        : "linear-gradient(145deg,rgba(15,30,20,0.95),rgba(8,15,25,0.9))",
                      border: ev.is_mass ? "1px solid rgba(232,160,32,0.4)" : "1px solid rgba(92,184,110,0.14)",
                      boxShadow: ev.is_mass ? "0 4px 24px rgba(232,160,32,0.12)" : "0 4px 20px rgba(0,0,0,0.3)",
                    }}>
                    {/* Дата и время */}
                    <div className="px-5 pt-5 pb-4 flex items-start justify-between"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div>
                        <div className="text-3xl font-bold leading-none mb-1"
                          style={{ fontFamily: "'Oswald',sans-serif", color: "#5cb86e" }}>
                          {new Date(ev.event_date).getDate()}
                        </div>
                        <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {MONTH_RU[new Date(ev.event_date).getMonth()]} {new Date(ev.event_date).getFullYear()}
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                        {ev.is_mass && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase"
                            style={{ background: "linear-gradient(135deg,#e8a020,#f5c842)", color: "#1a0f00", fontFamily: "'Oswald',sans-serif", letterSpacing: "0.08em" }}>
                            <Icon name="Star" size={9} />
                            Массовый
                          </span>
                        )}
                        <div className="text-sm font-semibold" style={{ fontFamily: "'Oswald',sans-serif", color: "#fff" }}>
                          {ev.event_time}
                        </div>
                        <div className="text-xs" style={{ color: ev.price === "Бесплатно" ? "#5cb86e" : "rgba(255,255,255,0.7)" }}>
                          {ev.price}
                        </div>
                      </div>
                    </div>

                    {/* Контент — растягивается */}
                    <div className="px-5 py-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-base mb-2"
                        style={{ fontFamily: "'Oswald',sans-serif", color: "#fff", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        {ev.title}
                      </h3>
                      <p className="text-xs leading-relaxed mb-4 flex-1"
                        style={{ color: "rgba(255,255,255,0.5)", minHeight: 36 }}>
                        {ev.description || ""}
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                          <Icon name="MapPin" size={11} />
                          <span className="truncate">{ev.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                          <Icon name="Building2" size={11} />
                          <span>{ev.city}</span>
                        </div>
                        {ev.spots > 0 && (
                          <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                            <Icon name="Users" size={11} />
                            <span>{ev.spots} мест</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Футер — всегда внизу */}
                    <div className="px-5 pb-5 pt-3 flex items-center justify-between mt-auto"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0"
                          style={{ border: "1px solid rgba(92,184,110,0.3)" }}>
                          {ev.instructor_photo ? (
                            <img src={ev.instructor_photo} alt="" className="w-full h-full object-cover"
                              onError={e => { (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(ev.instructor_name || "")}&background=1a3a22&color=5cb86e&size=28`; }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"
                              style={{ background: "rgba(92,184,110,0.1)" }}>
                              <Icon name="User" size={10} />
                            </div>
                          )}
                        </div>
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {ev.instructor_name}
                        </span>
                      </div>
                      {ev.contact_link ? (
                        <a href={ev.contact_link} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-4 py-1.5 rounded-full font-medium transition-all duration-200 hover:opacity-80 shrink-0"
                          style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff", fontFamily: "'Montserrat',sans-serif" }}>
                          Записаться
                        </a>
                      ) : (
                        <a href="#contact"
                          className="text-xs px-4 py-1.5 rounded-full font-medium transition-all duration-200 hover:opacity-80 shrink-0"
                          style={{ border: "1px solid rgba(92,184,110,0.3)", color: "#5cb86e" }}>
                          Написать
                        </a>
                      )}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════ КОНТАКТЫ ══════════ */}
      <section id="contact" className="py-24 px-5"
        style={{ background: "linear-gradient(180deg,#0a1825,#0a0e1a)" }}>
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <h2 className="font-display mb-4"
              style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              СВЯЗАТЬСЯ С НАМИ
            </h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ background: "linear-gradient(90deg,#3a8f4a,#5cb86e)" }} />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-10">
            <FadeIn>
              <div className="rounded-2xl p-8 h-full flex flex-col items-start justify-center"
                style={{ background: "linear-gradient(145deg,rgba(20,45,25,0.7),rgba(10,25,15,0.7))", border: "1px solid rgba(92,184,110,0.25)" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                  style={{ background: "rgba(92,184,110,0.15)", border: "1px solid rgba(92,184,110,0.35)" }}>
                  <Icon name="UserPlus" size={22} style={{ color: "#5cb86e" }} />
                </div>
                <h3 className="font-display font-bold text-xl mb-3"
                  style={{ fontFamily: "'Oswald',sans-serif", color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  СТАТЬ ИНСТРУКТОРОМ ШОДХАН
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Пройди обучение и веди практику Шодхан в своём городе вместе с командой из более чем 200 инструкторов по всему миру.
                </p>
                <a href="https://dskornev.ru/instr" target="_blank" rel="noopener noreferrer"
                  className="btn-shodhan inline-block px-8 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:scale-105"
                  style={{ color: "#fff", fontFamily: "'Oswald',sans-serif" }}>
                  Стать инструктором
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="flex flex-col gap-5 h-full">
                {[
                  { icon: "Send", label: "Telegram", val: "Министерство Счастья", href: "https://telegram.me/ministerstvoshastya" },
                  { icon: "MessageSquare", label: "ВКонтакте", val: "Министерство Счастья", href: "https://vk.com/happinessministry" },
                  { icon: "Instagram", label: "Instagram", val: "Министерство Счастья", href: "https://www.instagram.com/happinessministry/" },
                  { icon: "MessageCircle", label: "MAX", val: "Министерство Счастья", href: "https://max.ru/join/sv6RAm_GuHxevgVXkqTs4t3JzaoBw2yC9qiipYygVaE" },
                ].map((c, i) => (
                  <a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(92,184,110,0.1)", border: "1px solid rgba(92,184,110,0.2)" }}>
                      <Icon name={c.icon} size={18} style={{ color: "#5cb86e" }} />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest mb-0.5"
                        style={{ color: "rgba(92,184,110,0.7)", fontFamily: "'Oswald',sans-serif" }}>
                        {c.label}
                      </div>
                      <div className="text-sm" style={{ color: "#fff" }}>{c.val}</div>
                    </div>
                  </a>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}