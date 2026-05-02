from playwright.sync_api import sync_playwright
import json

OUTPUT_DIR = "D:/site/screenshots"

PAGES = [
    ("home_desktop_full",    "https://regrocery.co",                                        1920),
    ("catalog_desktop_full", "https://regrocery.co/collection/bestsellers",                 1920),
    ("product_desktop_full", "https://regrocery.co/product/brixy-shampoo-bar",              1920),
    ("blog_desktop_full",    "https://regrocery.co/blog",                                   1920),
]

CSS_EXTRACT = """
() => {
  const styles = getComputedStyle(document.documentElement);
  const body = getComputedStyle(document.body);

  // Collect fonts in use
  const fonts = new Set();
  document.querySelectorAll('*').forEach(el => {
    const ff = getComputedStyle(el).fontFamily;
    if (ff) fonts.add(ff.split(',')[0].trim().replace(/['"]/g,''));
  });

  // Collect all unique colors
  const colors = new Set();
  document.querySelectorAll('*').forEach(el => {
    const s = getComputedStyle(el);
    ['color','background-color','border-color','border-top-color'].forEach(p => {
      const v = s[p];
      if (v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent') colors.add(v);
    });
  });

  // Sample headings
  const headings = {};
  ['h1','h2','h3','h4'].forEach(tag => {
    const el = document.querySelector(tag);
    if (el) {
      const s = getComputedStyle(el);
      headings[tag] = {
        fontFamily: s.fontFamily.split(',')[0].trim().replace(/['"]/g,''),
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        textTransform: s.textTransform,
        color: s.color,
      };
    }
  });

  // Sample body text
  const bodyEl = document.querySelector('p');
  const bodyStyle = bodyEl ? getComputedStyle(bodyEl) : null;

  // Sample buttons
  const btnEl = document.querySelector('button, .btn, [class*="button"], a[class*="btn"]');
  const btnStyle = btnEl ? getComputedStyle(btnEl) : null;

  // Nav
  const navEl = document.querySelector('nav, header');
  const navStyle = navEl ? getComputedStyle(navEl) : null;

  return {
    fonts: [...fonts].slice(0, 10),
    colors: [...colors].slice(0, 30),
    headings,
    body: bodyStyle ? {
      fontFamily: bodyStyle.fontFamily.split(',')[0].trim().replace(/['"]/g,''),
      fontSize: bodyStyle.fontSize,
      fontWeight: bodyStyle.fontWeight,
      lineHeight: bodyStyle.lineHeight,
      color: bodyStyle.color,
    } : null,
    button: btnStyle ? {
      fontSize: btnStyle.fontSize,
      fontWeight: btnStyle.fontWeight,
      borderRadius: btnStyle.borderRadius,
      padding: btnStyle.padding,
      backgroundColor: btnStyle.backgroundColor,
      color: btnStyle.color,
      border: btnStyle.border,
      letterSpacing: btnStyle.letterSpacing,
      textTransform: btnStyle.textTransform,
    } : null,
    nav: navStyle ? {
      height: navStyle.height,
      backgroundColor: navStyle.backgroundColor,
      position: navStyle.position,
      borderBottom: navStyle.borderBottom,
    } : null,
    containerWidth: document.querySelector('.container, [class*="container"], main, [class*="wrapper"]')
      ? getComputedStyle(document.querySelector('.container, [class*="container"], main, [class*="wrapper"]')).maxWidth
      : null,
  };
}
"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # Full-page screenshots
    for name, url, w in PAGES:
        print(f"Full-page: {name}")
        page = browser.new_page(viewport={"width": w, "height": 1080})
        page.goto(url, wait_until="networkidle", timeout=60000)
        page.wait_for_timeout(2000)
        page.screenshot(path=f"{OUTPUT_DIR}/regrocery_{name}.png", full_page=True)
        print(f"  -> {OUTPUT_DIR}/regrocery_{name}.png")
        page.close()

    # CSS extraction from homepage
    print("\nExtracting CSS from homepage...")
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.goto("https://regrocery.co", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(2000)
    data = page.evaluate(CSS_EXTRACT)
    print(json.dumps(data, indent=2))
    page.close()

    # CSS from catalog
    print("\nExtracting CSS from catalog...")
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.goto("https://regrocery.co/collection/bestsellers", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(2000)
    data2 = page.evaluate(CSS_EXTRACT)
    print(json.dumps(data2, indent=2))
    page.close()

    # CSS from product page
    print("\nExtracting CSS from product page...")
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.goto("https://regrocery.co/product/brixy-shampoo-bar", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(2000)
    data3 = page.evaluate(CSS_EXTRACT)
    print(json.dumps(data3, indent=2))
    page.close()

    browser.close()
    print("\nDone.")
