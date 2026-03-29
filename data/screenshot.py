from playwright.sync_api import sync_playwright
import os, sys

html_file = sys.argv[1] if len(sys.argv) > 1 else r'd:\site\site\demo project\ic farvater\pages\products.html'
out_file = sys.argv[2] if len(sys.argv) > 2 else r'd:\site\data\screenshot_catalog.png'

html_path = os.path.abspath(html_file)
file_url = 'file:///' + html_path.replace('\\', '/').replace(' ', '%20')

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 3000})

    errors = []
    page.on('console', lambda msg: errors.append(f'{msg.type}: {msg.text}') if msg.type in ('error', 'warning') else None)

    page.goto(file_url, wait_until='networkidle')
    page.wait_for_timeout(2000)

    # Debug grid rows
    info = page.evaluate('''() => {
        const rows = document.querySelectorAll(".catalog__grid-row");
        const result = [];
        rows.forEach((row, i) => {
            const cards = row.querySelectorAll(".cat-card");
            const rect = row.getBoundingClientRect();
            result.push({
                row: i+1,
                cards: cards.length,
                top: rect.top,
                height: rect.height,
                display: getComputedStyle(row).display
            });
        });
        return result;
    }''')
    for r in info:
        print(f"Row {r['row']}: {r['cards']} cards, top={r['top']:.0f}, height={r['height']:.0f}, display={r['display']}")

    if errors:
        print('\\nErrors:')
        for e in errors[:10]:
            print(f'  {e}')

    page.screenshot(path=out_file, full_page=True)
    print(f'\nScreenshot saved')
    browser.close()
