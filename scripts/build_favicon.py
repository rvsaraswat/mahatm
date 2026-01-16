from __future__ import annotations

from pathlib import Path

from PIL import Image


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    src = repo_root / "images" / "mahatm logo 1.png"
    out = repo_root / "favicon.ico"

    if not src.exists():
        raise SystemExit(f"Source logo not found: {src}")

    img = Image.open(src).convert("RGBA")

    # Make a square canvas by padding with transparency.
    side = max(img.size)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    offset_x = (side - img.size[0]) // 2
    offset_y = (side - img.size[1]) // 2
    square.paste(img, (offset_x, offset_y))

    sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128)]
    icons = [square.resize(size, Image.Resampling.LANCZOS) for size in sizes]

    # Pillow writes all sizes into a single .ico when the first image saves with sizes=...
    icons[0].save(out, format="ICO", sizes=sizes)
    print(f"Wrote {out} from {src} with sizes={sizes}")


if __name__ == "__main__":
    main()
