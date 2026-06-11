"""
SOFENA logosining oq fonini olib tashlash skripti.
Ishlatish: python make_transparent_logo.py <kirish.png>
Misol:     python make_transparent_logo.py sofena-logo.png
"""
import sys
from PIL import Image
import numpy as np

def remove_white_background(input_path: str, output_path: str, threshold: int = 220) -> None:
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img, dtype=np.float32)

    r, g, b = data[:, :, 0], data[:, :, 1], data[:, :, 2]
    brightness = (r + g + b) / 3.0

    # Oq piksellar → shaffof, to'q piksellar → opaque
    # threshold dan yuqorisi asta-sekin shaffof bo'ladi (anti-aliasing uchun)
    alpha = np.where(
        brightness >= threshold,
        np.clip((255.0 - brightness) * (255.0 / (255.0 - threshold)), 0, 255),
        255.0
    )

    data[:, :, 3] = alpha
    result = Image.fromarray(data.astype(np.uint8), "RGBA")
    result.save(output_path)
    print(f"✅ Tayyor: {output_path}")

if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else "sofena-logo.png"
    dst = "frontend/public/sofena-logo.png"
    try:
        remove_white_background(src, dst)
    except FileNotFoundError:
        print(f"❌ Fayl topilmadi: {src}")
        print("   Logoni shu papkaga qo'ying va qayta ishlatib ko'ring.")
