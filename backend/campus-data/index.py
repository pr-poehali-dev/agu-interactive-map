import json
import os

import psycopg2  # noqa: E402  psycopg2-binary

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p61924321_agu_interactive_map")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    """
    API для сохранения и загрузки данных кампуса АлтГУ:
    - GET /  → загрузить все ассеты и позиции
    - POST / → сохранить ассет (asset_key, asset_type, data_url)
    - DELETE / → удалить ассет по asset_key
    - POST /position → сохранить позицию маркера
    """
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")

    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == "GET":
            cur.execute(f"SELECT asset_key, asset_type, data_url, s3_url FROM {SCHEMA}.campus_assets")
            assets = [
                {"key": r[0], "type": r[1], "dataUrl": r[2], "s3Url": r[3]}
                for r in cur.fetchall()
            ]
            cur.execute(f"SELECT building_id, lat, lng FROM {SCHEMA}.building_positions")
            positions = {r[0]: {"lat": r[1], "lng": r[2]} for r in cur.fetchall()}
            conn.close()
            return {
                "statusCode": 200,
                "headers": {**CORS, "Content-Type": "application/json"},
                "body": json.dumps({"assets": assets, "positions": positions}),
            }

        if method == "POST" and "/position" in path:
            body = json.loads(event.get("body") or "{}")
            bid = body["buildingId"]
            lat = float(body["lat"])
            lng = float(body["lng"])
            cur.execute(
                f"""
                INSERT INTO {SCHEMA}.building_positions (building_id, lat, lng)
                VALUES (%s, %s, %s)
                ON CONFLICT (building_id) DO UPDATE SET lat=%s, lng=%s, updated_at=NOW()
                """,
                (bid, lat, lng, lat, lng),
            )
            conn.commit()
            conn.close()
            return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"ok": True})}

        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            key = body["key"]
            asset_type = body["type"]
            data_url = body.get("dataUrl", "")
            cur.execute(
                f"""
                INSERT INTO {SCHEMA}.campus_assets (asset_key, asset_type, data_url)
                VALUES (%s, %s, %s)
                ON CONFLICT (asset_key) DO UPDATE SET asset_type=%s, data_url=%s, updated_at=NOW()
                """,
                (key, asset_type, data_url, asset_type, data_url),
            )
            conn.commit()
            conn.close()
            return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"ok": True})}

        if method == "DELETE":
            body = json.loads(event.get("body") or "{}")
            key = body["key"]
            cur.execute(f"DELETE FROM {SCHEMA}.campus_assets WHERE asset_key=%s", (key,))
            conn.commit()
            conn.close()
            return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"ok": True})}

        conn.close()
        return {"statusCode": 405, "headers": CORS, "body": "Method not allowed"}

    except Exception as e:
        conn.rollback()
        conn.close()
        return {"statusCode": 500, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": str(e)})}