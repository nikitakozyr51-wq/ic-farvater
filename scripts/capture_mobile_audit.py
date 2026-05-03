from playwright.sync_api import sync_playwright

pages = [
    ("http://127.0.0.1:8765/", "d:/site/screenshots/mobile-audit/home-mobile.png"),
    ("http://127.0.0.1:8765/pages/about.html", "d:/site/screenshots/mobile-audit/about-mobile.png"),
    ("http://127.0.0.1:8765/pages/contacts.html", "d:/site/screenshots/mobile-audit/contacts-mobile.png"),
    ("http://127.0.0.1:8765/pages/products.html", "d:/site/screenshots/mobile-audit/products-mobile.png"),
    ("http://127.0.0.1:8765/pages/product-detail.html?id=ARC70-0402", "d:/site/screenshots/mobile-audit/product-detail-mobile.png"),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for url, path in pages:
        page = browser.new_page(viewport={'width': 390, 'height': 844})
        page.goto(url, wait_until='networkidle')
        page.screenshot(path=path, full_page=True)
        print(f"Saved: {path}")
    browser.close()
