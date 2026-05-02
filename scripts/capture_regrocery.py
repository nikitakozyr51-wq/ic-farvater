from playwright.sync_api import sync_playwright
import os

OUTPUT_DIR = "D:/site/screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

PAGES = [
    ("home_desktop",    "https://regrocery.co",                                        1920, 1080),
    ("home_mobile",     "https://regrocery.co",                                        375,  812),
    ("catalog_desktop", "https://regrocery.co/collection/bestsellers",                 1920, 1080),
    ("catalog_mobile",  "https://regrocery.co/collection/bestsellers",                 375,  812),
    ("product_desktop", "https://regrocery.co/product/brixy-shampoo-bar",              1920, 1080),
    ("product_mobile",  "https://regrocery.co/product/brixy-shampoo-bar",              375,  812),
    ("blog_desktop",    "https://regrocery.co/blog",                                   1920, 1080),
    ("blog_mobile",     "https://regrocery.co/blog",                                   375,  812),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for name, url, w, h in PAGES:
        print(f"Capturing {name} ({w}x{h}) ...")
        page = browser.new_page(viewport={"width": w, "height": h})
        page.goto(url, wait_until="networkidle", timeout=60000)
        page.wait_for_timeout(2000)
        out = f"{OUTPUT_DIR}/regrocery_{name}.png"
        page.screenshot(path=out, full_page=False)
        print(f"  -> {out}")
        page.close()
    browser.close()
    print("Done.")
