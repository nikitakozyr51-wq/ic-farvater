#!/usr/bin/env python3
"""Конвертирует все PNG/JPG/GIF в assets/images/ → WebP. Удаляет оригиналы."""
import os, sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')
ROOT = r"D:\site\assets\images"
EXTS = ('.png', '.jpg', '.jpeg', '.gif')

def convert(src):
    dst = os.path.splitext(src)[0] + '.webp'
    if os.path.exists(dst):
        print(f"SKIP exists: {dst}")
        return
    try:
        img = Image.open(src)
        is_anim = getattr(img, 'is_animated', False)
        if is_anim:
            # Animated GIF → animated WebP
            img.save(dst, 'WEBP', save_all=True, quality=85, method=6)
        else:
            if img.mode in ('P', 'LA'):
                img = img.convert('RGBA')
            # lossless для PNG, quality=90 для JPG
            if src.lower().endswith(('.jpg', '.jpeg')):
                img.save(dst, 'WEBP', quality=88, method=6)
            else:
                img.save(dst, 'WEBP', lossless=True, quality=90, method=6)
        old_size = os.path.getsize(src)
        new_size = os.path.getsize(dst)
        saved = (old_size - new_size) / old_size * 100
        print(f"{os.path.relpath(src, ROOT):60} {old_size//1024:>5}K → {new_size//1024:>5}K  ({saved:+.0f}%)")
        os.remove(src)
    except Exception as e:
        print(f"FAIL {src}: {e}")

count = 0
for root, _, files in os.walk(ROOT):
    for f in files:
        if f.lower().endswith(EXTS):
            convert(os.path.join(root, f))
            count += 1

print(f"\nDone: {count} files")
