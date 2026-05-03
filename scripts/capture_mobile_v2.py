from playwright.sync_api import sync_playwright
import json

def capture_and_measure():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 390, 'height': 844})

        results = {}

        # --- HOME ---
        page.goto('http://127.0.0.1:8765/', wait_until='networkidle')
        # Accept cookie banner
        try:
            page.locator('text=ПРИНЯТЬ').first.click()
            page.wait_for_timeout(400)
        except:
            pass
        page.screenshot(path='d:/site/screenshots/mobile-audit/v2-home.png', full_page=True)

        # Measure badges and h2s
        data = page.evaluate("""() => {
            const pairs = [];
            document.querySelectorAll('.title-count').forEach(badge => {
                const h2 = badge.closest('.section-header, .sec-header, [class*="header"]')?.querySelector('h2')
                         || badge.parentElement?.querySelector('h2')
                         || badge.nextElementSibling;
                const br = badge.getBoundingClientRect();
                const scroll = window.scrollY || document.documentElement.scrollTop;
                // get page-absolute y
                const badgeY = br.top + scroll;
                let h2Info = null;
                if (h2) {
                    const hr = h2.getBoundingClientRect();
                    h2Info = { y: Math.round(hr.top + scroll), h: Math.round(hr.height), text: h2.textContent.trim().substring(0,40) };
                }
                pairs.push({
                    badge: badge.textContent.trim(),
                    badgeY: Math.round(badgeY),
                    badgeH: Math.round(br.height),
                    h2: h2Info
                });
            });
            return pairs;
        }""")
        results['home_badges'] = data
        print("HOME BADGES:", json.dumps(data, ensure_ascii=False, indent=2))

        # --- ABOUT ---
        page.goto('http://127.0.0.1:8765/pages/about.html', wait_until='networkidle')
        try:
            page.locator('text=ПРИНЯТЬ').first.click()
            page.wait_for_timeout(400)
        except:
            pass
        page.screenshot(path='d:/site/screenshots/mobile-audit/v2-about.png', full_page=True)

        # --- CONTACTS ---
        page.goto('http://127.0.0.1:8765/pages/contacts.html', wait_until='networkidle')
        try:
            page.locator('text=ПРИНЯТЬ').first.click()
            page.wait_for_timeout(400)
        except:
            pass
        page.screenshot(path='d:/site/screenshots/mobile-audit/v2-contacts.png', full_page=True)

        # Measure (01) КОНТАКТЫ badge
        contact_data = page.evaluate("""() => {
            const pairs = [];
            document.querySelectorAll('.title-count').forEach(badge => {
                const h2 = badge.closest('[class*="header"]')?.querySelector('h2')
                         || badge.parentElement?.querySelector('h2')
                         || badge.nextElementSibling;
                const br = badge.getBoundingClientRect();
                const scroll = window.scrollY || document.documentElement.scrollTop;
                const badgeY = br.top + scroll;
                let h2Info = null;
                if (h2) {
                    const hr = h2.getBoundingClientRect();
                    h2Info = { y: Math.round(hr.top + scroll), h: Math.round(hr.height), text: h2.textContent.trim().substring(0,40) };
                }
                pairs.push({
                    badge: badge.textContent.trim(),
                    badgeY: Math.round(badgeY),
                    badgeH: Math.round(br.height),
                    h2: h2Info
                });
            });
            return pairs;
        }""")
        results['contacts_badges'] = contact_data
        print("CONTACTS BADGES:", json.dumps(contact_data, ensure_ascii=False, indent=2))

        browser.close()
        return results

capture_and_measure()
