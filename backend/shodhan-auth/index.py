"""
Авторизация инструкторов Шодхан.
action=login              — вход по логину+паролю
action=me                 — получить профиль (X-Session-Token)
action=logout             — выход
action=update             — обновить профиль (bio, city, photo_url)
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
import psycopg2

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


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_instructor_by_token(cur, token):
    if not token:
        return None
    cur.execute(
        "SELECT id, full_name, city, bio, photo_url, role FROM shodhan_instructors WHERE session_token = %s",
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
            "SELECT id, full_name, city, bio, photo_url, role FROM shodhan_instructors WHERE login = %s AND password_hash = %s",
            (login_val, pw_hash),
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return err("Неверный логин или пароль")

        inst_id, name, city, bio, photo_url, role = row
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
                "city": city or "",
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
        inst_id, name, city, bio, photo_url, role = row
        conn.close()
        return ok({"id": inst_id, "full_name": name, "city": city or "", "bio": bio or "", "photo_url": photo_url or "", "role": role})

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
        cur.execute(
            "UPDATE shodhan_instructors SET bio = %s, photo_url = %s, city = %s WHERE id = %s",
            (body.get("bio", ""), body.get("photo_url", ""), body.get("city", ""), inst_id),
        )
        conn.commit()
        conn.close()
        return ok({"success": True})

    # ── PUBLIC: LIST INSTRUCTORS ───────────────────────────────────────────────
    if action == "public_instructors":
        cur.execute(
            """SELECT id, full_name, city, bio, photo_url, gender, age, experience_years, telegram, vk
               FROM shodhan_instructors
               WHERE role = 'instructor'
               ORDER BY full_name"""
        )
        rows = cur.fetchall()
        conn.close()
        return ok({"instructors": [
            {
                "id": r[0], "full_name": r[1], "city": r[2] or "",
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
            """SELECT id, full_name, login, city, role, created_at,
                      gender, age, experience_years, telegram, vk, photo_url, bio
               FROM shodhan_instructors ORDER BY created_at"""
        )
        rows = cur.fetchall()
        conn.close()
        return ok({"instructors": [
            {
                "id": r[0], "full_name": r[1], "login": r[2], "city": r[3] or "",
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
        city = (body.get("city") or "").strip()
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
               (full_name, phone, city, login, password_hash, role, gender, age, experience_years, telegram, vk)
               VALUES (%s, %s, %s, %s, %s, 'instructor', %s, %s, %s, %s, %s) RETURNING id""",
            (full_name, phone_placeholder, city, login_val, pw_hash, gender, age, experience_years, telegram, vk),
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
        city = (body.get("city") or "").strip()
        gender = (body.get("gender") or "").strip() or None
        age = body.get("age") or None
        experience_years = body.get("experience_years") or None
        telegram = (body.get("telegram") or "").strip() or None
        vk = (body.get("vk") or "").strip() or None
        bio = (body.get("bio") or "").strip()
        photo_url = (body.get("photo_url") or "").strip()
        cur.execute(
            """UPDATE shodhan_instructors
               SET full_name=%s, city=%s, gender=%s, age=%s, experience_years=%s,
                   telegram=%s, vk=%s, bio=%s, photo_url=%s
               WHERE id=%s""",
            (full_name, city, gender, age, experience_years, telegram, vk, bio, photo_url, target_id),
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
        cur.execute("SELECT id FROM shodhan_instructors WHERE login = %s AND id != %s", (login_val, target_id))
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
