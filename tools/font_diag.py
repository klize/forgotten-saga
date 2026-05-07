#!/usr/bin/env python3
"""Diagnostic: dump all 8 cho groups for a consonant to find correct variant mapping."""
import os, sys
try:
    from PIL import Image
except ImportError:
    print("pip install Pillow"); sys.exit(1)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(SCRIPT_DIR, '..', 'docs', 'assets', 'logo')

GOLD = (0xFF, 0xC3, 0x32, 0xFF)
GRAY = (0x60, 0x60, 0x60, 0xFF)
TRANSPARENT = (0, 0, 0, 0)

def load_korean_font(path):
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

def main():
    kfont = load_korean_font(os.path.join(ASSETS_DIR, 'h04.fnt'))

    # Test consonants: ㅌ(16), ㄴ(2), ㄷ(3), ㄱ(0)
    test_chos = [('ㅌ', 16), ('ㄴ', 2), ('ㄷ', 3), ('ㄱ', 0)]

    # 8 cho groups x test consonants, each glyph 16x16, with 2px gap
    gap = 2
    cols = 8
    rows = len(test_chos)
    cell = 16
    w = cols * (cell + gap) + gap
    h = rows * (cell + gap) + gap + 12 * rows  # extra for labels

    img = Image.new('RGBA', (w * 3, h * 3), (0x10, 0x10, 0x20, 0xFF))  # dark bg

    for row_i, (name, cho_idx) in enumerate(test_chos):
        for group in range(8):
            glyph_idx = group * 20 + (cho_idx + 1)  # +1 for filler skip
            bmp = kfont[glyph_idx]

            ox = gap + group * (cell + gap)
            oy = gap + row_i * (cell + gap + 12) + 12

            # Draw glyph at 3x scale
            for y in range(16):
                for x in range(16):
                    if bmp[y][x]:
                        for sy in range(3):
                            for sx in range(3):
                                img.putpixel((ox*3 + x*3 + sx, oy*3 + y*3 + sy), GOLD)

    # Also dump all 4 jung groups for ㅡ(18) and ㅣ(20)
    jung_test = [('ㅡ', 18), ('ㅣ', 20), ('ㅗ', 8), ('ㅏ', 0)]
    w2 = 4 * (cell + gap) + gap
    img2 = Image.new('RGBA', (w2 * 3, len(jung_test) * (cell + gap + 12) * 3 + gap * 3), (0x10, 0x10, 0x20, 0xFF))

    for row_i, (name, jung_idx) in enumerate(jung_test):
        for group in range(4):
            glyph_idx = 160 + group * 22 + (jung_idx + 1)
            bmp = kfont[glyph_idx]

            ox = gap + group * (cell + gap)
            oy = gap + row_i * (cell + gap + 12) + 12

            for y in range(16):
                for x in range(16):
                    if bmp[y][x]:
                        for sy in range(3):
                            for sx in range(3):
                                img2.putpixel((ox*3 + x*3 + sx, oy*3 + y*3 + sy), GOLD)

    # Also dump all 4 jong groups for ㅇ(21)
    jong_test = [('ㅇ', 21), ('ㄹ', 8), ('ㄱ', 1)]
    w3 = 4 * (cell + gap) + gap
    img3 = Image.new('RGBA', (w3 * 3, len(jong_test) * (cell + gap + 12) * 3 + gap * 3), (0x10, 0x10, 0x20, 0xFF))

    for row_i, (name, jong_idx) in enumerate(jong_test):
        for group in range(4):
            glyph_idx = 248 + group * 28 + jong_idx
            bmp = kfont[glyph_idx]
            ox = gap + group * (cell + gap)
            oy = gap + row_i * (cell + gap + 12) + 12
            for y in range(16):
                for x in range(16):
                    if bmp[y][x]:
                        for sy in range(3):
                            for sx in range(3):
                                img3.putpixel((ox*3 + x*3 + sx, oy*3 + y*3 + sy), GOLD)

    out = os.path.join(SCRIPT_DIR, '..', 'public', 'assets', 'titles')
    img.save(os.path.join(out, 'diag_cho_8groups.png'))
    img2.save(os.path.join(out, 'diag_jung_4groups.png'))
    img3.save(os.path.join(out, 'diag_jong_4groups.png'))
    print("Saved diag_cho_8groups.png (rows: ㅌ,ㄴ,ㄷ,ㄱ / cols: group 0-7)")
    print("Saved diag_jung_4groups.png (rows: ㅡ,ㅣ,ㅗ,ㅏ / cols: group 0-3)")
    print("Saved diag_jong_4groups.png (rows: ㅇ,ㄹ,ㄱ / cols: group 0-3)")

if __name__ == '__main__':
    main()
