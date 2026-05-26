import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, logout, adminListInstructors, adminCreateInstructor, adminDeleteInstructor, adminSetCredentials, adminUpdateInstructor, type Instructor } from "@/lib/api";
import Icon from "@/components/ui/icon";

const emptyForm = () => ({ full_name: "", login: "", password: "", city: "", gender: "", age: "", experience_years: "", telegram: "", vk: "" });
const emptyCredsForm = () => ({ login: "", password: "" });
const emptyEditForm = (ins?: Instructor) => ({
  full_name: ins?.full_name || "",
  city: ins?.city || "",
  gender: ins?.gender || "",
  age: ins?.age != null ? String(ins.age) : "",
  experience_years: ins?.experience_years != null ? String(ins.experience_years) : "",
  telegram: ins?.telegram || "",
  vk: ins?.vk || "",
  bio: ins?.bio || "",
  photo_url: ins?.photo_url || "",
});

function Field({ label, placeholder, type = "text", value, onChange, accent = "#5cb86e" }: {
  label: string; placeholder?: string; type?: string; value: string; onChange: (v: string) => void; accent?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
        style={{ color: `rgba(${accent === "#5cb86e" ? "92,184,110" : "201,168,76"},0.8)`, fontFamily: "'Oswald',sans-serif" }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
        onFocus={e => (e.currentTarget.style.borderColor = `rgba(${accent === "#5cb86e" ? "92,184,110" : "201,168,76"},0.5)`)}
        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
      />
    </div>
  );
}

function GenderSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
        style={{ color: "rgba(92,184,110,0.8)", fontFamily: "'Oswald',sans-serif" }}>
        Пол
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: value ? "#fff" : "rgba(255,255,255,0.4)" }}>
        <option value="" style={{ background: "#0d1520" }}>Не указан</option>
        <option value="M" style={{ background: "#0d1520" }}>Мужской</option>
        <option value="F" style={{ background: "#0d1520" }}>Женский</option>
      </select>
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [credsId, setCredsId] = useState<number | null>(null);
  const [credsForm, setCredsForm] = useState(emptyCredsForm());
  const [credsSaving, setCredsSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyEditForm());
  const [editSaving, setEditSaving] = useState(false);

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));
  const setCreds = (k: string, v: string) => setCredsForm(prev => ({ ...prev, [k]: v }));
  const setEdit = (k: string, v: string) => setEditForm(prev => ({ ...prev, [k]: v }));

  const loadData = async () => {
    const me = await getMe();
    if (!me || me.role !== "admin") { navigate("/login"); return; }
    const res = await adminListInstructors();
    if (res.error) { setError("Ошибка загрузки: " + res.error); setLoading(false); return; }
    setInstructors(res.instructors || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleLogout = async () => { await logout(); navigate("/login"); };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setSaving(true);
    try {
      const res = await adminCreateInstructor(form.full_name, form.login, form.password, form.city);
      if (res.error) { setError(res.error); }
      else {
        if (form.gender || form.age || form.experience_years || form.telegram || form.vk) {
          await adminUpdateInstructor(res.id, {
            full_name: form.full_name, city: form.city,
            gender: form.gender, age: form.age ? Number(form.age) : null,
            experience_years: form.experience_years ? Number(form.experience_years) : null,
            telegram: form.telegram, vk: form.vk,
          });
        }
        setSuccess("Инструктор создан!");
        setForm(emptyForm());
        setShowForm(false);
        loadData();
      }
    } catch { setError("Ошибка соединения"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    const res = await adminDeleteInstructor(id);
    if (res.error) { setError(res.error); return; }
    setDeleteId(null);
    loadData();
  };

  const handleSetCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setCredsSaving(true);
    try {
      const res = await adminSetCredentials(credsId!, credsForm.login, credsForm.password);
      if (res.error) { setError(res.error); }
      else { setSuccess("Логин и пароль установлены!"); setCredsId(null); setCredsForm(emptyCredsForm()); loadData(); }
    } catch { setError("Ошибка соединения"); }
    finally { setCredsSaving(false); }
  };

  const openEdit = (ins: Instructor) => {
    setEditId(ins.id);
    setEditForm(emptyEditForm(ins));
    setShowForm(false);
    setCredsId(null);
    setError(""); setSuccess("");
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setEditSaving(true);
    try {
      const res = await adminUpdateInstructor(editId!, {
        full_name: editForm.full_name, city: editForm.city,
        gender: editForm.gender,
        age: editForm.age ? Number(editForm.age) : null,
        experience_years: editForm.experience_years ? Number(editForm.experience_years) : null,
        telegram: editForm.telegram, vk: editForm.vk,
        bio: editForm.bio, photo_url: editForm.photo_url,
      });
      if (res.error) { setError(res.error); }
      else { setSuccess("Данные инструктора обновлены!"); setEditId(null); loadData(); }
    } catch { setError("Ошибка соединения"); }
    finally { setEditSaving(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#060c14" }}>
        <Icon name="Loader2" size={32} className="animate-spin" style={{ color: "#5cb86e" }} />
      </div>
    );
  }

  const onlyInstructors = instructors.filter(i => i.role === "instructor");

  return (
    <div className="min-h-screen px-4 py-8"
      style={{ background: "linear-gradient(135deg,#060c14 0%,#0a1a0f 100%)", fontFamily: "'Montserrat',sans-serif" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest"
              style={{ fontFamily: "'Oswald',sans-serif", color: "#fff" }}>
              ШОДХАН — АДМИНИСТРАТОР
            </h1>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Управление инструкторами</p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
            <Icon name="LogOut" size={14} />
            Выйти
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 rounded-xl px-4 py-3 text-sm flex items-center gap-2"
            style={{ background: "rgba(200,50,50,0.12)", border: "1px solid rgba(200,50,50,0.3)", color: "#ff8080" }}>
            <Icon name="AlertCircle" size={14} />{error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl px-4 py-3 text-sm flex items-center gap-2"
            style={{ background: "rgba(50,160,80,0.12)", border: "1px solid rgba(50,160,80,0.3)", color: "#7edb95" }}>
            <Icon name="CheckCircle" size={14} />{success}
          </div>
        )}

        {/* Top bar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Oswald',sans-serif" }}>
            Инструкторы ({onlyInstructors.length})
          </h2>
          <button onClick={() => { setShowForm(!showForm); setCredsId(null); setEditId(null); setError(""); setSuccess(""); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff" }}>
            <Icon name={showForm ? "X" : "Plus"} size={14} />
            {showForm ? "Отмена" : "Новый инструктор"}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="mb-6 rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(92,184,110,0.2)" }}>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-5"
              style={{ fontFamily: "'Oswald',sans-serif", color: "#5cb86e" }}>
              Создать нового инструктора
            </h3>
            <form onSubmit={handleCreate} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Полное имя *" placeholder="Иванов Иван Иванович" value={form.full_name} onChange={v => set("full_name", v)} />
              <Field label="Город" placeholder="Москва" value={form.city} onChange={v => set("city", v)} />
              <GenderSelect value={form.gender} onChange={v => set("gender", v)} />
              <Field label="Возраст" placeholder="30" type="number" value={form.age} onChange={v => set("age", v)} />
              <Field label="Стаж (лет)" placeholder="2" type="number" value={form.experience_years} onChange={v => set("experience_years", v)} />
              <Field label="Telegram" placeholder="@username" value={form.telegram} onChange={v => set("telegram", v)} />
              <Field label="ВКонтакте" placeholder="@id или ссылка" value={form.vk} onChange={v => set("vk", v)} />
              <Field label="Логин *" placeholder="instructor_login" value={form.login} onChange={v => set("login", v)} />
              <Field label="Пароль *" placeholder="Надёжный пароль" type="password" value={form.password} onChange={v => set("password", v)} />
              <div className="sm:col-span-2 lg:col-span-3">
                <button type="submit" disabled={saving}
                  className="px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff" }}>
                  {saving ? "Создаю..." : "Создать инструктора"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit form */}
        {editId !== null && (
          <div className="mb-6 rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(92,184,110,0.25)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold uppercase tracking-widest"
                style={{ fontFamily: "'Oswald',sans-serif", color: "#5cb86e" }}>
                Редактировать — {instructors.find(i => i.id === editId)?.full_name}
              </h3>
              <button onClick={() => setEditId(null)} className="p-1 opacity-50 hover:opacity-100" style={{ color: "#fff" }}>
                <Icon name="X" size={16} />
              </button>
            </div>
            <form onSubmit={handleEdit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="ФИО" value={editForm.full_name} onChange={v => setEdit("full_name", v)} />
              <Field label="Город" value={editForm.city} onChange={v => setEdit("city", v)} />
              <GenderSelect value={editForm.gender} onChange={v => setEdit("gender", v)} />
              <Field label="Возраст" type="number" value={editForm.age} onChange={v => setEdit("age", v)} />
              <Field label="Стаж (лет)" type="number" value={editForm.experience_years} onChange={v => setEdit("experience_years", v)} />
              <Field label="Telegram" placeholder="@username" value={editForm.telegram} onChange={v => setEdit("telegram", v)} />
              <Field label="ВКонтакте" placeholder="@id или ссылка" value={editForm.vk} onChange={v => setEdit("vk", v)} />
              <Field label="Ссылка на фото" placeholder="https://..." value={editForm.photo_url} onChange={v => setEdit("photo_url", v)} />
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
                  style={{ color: "rgba(92,184,110,0.8)", fontFamily: "'Oswald',sans-serif" }}>О себе</label>
                <textarea value={editForm.bio} onChange={e => setEdit("bio", e.target.value)} rows={3} placeholder="Краткое описание..."
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
                <button type="submit" disabled={editSaving}
                  className="px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff" }}>
                  {editSaving ? "Сохраняю..." : "Сохранить изменения"}
                </button>
                <button type="button" onClick={() => setEditId(null)}
                  className="px-6 py-3 rounded-xl text-sm transition-all hover:opacity-80"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Set credentials form */}
        {credsId !== null && (
          <div className="mb-6 rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.3)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold uppercase tracking-widest"
                style={{ fontFamily: "'Oswald',sans-serif", color: "#c9a84c" }}>
                Назначить логин и пароль — {instructors.find(i => i.id === credsId)?.full_name}
              </h3>
              <button onClick={() => { setCredsId(null); setCredsForm(emptyCredsForm()); }} className="p-1 opacity-50 hover:opacity-100" style={{ color: "#fff" }}>
                <Icon name="X" size={16} />
              </button>
            </div>
            <form onSubmit={handleSetCreds} className="grid sm:grid-cols-2 gap-4">
              <Field label="Логин" placeholder="instructor_login" value={credsForm.login} onChange={v => setCreds("login", v)} accent="#c9a84c" />
              <Field label="Пароль" placeholder="Надёжный пароль" type="password" value={credsForm.password} onChange={v => setCreds("password", v)} accent="#c9a84c" />
              <div className="sm:col-span-2">
                <button type="submit" disabled={credsSaving}
                  className="px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#a87a20,#c9a84c)", color: "#fff" }}>
                  {credsSaving ? "Сохраняю..." : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="rounded-2xl overflow-x-auto" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr auto",
            gap: 0,
            background: "rgba(255,255,255,0.05)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "10px 16px",
            minWidth: 820,
          }}>
            {["ФИО", "М/Ж", "Возраст", "Стаж", "Город", "Telegram", "ВКонтакте", ""].map((h, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", fontFamily: "'Oswald',sans-serif" }}>
                {h}
              </span>
            ))}
          </div>

          {onlyInstructors.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Нет инструкторов</div>
          ) : (
            onlyInstructors.map(ins => (
              <div key={ins.id} style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr auto",
                gap: 0,
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                padding: "12px 16px",
                minWidth: 820,
              }}>
                <div>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 500, margin: 0 }}>{ins.full_name}</p>
                  {ins.login && <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: "2px 0 0", fontFamily: "monospace" }}>{ins.login}</p>}
                  {!ins.login && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 10, background: "rgba(200,50,50,0.15)", color: "#ff8080" }}>нет логина</span>}
                </div>
                <span style={{ color: ins.gender ? "#5cb86e" : "rgba(255,255,255,0.25)", fontSize: 13 }}>
                  {ins.gender === "M" ? "М" : ins.gender === "F" ? "Ж" : "—"}
                </span>
                <span style={{ color: ins.age ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)", fontSize: 13 }}>
                  {ins.age ?? "—"}
                </span>
                <span style={{ color: ins.experience_years ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)", fontSize: 13 }}>
                  {ins.experience_years ? `${ins.experience_years} л.` : "—"}
                </span>
                <span style={{ color: ins.city ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)", fontSize: 13 }}>
                  {ins.city || "—"}
                </span>
                <span style={{ fontSize: 12 }}>
                  {ins.telegram
                    ? <a href={ins.telegram.startsWith("http") ? ins.telegram : `https://t.me/${ins.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" style={{ color: "#5cb86e", textDecoration: "none" }}>{ins.telegram}</a>
                    : <span style={{ color: "rgba(255,255,255,0.25)" }}>—</span>}
                </span>
                <span style={{ fontSize: 12 }}>
                  {ins.vk
                    ? <a href={ins.vk.startsWith("http") ? ins.vk : `https://vk.com/${ins.vk.replace("@", "")}`} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(100,160,255,0.8)", textDecoration: "none" }}>{ins.vk}</a>
                    : <span style={{ color: "rgba(255,255,255,0.25)" }}>—</span>}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(ins)} title="Редактировать" className="p-1.5 rounded-lg transition-all hover:opacity-80" style={{ color: "#5cb86e" }}>
                    <Icon name="Pencil" size={14} />
                  </button>
                  <button onClick={() => { setCredsId(ins.id); setCredsForm(emptyCredsForm()); setShowForm(false); setEditId(null); setError(""); setSuccess(""); }}
                    title="Логин / пароль" className="p-1.5 rounded-lg transition-all hover:opacity-80" style={{ color: "#c9a84c" }}>
                    <Icon name="KeyRound" size={14} />
                  </button>
                  {deleteId === ins.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleDelete(ins.id)}
                        className="text-xs px-3 py-1 rounded-lg transition-all hover:opacity-80"
                        style={{ background: "rgba(200,50,50,0.2)", color: "#ff8080", border: "1px solid rgba(200,50,50,0.3)" }}>
                        Удалить
                      </button>
                      <button onClick={() => setDeleteId(null)} className="text-xs px-2 py-1 rounded-lg" style={{ color: "rgba(255,255,255,0.4)" }}>Отмена</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteId(ins.id)} className="p-1.5 rounded-lg transition-all hover:opacity-80" style={{ color: "rgba(255,100,100,0.5)" }}>
                      <Icon name="Trash2" size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
