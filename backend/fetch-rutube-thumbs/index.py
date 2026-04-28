"""
Скачивает обложки видео с Rutube и сохраняет в S3.
GET / — скачивает все обложки, возвращает их CDN URL.
"""

import json
import os
import urllib.request
import urllib.parse
import boto3

VIDEOS = [
    "https://rutube.ru/video/d8a7ba60e26cfdbcc6e9eea93d9ad9c7/",
    "https://rutube.ru/video/8f2484e0e5ca253e32cea2945db51372/",
    "https://rutube.ru/video/3322e4227d230669225848181a330d49/",
    "https://rutube.ru/video/e3029ca73a9f9f2097a29f970ab02840/",
    "https://rutube.ru/video/1b8cb409c646c7a545c1dd1e29323805/",
    "https://rutube.ru/video/db5095fa28cd19c42a34ba6be3466e1b/",
    "https://rutube.ru/video/adbd840929c7a79a6321185f79c19192/",
    "https://rutube.ru/video/c4846d76fde4e0149e8047d76e89b3a9/",
]

def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    key_id = os.environ["AWS_ACCESS_KEY_ID"]

    results = []
    for i, video_url in enumerate(VIDEOS):
        key = f"rutube-thumbs/review_{i}.jpg"
        cdn_url = f"https://cdn.poehali.dev/projects/{key_id}/bucket/{key}"

        # Проверяем, уже загружено
        try:
            s3.head_object(Bucket="files", Key=key)
            results.append({"index": i, "url": cdn_url, "status": "cached"})
            continue
        except Exception:
            pass

        # Получаем thumbnail через oEmbed
        oembed_url = f"https://rutube.ru/api/oembed/?url={urllib.parse.quote(video_url)}&format=json"
        req = urllib.request.Request(oembed_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        thumb_url = data.get("thumbnail_url")
        if not thumb_url:
            results.append({"index": i, "url": None, "status": "no_thumb"})
            continue

        # Скачиваем картинку
        req2 = urllib.request.Request(thumb_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req2, timeout=10) as resp2:
            img_data = resp2.read()

        # Сохраняем в S3
        s3.put_object(Bucket="files", Key=key, Body=img_data, ContentType="image/jpeg")
        results.append({"index": i, "url": cdn_url, "status": "uploaded"})

    return {
        "statusCode": 200,
        "headers": {**cors_headers(), "Content-Type": "application/json"},
        "body": json.dumps({"thumbs": results}, ensure_ascii=False),
    }
