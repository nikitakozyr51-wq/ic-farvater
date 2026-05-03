from playwright.sync_api import sync_playwright
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 390, 'height': 844})
        page.goto('http://127.0.0.1:8765/', wait_until='networkidle')

        # Click cookie banner accept button
        try:
            page.locator('button:has-text("ПРИНЯТЬ")').click(timeout=5000)
            page.wait_for_timeout(800)
        except Exception as e:
            print(f"Cookie button error: {e}")

        # Wait for animations
        page.wait_for_timeout(1000)

        # Full-page screenshot
        page.screenshot(path='D:/site/screenshots/mobile-audit/home-mobile-full.png', full_page=True)
        print("Screenshot saved.")

        # Measure (01)-(04) badges and their h2 siblings
        results = []
        for n in ['01', '02', '03', '04']:
            badge = page.locator(f'text=({n})').first
            try:
                br = badge.evaluate('el => { const r = el.getBoundingClientRect(); return {x: r.x, y: r.y, w: r.width, h: r.height}; }')
            except:
                br = None

            # Find the nearest h2 in the same parent
            try:
                h2_br = badge.evaluate('''el => {
                    let parent = el.closest('.services__item, .service-item, section, li, div');
                    if (!parent) parent = el.parentElement;
                    const h2 = parent.querySelector("h2, h3");
                    if (!h2) return null;
                    const r = h2.getBoundingClientRect();
                    return {x: r.x, y: r.y, w: r.width, h: r.height};
                }''')
            except:
                h2_br = None

            same_line = None
            if br and h2_br:
                # Same line if their vertical centers are within 10px
                badge_mid = br['y'] + br['h'] / 2
                h2_mid = h2_br['y'] + h2_br['h'] / 2
                same_line = abs(badge_mid - h2_mid) < 15

            results.append({
                'badge': f'({n})',
                'badge_rect': br,
                'h2_rect': h2_br,
                'same_line': same_line
            })

        print(json.dumps(results, indent=2, ensure_ascii=False))
        browser.close()

run()
