#!/usr/bin/env python3
"""Render game bitmap font titles as gold-on-transparent PNG images.

Font formats:
  e3.fnt  — 8x16 ASCII bitmap font (256 chars x 16 bytes = 4096B)
  h04.fnt — 16x16 Korean jamo composition font (360 glyphs x 32 bytes = 11520B)
            Layout: 8 cho groups x 20 + 4 jung groups x 22 + 4 jong groups x 28 = 360
"""
import os
import sys

try:
    from PIL import Image
except ImportError:
    print("Error: pip install Pillow", file=sys.stderr)
    sys.exit(1)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(SCRIPT_DIR, '..', 'docs', 'assets', 'logo')
OUTPUT_DIR = os.path.join(SCRIPT_DIR, '..', 'public', 'assets', 'titles')

GOLD = (0xFF, 0xC3, 0x32, 0xFF)
WHITE = (0xFF, 0xFF, 0xFF, 0xFF)
BLUE = (0x83, 0x9B, 0xCB, 0xFF)
TRANSPARENT = (0, 0, 0, 0)


# ── Font loaders ──────────────────────────────────────────────

def load_ascii_font(path):
    """Load 8x16 bitmap font. Returns dict[charcode] -> list[16 rows of 8 bits]."""
    with open(path, 'rb') as f:
        data = f.read()
    glyphs = {}
    for i in range(256):
        off = i * 16
        glyphs[i] = [[(data[off + y] >> (7 - x)) & 1 for x in range(8)] for y in range(16)]
    return glyphs


def load_korean_font(path):
    """Load 16x16 jamo font. Returns list[360] of 16x16 bitmaps."""
    with open(path, 'rb') as f:
        data = f.read()
    glyphs = []
    for i in range(360):
        off = i * 32
        rows = []
        for y in range(16):
            w = (data[off + y * 2] << 8) | data[off + y * 2 + 1]
            rows.append([(w >> (15 - x)) & 1 for x in range(16)])
        glyphs.append(rows)
    return glyphs


# ── Korean jamo composition ──────────────────────────────────

# Jung (vowel) visual category:
#   0 = right-side (ㅏㅐㅑㅒㅓㅔㅕㅖㅣ)
#   1 = bottom ㅗ-type (ㅗㅘㅙㅚㅛ)
#   2 = bottom ㅜ-type (ㅜㅝㅞㅟㅠ)
#   3 = bottom ㅡ-type (ㅡㅢ)
# ㅡ(18),ㅢ(19): cat=2 gives wide cho + separated ㅡ stroke
JUNG_CAT = [0,0,0,0, 0,0,0,0, 1,1,1,1,1, 2,2,2,2,2, 2,2, 0]

CHO_BASE  = 0    # 8 groups x 20
JUNG_BASE = 160  # 4 groups x 22
JONG_BASE = 248  # 4 groups x 28


def decompose(ch):
    """Decompose Hangul syllable -> (cho, jung, jong) or None."""
    c = ord(ch) - 0xAC00
    if c < 0 or c >= 11172:
        return None
    jong = c % 28; c //= 28
    jung = c % 21; cho = c // 21
    return cho, jung, jong


def composite_hangul(cho, jung, jong, font):
    """Overlay cho+jung+jong glyphs into a 16x16 bitmap."""
    has_jong = jong > 0

    # Cho group: 0-3 without jong, 4-7 with jong
    cg = JUNG_CAT[jung] + (4 if has_jong else 0)
    # Jung group: 1 without jong, 3 with jong (cho always present for syllables)
    jg = 3 if has_jong else 1

    ci = CHO_BASE  + cg * 20 + (cho + 1)
    ji = JUNG_BASE + jg * 22 + (jung + 1)

    result = [row[:] for row in font[ci]]  # copy cho bitmap

    # OR jung
    jung_bmp = font[ji]
    for y in range(16):
        for x in range(16):
            if jung_bmp[y][x]:
                result[y][x] = 1

    # OR jong
    if has_jong:
        jog = JUNG_CAT[jung]
        joi = JONG_BASE + jog * 28 + jong
        jong_bmp = font[joi]
        for y in range(16):
            for x in range(16):
                if jong_bmp[y][x]:
                    result[y][x] = 1

    return result


# ── Text renderer ─────────────────────────────────────────────

def render_text(text, ascii_font, korean_font, color=GOLD, spacing=1):
    """Render a text string to an RGBA PIL Image."""
    # Build glyph list: (bitmap, width)
    pieces = []
    for ch in text:
        if ch == ' ':
            pieces.append((None, 8))
        elif ord(ch) < 128:
            pieces.append((ascii_font[ord(ch)], 8))
        else:
            d = decompose(ch)
            if d:
                pieces.append((composite_hangul(*d, korean_font), 16))
            else:
                pieces.append((None, 8))

    total_w = sum(w for _, w in pieces) + spacing * max(0, len(pieces) - 1)
    img = Image.new('RGBA', (total_w, 16), TRANSPARENT)

    x = 0
    for i, (bmp, w) in enumerate(pieces):
        if bmp:
            for y in range(16):
                for bx in range(w):
                    if bmp[y][bx]:
                        img.putpixel((x + bx, y), color)
        x += w
        if i < len(pieces) - 1:
            x += spacing

    return img


# ── Main ──────────────────────────────────────────────────────

TITLES = [
    ('download',    'DOWNLOAD'),
    ('patch_notes', '패치노트'),
    ('features',    '기능 소개'),
    ('install',     '설치 가이드'),
    ('mod_features','모드 기능'),
]

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    afont = load_ascii_font(os.path.join(ASSETS_DIR, 'e3.fnt'))
    kfont = load_korean_font(os.path.join(ASSETS_DIR, 'h04.fnt'))

    for name, text in TITLES:
        for color, suffix in [(WHITE, '')]:
            img = render_text(text, afont, kfont, color=color)
            path = os.path.join(OUTPUT_DIR, f'{name}{suffix}.png')
            img.save(path)
            print(f'  {name}{suffix:3s}  {text:10s}  {img.width:3d}x{img.height} -> {os.path.basename(path)}')

    print('Done!')


if __name__ == '__main__':
    main()
