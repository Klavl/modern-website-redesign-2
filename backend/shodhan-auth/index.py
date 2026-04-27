"""
Авторизация инструкторов Шодхан.
action=login         — вход по логину+паролю
action=me            — получить профиль (X-Session-Token)
action=logout        — выход
action=update        — обновить профиль (bio, city, photo_url)
action=admin_list    — список инструкторов (только admin)
action=admin_create  — создать инструктора (только admin)
action=admin_delete  — удалить инструктора (только admin)
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

    # ── ADMIN: LIST ───────────────────────────────────────────────────────────
    if action == "admin_list":
        row, error = require_admin(cur, token)
        if error:
            conn.close()
            return error
        cur.execute(
            "SELECT id, full_name, login, city, role, created_at FROM shodhan_instructors ORDER BY created_at"
        )
        rows = cur.fetchall()
        conn.close()
        return ok({"instructors": [
            {"id": r[0], "full_name": r[1], "login": r[2], "city": r[3], "role": r[4], "created_at": str(r[5])}
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

        if not login_val or not password or not full_name:
            conn.close()
            return err("Заполните логин, пароль и имя")

        cur.execute("SELECT id FROM shodhan_instructors WHERE login = %s", (login_val,))
        if cur.fetchone():
            conn.close()
            return err("Инструктор с таким логином уже существует")

        pw_hash = hash_password(password)
        # phone уникален и NOT NULL — используем логин как заполнитель
        phone_placeholder = f"login:{login_val}"
        cur.execute(
            "INSERT INTO shodhan_instructors (full_name, phone, city, login, password_hash, role) VALUES (%s, %s, %s, %s, %s, 'instructor') RETURNING id",
            (full_name, phone_placeholder, city, login_val, pw_hash),
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return ok({"success": True, "id": new_id})

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
        # Нельзя удалить себя
        if target_id == row[0]:
            conn.close()
            return err("Нельзя удалить себя")
        cur.execute("DELETE FROM shodhan_instructors WHERE id = %s AND role != 'admin'", (target_id,))
        conn.commit()
        conn.close()
        return ok({"success": True})

    conn.close()
    return err("Неизвестное действие", 400)