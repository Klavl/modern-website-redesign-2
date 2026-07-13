"""
Мероприятия инструкторов Шодхан.
action=list    — список всех активных будущих мероприятий (публичный)
action=my      — мои мероприятия (требует X-Session-Token)
action=create  — создать мероприятие (требует токен)
action=update  — обновить мероприятие (требует токен, id)
action=delete  — скрыть мероприятие (требует токен, id)
"""

import json
import os
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


def get_instructor(cur, token):
    if not token:
        return None
    cur.execute(
        "SELECT id, full_name, cities FROM shodhan_instructors WHERE session_token = %s",
        (token,),
    )
    row = cur.fetchone()
    if not row:
        return None
    inst_id, name, cities = row
    first_city = cities[0] if cities else ""
    return (inst_id, name, first_city)


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    if event.get("httpMethod") == "GET":
        body["action"] = "list"

    token = (event.get("headers") or {}).get("X-Session-Token", "")
    action = body.get("action", "list")

    conn = get_conn()
    cur = conn.cursor()

    # ── LIST (public) ─────────────────────────────────────────────────────────
    if action == "list":
        cur.execute("""
            SELECT e.id, e.title, e.description, e.event_date, e.event_time,
                   e.location, e.city, e.price, e.spots, e.contact_link,
                   i.full_name, i.photo_url, i.id, e.is_mass
            FROM shodhan_events e
            JOIN shodhan_instructors i ON i.id = e.instructor_id
            WHERE e.is_active = TRUE AND e.event_date >= CURRENT_DATE
            ORDER BY e.event_date ASC, e.event_time ASC
            LIMIT 50
        """)
        rows = cur.fetchall()
        events = [
            {
                "id": r[0], "title": r[1], "description": r[2],
                "event_date": str(r[3]), "event_time": r[4],
                "location": r[5], "city": r[6], "price": r[7],
                "spots": r[8], "contact_link": r[9],
                "instructor_name": r[10], "instructor_photo": r[11],
                "instructor_id": r[12], "is_mass": r[13],
            }
            for r in rows
        ]
        conn.close()
        return ok({"events": events})

    # ── MY EVENTS ─────────────────────────────────────────────────────────────
    if action == "my":
        inst = get_instructor(cur, token)
        if not inst:
            conn.close()
            return err("Требуется авторизация", 401)
        inst_id = inst[0]
        cur.execute("""
            SELECT id, title, description, event_date, event_time,
                   location, city, price, spots, contact_link, is_active, is_mass
            FROM shodhan_events
            WHERE instructor_id = %s
            ORDER BY event_date DESC
        """, (inst_id,))
        rows = cur.fetchall()
        events = [
            {
                "id": r[0], "title": r[1], "description": r[2],
                "event_date": str(r[3]), "event_time": r[4],
                "location": r[5], "city": r[6], "price": r[7],
                "spots": r[8], "contact_link": r[9], "is_active": r[10],
                "is_mass": r[11],
            }
            for r in rows
        ]
        conn.close()
        return ok({"events": events})

    # ── CREATE ────────────────────────────────────────────────────────────────
    if action == "create":
        inst = get_instructor(cur, token)
        if not inst:
            conn.close()
            return err("Требуется авторизация", 401)
        inst_id, inst_name, inst_city = inst

        event_date = (body.get("event_date") or "").strip()
        event_time = (body.get("event_time") or "").strip()
        location = (body.get("location") or "").strip()
        city = (body.get("city") or inst_city).strip()
        is_mass = bool(body.get("is_mass", False))

        if not event_date or not event_time or not location:
            conn.close()
            return err("Заполните дату, время и место")

        cur.execute("""
            INSERT INTO shodhan_events
              (instructor_id, title, description, event_date, event_time, location, city, price, spots, contact_link, is_mass)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            inst_id, "ШОДХАН",
            body.get("description", ""),
            event_date, event_time, location, city,
            body.get("price", "Бесплатно"),
            int(body.get("spots") or 0),
            body.get("contact_link", ""),
            is_mass,
        ))
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return ok({"success": True, "id": new_id})

    # ── UPDATE ────────────────────────────────────────────────────────────────
    if action == "update":
        inst = get_instructor(cur, token)
        if not inst:
            conn.close()
            return err("Требуется авторизация", 401)
        inst_id = inst[0]
        event_id = body.get("id")
        if not event_id:
            conn.close()
            return err("Не указан id мероприятия")

        cur.execute("SELECT id FROM shodhan_events WHERE id = %s AND instructor_id = %s", (event_id, inst_id))
        if not cur.fetchone():
            conn.close()
            return err("Мероприятие не найдено", 404)

        event_date = (body.get("event_date") or "").strip()
        event_time = (body.get("event_time") or "").strip()
        location = (body.get("location") or "").strip()
        is_mass = bool(body.get("is_mass", False))

        if not event_date or not event_time or not location:
            conn.close()
            return err("Заполните все обязательные поля")

        cur.execute("""
            UPDATE shodhan_events SET
              title = 'ШОДХАН', description = %s, event_date = %s, event_time = %s,
              location = %s, city = %s, price = %s, spots = %s, contact_link = %s,
              is_mass = %s
            WHERE id = %s AND instructor_id = %s
        """, (
            body.get("description", ""),
            event_date, event_time, location,
            body.get("city", ""), body.get("price", "Бесплатно"),
            int(body.get("spots") or 0), body.get("contact_link", ""),
            is_mass,
            event_id, inst_id,
        ))
        conn.commit()
        conn.close()
        return ok({"success": True})

    # ── DELETE (deactivate) ───────────────────────────────────────────────────
    if action == "delete":
        inst = get_instructor(cur, token)
        if not inst:
            conn.close()
            return err("Требуется авторизация", 401)
        inst_id = inst[0]
        event_id = body.get("id")
        if not event_id:
            conn.close()
            return err("Не указан id")

        cur.execute(
            "UPDATE shodhan_events SET is_active = FALSE WHERE id = %s AND instructor_id = %s",
            (event_id, inst_id),
        )
        conn.commit()
        conn.close()
        return ok({"success": True})

    conn.close()
    return err("Неизвестное действие", 400)