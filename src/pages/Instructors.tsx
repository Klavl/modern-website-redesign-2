import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicInstructors, type Instructor } from "@/lib/api";
import Icon from "@/components/ui/icon";

function expLabel(y?: number | null) {
  if (!y) return "—";
  if (y === 1) return "1 год";
  if (y < 5) return `${y} года`;
  return `${y} лет`;
}

export default function Instructors() {
  const navigate = useNavigate();
  const [all, setAll] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [expMin, setExpMin] = useState("");

  useEffect(() => {
    getPublicInstructors().then(list => {
      setAll(list);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const cities = useMemo(() => {
    const set = new Set<string>();
    all.forEach(i => (i.cities || []).forEach(c => c && set.add(c)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ru"));
  }, [all]);

  const filtered = useMemo(() => {
    return all.filter(ins => {
      if (city && !(ins.cities || []).includes(city)) return false;
      if (gender && ins.gender !== gender) return false;
      if (ageMin && (ins.age ?? 0) < Number(ageMin)) return false;
      if (ageMax && (ins.age ?? 999) > Number(ageMax)) return false;
      if (expMin && (ins.experience_years ?? 0) < Number(expMin)) return false;
      return true;
    });
  }, [all, city, gender, ageMin, ageMax, expMin]);

  const hasFilters = city || gender || ageMin || ageMax || expMin;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#060c14 0%,#0a1a0f 100%)", fontFamily: "'Montserrat',sans-serif" }}>

      {/* Header */}
      <div style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}
        className="sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 transition-opacity hover:opacity-70"
            style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
            <Icon name="ArrowLeft" size={16} />
            На главную
          </button>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <span style={{ fontFamily: "'Oswald',sans-serif", color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Инструкторы Шодхан
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-10">

        {/* Title */}
        <div className="text-center mb-10">
          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 8px" }}>
            ИНСТРУКТОРЫ ШОДХАН
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, margin: 0 }}>
            {loading ? "Загружаем..." : `${all.length} сертифицированных инструктора по всему миру`}
          </p>
          <div style={{ width: 80, height: 4, margin: "14px auto 0", borderRadius: 9999, background: "linear-gradient(90deg,#3a8f4a,#5cb86e)" }} />
        </div>

        {/* Filters */}
        <div className="rounded-2xl p-5 mb-8"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(92,184,110,0.8)", marginBottom: 6 }}>Город</label>
              <select value={city} onChange={e => setCity(e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 12px", color: city ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 13, outline: "none" }}>
                <option value="">Все города</option>
                {cities.map(c => <option key={c} value={c} style={{ background: "#0d1520" }}>{c}</option>)}
              </select>
            </div>
            <div style={{ minWidth: 130 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(92,184,110,0.8)", marginBottom: 6 }}>Пол</label>
              <select value={gender} onChange={e => setGender(e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 12px", color: gender ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 13, outline: "none" }}>
                <option value="">Любой</option>
                <option value="M" style={{ background: "#0d1520" }}>Мужской</option>
                <option value="F" style={{ background: "#0d1520" }}>Женский</option>
              </select>
            </div>
            <div style={{ minWidth: 110 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(92,184,110,0.8)", marginBottom: 6 }}>Возраст от</label>
              <input type="number" min={0} max={100} value={ageMin} onChange={e => setAgeMin(e.target.value)}
                placeholder="18"
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 12px", color: "#fff", fontSize: 13, outline: "none" }} />
            </div>
            <div style={{ minWidth: 110 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(92,184,110,0.8)", marginBottom: 6 }}>Возраст до</label>
              <input type="number" min={0} max={100} value={ageMax} onChange={e => setAgeMax(e.target.value)}
                placeholder="60"
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 12px", color: "#fff", fontSize: 13, outline: "none" }} />
            </div>
            <div style={{ minWidth: 130 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(92,184,110,0.8)", marginBottom: 6 }}>Стаж от (лет)</label>
              <input type="number" min={0} value={expMin} onChange={e => setExpMin(e.target.value)}
                placeholder="1"
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 12px", color: "#fff", fontSize: 13, outline: "none" }} />
            </div>
            {hasFilters && (
              <button onClick={() => { setCity(""); setGender(""); setAgeMin(""); setAgeMax(""); setExpMin(""); }}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, background: "rgba(200,80,80,0.12)", border: "1px solid rgba(200,80,80,0.25)", color: "#ff8080", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
                <Icon name="X" size={13} />
                Сбросить
              </button>
            )}
          </div>
          {hasFilters && (
            <p style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
              Найдено: <strong style={{ color: "#5cb86e" }}>{filtered.length}</strong> из {all.length}
            </p>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <Icon name="Loader2" size={32} className="animate-spin" style={{ color: "#5cb86e", margin: "0 auto" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.35)" }}>
            <Icon name="Users" size={48} style={{ margin: "0 auto 16px", display: "block", opacity: 0.3 }} />
            <p style={{ fontSize: 16 }}>Инструкторы не найдены</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>Попробуй изменить фильтры</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {filtered.map((ins, i) => (
              <InstructorCard key={ins.id} ins={ins} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InstructorCard({ ins, index }: { ins: Instructor; index: number }) {
  return (
    <div style={{
      borderRadius: 16,
      overflow: "hidden",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      transition: "transform 0.2s, border-color 0.2s",
      cursor: "default",
      animationDelay: `${(index % 8) * 0.04}s`,
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(92,184,110,0.3)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
      }}>
      {/* Photo */}
      <div style={{ aspectRatio: "1/1", overflow: "hidden", position: "relative", background: "#0d1520" }}>
        <img
          src={ins.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(ins.full_name)}&background=1a3a22&color=5cb86e&size=300`}
          alt={ins.full_name}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
          onError={e => {
            (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(ins.full_name)}&background=1a3a22&color=5cb86e&size=300`;
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />
        {ins.cities && ins.cities.length > 0 && (
          <div style={{
            position: "absolute", bottom: 8, left: 8, right: 8,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <Icon name="MapPin" size={11} style={{ color: "#5cb86e", flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {ins.cities.join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px 14px" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: "0 0 8px", lineHeight: 1.3 }}>
          {ins.full_name}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: ins.telegram || ins.vk ? 10 : 0 }}>
          {ins.gender && (
            <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "rgba(92,184,110,0.12)", border: "1px solid rgba(92,184,110,0.2)", color: "#5cb86e" }}>
              {ins.gender === "M" ? "М" : "Ж"}
            </span>
          )}
          {ins.age && (
            <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              {ins.age} лет
            </span>
          )}
          {ins.experience_years && (
            <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Стаж: {expLabel(ins.experience_years)}
            </span>
          )}
        </div>
        {ins.bio && (
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", margin: "0 0 10px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {ins.bio}
          </p>
        )}
        {(ins.telegram || ins.vk) && (
          <div style={{ display: "flex", gap: 6 }}>
            {ins.telegram && (
              <a href={ins.telegram.startsWith("http") ? ins.telegram : `https://t.me/${ins.telegram.replace("@", "")}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#5cb86e", textDecoration: "none", padding: "4px 8px", borderRadius: 8, background: "rgba(92,184,110,0.1)", border: "1px solid rgba(92,184,110,0.2)" }}
                onClick={e => e.stopPropagation()}>
                <Icon name="Send" size={11} />
                TG
              </a>
            )}
            {ins.vk && (
              <a href={ins.vk.startsWith("http") ? ins.vk : `https://vk.com/${ins.vk.replace("@", "")}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(255,255,255,0.6)", textDecoration: "none", padding: "4px 8px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                onClick={e => e.stopPropagation()}>
                <Icon name="Users" size={11} />
                VK
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}