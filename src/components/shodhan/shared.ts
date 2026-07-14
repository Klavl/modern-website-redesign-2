import { useRef, useState, useEffect } from "react";

export const MONTH_RU = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];

export function fmtDate(d: string) {
  if (!d) return "";
  const dt = new Date(d);
  return `${dt.getDate()} ${MONTH_RU[dt.getMonth()]} ${dt.getFullYear()}`;
}

export const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
};

export const DMITRY_PHOTO = "https://cdn.poehali.dev/projects/756e28ae-f342-42b1-ab53-44233856dec1/bucket/6e2df17f-042f-4f94-95b3-dfc3557a23c0.png";

export const GROUP_PHOTO = "https://cdn.poehali.dev/projects/756e28ae-f342-42b1-ab53-44233856dec1/bucket/b6c1465d-923c-4a06-95af-2ede37c4ad60.jpg";

export const INSTRUCTORS_MAIN = [
  { img: DMITRY_PHOTO },
  { img: "https://cdn.poehali.dev/files/7dcc45c1-c7e8-402d-86f7-a0cdca2cd9d0.png" },
  { img: "https://cdn.poehali.dev/files/f7a50ea4-30e4-42e5-8764-b0ca5e793faf.png" },
  { img: "https://cdn.poehali.dev/files/a1246f76-0823-46a0-a21c-f7e30bc92df9.png" },
  { img: "https://cdn.poehali.dev/files/7c763edb-99f0-4fb9-8995-08dd19a893fb.png" },
  { img: "https://cdn.poehali.dev/files/51708a07-06ec-4a23-aa7d-dfa1a3fb822b.png" },
  { img: "https://cdn.poehali.dev/files/0e403994-a766-439f-83f5-5031a9694533.png" },
  { img: "https://cdn.poehali.dev/files/faad76da-0ac4-48b5-8ae7-edb5bc0fa872.png" },
  { img: "https://cdn.poehali.dev/files/4f24f45a-682f-479a-b3b2-900bed0911d0.png" },
];

export const ELEMENTS_16 = [
  { n: "1", desc: "Освобождаемся от застарелых негативных эмоций, которые подавляли годами" },
  { n: "2", desc: "Избавляемся от агрессии и страха, трансформируя их в силу и смелость" },
  { n: "3", desc: "Высвобождаем застоявшуюся энергию, снимая напряжение в теле и эмоциях" },
  { n: "4", desc: "Укрепляем уверенность в себе, в своём праве на жизнь и самовыражение" },
  { n: "5", desc: "Тренируем волю и учимся контролировать инстинкты, снижая уровень стресса и паники" },
  { n: "6", desc: "Укрепляем чувство внутренней свободы и независимости" },
  { n: "7", desc: "Расслабляем мышцы, освобождаемся от подавленных эмоций" },
  { n: "8", desc: "Учимся принимать свои теневые стороны, повышаем осознанность" },
  { n: "9", desc: "Управляем дыханием, чтобы научиться эффективно восстанавливаться после стресса или нагрузок" },
  { n: "10", desc: "Прорабатываем эмоциональные травмы и освобождаемся от глубинных блокировок" },
  { n: "11", desc: "Учимся расслабляться в нестабильных ситуациях и находить внутреннее равновесие" },
  { n: "12", desc: "Укрепляем внутреннее чувство целостности и эмоциональную устойчивость" },
  { n: "13", desc: "Высвобождаем энергию, погружаясь в состояние полной радости и легкости" },
  { n: "14", desc: "Исцеляем внутренние эмоциональные раны, наполняем тело ощущением покоя и любви" },
  { n: "15", desc: "Активируем энергетический обмен между собой и окружающим миром, обретая чувство единства и связи с ним" },
  { n: "16", desc: "Формируем новое восприятие жизни, буквально «рождаясь» заново" },
];

export const AFTER_MEDITATION = [
  "Тело расслаблено и наполнено энергией",
  "Ум ясный и спокойный",
  "Эмоции выровнены",
  "Чувствуешь связь с собой",
  "Снят накопленный стресс",
  "Появляется ощущение лёгкости",
  "Повышается чувствительность",
  "Углубляется самопонимание",
];

export const INSTRUCTORS_FULL = [
  { city: "Москва", role: "Основатель метода", img: DMITRY_PHOTO },
  { city: "Инструктор", role: "Инструктор", img: "https://cdn.poehali.dev/files/7dcc45c1-c7e8-402d-86f7-a0cdca2cd9d0.png" },
  { city: "Инструктор", role: "Инструктор", img: "https://cdn.poehali.dev/files/f7a50ea4-30e4-42e5-8764-b0ca5e793faf.png" },
  { city: "Инструктор", role: "Инструктор", img: "https://cdn.poehali.dev/files/a1246f76-0823-46a0-a21c-f7e30bc92df9.png" },
  { city: "Инструктор", role: "Инструктор", img: "https://cdn.poehali.dev/files/7c763edb-99f0-4fb9-8995-08dd19a893fb.png" },
  { city: "Инструктор", role: "Инструктор", img: "https://cdn.poehali.dev/files/51708a07-06ec-4a23-aa7d-dfa1a3fb822b.png" },
  { city: "Инструктор", role: "Инструктор", img: "https://cdn.poehali.dev/files/0e403994-a766-439f-83f5-5031a9694533.png" },
  { city: "Инструктор", role: "Инструктор", img: "https://cdn.poehali.dev/files/faad76da-0ac4-48b5-8ae7-edb5bc0fa872.png" },
  { city: "Инструктор", role: "Инструктор", img: "https://cdn.poehali.dev/files/4f24f45a-682f-479a-b3b2-900bed0911d0.png" },
  { city: "Инструктор", role: "Инструктор", img: "https://cdn.poehali.dev/files/34d0c73d-0746-4070-ab78-8c1d2692ff76.png" },
  { city: "Инструктор", role: "Инструктор", img: "https://cdn.poehali.dev/files/bc129867-0481-46bf-a409-6c86134545b6.png" },
  { city: "Инструктор", role: "Инструктор", img: "https://cdn.poehali.dev/files/7a9e2e0b-5413-4b70-81e9-062d52169ece.png" },
  { city: "Инструктор", role: "Инструктор", img: "https://cdn.poehali.dev/files/9fcdefa5-c445-4201-838e-5ac1fb853b78.png" },
];

export const NAV = [
  { label: "О методе", href: "#about" },
  { label: "Практики", href: "#elements" },
  { label: "Инструкторы", href: "#instructors" },
  { label: "Мероприятия", href: "#events" },
  { label: "Контакты", href: "#contact" },
];