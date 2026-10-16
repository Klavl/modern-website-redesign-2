"""
Авторизация инструкторов Шодхан.
action=login              — вход по логину+паролю
action=me                 — получить профиль (X-Session-Token)
action=logout             — выход
action=update             — обновить свой профиль (все поля кроме логина/пароля)
action=update_credentials — сменить свои логин/пароль
action=fetch_photo        — скачать фото по ссылке (для обрезки)
action=upload_photo       — загрузить фото в хранилище
action=public_instructors — публичный список инструкторов
action=admin_list         — список инструкторов (только admin)
action=admin_create       — создать инструктора (только admin)
action=admin_update       — обновить данные инструктора (только admin)
action=admin_delete       — удалить инструктора (только admin)
action=admin_set_credentials — сменить логин/пароль (только admin)
"""

import json
import os
import secrets
import hashlib
import re
import base64
import socket
import ipaddress
import urllib.request
import urllib.parse
import psycopg2
import boto3

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
    }


def ok(data):
    return {
        "statusCode": 200,
        "headers": {**cors_headers(), "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False, default=str),
    }


def err(msg, code=400):
    return {
        "statusCode": code,
        "headers": {**cors_headers(), "Content-Type": "application/json"},
        "body": json.dumps({"error": msg}, ensure_ascii=False),
    }


def norm_login(v: str) -> str:
    return re.sub(r"\s+", " ", (v or "").strip()).lower()


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def parse_cities(body):
    """Принимает cities (list) из тела запроса, чистит и убирает дубли/пустые значения."""
    raw = body.get("cities")
    if raw is None:
        return None
    if not isinstance(raw, list):
        return []
    seen = []
    for c in raw:
        c = (str(c) or "").strip()
        if c and c not in seen:
            seen.append(c)
    return seen


def get_instructor_by_token(cur, token):
    if not token:
        return None
    cur.execute(
        "SELECT id, full_name, cities, bio, photo_url, role FROM shodhan_instructors WHERE session_token = %s",
        (token,),
    )
    return cur.fetchone()


def require_admin(cur, token):
    row = get_instructor_by_token(cur, token)
    if not row:
        return None, err("Требуется авторизация", 401)
    if row[5] != "admin":
        return None, err("Нет прав доступа", 403)
    return row, None


MAX_IMAGE_BYTES = 8 * 1024 * 1024
TRANSLIT = dict(zip(
    "абвгдеёжзийклмнопрстуфхцчшщъыьэюя",
    ["a","b","v","g","d","e","e","zh","z","i","y","k","l","m","n","o","p","r","s","t","u","f","kh","ts","ch","sh","shch","","y","","e","yu","ya"],
))


def cdn_prefix():
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/"


def name_slug(full_name, inst_id):
    out = []
    for ch in (full_name or "").lower():
        if ch in TRANSLIT:
            out.append(TRANSLIT[ch])
        elif ch.isascii() and ch.isalnum():
            out.append(ch)
        elif ch in " -_":
            out.append("_")
    slug = re.sub(r"_+", "_", "".join(out)).strip("_")
    return f"{slug or 'instructor'}-{inst_id}"


def detect_image(data):
    if data[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if data[:4] == b"GIF8":
        return "image/gif"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    return None


def check_public_host(url):
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ("http", "https") or not parsed.hostname:
        raise ValueError("Некорректная ссылка")
    for info in socket.getaddrinfo(parsed.hostname, None):
        ip = ipaddress.ip_address(info[4][0])
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_multicast:
            raise ValueError("Ссылка недоступна")


class SafeRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        check_public_host(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def http_get(url, limit=MAX_IMAGE_BYTES):
    check_public_host(url)
    opener = urllib.request.build_opener(SafeRedirect)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with opener.open(req, timeout=4) as resp:
        data = resp.read(limit + 1)
    if len(data) > limit:
        raise ValueError("Файл слишком большой (максимум 8 МБ)")
    return data


def normalize_photo_url(url):
    url = url.strip().split()[0] if url.strip() else ""
    host = urllib.parse.urlparse(url).hostname or ""
    if "drive.google.com" in host or "docs.google.com" in host:
        if "/folders/" in url:
            raise ValueError("Это ссылка на папку. Нужна ссылка на конкретное фото")
        m = re.search(r"/d/([\w-]+)", url) or re.search(r"[?&]id=([\w-]+)", url)
        if not m:
            raise ValueError("Не удалось распознать ссылку Google Drive")
        return f"https://drive.google.com/uc?export=download&id={m.group(1)}"
    if host.endswith("yandex.ru") or host.endswith("yandex.com") or host == "yadi.sk":
        api = "https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=" + urllib.parse.quote(url, safe="")
        href = json.loads(http_get(api, 200000)).get("href")
        if not href:
            raise ValueError("Не удалось получить файл с Яндекс.Диска")
        return href
    return url


def download_image(url):
    try:
        data = http_get(normalize_photo_url(url))
    except ValueError:
        raise
    except Exception:
        raise ValueError("Не удалось скачать фото по ссылке. Проверьте, что доступ открыт для всех")
    ctype = detect_image(data)
    if not ctype:
        raise ValueError("По ссылке не фотография. Нужна прямая ссылка на изображение")
    return data, ctype


def s3_client():
    return boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )


def store_photo(full_name, inst_id, data, ctype):
    import time
    ext = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif"}[ctype]
    stamp = int(time.time())
    base = f"{name_slug(full_name, inst_id)}-{stamp}"
    key = f"instructor-photos/{base}.{ext}"
    s3 = s3_client()
    s3.put_object(Bucket="files", Key=key, Body=data, ContentType=ctype)
    return cdn_prefix() + key


def resolve_photo(cur, inst_id, full_name, new_url):
    """Возвращает (url, ошибка). Чужие ссылки скачивает и кладёт в хранилище."""
    new_url = (new_url or "").strip()
    if not new_url or new_url.startswith(cdn_prefix()):
        return new_url, None
    cur.execute("SELECT photo_url FROM shodhan_instructors WHERE id = %s", (inst_id,))
    row = cur.fetchone()
    if row and (row[0] or "") == new_url:
        return new_url, None
    try:
        data, ctype = download_image(new_url)
        return store_photo(full_name, inst_id, data, ctype), None
    except ValueError as e:
        return None, str(e)
    except Exception:
        return None, "Не удалось сохранить фото"


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    token = (event.get("headers") or {}).get("X-Session-Token", "")
    action = body.get("action", "")

    conn = get_conn()
    cur = conn.cursor()

    # ── LOGIN ─────────────────────────────────────────────────────────────────
    if action == "login":
        login_val = (body.get("login") or "").strip()
        password = (body.get("password") or "").strip()

        if not login_val or not password:
            conn.close()
            return err("Введите логин и пароль")

        pw_hash = hash_password(password)
        cur.execute(
            "SELECT id, full_name, cities, bio, photo_url, role FROM shodhan_instructors WHERE lower(login) = lower(%s) AND password_hash = %s",
            (norm_login(login_val), pw_hash),
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return err("Неверный логин или пароль")

        inst_id, name, cities, bio, photo_url, role = row
        new_token = secrets.token_hex(32)
        cur.execute("UPDATE shodhan_instructors SET session_token = %s WHERE id = %s", (new_token, inst_id))
        conn.commit()
        conn.close()
        return ok({
            "success": True,
            "token": new_token,
            "instructor": {
                "id": inst_id,
                "full_name": name,
                "cities": cities or [],
                "bio": bio or "",
                "photo_url": photo_url or "",
                "role": role,
            },
        })

    # ── ME ────────────────────────────────────────────────────────────────────
    if action == "me":
        row = get_instructor_by_token(cur, token)
        if not row:
            conn.close()
            return err("Токен недействителен", 401)
        inst_id, name, cities, bio, photo_url, role = row
        cur.execute("SELECT gender, age, experience_years, telegram, vk, login FROM shodhan_instructors WHERE id = %s", (inst_id,))
        g, a, e, t, v, lg = cur.fetchone()
        conn.close()
        return ok({"id": inst_id, "full_name": name, "cities": cities or [], "bio": bio or "", "photo_url": photo_url or "", "role": role,
                   "gender": g or "", "age": a, "experience_years": e, "telegram": t or "", "vk": v or "", "login": lg or ""})

    # ── LOGOUT ────────────────────────────────────────────────────────────────
    if action == "logout":
        if token:
            cur.execute("UPDATE shodhan_instructors SET session_token = NULL WHERE session_token = %s", (token,))
            conn.commit()
        conn.close()
        return ok({"success": True})

    # ── UPDATE PROFILE ────────────────────────────────────────────────────────
    if action == "update":
        row = get_instructor_by_token(cur, token)
        if not row:
            conn.close()
            return err("Требуется авторизация", 401)
        inst_id = row[0]
        cities = parse_cities(body)
        if cities is None:
            cities = row[2] or []
        full_name = (body.get("full_name") or "").strip() or row[1]
        photo_url, perr = resolve_photo(cur, inst_id, full_name, body.get("photo_url"))
        if perr:
            conn.close()
            return err(perr)
        cur.execute(
            """UPDATE shodhan_instructors
               SET full_name=%s, city=%s, cities=%s, gender=%s, age=%s, experience_years=%s,
                   telegram=%s, vk=%s, bio=%s, photo_url=%s
               WHERE id=%s""",
            (full_name, cities[0] if cities else "", cities,
             (body.get("gender") or "").strip() or None, body.get("age") or None,
             body.get("experience_years") or None,
             (body.get("telegram") or "").strip() or None, (body.get("vk") or "").strip() or None,
             (body.get("bio") or "").strip(), photo_url, inst_id),
        )
        conn.commit()
        conn.close()
        return ok({"success": True})

    # ── SELF: CHANGE LOGIN / PASSWORD ─────────────────────────────────────────
    if action == "update_credentials":
        row = get_instructor_by_token(cur, token)
        if not row:
            conn.close()
            return err("Требуется авторизация", 401)
        inst_id = row[0]
        login_val = norm_login(body.get("login") or "")
        password = (body.get("password") or "").strip()
        if not login_val:
            conn.close()
            return err("Логин не может быть пустым")
        if password and len(password) < 6:
            conn.close()
            return err("Пароль должен быть не короче 6 символов")
        cur.execute("SELECT id FROM shodhan_instructors WHERE lower(login) = %s AND id != %s", (login_val, inst_id))
        if cur.fetchone():
            conn.close()
            return err("Такой логин уже занят")
        if password:
            cur.execute(
                "UPDATE shodhan_instructors SET login=%s, password_hash=%s, phone=%s WHERE id=%s",
                (login_val, hash_password(password), "login:" + login_val, inst_id),
            )
        else:
            cur.execute(
                "UPDATE shodhan_instructors SET login=%s, phone=%s WHERE id=%s",
                (login_val, "login:" + login_val, inst_id),
            )
        conn.commit()
        conn.close()
        return ok({"success": True})

    # ── PHOTO: FETCH BY LINK (для обрезки в браузере) ─────────────────────────
    if action == "fetch_photo":
        if not get_instructor_by_token(cur, token):
            conn.close()
            return err("Требуется авторизация", 401)
        conn.close()
        try:
            data, ctype = download_image(body.get("url") or "")
        except ValueError as e:
            return err(str(e))
        return ok({"data_url": f"data:{ctype};base64," + base64.b64encode(data).decode()})

    # ── PHOTO: UPLOAD (обрезанное + оригинал) ─────────────────────────────────
    if action == "upload_photo":
        row = get_instructor_by_token(cur, token)
        if not row:
            conn.close()
            return err("Требуется авторизация", 401)
        target_id = row[0]
        if body.get("instructor_id") and int(body["instructor_id"]) != row[0]:
            if row[5] != "admin":
                conn.close()
                return err("Нет прав доступа", 403)
            target_id = int(body["instructor_id"])
        cur.execute("SELECT full_name FROM shodhan_instructors WHERE id = %s", (target_id,))
        t = cur.fetchone()
        if not t:
            conn.close()
            return err("Инструктор не найден", 404)
        try:
            cropped = base64.b64decode(body.get("image") or "")
        except Exception:
            conn.close()
            return err("Некорректный файл")
        ctype = detect_image(cropped)
        if not cropped or len(cropped) > MAX_IMAGE_BYTES or not ctype:
            conn.close()
            return err("Нужна фотография до 8 МБ")
        cur.execute("SELECT photo_url FROM shodhan_instructors WHERE id = %s", (target_id,))
        prev = (cur.fetchone() or [""])[0] or ""
        url = store_photo(t[0], target_id, cropped, ctype)
        if prev.startswith(cdn_prefix() + "instructor-photos/") and prev != url:
            try:
                s3_client().delete_object(Bucket="files", Key=prev[len(cdn_prefix()):])
            except Exception:
                pass
        cur.execute("UPDATE shodhan_instructors SET photo_url = %s WHERE id = %s", (url, target_id))
        conn.commit()
        conn.close()
        return ok({"success": True, "photo_url": url})

    # ── PUBLIC: LIST INSTRUCTORS ───────────────────────────────────────────────
    if action == "public_instructors":
        cur.execute(
            """SELECT id, full_name, cities, bio, photo_url, gender, age, experience_years, telegram, vk
               FROM shodhan_instructors
               WHERE role = 'instructor'
               ORDER BY full_name"""
        )
        rows = cur.fetchall()
        conn.close()
        return ok({"instructors": [
            {
                "id": r[0], "full_name": r[1], "cities": r[2] or [],
                "bio": r[3] or "", "photo_url": r[4] or "",
                "gender": r[5] or "", "age": r[6],
                "experience_years": r[7], "telegram": r[8] or "", "vk": r[9] or ""
            }
            for r in rows
        ]})

    # ── ADMIN: LIST ───────────────────────────────────────────────────────────
    if action == "admin_list":
        row, error = require_admin(cur, token)
        if error:
            conn.close()
            return error
        cur.execute(
            """SELECT id, full_name, login, cities, role, created_at,
                      gender, age, experience_years, telegram, vk, photo_url, bio
               FROM shodhan_instructors ORDER BY created_at"""
        )
        rows = cur.fetchall()
        conn.close()
        return ok({"instructors": [
            {
                "id": r[0], "full_name": r[1], "login": r[2], "cities": r[3] or [],
                "role": r[4], "created_at": str(r[5]),
                "gender": r[6] or "", "age": r[7], "experience_years": r[8],
                "telegram": r[9] or "", "vk": r[10] or "",
                "photo_url": r[11] or "", "bio": r[12] or ""
            }
            for r in rows
        ]})

    # ── ADMIN: CREATE ─────────────────────────────────────────────────────────
    if action == "admin_create":
        row, error = require_admin(cur, token)
        if error:
            conn.close()
            return error

        login_val = (body.get("login") or "").strip()
        password = (body.get("password") or "").strip()
        full_name = (body.get("full_name") or "").strip()
        cities = parse_cities(body) or []
        gender = (body.get("gender") or "").strip() or None
        age = body.get("age") or None
        experience_years = body.get("experience_years") or None
        telegram = (body.get("telegram") or "").strip() or None
        vk = (body.get("vk") or "").strip() or None

        if not login_val or not password or not full_name:
            conn.close()
            return err("Заполните логин, пароль и имя")

        cur.execute("SELECT id FROM shodhan_instructors WHERE login = %s", (login_val,))
        if cur.fetchone():
            conn.close()
            return err("Инструктор с таким логином уже существует")

        pw_hash = hash_password(password)
        phone_placeholder = "login:" + login_val
        cur.execute(
            """INSERT INTO shodhan_instructors
               (full_name, phone, city, cities, login, password_hash, role, gender, age, experience_years, telegram, vk)
               VALUES (%s, %s, %s, %s, %s, %s, 'instructor', %s, %s, %s, %s, %s) RETURNING id""",
            (full_name, phone_placeholder, cities[0] if cities else "", cities, login_val, pw_hash, gender, age, experience_years, telegram, vk),
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return ok({"success": True, "id": new_id})

    # ── ADMIN: UPDATE INSTRUCTOR ───────────────────────────────────────────────
    if action == "admin_update":
        row, error = require_admin(cur, token)
        if error:
            conn.close()
            return error
        target_id = body.get("id")
        if not target_id:
            conn.close()
            return err("Не указан id")
        full_name = (body.get("full_name") or "").strip()
        cities = parse_cities(body)
        if cities is None:
            cur.execute("SELECT cities FROM shodhan_instructors WHERE id = %s", (target_id,))
            existing = cur.fetchone()
            cities = existing[0] if existing and existing[0] else []
        gender = (body.get("gender") or "").strip() or None
        age = body.get("age") or None
        experience_years = body.get("experience_years") or None
        telegram = (body.get("telegram") or "").strip() or None
        vk = (body.get("vk") or "").strip() or None
        bio = (body.get("bio") or "").strip()
        photo_url, perr = resolve_photo(cur, target_id, full_name, body.get("photo_url"))
        if perr:
            conn.close()
            return err(perr)
        cur.execute(
            """UPDATE shodhan_instructors
               SET full_name=%s, city=%s, cities=%s, gender=%s, age=%s, experience_years=%s,
                   telegram=%s, vk=%s, bio=%s, photo_url=%s
               WHERE id=%s""",
            (full_name, cities[0] if cities else "", cities, gender, age, experience_years, telegram, vk, bio, photo_url, target_id),
        )
        conn.commit()
        conn.close()
        return ok({"success": True})

    # ── ADMIN: DELETE ─────────────────────────────────────────────────────────
    if action == "admin_delete":
        row, error = require_admin(cur, token)
        if error:
            conn.close()
            return error
        target_id = body.get("id")
        if not target_id:
            conn.close()
            return err("Не указан id")
        if target_id == row[0]:
            conn.close()
            return err("Нельзя удалить себя")
        cur.execute("DELETE FROM shodhan_events WHERE instructor_id = %s", (target_id,))
        cur.execute("DELETE FROM shodhan_instructors WHERE id = %s AND role != 'admin'", (target_id,))
        conn.commit()
        conn.close()
        return ok({"success": True})

    # ── ADMIN: SET CREDENTIALS ────────────────────────────────────────────────
    if action == "admin_set_credentials":
        row, error = require_admin(cur, token)
        if error:
            conn.close()
            return error
        target_id = body.get("id")
        login_val = (body.get("login") or "").strip()
        password = (body.get("password") or "").strip()
        if not target_id or not login_val or not password:
            conn.close()
            return err("Заполните id, логин и пароль")
        login_val = norm_login(login_val)
        cur.execute("SELECT id FROM shodhan_instructors WHERE lower(login) = %s AND id != %s", (login_val, target_id))
        if cur.fetchone():
            conn.close()
            return err("Такой логин уже занят")
        pw_hash = hash_password(password)
        phone_placeholder = "login:" + login_val
        cur.execute(
            "UPDATE shodhan_instructors SET login=%s, password_hash=%s, phone=%s WHERE id=%s",
            (login_val, pw_hash, phone_placeholder, target_id),
        )
        conn.commit()
        conn.close()
        return ok({"success": True})

    conn.close()
    return err("Неизвестный action")
