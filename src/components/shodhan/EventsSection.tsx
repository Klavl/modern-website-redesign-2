import Icon from "@/components/ui/icon";
import FadeIn from "./FadeIn";
import { MONTH_RU, NAV } from "./shared";
import { type ShodhanEvent } from "@/lib/api";

type Props = {
  events: ShodhanEvent[];
};

export default function EventsSection({ events }: Props) {
  return (
    <>
      {/* ══════════ БЛИЖАЙШИЕ МЕРОПРИЯТИЯ ══════════ */}
      <section id="events" className="py-24 px-5"
        style={{ background: "linear-gradient(180deg,#0a1a0f,#081218)" }}>
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-12">
            <h2 className="font-display mb-3"
              style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              БЛИЖАЙШИЕ<br />МЕРОПРИЯТИЯ
            </h2>
            <div className="w-20 h-1 rounded-full" style={{ background: "linear-gradient(90deg,#3a8f4a,#5cb86e)" }} />
          </FadeIn>

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
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((ev, i) => (
                <FadeIn key={ev.id} delay={(i % 3) * 0.08}>
                  <div className="rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "linear-gradient(145deg,rgba(15,30,20,0.95),rgba(8,15,25,0.9))",
                      border: "1px solid rgba(92,184,110,0.14)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    }}>
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
                      <div className="text-right">
                        <div className="text-sm font-semibold" style={{ fontFamily: "'Oswald',sans-serif", color: "#fff" }}>
                          {ev.event_time}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: ev.price === "Бесплатно" ? "#5cb86e" : "rgba(255,255,255,0.7)" }}>
                          {ev.price}
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-4 flex-1">
                      <h3 className="font-bold text-base mb-2"
                        style={{ fontFamily: "'Oswald',sans-serif", color: "#fff", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        {ev.title}
                      </h3>
                      {ev.description && (
                        <p className="text-xs leading-relaxed mb-3 line-clamp-2"
                          style={{ color: "rgba(255,255,255,0.5)" }}>
                          {ev.description}
                        </p>
                      )}
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

                    <div className="px-5 pb-5 pt-3 flex items-center justify-between"
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
                        <span className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 110 }}>
                          {ev.instructor_name}
                        </span>
                      </div>
                      {ev.contact_link ? (
                        <a href={ev.contact_link} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-4 py-1.5 rounded-full font-medium transition-all duration-200 hover:opacity-80"
                          style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff", fontFamily: "'Montserrat',sans-serif" }}>
                          Записаться
                        </a>
                      ) : (
                        <a href="#contact"
                          className="text-xs px-4 py-1.5 rounded-full font-medium transition-all duration-200 hover:opacity-80"
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
              <div className="rounded-2xl p-8"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 className="font-display font-bold text-xl mb-6"
                  style={{ fontFamily: "'Oswald',sans-serif", color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  ОСТАВИТЬ ЗАЯВКУ
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Ваше имя", placeholder: "Как вас зовут?" },
                    { label: "Телефон или Email", placeholder: "+7 (___) ___-__-__" },
                    { label: "Ваш город", placeholder: "Москва, Санкт-Петербург..." },
                  ].map((f, i) => (
                    <div key={i}>
                      <label className="block text-xs font-medium tracking-widest uppercase mb-2"
                        style={{ color: "rgba(92,184,110,0.7)", fontFamily: "'Oswald',sans-serif" }}>
                        {f.label}
                      </label>
                      <input type="text" placeholder={f.placeholder}
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", fontFamily: "'Montserrat',sans-serif" }}
                        onFocus={e => (e.currentTarget.style.borderColor = "rgba(92,184,110,0.5)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
                    </div>
                  ))}
                  <textarea placeholder="Ваш вопрос или пожелание..."
                    rows={3}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 resize-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", fontFamily: "'Montserrat',sans-serif" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(92,184,110,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
                  <button
                    className="w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
                    style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff", fontFamily: "'Oswald',sans-serif" }}>
                    ОТПРАВИТЬ ЗАЯВКУ
                  </button>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="flex flex-col gap-4 h-full justify-center">
                {[
                  { icon: "Globe", label: "Сайт", value: "shodhan.ru", href: "https://shodhan.ru" },
                  { icon: "Send", label: "Telegram", value: "@shodhan", href: "https://t.me/shodhan" },
                  { icon: "Instagram", label: "Instagram", value: "@shodhan.ru", href: "#" },
                  { icon: "Youtube", label: "YouTube", value: "Шодхан — медитация", href: "#" },
                  { icon: "Mail", label: "Email", value: "info@shodhan.ru", href: "mailto:info@shodhan.ru" },
                ].map((c, i) => (
                  <a key={i} href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl group transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(92,184,110,0.35)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ background: "rgba(92,184,110,0.1)", border: "1px solid rgba(92,184,110,0.2)" }}>
                      <Icon name={c.icon as "Globe"} size={15} />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest mb-0.5"
                        style={{ color: "rgba(92,184,110,0.55)", fontSize: "9px", fontFamily: "'Oswald',sans-serif" }}>
                        {c.label}
                      </div>
                      <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Montserrat',sans-serif" }}>
                        {c.value}
                      </div>
                    </div>
                    <Icon name="ArrowUpRight" size={13} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
                  </a>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="py-8 px-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display font-bold tracking-widest text-lg"
            style={{ fontFamily: "'Oswald',sans-serif", color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em" }}>
            ШОДХАН
          </span>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", fontFamily: "'Montserrat',sans-serif" }}>
            © {new Date().getFullYear()} Шодхан. Активная медитация первоэлементов.
          </p>
          <div className="flex gap-5">
            {NAV.map(n => (
              <a key={n.href} href={n.href}
                className="transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px", fontFamily: "'Oswald',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(92,184,110,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                {n.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}