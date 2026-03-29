from playwright.sync_api import sync_playwright
import os

html_path = os.path.abspath(r'd:\site\site\demo project\ic farvater\pages\products.html')
file_url = 'file:///' + html_path.replace('\\', '/').replace(' ', '%20')

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})

    page.goto(file_url, wait_until='networkidle')
    page.wait_for_timeout(1000)

    # Click on "Микросхемы" cat-card
    page.click('.cat-card[data-category="microchips"]')
    page.wait_for_timeout(1000)

    # Debug state
    info = page.evaluate('''() => {
        const grid = document.getElementById("products-grid");
        const dynamic = document.getElementById("catalog-products");
        const cards = dynamic ? dynamic.querySelectorAll(".product-card") : [];
        const title = dynamic ? dynamic.querySelector(".catalog__category-title") : null;
        return {
            gridDisplay: grid ? grid.style.display : "N/A",
            dynamicDisplay: dynamic ? dynamic.style.display : "N/A",
            productCards: cards.length,
            categoryTitle: title ? title.textContent.trim() : "N/A"
        };
    }''')
    print(f"Static grid display: {info['gridDisplay']}")
    print(f"Dynamic container display: {info['dynamicDisplay']}")
    print(f"Product cards shown: {info['productCards']}")
    print(f"Category title: {info['categoryTitle']}")

    page.screenshot(path=r'd:\site\data\screenshot_filter.png', full_page=True)
    print('Screenshot saved')
    browser.close()
