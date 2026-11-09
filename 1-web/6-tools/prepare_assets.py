#!/usr/bin/env python3
"""
Przygotowanie assetów do publikacji w nowej stronie.

Czyta oryginały z 0-assets/ i generuje zoptymalizowane pliki do 7-public/:
  - WebP w kilku szerokościach (hero, strefy),
  - przezroczyste WebP dla logotypów partnerów,
  - ikony (SVG + PNG) i favicon,
  - obrazek Open Graph 1200x630.

Skrypt jest idempotentny: można go uruchamiać wielokrotnie.
Wymaga: Pillow.

Użycie:
    python3 scripts/prepare_assets.py
"""

from __future__ import annotations

import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "0-assets"
OUT = ROOT / "7-public"

FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"


def ensure_dirs() -> None:
    for d in ("img/strefy", "img/trenerzy", "img/uslugi", "img/partnerzy", "brand", "og", "media"):
        (OUT / d).mkdir(parents=True, exist_ok=True)


def save_webp(im: Image.Image, path: Path, quality: int = 82) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "WEBP", quality=quality, method=6)
    return path.stat().st_size


def widths(src_w: int, steps: list[int]) -> list[int]:
    """Zwraca listę szerokości <= szerokości źródła, malejąco."""
    return sorted({w for w in steps if w <= src_w}, reverse=True)


def crop_alpha(im: Image.Image, threshold: int = 200) -> Image.Image:
    alpha = im.getchannel("A")
    bbox = alpha.point(lambda p: 255 if p > threshold else 0).getbbox()
    return im.crop(bbox) if bbox else im


def build_zones() -> list[dict]:
    mapping = {
        "wolneCiezary.png": "wolne-ciezary",
        "maszynyZeStosem.png": "maszyny-ze-stosem",
        "cardio.png": "cardio",
        "rozgrzewka.png": "sala-funkcjonalna",
        "cross.png": "sala-cross",
        "rollWibra.png": "rollmasaz",
    }
    out = []
    for filename, slug in mapping.items():
        src = SRC / "photos" / "zones" / filename
        im = Image.open(src).convert("RGB")
        for w in widths(im.width, [1400, 900, 711, 500]):
            h = round(im.height * w / im.width)
            resized = im.resize((w, h), Image.LANCZOS)
            p = OUT / "img" / "strefy" / f"{slug}-{w}.webp"
            size = save_webp(resized, p, 80)
            out.append({"file": str(p.relative_to(ROOT)), "w": w, "kb": round(size / 1024)})
    return out


def build_services() -> list[dict]:
    mapping = {
        "badminton.png": "badminton",
        "sauna.png": "sauna",
        "bufet.png": "bufet-sklep",
    }
    out = []
    for filename, slug in mapping.items():
        src = SRC / "photos" / "services" / filename
        im = Image.open(src).convert("RGB")
        for w in widths(im.width, [1152, 900, 711, 500]):
            h = round(im.height * w / im.width)
            resized = im.resize((w, h), Image.LANCZOS)
            p = OUT / "img" / "uslugi" / f"{slug}-{w}.webp"
            size = save_webp(resized, p, 80)
            out.append({"file": str(p.relative_to(ROOT)), "w": w, "kb": round(size / 1024)})
    return out


def build_trainers() -> list[dict]:
    mapping = {
        "krzysztof.jpg": "krzysztof",
        "lukasz.jpg": "lukasz",
        "rafal.jpg": "rafal",
        "cezary.jpg": "cezary",
        "artur.jpg": "artur",
    }
    out = []
    for filename, slug in mapping.items():
        src = SRC / "photos" / "trainers" / filename
        im = Image.open(src).convert("RGB")
        # Zdjęcia profilowe są kwadratowe (150×150) — kadr bez zmian,
        # natywna rozdzielczość wystarcza na awatar 64/80 px.
        side = min(im.size)
        left = (im.width - side) // 2
        top = (im.height - side) // 2
        im = im.crop((left, top, left + side, top + side))
        p = OUT / "img" / "trenerzy" / f"{slug}.webp"
        size = save_webp(im, p, 88)
        out.append({"file": str(p.relative_to(ROOT)), "kb": round(size / 1024)})
    return out


def build_partners() -> list[dict]:
    mapping = {
        "multisport.png": "multisport",
        "medicover.png": "medicover",
        "fitProfit.png": "fitprofit",
        "pzu.png": "pzu",
    }
    out = []
    for filename, slug in mapping.items():
        src = SRC / "partners" / filename
        im = Image.open(src).convert("RGBA")
        # Kafle mają ~360 px szerokości — zostawiamy natywną rozdzielczość
        # (maks. 900 px), żeby nie upscalować w przeglądarce.
        w = min(im.width, 900)
        h = round(im.height * w / im.width)
        resized = im.resize((w, h), Image.LANCZOS)
        p = OUT / "img" / "partnerzy" / f"{slug}.webp"
        size = save_webp(resized, p, 90)
        out.append({"file": str(p.relative_to(ROOT)), "kb": round(size / 1024)})
    return out


def build_brand() -> list[dict]:
    out = []
    # Wektorowa ikona (biały znak do umieszczenia na czerwonym tle).
    svg_src = SRC / "logos" / "svg" / "IconParysLogoMini.svg"
    shutil.copy2(svg_src, OUT / "brand" / "icon-mark.svg")
    out.append({"file": "7-public/brand/icon-mark.svg"})

    # Pełne logo (pionowe) do stopki / materiałów.
    logo = Image.open(SRC / "logos" / "renders" / "parys-logo-primary.png").convert("RGBA")
    logo = crop_alpha(logo)
    logo.thumbnail((900, 900), Image.LANCZOS)
    save_webp(logo, OUT / "brand" / "logo.webp", 90)
    out.append({"file": "7-public/brand/logo.webp"})

    # Ikona kwadratowa (czerwony kafel) — apple-touch-icon / PWA.
    icon = Image.open(SRC / "logos" / "renders" / "parys-icon.png").convert("RGBA")
    icon = crop_alpha(icon)
    side = max(icon.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.alpha_composite(icon, ((side - icon.width) // 2, (side - icon.height) // 2))
    for px in (512, 192, 180):
        canvas.resize((px, px), Image.LANCZOS).save(
            OUT / "brand" / f"icon-{px}.png", "PNG", optimize=True
        )
        out.append({"file": f"7-public/brand/icon-{px}.png"})

    # Favicon z oryginału.
    fav = SRC / "seo" / "favicon.ico"
    if fav.exists():
        shutil.copy2(fav, OUT / "favicon.ico")
        out.append({"file": "7-public/favicon.ico"})
    return out


def build_og() -> list[dict]:
    hero = Image.open(SRC / "photos" / "hero" / "SilowniaBackgroundLarge.png").convert("RGB")
    W, H = 1200, 630
    # Kadr 1200x630 z wyśrodkowaniem.
    ratio = max(W / hero.width, H / hero.height)
    resized = hero.resize((round(hero.width * ratio), round(hero.height * ratio)), Image.LANCZOS)
    left = (resized.width - W) // 2
    top = (resized.height - H) // 2
    canvas = resized.crop((left, top, left + W, top + H))

    # Przyciemnienie + czerwony pas.
    overlay = Image.new("RGBA", (W, H), (11, 11, 12, 165))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay)
    draw = ImageDraw.Draw(canvas)
    draw.rectangle([0, 0, 14, H], fill=(227, 30, 36, 255))

    big = ImageFont.truetype(FONT_BOLD, 92)
    small = ImageFont.truetype(FONT_REG, 30)
    tiny = ImageFont.truetype(FONT_BOLD, 20)
    draw.text((70, 150), "SPORT STUDIO PARYS", font=big, fill=(255, 255, 255, 255))
    draw.text((70, 262), "SIŁOWNIA I KLUB FITNESS W NYSIE · OD 1989", font=small, fill=(200, 200, 205, 255))
    draw.text((70, 360), "CZYNNE CAŁĄ DOBĘ", font=big, fill=(227, 30, 36, 255))
    draw.text((70, 500), "PARYS.NYSA.PL", font=tiny, fill=(255, 255, 255, 255))

    p = OUT / "og" / "og-default.jpg"
    canvas.convert("RGB").save(p, "JPEG", quality=86, optimize=True, progressive=True)
    return [{"file": str(p.relative_to(ROOT)), "kb": round(p.stat().st_size / 1024)}]


def main() -> None:
    ensure_dirs()
    report = {
        "strefy": build_zones(),
        "uslugi": build_services(),
        "trenerzy": build_trainers(),
        "partnerzy": build_partners(),
        "brand": build_brand(),
        "og": build_og(),
    }
    total = sum(f.stat().st_size for f in OUT.rglob("*") if f.is_file())
    print(json.dumps({k: len(v) for k, v in report.items()}, indent=2, ensure_ascii=False))
    print(f"7-public/ razem: {total / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
