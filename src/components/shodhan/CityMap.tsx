import { useEffect, useRef } from "react";
import FadeIn from "./FadeIn";
import "leaflet/dist/leaflet.css";

const CITIES: { name: string; coords: [number, number] }[] = [
  { name: "Москва", coords: [55.7558, 37.6173] },
  { name: "Санкт-Петербург", coords: [59.9343, 30.3351] },
  { name: "Новосибирск", coords: [54.9885, 82.9207] },
  { name: "Екатеринбург", coords: [56.8389, 60.6057] },
  { name: "Краснодар", coords: [45.0448, 38.9760] },
  { name: "Красноярск", coords: [56.0153, 92.8932] },
  { name: "Казань", coords: [55.8304, 49.0661] },
  { name: "Самара", coords: [53.2415, 50.1606] },
  { name: "Омск", coords: [54.9885, 73.3242] },
  { name: "Тюмень", coords: [57.1553, 65.5619] },
  { name: "Уфа", coords: [54.7388, 55.9721] },
  { name: "Томск", coords: [56.4977, 84.9744] },
  { name: "Барнаул", coords: [53.3606, 83.7636] },
  { name: "Нижний Новгород", coords: [56.3269, 44.0059] },
  { name: "Воронеж", coords: [51.6720, 39.1843] },
  { name: "Пенза", coords: [53.2007, 44.9979] },
  { name: "Саратов", coords: [51.5924, 45.9608] },
  { name: "Тольятти", coords: [53.5303, 49.3461] },
  { name: "Ижевск", coords: [56.8527, 53.2114] },
  { name: "Иваново", coords: [57.0, 40.9739] },
  { name: "Хабаровск", coords: [48.4827, 135.0840] },
  { name: "Чита", coords: [52.0336, 113.5007] },
  { name: "Тамбов", coords: [52.7212, 41.4523] },
  { name: "Липецк", coords: [52.6031, 39.5708] },
  { name: "Курск", coords: [51.7304, 36.1938] },
  { name: "Орёл", coords: [52.9651, 36.0785] },
  { name: "Калининград", coords: [54.7104, 20.4522] },
  { name: "Тверь", coords: [56.8587, 35.9176] },
  { name: "Новороссийск", coords: [44.7238, 37.7688] },
  { name: "Сочи", coords: [43.6028, 39.7342] },
  { name: "Анапа", coords: [44.8952, 37.3160] },
  { name: "Великий Новгород", coords: [58.5213, 31.2755] },
  { name: "Мичуринск", coords: [52.8957, 40.4897] },
  { name: "Магнитогорск", coords: [53.4072, 59.0466] },
  { name: "Обнинск", coords: [55.0926, 36.6122] },
  { name: "Киров", coords: [58.6036, 49.6679] },
  { name: "Оренбург", coords: [51.7727, 55.0988] },
  { name: "Чебоксары", coords: [56.1439, 47.2489] },
  { name: "Дзержинск", coords: [56.2340, 43.4614] },
  { name: "Ульяновск", coords: [54.3167, 48.4000] },
  { name: "Прокопьевск", coords: [53.8864, 86.7478] },
  { name: "Киселёвск", coords: [53.9938, 86.6432] },
  { name: "Бийск", coords: [52.5412, 85.1572] },
  { name: "Новоалтайск", coords: [53.3894, 83.9349] },
  { name: "Горно-Алтайск", coords: [51.9581, 85.9603] },
  { name: "Салехард", coords: [66.5346, 66.6111] },
  { name: "Георгиевск", coords: [44.1553, 43.4639] },
  { name: "Крым", coords: [45.0, 34.0] },
  { name: "Белгород", coords: [50.5997, 36.5854] },
  { name: "Владимир", coords: [56.1290, 40.4068] },
  { name: "Волгоград", coords: [48.7080, 44.5133] },
  { name: "Рыбинск", coords: [58.0500, 38.8333] },
  { name: "Благовещенск", coords: [50.2906, 127.5272] },
  { name: "Башкирия", coords: [54.7388, 55.9721] },
  { name: "Беларусь", coords: [53.9045, 27.5615] },
  { name: "Казахстан", coords: [51.1801, 71.4460] },
  { name: "Франция", coords: [48.8566, 2.3522] },
  { name: "Аргентина", coords: [-34.6037, -58.3816] },
  { name: "Канада", coords: [45.4215, -75.6972] },
  { name: "Таиланд", coords: [13.7563, 100.5018] },
  { name: "Бали", coords: [-8.3405, 115.0920] },
  { name: "Черногория", coords: [42.4304, 19.2594] },
];

export default function CityMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    let map: unknown;

    const init = async () => {
      const L = (await import("leaflet")).default;

      if (!mapRef.current || mapInstanceRef.current) return;

      map = L.map(mapRef.current, {
        center: [30, 40],
        zoom: 2,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
        className: "shodhan-dark-tiles",
      }).addTo(map as L.Map);

      // Custom green circle marker icon
      const createIcon = () =>
        L.divIcon({
          className: "",
          html: `<div style="
            width:12px;height:12px;
            background:#5cb86e;
            border:2px solid rgba(92,184,110,0.4);
            border-radius:50%;
            box-shadow:0 0 8px #5cb86e,0 0 16px rgba(92,184,110,0.4);
          "></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
          popupAnchor: [0, -10],
        });

      CITIES.forEach((city) => {
        L.marker(city.coords, { icon: createIcon() })
          .addTo(map as L.Map)
          .bindTooltip(city.name, {
            permanent: false,
            direction: "top",
            className: "shodhan-map-tooltip",
          });
      });

      mapInstanceRef.current = map;
    };

    init();

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as L.Map).remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section
      className="py-16 px-5 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg,#0a1a0f,#081218)" }}
    >
      <style>{`
        .shodhan-map-tooltip {
          background: rgba(10,18,28,0.95) !important;
          color: #e8dcc8 !important;
          font-size: 11px !important;
          font-family: Montserrat, sans-serif !important;
          padding: 3px 8px !important;
          border-radius: 6px !important;
          border: 1px solid rgba(92,184,110,0.3) !important;
          box-shadow: none !important;
          white-space: nowrap !important;
        }
        .shodhan-map-tooltip::before {
          display: none !important;
        }
        .leaflet-control-attribution {
          background: rgba(10,18,28,0.7) !important;
          color: rgba(255,255,255,0.3) !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a {
          color: rgba(92,184,110,0.6) !important;
        }
        .leaflet-control-zoom a {
          background: rgba(10,18,28,0.9) !important;
          color: #5cb86e !important;
          border-color: rgba(92,184,110,0.3) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(92,184,110,0.15) !important;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2
            className="font-display mb-3 text-center"
            style={{
              fontFamily: "'Oswald',sans-serif",
              fontSize: "clamp(28px,4vw,48px)",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            ШОДХАН В ТВОЁМ ГОРОДЕ
          </h2>
          <p
            className="text-sm mb-4 text-center"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Инструкторы Шодхан работают в {CITIES.length}+ городах и странах по
            всему миру
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["Россия", "СНГ", "Европа", "Азия", "Америка"].map((region) => (
              <span
                key={region}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: "rgba(92,184,110,0.1)",
                  border: "1px solid rgba(92,184,110,0.25)",
                  color: "#5cb86e",
                  fontFamily: "'Montserrat',sans-serif",
                }}
              >
                {region}
              </span>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(92,184,110,0.2)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div ref={mapRef} style={{ width: "100%", height: 520 }} />
          </div>
          <p
            className="text-xs text-center mt-3"
            style={{
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'Montserrat',sans-serif",
            }}
          >
            Нажмите на точку, чтобы узнать город
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
