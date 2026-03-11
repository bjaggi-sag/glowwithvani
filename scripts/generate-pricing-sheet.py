from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont


ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT_DIR / "src" / "data" / "services.content.json"
OUTPUT_DIR = ROOT_DIR / "public" / "downloads"
PNG_PATH = OUTPUT_DIR / "glowwithvani-pricing.png"
PDF_PATH = OUTPUT_DIR / "glowwithvani-pricing.pdf"

PALETTE = {
    "background": "#faf7f2",
    "surface": "#fffdf9",
    "surface_soft": "#f5efe5",
    "ink": "#241b16",
    "muted": "#6c5f51",
    "accent": "#8c6a42",
    "line": "#ddcfc0",
    "glow": "#efe3d1",
}

WIDTH = 1600
OUTER_PAD = 96
CARD_GAP = 28
COLS = 2
CARD_WIDTH = (WIDTH - OUTER_PAD * 2 - CARD_GAP) // COLS
CARD_HEIGHT = 360
HEADER_HEIGHT = 220
NOTES_HEIGHT = 220


def load_font(size: int, *, serif: bool = False, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates: list[str]
    if serif:
        candidates = [
            "/System/Library/Fonts/Supplemental/Georgia Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Georgia.ttf",
            "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
            "/usr/share/fonts/truetype/liberation2/LiberationSerif-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSerif-Regular.ttf",
            "/usr/share/fonts/liberation/LiberationSerif-Bold.ttf" if bold else "/usr/share/fonts/liberation/LiberationSerif-Regular.ttf",
        ]
    else:
        candidates = [
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/System/Library/Fonts/Supplemental/Helvetica.ttc",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
            "/usr/share/fonts/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/liberation/LiberationSans-Regular.ttf",
        ]

    candidates.extend(
        [
            "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
        ]
    )

    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size=size)
        except OSError:
            continue

    raise RuntimeError(f"No scalable font found for {'serif' if serif else 'sans'} {'bold' if bold else 'regular'} text")


FONT_KICKER = load_font(28, bold=True)
FONT_TITLE = load_font(76, serif=True)
FONT_SUBTITLE = load_font(28)
FONT_CARD_TITLE = load_font(38, serif=True)
FONT_CARD_PRICE = load_font(30, bold=True)
FONT_CARD_BODY = load_font(23)
FONT_NOTES_HEADING = load_font(24, bold=True)
FONT_NOTES = load_font(22)


def text_size(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont) -> tuple[int, int]:
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""

    for word in words:
        candidate = f"{current} {word}".strip()
        if text_size(draw, candidate, font)[0] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word

    if current:
        lines.append(current)

    return lines


def draw_wrapped_text(
    draw: ImageDraw.ImageDraw,
    *,
    x: int,
    y: int,
    lines: Iterable[str],
    font: ImageFont.ImageFont,
    fill: str,
    line_height: int,
) -> int:
    current_y = y
    for line in lines:
        draw.text((x, current_y), line, font=font, fill=fill)
        current_y += line_height
    return current_y


with DATA_PATH.open() as handle:
    content = json.load(handle)

services = content["services"]
service_pricing_notes = content["servicePricingNotes"]

row_count = (len(services) + COLS - 1) // COLS
grid_height = row_count * CARD_HEIGHT + max(0, row_count - 1) * CARD_GAP
HEIGHT = OUTER_PAD * 2 + HEADER_HEIGHT + grid_height + NOTES_HEIGHT

image = Image.new("RGB", (WIDTH, HEIGHT), PALETTE["background"])
draw = ImageDraw.Draw(image)

# Soft background accents.
draw.ellipse((WIDTH - 440, 10, WIDTH - 80, 370), fill=PALETTE["glow"])
draw.ellipse((WIDTH - 700, HEIGHT - 620, WIDTH - 260, HEIGHT - 180), fill="#f2e6d8")

# Header.
draw.text((OUTER_PAD, 92), "GLOWWITHVANI", font=FONT_KICKER, fill=PALETTE["accent"])
draw.text((OUTER_PAD, 140), "Services & Pricing", font=FONT_TITLE, fill=PALETTE["ink"])
draw.text(
    (OUTER_PAD, 228),
    "Luxury makeup services for bridal, event, and editorial beauty.",
    font=FONT_SUBTITLE,
    fill=PALETTE["muted"],
)

for index, service in enumerate(services):
    col = index % COLS
    row = index // COLS
    x = OUTER_PAD + col * (CARD_WIDTH + CARD_GAP)
    y = OUTER_PAD + HEADER_HEIGHT + row * (CARD_HEIGHT + CARD_GAP)

    draw.rounded_rectangle(
        (x, y, x + CARD_WIDTH, y + CARD_HEIGHT),
        radius=28,
        fill=PALETTE["surface"],
        outline=PALETTE["line"],
        width=2,
    )

    inner_x = x + 40
    inner_y = y + 36
    max_text_width = CARD_WIDTH - 80

    title_lines = wrap_text(draw, service["title"], FONT_CARD_TITLE, max_text_width)
    after_title_y = draw_wrapped_text(
        draw,
        x=inner_x,
        y=inner_y,
        lines=title_lines,
        font=FONT_CARD_TITLE,
        fill=PALETTE["ink"],
        line_height=44,
    )

    price_y = after_title_y + 18
    draw.text((inner_x, price_y), service["startingPrice"], font=FONT_CARD_PRICE, fill=PALETTE["accent"])

    _, price_height = text_size(draw, service["startingPrice"], FONT_CARD_PRICE)
    description_y = price_y + price_height + 26
    description_lines = wrap_text(draw, service["description"], FONT_CARD_BODY, max_text_width)[:4]
    draw_wrapped_text(
        draw,
        x=inner_x,
        y=description_y,
        lines=description_lines,
        font=FONT_CARD_BODY,
        fill=PALETTE["muted"],
        line_height=31,
    )

notes_y = OUTER_PAD + HEADER_HEIGHT + grid_height + 36
draw.rounded_rectangle(
    (OUTER_PAD, notes_y, WIDTH - OUTER_PAD, notes_y + 164),
    radius=28,
    fill=PALETTE["surface_soft"],
    outline=PALETTE["line"],
    width=2,
)
draw.text((OUTER_PAD + 28, notes_y + 24), "NOTES", font=FONT_NOTES_HEADING, fill=PALETTE["accent"])

for index, note in enumerate(service_pricing_notes):
    line_y = notes_y + 70 + index * 36
    draw.ellipse((OUTER_PAD + 28, line_y + 8, OUTER_PAD + 36, line_y + 16), fill=PALETTE["accent"])
    draw.text((OUTER_PAD + 52, line_y), note, font=FONT_NOTES, fill=PALETTE["muted"])

draw.text(
    (OUTER_PAD + 28, notes_y + 132),
    "Final pricing may vary based on look, location, and custom requirements.",
    font=FONT_NOTES,
    fill=PALETTE["muted"],
)

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
image.save(PNG_PATH, format="PNG")
image.save(PDF_PATH, format="PDF", resolution=300)

print(f"Generated {PNG_PATH}")
print(f"Generated {PDF_PATH}")
