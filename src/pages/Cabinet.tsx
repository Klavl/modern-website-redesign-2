import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCachedInstructor, getMe, logout,
  getMyEvents, createEvent, updateEvent, deleteEvent,
  type Instructor, type ShodhanEvent,
} from "@/lib/api";
import Icon from "@/components/ui/icon";

type EventForm = {
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  city: string;
  price: string;
  spots: number;
  contact_link: string;
  is_mass: boolean;
};

const emptyForm = (): EventForm => ({
  description: "", event_date: "", event_time: "",
  location: "", city: "", price: "Бесплатно", spots: 0, contact_link: "", is_mass: false,
});

const MONTH_RU = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
function fmtDate(d: string) {
  if (!d) return "";
  const dt = new Date(d);
  return `${dt.getDate()} ${MONTH_RU[dt.getMonth()]} ${dt.getFullYear()}`;
}

export default function Cabinet() {
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState<Instructor | null>(getCachedInstructor());
  const [events, setEvents] = useState<ShodhanEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    (async () => {
      const me = await getMe();
      if (!me) { navigate("/login"); return; }
      setInstructor(me);
      const evs = await getMyEvents();
      setEvents(evs);
      setLoading(false);
    })();
  }, []);

  const set = (k: keyof EventForm, v: string | number) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm(), city: instructor?.cities?.[0] || "" });
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (ev: ShodhanEvent) => {
    setEditId(ev.id);
    setForm({
      description: ev.description,
      event_date: ev.event_date, event_time: ev.event_time,
      location: ev.location, city: ev.city, price: ev.price,
      spots: ev.spots, contact_link: ev.contact_link,
      is_mass: ev.is_mass ?? false,
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const payload = { ...form, spots: Number(form.spots) };
      const res = editId
        ? await updateEvent(editId, payload)
        : await createEvent(payload);
      if (res.error) { setFormError(res.error); return; }
      const evs = await getMyEvents();
      setEvents(evs);
      setShowForm(false);
      setSuccessMsg(editId ? "Мероприятие обновлено!" : "Мероприятие добавлено!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setFormError("Ошибка. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Скрыть это мероприятие?")) return;
    await deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
    setSuccessMsg("Мероприятие скрыто.");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "#060c14" }}>
        <Icon name="Loader2" size={32} className="animate-spin" style={{ color: "#5cb86e" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#060c14,#0a1a0f)", fontFamily: "'Montserrat',sans-serif" }}>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 px-5 py-4 flex items-center justify-between"
        style={{ background: "rgba(6,12,20,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}>
        <a href="/" className="text-xl font-bold tracking-widest"
          style={{ fontFamily: "'Oswald',sans-serif", color: "#fff", letterSpacing: "0.15em" }}>
          ШОДХАН
        </a>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:block" style={{ color: "rgba(255,255,255,0.55)" }}>
            {instructor?.full_name}
          </span>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full transition-all duration-200 hover:opacity-80"
            style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.55)" }}>
            <Icon name="LogOut" size={12} />
            Выйти
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-10">

        {/* ── ПРОФИЛЬ ── */}
        <div className="rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
            style={{ background: "rgba(92,184,110,0.12)", border: "2px solid rgba(92,184,110,0.3)" }}>
            {instructor?.photo_url ? (
              <img src={instructor.photo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <Icon name="User" size={24} />
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs tracking-widest uppercase mb-0.5"
              style={{ color: "#5cb86e", fontFamily: "'Oswald',sans-serif" }}>
              Инструктор Шодхан
            </p>
            <h2 className="text-xl font-bold mb-0.5"
              style={{ fontFamily: "'Oswald',sans-serif", color: "#fff", letterSpacing: "0.05em" }}>
              {instructor?.full_name}
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              {instructor?.cities?.join(", ")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-center px-5 py-3 rounded-xl"
              style={{ background: "rgba(92,184,110,0.08)", border: "1px solid rgba(92,184,110,0.15)" }}>
              <div className="text-2xl font-bold" style={{ fontFamily: "'Oswald',sans-serif", color: "#5cb86e" }}>
                {events.filter(e => e.is_active && e.event_date >= new Date().toISOString().split("T")[0]).length}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>активных</div>
            </div>
            <div className="text-center px-5 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="text-2xl font-bold" style={{ fontFamily: "'Oswald',sans-serif", color: "#fff" }}>
                {events.length}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>всего</div>
            </div>
          </div>
        </div>

        {/* ── УВЕДОМЛЕНИЕ ── */}
        {successMsg && (
          <div className="mb-5 rounded-xl px-4 py-3 flex items-center gap-2 text-sm"
            style={{ background: "rgba(50,160,80,0.12)", border: "1px solid rgba(50,160,80,0.3)", color: "#7edb95" }}>
            <Icon name="CheckCircle" size={14} />
            {successMsg}
          </div>
        )}

        {/* ── ЗАГОЛОВОК + КНОПКА ── */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold"
            style={{ fontFamily: "'Oswald',sans-serif", color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            МОИ МЕРОПРИЯТИЯ
          </h3>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-200 hover:scale-105"
            style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff", fontFamily: "'Oswald',sans-serif" }}>
            <Icon name="Plus" size={16} />
            Добавить
          </button>
        </div>

        {/* ── СПИСОК СОБЫТИЙ ── */}
        {events.length === 0 ? (
          <div className="text-center py-20 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
            <Icon name="Calendar" size={40} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              У вас пока нет мероприятий.<br />Нажмите «Добавить» чтобы создать первое.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map(ev => (
              <div key={ev.id}
                className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-200"
                style={{
                  background: ev.is_active ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${ev.is_active ? "rgba(92,184,110,0.15)" : "rgba(255,255,255,0.05)"}`,
                  opacity: ev.is_active ? 1 : 0.55,
                }}>
                {/* Дата */}
                <div className="shrink-0 text-center rounded-xl px-4 py-3"
                  style={{ background: "rgba(92,184,110,0.08)", border: "1px solid rgba(92,184,110,0.15)", minWidth: 80 }}>
                  <div className="text-lg font-bold leading-none" style={{ fontFamily: "'Oswald',sans-serif", color: "#5cb86e" }}>
                    {new Date(ev.event_date).getDate()}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {MONTH_RU[new Date(ev.event_date).getMonth()]}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#5cb86e" }}>{ev.event_time}</div>
                </div>

                {/* Инфо */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-semibold text-base truncate"
                      style={{ fontFamily: "'Oswald',sans-serif", color: "#fff", letterSpacing: "0.04em" }}>
                      {ev.title}
                    </h4>
                    {!ev.is_active && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(200,50,50,0.15)", color: "#ff8080", border: "1px solid rgba(200,50,50,0.25)" }}>
                        скрыто
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                    <Icon name="MapPin" size={11} />
                    <span>{ev.location}</span>
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                    <span>{ev.city}</span>
                    {ev.price && ev.price !== "Бесплатно" && (
                      <>
                        <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                        <span style={{ color: "#5cb86e" }}>{ev.price}</span>
                      </>
                    )}
                    {ev.spots > 0 && (
                      <>
                        <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                        <span>{ev.spots} мест</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Кнопки */}
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(ev)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                    <Icon name="Pencil" size={13} />
                  </button>
                  {ev.is_active && (
                    <button onClick={() => handleDelete(ev.id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={{ background: "rgba(200,50,50,0.08)", border: "1px solid rgba(200,50,50,0.2)", color: "#ff8080" }}>
                      <Icon name="EyeOff" size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── МОДАЛЬНАЯ ФОРМА ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            style={{ background: "#0d1820", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="p-6 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="font-bold text-lg"
                style={{ fontFamily: "'Oswald',sans-serif", color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {editId ? "РЕДАКТИРОВАТЬ" : "НОВОЕ МЕРОПРИЯТИЕ"}
              </h3>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                <Icon name="X" size={14} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Фиксированное название */}
              <div className="rounded-xl px-4 py-3 flex items-center gap-2"
                style={{ background: "rgba(92,184,110,0.08)", border: "1px solid rgba(92,184,110,0.2)" }}>
                <Icon name="Tag" size={14} style={{ color: "#5cb86e" }} />
                <span className="text-sm font-bold tracking-widest" style={{ color: "#5cb86e", fontFamily: "'Oswald',sans-serif" }}>ШОДХАН</span>
                <span className="text-xs ml-1" style={{ color: "rgba(255,255,255,0.4)" }}>— название всех мероприятий</span>
              </div>
              {[
                { key: "event_date", label: "Дата *", placeholder: "", type: "date", required: true },
                { key: "event_time", label: "Время *", placeholder: "18:00", type: "time", required: true },
                { key: "location", label: "Место проведения *", placeholder: "Студия Yoga Space, ул. Ленина, 5", type: "text", required: true },
                { key: "city", label: "Город *", placeholder: "Москва", type: "text", required: true },
                { key: "price", label: "Стоимость", placeholder: "Бесплатно / 500 руб", type: "text", required: false },
                { key: "spots", label: "Количество мест (0 = без ограничений)", placeholder: "20", type: "number", required: false },
                { key: "contact_link", label: "Ссылка для записи (Telegram, сайт…)", placeholder: "https://t.me/...", type: "text", required: false },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
                    style={{ color: "rgba(92,184,110,0.65)", fontFamily: "'Oswald',sans-serif" }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={String(form[f.key as keyof EventForm])}
                    onChange={e => set(f.key as keyof EventForm, f.type === "number" ? Number(e.target.value) : e.target.value)}
                    required={f.required}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'Montserrat',sans-serif", colorScheme: "dark" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(92,184,110,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
                  style={{ color: "rgba(92,184,110,0.65)", fontFamily: "'Oswald',sans-serif" }}>
                  Описание
                </label>
                <textarea
                  placeholder="Подробнее о практике..."
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 resize-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'Montserrat',sans-serif" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(92,184,110,0.5)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              {/* Чекбокс Массовый */}
              <label className="flex items-center gap-3 cursor-pointer select-none rounded-xl px-4 py-3 transition-colors duration-150"
                style={{ background: form.is_mass ? "rgba(92,184,110,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${form.is_mass ? "rgba(92,184,110,0.35)" : "rgba(255,255,255,0.08)"}` }}>
                <div onClick={() => setForm(prev => ({ ...prev, is_mass: !prev.is_mass }))}
                  className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all duration-150"
                  style={{ background: form.is_mass ? "#5cb86e" : "rgba(255,255,255,0.1)", border: `1.5px solid ${form.is_mass ? "#5cb86e" : "rgba(255,255,255,0.2)"}`, cursor: "pointer" }}>
                  {form.is_mass && <Icon name="Check" size={12} style={{ color: "#fff" }} />}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#fff" }}>Массовый Шодхан</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Отметьте, если это массовое мероприятие</p>
                </div>
              </label>

              {formError && (
                <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
                  style={{ background: "rgba(200,50,50,0.12)", border: "1px solid rgba(200,50,50,0.3)", color: "#ff8080" }}>
                  <Icon name="AlertCircle" size={13} />
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80"
                  style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)" }}>
                  Отмена
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff", fontFamily: "'Oswald',sans-serif" }}>
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Icon name="Loader2" size={14} className="animate-spin" />
                      Сохраняю...
                    </span>
                  ) : editId ? "СОХРАНИТЬ" : "СОЗДАТЬ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}