import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, logout, adminListInstructors, adminCreateInstructor, adminDeleteInstructor, adminSetCredentials } from "@/lib/api";
import Icon from "@/components/ui/icon";

type InstructorRow = {
  id: number;
  full_name: string;
  login: string;
  city: string;
  role: string;
  created_at: string;
};

const emptyForm = () => ({ full_name: "", login: "", password: "", city: "" });
const emptyCredsForm = () => ({ login: "", password: "" });

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState<InstructorRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [credsId, setCredsId] = useState<number | null>(null);
  const [credsForm, setCredsForm] = useState(emptyCredsForm());
  const [credsSaving, setCredsSaving] = useState(false);

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));
  const setCreds = (k: string, v: string) => setCredsForm(prev => ({ ...prev, [k]: v }));

  const loadData = async () => {
    const me = await getMe();
    if (!me || me.role !== "admin") {
      navigate("/login");
      return;
    }
    const res = await adminListInstructors();
    if (res.error) {
      setError("Ошибка загрузки: " + res.error);
      setLoading(false);
      return;
    }
    setInstructors(res.instructors || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setSaving(true);
    try {
      const res = await adminCreateInstructor(form.full_name, form.login, form.password, form.city);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess("Инструктор создан!");
        setForm(emptyForm());
        setShowForm(false);
        loadData();
      }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setSaving(false);
    }
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
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess("Логин и пароль установлены!");
        setCredsId(null);
        setCredsForm(emptyCredsForm());
        loadData();
      }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setCredsSaving(false);
    }
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
    <div className="min-h-screen px-4 py-8"
      style={{ background: "linear-gradient(135deg,#060c14 0%,#0a1a0f 100%)", fontFamily: "'Montserrat',sans-serif" }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest"
              style={{ fontFamily: "'Oswald',sans-serif", color: "#fff" }}>
              ШОДХАН — АДМИНИСТРАТОР
            </h1>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              Управление инструкторами
            </p>
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
            <Icon name="AlertCircle" size={14} />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl px-4 py-3 text-sm flex items-center gap-2"
            style={{ background: "rgba(50,160,80,0.12)", border: "1px solid rgba(50,160,80,0.3)", color: "#7edb95" }}>
            <Icon name="CheckCircle" size={14} />
            {success}
          </div>
        )}

        {/* Add button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Oswald',sans-serif" }}>
            Инструкторы ({instructors.filter(i => i.role === "instructor").length})
          </h2>
          <button onClick={() => { setShowForm(!showForm); setCredsId(null); setError(""); setSuccess(""); }}
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
            <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
              {[
                { key: "full_name", label: "Полное имя", placeholder: "Иванов Иван Иванович", type: "text" },
                { key: "city", label: "Город", placeholder: "Москва", type: "text" },
                { key: "login", label: "Логин", placeholder: "instructor_login", type: "text" },
                { key: "password", label: "Пароль", placeholder: "Надёжный пароль", type: "password" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
                    style={{ color: "rgba(92,184,110,0.7)", fontFamily: "'Oswald',sans-serif" }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => set(f.key, e.target.value)}
                    required
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(92,184,110,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <button type="submit" disabled={saving}
                  className="px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff" }}>
                  {saving ? "Создаю..." : "Создать инструктора"}
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
              <button onClick={() => { setCredsId(null); setCredsForm(emptyCredsForm()); }}
                className="p-1 opacity-50 hover:opacity-100"
                style={{ color: "#fff" }}>
                <Icon name="X" size={16} />
              </button>
            </div>
            <form onSubmit={handleSetCreds} className="grid sm:grid-cols-2 gap-4">
              {[
                { key: "login", label: "Логин", placeholder: "instructor_login", type: "text" },
                { key: "password", label: "Пароль", placeholder: "Надёжный пароль", type: "password" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
                    style={{ color: "rgba(201,168,76,0.8)", fontFamily: "'Oswald',sans-serif" }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={credsForm[f.key as keyof typeof credsForm]}
                    onChange={e => setCreds(f.key, e.target.value)}
                    required
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
              ))}
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

        {/* Instructors list */}
        <div className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] text-xs font-semibold uppercase tracking-widest px-5 py-3"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", fontFamily: "'Oswald',sans-serif", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span>Имя</span>
            <span>Логин</span>
            <span>Город</span>
            <span></span>
          </div>

          {instructors.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              Нет инструкторов
            </div>
          ) : (
            instructors.map(ins => (
              <div key={ins.id}
                className="grid grid-cols-[1fr_1fr_1fr_auto] items-center px-5 py-4 text-sm"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span style={{ color: "#fff" }}>{ins.full_name}</span>
                  {ins.role === "admin" && (
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(201,168,76,0.15)", color: "#c9a84c", fontSize: 10 }}>
                      admin
                    </span>
                  )}
                  {ins.role !== "admin" && !ins.login && (
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(200,50,50,0.15)", color: "#ff8080", fontSize: 10 }}>
                      нет логина
                    </span>
                  )}
                </div>
                <span style={{ color: ins.login ? "rgba(255,255,255,0.55)" : "rgba(255,100,100,0.5)", fontFamily: "monospace" }}>
                  {ins.login || "—"}
                </span>
                <span style={{ color: "rgba(255,255,255,0.55)" }}>{ins.city || "—"}</span>
                <div className="flex items-center gap-1">
                  {ins.role !== "admin" && !ins.login && (
                    <button
                      onClick={() => { setCredsId(ins.id); setCredsForm(emptyCredsForm()); setShowForm(false); setError(""); setSuccess(""); }}
                      title="Назначить логин и пароль"
                      className="p-1.5 rounded-lg transition-all hover:opacity-80"
                      style={{ color: "#c9a84c" }}>
                      <Icon name="KeyRound" size={14} />
                    </button>
                  )}
                  {ins.role !== "admin" && (
                    deleteId === ins.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDelete(ins.id)}
                          className="text-xs px-3 py-1 rounded-lg transition-all hover:opacity-80"
                          style={{ background: "rgba(200,50,50,0.2)", color: "#ff8080", border: "1px solid rgba(200,50,50,0.3)" }}>
                          Удалить
                        </button>
                        <button onClick={() => setDeleteId(null)}
                          className="text-xs px-2 py-1 rounded-lg"
                          style={{ color: "rgba(255,255,255,0.4)" }}>
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteId(ins.id)}
                        className="p-1.5 rounded-lg transition-all hover:opacity-80"
                        style={{ color: "rgba(255,100,100,0.5)" }}>
                        <Icon name="Trash2" size={14} />
                      </button>
                    )
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
