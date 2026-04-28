import { useState } from "react";
import Icon from "@/components/ui/icon";
import FadeIn from "./FadeIn";

const FAQ = [
  {
    q: "Как понять, что Шодхан подходит мне?",
    a: "Неважно, сколько тебе лет, какой у тебя вес, пол или вероисповедание. Шодхан подходит абсолютно любому человеку.",
  },
  {
    q: "Сколько длится Шодхан?",
    a: "2-3 часа — инструктаж к практике и теория «Основы эмоциональной гигиены» до начала практики. 1 час — активная фаза практики. 1 час — сатсанг, шеринг и ответы на вопросы после практики.",
  },
  {
    q: "Что нужно взять с собой?",
    a: "Лёгкую, не сковывающую движения одежду (женщинам — футболка или топик, не сжимающий грудь), коврик для йоги, бутылочку воды.",
  },
  {
    q: "Сколько стоит практика?",
    a: "Стоимость отличается в зависимости от города и инструктора, который проводит практику. Вы можете посмотреть расписание всех мероприятий на нашем сайте или связаться с нами и узнать подробности.",
  },
  {
    q: "Можно ли пройти Шодхан снова?",
    a: "Каждая практика Шодхан идеальна и каждый создаёт свой идеальный опыт её проживания. Поэтому неважно — впервые или не впервые, ты проживаешь свою лучшую практику!",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-5"
      style={{ background: "linear-gradient(180deg,#0a0e1a,#0d1520)" }}>
      <div className="max-w-3xl mx-auto">
        <FadeIn className="text-center mb-14">
          <h2 className="font-display mb-4"
            style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full" style={{ background: "linear-gradient(90deg,#3a8f4a,#5cb86e)" }} />
        </FadeIn>

        <div className="flex flex-col gap-3">
          {FAQ.map((item, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <div
                className="rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  border: open === i ? "1px solid rgba(92,184,110,0.35)" : "1px solid rgba(255,255,255,0.08)",
                  background: open === i ? "rgba(20,45,25,0.6)" : "rgba(255,255,255,0.03)",
                }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-semibold text-sm leading-snug"
                    style={{ fontFamily: "'Montserrat',sans-serif", color: "#fff" }}>
                    {item.q}
                  </span>
                  <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: open === i ? "rgba(92,184,110,0.2)" : "rgba(255,255,255,0.06)",
                      border: open === i ? "1px solid rgba(92,184,110,0.4)" : "1px solid rgba(255,255,255,0.1)",
                      transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                    }}>
                    <Icon name="Plus" size={14} style={{ color: open === i ? "#5cb86e" : "rgba(255,255,255,0.5)" }} />
                  </div>
                </button>
                {open === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Montserrat',sans-serif" }}>
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
