import { useState } from "react";
import Icon from "@/components/ui/icon";
import PhotoUploader from "@/components/PhotoUploader";
import { updateProfile, getMe, type Instructor } from "@/lib/api";

const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" };
const labelStyle = { color: "rgba(92,184,110,0.8)", fontFamily: "'Oswald',sans-serif" };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function ProfileEditor({ instructor, onSaved, onClose }: {
  instructor: Instructor;
  onSaved: (i: Instructor) => void;
  onClose: () => void;
}) {
  const [f, setF] = useState({
    full_name: instructor.full_name || "",
    cities: (instructor.cities || []).join(", "),
    gender: instructor.gender || "",
    age: instructor.age != null ? String(instructor.age) : "",
    experience_years: instructor.experience_years != null ? String(instructor.experience_years) : "",
    telegram: instructor.telegram || "",
    vk: instructor.vk || "",
    bio: instructor.bio || "",
    photo_url: instructor.photo_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      const res = await updateProfile({
        full_name: f.full_name,
        cities: f.cities.split(",").map(c => c.trim()).filter(Boolean),
        gender: f.gender,
        age: f.age ? Number(f.age) : null,
        experience_years: f.experience_years ? Number(f.experience_years) : null,
        telegram: f.telegram, vk: f.vk, bio: f.bio, photo_url: f.photo_url,
      });
      if (res.error) { setError(res.error); return; }
      const me = await getMe();
      if (me) onSaved(me);
    } catch { setError("Ошибка соединения"); }
    finally { setSaving(false); }
  };

  return (
    <div className="rounded-2xl p-6 mb-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(92,184,110,0.3)" }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold uppercase tracking-widest" style={{ fontFamily: "'Oswald',sans-serif", color: "#5cb86e" }}>
          Мой профиль
        </h3>
        <button type="button" onClick={onClose} className="p-1 opacity-50 hover:opacity-100" style={{ color: "#fff" }}>
          <Icon name="X" size={16} />
        </button>
      </div>
      <form onSubmit={submit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Row label="ФИО">
          <input value={f.full_name} onChange={e => set("full_name", e.target.value)} required
            className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
        </Row>
        <Row label="Города (через запятую)">
          <input value={f.cities} onChange={e => set("cities", e.target.value)} placeholder="Москва, Сочи"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
        </Row>
        <Row label="Пол">
          <select value={f.gender} onChange={e => set("gender", e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle}>
            <option value="" style={{ background: "#0d1520" }}>Не указан</option>
            <option value="M" style={{ background: "#0d1520" }}>Мужской</option>
            <option value="F" style={{ background: "#0d1520" }}>Женский</option>
          </select>
        </Row>
        <Row label="Возраст">
          <input type="number" min={0} value={f.age} onChange={e => set("age", e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
        </Row>
        <Row label="Стаж (лет)">
          <input type="number" min={0} value={f.experience_years} onChange={e => set("experience_years", e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
        </Row>
        <Row label="Telegram">
          <input value={f.telegram} onChange={e => set("telegram", e.target.value)} placeholder="@username"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
        </Row>
        <Row label="ВКонтакте">
          <input value={f.vk} onChange={e => set("vk", e.target.value)} placeholder="@id или ссылка"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
        </Row>
        <div className="sm:col-span-2">
          <Row label="О себе">
            <textarea value={f.bio} onChange={e => set("bio", e.target.value)} rows={3} placeholder="Краткое описание..."
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none" style={inputStyle} />
          </Row>
        </div>
        <PhotoUploader photoUrl={f.photo_url} onChange={u => set("photo_url", u)} />
        {error && <p className="sm:col-span-2 lg:col-span-3 text-sm" style={{ color: "#ff8080" }}>{error}</p>}
        <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
          <button type="submit" disabled={saving}
            className="px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff" }}>
            {saving ? "Сохраняю..." : "Сохранить"}
          </button>
          <button type="button" onClick={onClose}
            className="px-6 py-3 rounded-xl text-sm hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
