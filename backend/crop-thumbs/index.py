"""
Нарезает 2 составные картинки на 8 отдельных превью для отзывов и сохраняет в S3.
"""

import os
import io
import json
import urllib.request
import boto3
from PIL import Image

SOURCE_IMAGES = [
    {
        "url": "https://cdn.poehali.dev/projects/756e28ae-f342-42b1-ab53-44233856dec1/bucket/871a33a3-8da3-4eda-99fa-d4bcc6d1cdb3.png",
        "indices": [0, 1, 2, 3],
    },
    {
        "url": "https://cdn.poehali.dev/projects/756e28ae-f342-42b1-ab53-44233856dec1/bucket/8cd65ad0-5e05-4376-8c60-11f2af6d49dd.png",
        "indices": [4, 5, 6, 7],
    },
]

def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

def crop_4_panels(img: Image.Image):
    """Нарезает изображение на 4 равные вертикальные панели."""
    w, h = img.size
    panel_w = w // 4
    panels = []
    for i in range(4):
        x0 = i * panel_w
        x1 = (i + 1) * panel_w if i < 3 else w
        panel = img.crop((x0, 0, x1, h))
        panels.append(panel)
    return panels

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

    for source in SOURCE_IMAGES:
        req = urllib.request.Request(source["url"], headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            img_data = resp.read()

        img = Image.open(io.BytesIO(img_data)).convert("RGB")
        panels = crop_4_panels(img)

        for panel, idx in zip(panels, source["indices"]):
            key = f"rutube-thumbs/review_{idx}.jpg"
            cdn_url = f"https://cdn.poehali.dev/projects/{key_id}/bucket/{key}"

            buf = io.BytesIO()
            panel.save(buf, format="JPEG", quality=92)
            buf.seek(0)

            s3.put_object(Bucket="files", Key=key, Body=buf.read(), ContentType="image/jpeg")
            results.append({"index": idx, "url": cdn_url, "status": "uploaded"})

    return {
        "statusCode": 200,
        "headers": {**cors_headers(), "Content-Type": "application/json"},
        "body": json.dumps({"results": results}, ensure_ascii=False),
    }
