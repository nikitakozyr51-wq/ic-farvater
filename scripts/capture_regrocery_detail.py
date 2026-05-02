from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # ---- Catalog card details ----
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.goto("https://regrocery.co/collection/bestsellers", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(2000)

    card_data = page.evaluate("""
    () => {
      // Find product cards
      const cards = document.querySelectorAll('article, [class*="product"], [class*="card"], li[class*="item"]');
      const results = [];
      for (let i = 0; i < Math.min(3, cards.length); i++) {
        const c = cards[i];
        const s = getComputedStyle(c);
        const img = c.querySelector('img');
        const imgS = img ? getComputedStyle(img) : null;
        results.push({
          tag: c.tagName,
          className: c.className.slice(0, 80),
          width: c.offsetWidth,
          height: c.offsetHeight,
          backgroundColor: s.backgroundColor,
          borderRadius: s.borderRadius,
          boxShadow: s.boxShadow,
          border: s.border,
          padding: s.padding,
          gap: s.gap,
          imgAspect: img ? `${img.offsetWidth}x${img.offsetHeight}` : null,
          imgObjectFit: imgS ? imgS.objectFit : null,
          imgBorderRadius: imgS ? imgS.borderRadius : null,
        });
      }

      // Sidebar / filters
      const sidebar = document.querySelector('aside, [class*="sidebar"], [class*="filter"], nav[class*="collection"]');
      const sidebarS = sidebar ? getComputedStyle(sidebar) : null;

      // Page header / h1 area
      const h1 = document.querySelector('h1');
      const h1S = h1 ? getComputedStyle(h1) : null;
      const h1Rect = h1 ? h1.getBoundingClientRect() : null;

      // Grid container for products
      const grid = document.querySelector('[class*="grid"], [class*="products"], ul[class*="list"]');
      const gridS = grid ? getComputedStyle(grid) : null;

      // Price element
      const price = document.querySelector('[class*="price"]');
      const priceS = price ? getComputedStyle(price) : null;

      // Tag / badge
      const tag = document.querySelector('[class*="tag"], [class*="badge"], [class*="label"]');
      const tagS = tag ? getComputedStyle(tag) : null;

      // Page background color
      const bodyBg = getComputedStyle(document.body).backgroundColor;
      const htmlBg = getComputedStyle(document.documentElement).backgroundColor;

      // Navigation links style
      const navLink = document.querySelector('nav a, header a');
      const navLinkS = navLink ? getComputedStyle(navLink) : null;

      return {
        cards: results,
        sidebar: sidebarS ? {
          width: sidebar.offsetWidth,
          fontSize: sidebarS.fontSize,
          color: sidebarS.color,
        } : null,
        h1: h1S ? {
          text: h1 ? h1.textContent.trim().slice(0,50) : '',
          fontSize: h1S.fontSize,
          fontWeight: h1S.fontWeight,
          fontFamily: h1S.fontFamily.split(',')[0].trim().replace(/['"]/g,''),
          lineHeight: h1S.lineHeight,
          letterSpacing: h1S.letterSpacing,
          color: h1S.color,
          textTransform: h1S.textTransform,
          marginTop: h1S.marginTop,
          marginBottom: h1S.marginBottom,
          top: h1Rect ? Math.round(h1Rect.top) : null,
        } : null,
        grid: gridS ? {
          display: gridS.display,
          gridTemplateColumns: gridS.gridTemplateColumns,
          gap: gridS.gap,
          columnGap: gridS.columnGap,
          rowGap: gridS.rowGap,
          padding: gridS.padding,
          maxWidth: gridS.maxWidth,
          width: grid.offsetWidth,
        } : null,
        price: priceS ? {
          fontSize: priceS.fontSize,
          fontWeight: priceS.fontWeight,
          color: priceS.color,
          fontFamily: priceS.fontFamily.split(',')[0].trim().replace(/['"]/g,''),
        } : null,
        tag: tagS ? {
          fontSize: tagS.fontSize,
          fontWeight: tagS.fontWeight,
          color: tagS.color,
          backgroundColor: tagS.backgroundColor,
          borderRadius: tagS.borderRadius,
          border: tagS.border,
          padding: tagS.padding,
        } : null,
        pageBackground: { body: bodyBg, html: htmlBg },
        navLink: navLinkS ? {
          fontSize: navLinkS.fontSize,
          fontWeight: navLinkS.fontWeight,
          color: navLinkS.color,
          letterSpacing: navLinkS.letterSpacing,
          textTransform: navLinkS.textTransform,
          textDecoration: navLinkS.textDecoration,
        } : null,
      };
    }
    """)
    print("=== CATALOG DETAIL ===")
    print(json.dumps(card_data, indent=2))
    page.close()

    # ---- Product page details ----
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.goto("https://regrocery.co/product/brixy-shampoo-bar", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(2000)

    prod_data = page.evaluate("""
    () => {
      const h1 = document.querySelector('h1');
      const h1S = h1 ? getComputedStyle(h1) : null;

      // Main image
      const mainImg = document.querySelector('[class*="main"] img, [class*="gallery"] img, [class*="product__image"] img');
      const mainImgS = mainImg ? getComputedStyle(mainImg) : null;

      // CTA button
      const cta = document.querySelector('button[type="submit"], [class*="add-to-cart"], [class*="atc"]');
      const ctaS = cta ? getComputedStyle(cta) : null;

      // Select/option dropdown
      const select = document.querySelector('select, [class*="select"], [class*="option"]');
      const selectS = select ? getComputedStyle(select) : null;

      // Accordion/tabs
      const accordion = document.querySelector('[class*="accordion"], details, [class*="expand"]');
      const accordionS = accordion ? getComputedStyle(accordion) : null;

      // Layout columns
      const layout = document.querySelector('[class*="layout"], [class*="product-page"], [class*="product__wrapper"]');
      const layoutS = layout ? getComputedStyle(layout) : null;

      // Thumbnail images
      const thumbs = document.querySelectorAll('[class*="thumb"] img, [class*="thumbnail"] img');
      const thumbData = thumbs.length ? getComputedStyle(thumbs[0]) : null;

      // Tags/badges on product
      const tags = document.querySelectorAll('[class*="tag"], [class*="badge"], [class*="pill"]');
      const tagResults = [];
      tags.forEach((t, i) => {
        if (i > 4) return;
        const s = getComputedStyle(t);
        tagResults.push({
          text: t.textContent.trim(),
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          color: s.color,
          backgroundColor: s.backgroundColor,
          borderRadius: s.borderRadius,
          border: s.border,
          padding: s.padding,
        });
      });

      // Breadcrumb
      const breadcrumb = document.querySelector('[class*="breadcrumb"], [aria-label*="breadcrumb"]');
      const breadcrumbS = breadcrumb ? getComputedStyle(breadcrumb) : null;

      // Related products section
      const related = document.querySelector('[class*="related"], [class*="upsell"]');
      const relatedS = related ? getComputedStyle(related) : null;

      return {
        h1: h1S ? {
          fontSize: h1S.fontSize,
          fontWeight: h1S.fontWeight,
          fontFamily: h1S.fontFamily.split(',')[0].trim().replace(/['"]/g,''),
          lineHeight: h1S.lineHeight,
          letterSpacing: h1S.letterSpacing,
          color: h1S.color,
          textTransform: h1S.textTransform,
        } : null,
        mainImage: mainImgS ? {
          width: mainImg.offsetWidth,
          height: mainImg.offsetHeight,
          objectFit: mainImgS.objectFit,
          borderRadius: mainImgS.borderRadius,
        } : null,
        cta: ctaS ? {
          text: cta ? cta.textContent.trim() : '',
          width: cta.offsetWidth,
          height: cta.offsetHeight,
          fontSize: ctaS.fontSize,
          fontWeight: ctaS.fontWeight,
          color: ctaS.color,
          backgroundColor: ctaS.backgroundColor,
          borderRadius: ctaS.borderRadius,
          border: ctaS.border,
          letterSpacing: ctaS.letterSpacing,
          textTransform: ctaS.textTransform,
          padding: ctaS.padding,
        } : null,
        tags: tagResults,
        relatedSection: relatedS ? {
          backgroundColor: relatedS.backgroundColor,
          padding: relatedS.padding,
        } : null,
      };
    }
    """)
    print("\n=== PRODUCT PAGE DETAIL ===")
    print(json.dumps(prod_data, indent=2))
    page.close()

    # ---- Homepage sections detail ----
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.goto("https://regrocery.co", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(2000)

    home_data = page.evaluate("""
    () => {
      const sections = document.querySelectorAll('section, [class*="section"]');
      const secResults = [];
      sections.forEach((s, i) => {
        if (i > 6) return;
        const st = getComputedStyle(s);
        secResults.push({
          index: i,
          className: s.className.slice(0,60),
          offsetHeight: s.offsetHeight,
          backgroundColor: st.backgroundColor,
          padding: st.padding,
          marginTop: st.marginTop,
          marginBottom: st.marginBottom,
        });
      });

      // Footer
      const footer = document.querySelector('footer');
      const footerS = footer ? getComputedStyle(footer) : null;

      // Horizontal marquee / ticker
      const ticker = document.querySelector('[class*="marquee"], [class*="ticker"], [class*="scroll"]');
      const tickerS = ticker ? getComputedStyle(ticker) : null;

      // "Order" button in nav
      const orderBtn = document.querySelector('header button, header a[href*="order"], nav button');
      const orderBtnS = orderBtn ? getComputedStyle(orderBtn) : null;

      return {
        sections: secResults,
        footer: footerS ? {
          backgroundColor: footerS.backgroundColor,
          color: footerS.color,
          padding: footerS.padding,
        } : null,
        ticker: tickerS ? {
          fontSize: tickerS.fontSize,
          fontFamily: tickerS.fontFamily.split(',')[0].trim().replace(/['"]/g,''),
          color: tickerS.color,
          backgroundColor: tickerS.backgroundColor,
        } : null,
        orderBtn: orderBtnS ? {
          text: orderBtn ? orderBtn.textContent.trim() : '',
          fontSize: orderBtnS.fontSize,
          fontWeight: orderBtnS.fontWeight,
          color: orderBtnS.color,
          backgroundColor: orderBtnS.backgroundColor,
          borderRadius: orderBtnS.borderRadius,
          border: orderBtnS.border,
          padding: orderBtnS.padding,
          letterSpacing: orderBtnS.letterSpacing,
        } : null,
      };
    }
    """)
    print("\n=== HOMEPAGE SECTIONS ===")
    print(json.dumps(home_data, indent=2))
    page.close()

    browser.close()
    print("\nDone.")
