import { useRef, useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { fetchPhotoByUrl, uploadPhoto } from "@/lib/api";

const FRAME = 280;
const OUT = 600;

type Props = {
  photoUrl: string;
  onChange: (url: string) => void;
  instructorId?: number;
  accent?: string;
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

const urlToDataUrl = async (url: string) => {
  const r = await fetch(url);
  const b = await r.blob();
  return fileToDataUrl(new File([b], "p", { type: b.type }));
};

export default function PhotoUploader({ photoUrl, onChange, instructorId, accent = "#5cb86e" }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const baseScale = img ? FRAME / Math.min(img.naturalWidth, img.naturalHeight) : 1;

  const clamp = useCallback((p: { x: number; y: number }, z: number) => {
    if (!img) return p;
    const w = img.naturalWidth * baseScale * z;
    const h = img.naturalHeight * baseScale * z;
    const mx = Math.max(0, (w - FRAME) / 2);
    const my = Math.max(0, (h - FRAME) / 2);
    return { x: Math.min(mx, Math.max(-mx, p.x)), y: Math.min(my, Math.max(-my, p.y)) };
  }, [img, baseScale]);

  useEffect(() => {
    if (!src) { setImg(null); return; }
    const i = new Image();
    i.onload = () => { setImg(i); setZoom(1); setPos({ x: 0, y: 0 }); };
    i.onerror = () => { setError("Не удалось открыть изображение"); setSrc(null); };
    i.src = src;
  }, [src]);

  const openFile = async (file?: File) => {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) { setError("Выберите файл-изображение"); return; }
    if (file.size > 8 * 1024 * 1024) { setError("Файл слишком большой (максимум 8 МБ)"); return; }
    setSrc(await fileToDataUrl(file));
  };

  const openLink = async () => {
    const u = link.trim();
    if (!u) return;
    setError(""); setBusy(true);
    try {
      const res = await fetchPhotoByUrl(u);
      if (res.error || !res.data_url) setError(res.error || "Не удалось скачать фото");
      else { setSrc(res.data_url); setLink(""); }
    } catch { setError("Ошибка соединения"); }
    finally { setBusy(false); }
  };

  const editCurrent = async () => {
    if (!photoUrl) return;
    setError(""); setBusy(true);
    try { setSrc(await urlToDataUrl(photoUrl)); }
    catch {
      try {
        const res = await fetchPhotoByUrl(photoUrl);
        if (res.data_url) setSrc(res.data_url); else setError(res.error || "Не удалось открыть фото");
      } catch { setError("Не удалось открыть фото"); }
    } finally { setBusy(false); }
  };

  const onDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setPos(clamp({ x: drag.current.px + e.clientX - drag.current.x, y: drag.current.py + e.clientY - drag.current.y }, zoom));
  };
  const onUp = () => { drag.current = null; };

  const changeZoom = (z: number) => { setZoom(z); setPos(p => clamp(p, z)); };

  const save = async () => {
    if (!img || !src) return;
    setBusy(true); setError("");
    try {
      const scale = baseScale * zoom;
      const sw = FRAME / scale;
      const sx = img.naturalWidth / 2 - pos.x / scale - sw / 2;
      const sy = img.naturalHeight / 2 - pos.y / scale - sw / 2;
      const canvas = document.createElement("canvas");
      canvas.width = OUT; canvas.height = OUT;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, OUT, OUT);
      ctx.drawImage(img, sx, sy, sw, sw, 0, 0, OUT, OUT);
      const cropped = canvas.toDataURL("image/jpeg", 0.9).split(",")[1];
      const originalIsData = src.startsWith("data:");
      const original = originalIsData ? src.split(",")[1] : "";
      const res = await uploadPhoto(cropped, original, instructorId);
      if (res.error || !res.photo_url) setError(res.error || "Не удалось сохранить фото");
      else { onChange(res.photo_url); setSrc(null); }
    } catch { setError("Ошибка соединения"); }
    finally { setBusy(false); }
  };

  const rgb = accent === "#5cb86e" ? "92,184,110" : "201,168,76";
  const btn = { background: `rgba(${rgb},0.15)`, color: accent, border: `1px solid rgba(${rgb},0.35)` };

  return (
    <div className="sm:col-span-2 lg:col-span-3">
      <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
        style={{ color: `rgba(${rgb},0.8)`, fontFamily: "'Oswald',sans-serif" }}>
        Фото
      </label>

      {!src && (
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {photoUrl
              ? <img src={photoUrl} alt="" className="w-full h-full object-cover" />
              : <Icon name="User" size={28} />}
          </div>
          <div className="flex-1 w-full space-y-3">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => fileRef.current?.click()}
                className="px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:opacity-80" style={btn}>
                <Icon name="Upload" size={14} /> Загрузить файл
              </button>
              {photoUrl && (
                <button type="button" onClick={editCurrent} disabled={busy}
                  className="px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:opacity-80 disabled:opacity-50" style={btn}>
                  <Icon name="Crop" size={14} /> Изменить миниатюру
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => { openFile(e.target.files?.[0]); e.target.value = ""; }} />
            </div>
            <div className="flex gap-2">
              <input type="text" value={link} onChange={e => setLink(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); openLink(); } }}
                placeholder="или вставьте ссылку на фото"
                className="flex-1 rounded-xl px-4 py-2 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              <button type="button" onClick={openLink} disabled={busy || !link.trim()}
                className="px-4 py-2 rounded-xl text-sm hover:opacity-80 disabled:opacity-40" style={btn}>
                {busy ? "Загружаю..." : "Загрузить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {src && img && (
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
            className="relative overflow-hidden shrink-0 touch-none"
            style={{ width: FRAME, height: FRAME, borderRadius: 12, background: "#000", cursor: "grab", border: `2px solid ${accent}` }}>
            <img src={src} alt="" draggable={false}
              style={{
                position: "absolute", left: "50%", top: "50%", maxWidth: "none",
                width: img.naturalWidth * baseScale * zoom, height: img.naturalHeight * baseScale * zoom,
                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                userSelect: "none", pointerEvents: "none",
              }} />
          </div>
          <div className="space-y-4 w-full max-w-xs">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              Перетащите фото и приблизьте, чтобы выбрать квадратную миниатюру.
            </p>
            <input type="range" min={1} max={4} step={0.01} value={zoom}
              onChange={e => changeZoom(Number(e.target.value))} className="w-full" />
            <div className="flex gap-2">
              <button type="button" onClick={save} disabled={busy}
                className="px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#3a8f4a,#5cb86e)", color: "#fff" }}>
                {busy ? "Сохраняю..." : "Сохранить фото"}
              </button>
              <button type="button" onClick={() => { setSrc(null); setError(""); }} disabled={busy}
                className="px-4 py-2.5 rounded-xl text-sm hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-xs mt-2" style={{ color: "#ff8080" }}>{error}</p>}
    </div>
  );
}
