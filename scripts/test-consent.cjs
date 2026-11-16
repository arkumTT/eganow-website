// Browser tests for the analytics + consent system (needs Playwright + Chromium; axe-core is a devDependency).
// They use stand-ins for the vendors served at the vendors' REAL URLs, so the Content-Security-Policy is exercised for real.
//
//   # 1. build with analytics on, and serve it with the real headers
//   ANALYTICS_PROVIDER=plausible PLAUSIBLE_DOMAIN=eganow.com ANALYTICS_IN_STAGING=true npm run build && npm run serve
//   # 2. in another terminal
//   npm run test:consent -- plausible
//   (repeat with ANALYTICS_PROVIDER=ga4 GA4_MEASUREMENT_ID=G-TEST123456 ... and `-- ga4`; a build without analytics with `-- default`)
//
// What it proves: ZERO requests to the vendor before consent or after rejecting; events and their payloads after accepting;
// no personal data ever sent; Global Privacy Control respected; expiry/version/corrupt/blocked-storage handled; no layout
// shift; keyboard order; accessibility (axe); and no CSP violations anywhere in the flow.
const { chromium } = require('playwright');
const MODE = process.argv[2]; // plausible | ga4 | default
if (!['plausible', 'ga4', 'default'].includes(MODE)) { console.error('usage: node scripts/test-consent.cjs plausible|ga4|default'); process.exit(2); }
const SHOTS = process.env.SHOTS; // optional: a folder to save banner screenshots in
const base = process.env.BASE || 'http://localhost:4322';
const GA_ID = 'G-TEST123456';
let pass = 0, fail = 0;
const ok = (cond, label, extra = '') => { cond ? pass++ : fail++; console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${extra ? '  [' + extra + ']' : ''}`); };

// ---- stand-ins for the vendors, served at their real URLs so the CSP is exercised for real
const PLAUSIBLE_JS = `(function(){var c=document.currentScript,d=c&&c.getAttribute('data-domain');function post(n,p){fetch('https://plausible.io/api/event',{method:'POST',keepalive:true,headers:{'Content-Type':'text/plain'},body:JSON.stringify({n:n,d:d,p:p||null,u:location.pathname})}).catch(function(){})}var q=(window.plausible&&window.plausible.q)||[];window.plausible=function(n,o){post(n,o&&o.props)};post('pageview');q.forEach(function(a){window.plausible.apply(null,a)})})();`;
const GA_JS = `(function(){var dl=window.dataLayer||[];function send(a){fetch('https://www.google-analytics.com/g/collect',{method:'POST',keepalive:true,mode:'no-cors',body:JSON.stringify(Array.prototype.slice.call(a))}).catch(function(){})}dl.forEach(send);var push=dl.push;dl.push=function(a){send(a);return push.apply(dl,arguments)};new Image().src='https://www.googletagmanager.com/p.gif';})();`;

async function newCtx(browser, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts.ctx });
  const reqs = []; const viol = [];
  const vendorHosts = /plausible\.io|googletagmanager\.com|google-analytics\.com/;
  await ctx.route(vendorHosts, async (route) => {
    const u = route.request().url(); reqs.push({ url: u, method: route.request().method(), body: route.request().postData() });
    if (u === 'https://plausible.io/js/script.js') return route.fulfill({ contentType: 'application/javascript', body: PLAUSIBLE_JS });
    if (u.startsWith('https://www.googletagmanager.com/gtag/js')) return route.fulfill({ contentType: 'application/javascript', body: GA_JS });
    return route.fulfill({ status: 202, headers: { 'access-control-allow-origin': '*' }, body: 'ok' });
  });
  await ctx.addInitScript((o) => {
    window.__v = []; document.addEventListener('securitypolicyviolation', (e) => window.__v.push(e.violatedDirective + ' <- ' + e.blockedURI));
    if (o.gpc) Object.defineProperty(navigator, 'globalPrivacyControl', { value: true });
    if (o.blockStorage) Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } });
  }, { gpc: !!opts.gpc, blockStorage: !!opts.blockStorage });
  const page = await ctx.newPage(); page.errs = []; page.on('pageerror', (e) => page.errs.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !/status of 404|Failed to load resource/.test(m.text()) && page.errs.push(m.text()));
  return { ctx, page, reqs, getViol: () => page.evaluate(() => window.__v) };
}
const events = (reqs) => reqs.filter((r) => /api\/event|g\/collect/.test(r.url) && r.body).map((r) => { try { return JSON.parse(r.body); } catch { return r.body; } });
const plEvents = (reqs) => events(reqs).filter((e) => e && e.n).map((e) => ({ name: e.n, props: e.p }));
const bannerVisible = (p) => p.evaluate(() => { const b = document.querySelector('[data-consent-banner]'); return !!b && !b.hidden && b.offsetHeight > 0; });
const stored = (p) => p.evaluate(() => { try { return JSON.parse(localStorage.getItem('eganow_consent')); } catch { return 'ERR'; } });
const vendorReqs = (reqs) => reqs.length;

(async () => {
  const browser = await chromium.launch();

  if (MODE === 'default') {
    console.log('=== DEFAULT build (analytics not configured): nothing at all ===');
    const { page, reqs, ctx } = await newCtx(browser); const hosts = new Set();
    page.on('request', (r) => hosts.add(new URL(r.url()).host));
    await page.goto(base + '/'); await page.waitForTimeout(1200);
    ok(!(await page.$('[data-consent-banner]')), 'no banner in the page');
    ok(!(await page.$('[data-consent-open]')), 'no "Cookie settings" footer button');
    ok(!(await page.evaluate(() => document.cookie)), 'no cookies set');
    ok(!(await page.evaluate(() => localStorage.length)), 'nothing in localStorage');
    ok([...hosts].every((h) => h === 'localhost:4322'), 'every request goes to this site only', [...hosts].join(','));
    await ctx.close();
  }

  if (MODE === 'plausible') {
    console.log('=== PLAUSIBLE: first visit, nothing chosen yet ===');
    let c = await newCtx(browser); let p = c.page;
    await p.goto(base + '/'); await p.waitForTimeout(1500);
    ok(await bannerVisible(p), 'banner is shown');
    ok(vendorReqs(c.reqs) === 0, 'ZERO requests to the analytics vendor before consent', String(vendorReqs(c.reqs)));
    ok((await stored(p)) === null, 'no consent record stored yet');
    ok(!(await p.evaluate(() => document.cookie)), 'no cookies');
    const b = await p.evaluate(() => { const r = document.querySelector('[data-consent-banner]').getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; });
    const [accept, reject] = await p.evaluate(() => ['[data-consent-accept]', '[data-consent-reject]'].map((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; }));
    ok(accept.w === reject.w && accept.h === reject.h && accept.h >= 44, 'Accept and Reject are the same size, and tall enough to tap', `${accept.w}x${accept.h} vs ${reject.w}x${reject.h}`);
    // a visitor can still use the whole site with the banner open: it is not a blocking wall
    ok(await p.evaluate(() => { const l = document.querySelector('a[href="/business"]'); const r = l.getBoundingClientRect(); return r.width > 0; }), 'page stays usable behind the banner');
    if (SHOTS) await p.screenshot({ path: SHOTS + '/banner_desktop.png' });
    await c.ctx.close();

    console.log('\n=== PLAUSIBLE: Accept ===');
    c = await newCtx(browser); p = c.page;
    await p.goto(base + '/'); await p.waitForTimeout(1000);
    await p.click('[data-consent-accept]'); await p.waitForTimeout(1200);
    ok(!(await bannerVisible(p)), 'banner hides');
    ok(c.reqs.some((r) => r.url === 'https://plausible.io/js/script.js'), 'vendor script is requested (only now)');
    ok(await p.evaluate(() => document.querySelector('script[data-domain="eganow.com"]')?.getAttribute('src') === 'https://plausible.io/js/script.js'), 'script tag carries the configured domain');
    ok((await stored(p))?.analytics === true && (await stored(p))?.by === 'user', 'consent recorded', JSON.stringify(await stored(p)));
    ok(plEvents(c.reqs).some((e) => e.name === 'pageview'), 'a page view reaches the vendor');
    await p.click('a[data-track="store_click"][data-track-store="app_store"][data-track-location="hero"]').catch(() => {}); await p.waitForTimeout(400);
    await p.click('a[data-track="business_cta"]').catch(() => {}); await p.waitForTimeout(800);
    let ev = plEvents(c.reqs);
    ok(ev.some((e) => e.name === 'store_click' && e.props?.store === 'app_store' && e.props?.location === 'hero' && e.props?.page === '/'), 'store button click tracked with store/location/page', JSON.stringify(ev.find((e) => e.name === 'store_click')));
    // contact CTA is tracked automatically from the link's ?topic=
    await p.goto(base + '/business/egapos'); await p.waitForTimeout(1200);
    await Promise.all([p.waitForURL('**/contact?topic=sales').catch(() => {}), p.click('.price .btn')]); await p.waitForTimeout(800);
    ev = plEvents(c.reqs);
    ok(ev.some((e) => e.name === 'contact_cta' && e.props?.topic === 'sales' && e.props?.page === '/business/egapos'), 'link to /contact?topic=sales tracked automatically, before navigating away', JSON.stringify(ev.find((e) => e.name === 'contact_cta')));
    // contact submit: topic only
    await p.route('https://forms.zohopublic.com/**', (r) => r.fulfill({ status: 303, headers: { location: base + '/contact/thanks' } }));
    await p.fill('#first', 'Ama'); await p.fill('#last', 'Mensah'); await p.fill('#email', 'ama@example.com'); await p.fill('#msg', 'SECRET MESSAGE TEXT');
    await Promise.all([p.waitForURL('**/contact/thanks').catch(() => {}), p.click('#send')]); await p.waitForTimeout(800);
    ev = plEvents(c.reqs); const submit = ev.find((e) => e.name === 'contact_submit');
    ok(!!submit && submit.props?.topic === 'sales', 'contact_submit tracked with the topic', JSON.stringify(submit));
    const everything = JSON.stringify(c.reqs);
    ok(!/Ama|Mensah|ama@example|SECRET MESSAGE|@/.test(everything.replace(/eganow\.com/g, '')), 'no name, email or message text ever sent to the vendor');
    // story chapters + business panels
    await p.goto(base + '/'); await p.waitForTimeout(1500);
    const total = await p.evaluate(() => document.querySelector('[data-story]').offsetHeight - innerHeight + 64);
    for (const f of [0.2, 0.45, 0.7, 0.95]) { await p.evaluate((y) => scrollTo(0, y), total * f); await p.waitForTimeout(900); }
    const chapters = plEvents(c.reqs).filter((e) => e.name === 'chapter_reached').map((e) => e.props.chapter);
    ok(chapters.length >= 4 && new Set(chapters).size === chapters.length, 'story chapters reported once each, in order', chapters.join(' > '));
    await p.goto(base + '/business'); await p.waitForTimeout(1200);
    const bt = await p.evaluate(() => document.querySelector('[data-biz]').getBoundingClientRect().top + scrollY + document.querySelector('[data-biz]').offsetHeight);
    for (const f of [0.2, 0.5, 0.8]) { await p.evaluate((y) => scrollTo(0, y), (bt - 900) * f + 300); await p.waitForTimeout(900); }
    const panels = plEvents(c.reqs).filter((e) => e.name === 'service_panel_viewed').map((e) => e.props.service);
    ok(panels.length >= 2 && new Set(panels).size === panels.length, 'business service panels reported once each', panels.join(' > '));

    console.log('\n=== PLAUSIBLE: the choice is remembered ===');
    const before = c.reqs.length; await p.goto(base + '/help'); await p.waitForTimeout(1500);
    ok(!(await bannerVisible(p)), 'no banner on the next page / next visit');
    ok(c.reqs.slice(before).some((r) => r.url === 'https://plausible.io/js/script.js'), 'analytics loads automatically for a returning, consenting visitor');

    console.log('\n=== PLAUSIBLE: change of mind via footer "Cookie settings" ===');
    await p.click('[data-consent-open]'); await p.waitForTimeout(400);
    ok(await bannerVisible(p), 'banner reopens');
    ok(/analytics on/.test(await p.evaluate(() => document.querySelector('[data-consent-status]').textContent)), 'shows the current choice', await p.evaluate(() => document.querySelector('[data-consent-status]').textContent));
    ok(await p.evaluate(() => document.activeElement?.id === 'cb-t'), 'focus moves to the banner heading (visitor asked for it)');
    await p.click('[data-consent-reject]'); await p.waitForTimeout(500);
    ok(await p.evaluate(() => document.activeElement?.hasAttribute('data-consent-open')), 'focus returns to the footer button afterwards');
    const n0 = c.reqs.length; await p.click('a[href="/contact?topic=support"]').catch(() => {}); await p.waitForTimeout(700);
    ok(c.reqs.length === n0, 'after rejecting, further clicks send nothing', `${c.reqs.length - n0} new requests`);
    ok((await stored(p))?.analytics === false, 'rejection recorded');
    const v1 = await c.getViol(); ok(v1.length === 0, 'no CSP violations in the whole accept flow', JSON.stringify(v1)); ok(p.errs.length === 0, 'no console errors', p.errs.join('|'));
    await c.ctx.close();

    console.log('\n=== PLAUSIBLE: Reject ===');
    c = await newCtx(browser); p = c.page;
    await p.goto(base + '/'); await p.waitForTimeout(1000); await p.click('[data-consent-reject]'); await p.waitForTimeout(600);
    await p.click('a[data-track="store_click"]').catch(() => {}); await p.reload(); await p.waitForTimeout(1200);
    ok(!(await bannerVisible(p)), 'banner stays away after a reload');
    ok(vendorReqs(c.reqs) === 0, 'ZERO vendor requests, even after clicking tracked buttons and reloading', String(vendorReqs(c.reqs)));
    ok((await stored(p))?.analytics === false, 'rejection remembered');
    await c.ctx.close();

    console.log('\n=== PLAUSIBLE: browser sends Global Privacy Control ===');
    c = await newCtx(browser, { gpc: true }); p = c.page;
    await p.goto(base + '/'); await p.waitForTimeout(1200);
    ok(!(await bannerVisible(p)), 'no banner (the signal is respected as a No)');
    ok(vendorReqs(c.reqs) === 0, 'zero vendor requests');
    ok((await stored(p))?.by === 'gpc' && (await stored(p))?.analytics === false, 'recorded as a GPC-based No', JSON.stringify(await stored(p)));
    await p.click('[data-consent-open]'); await p.waitForTimeout(300);
    ok(/Global Privacy Control/.test(await p.evaluate(() => document.querySelector('[data-consent-status]').textContent)), 'Cookie settings explains the signal');
    await p.click('[data-consent-accept]'); await p.waitForTimeout(1000);
    ok(c.reqs.some((r) => r.url === 'https://plausible.io/js/script.js'), 'visitor can still opt IN explicitly');
    await c.ctx.close();

    console.log('\n=== PLAUSIBLE: edge cases ===');
    c = await newCtx(browser); p = c.page; await p.goto(base + '/'); await p.waitForTimeout(800);
    await p.evaluate(() => localStorage.setItem('eganow_consent', JSON.stringify({ v: 1, analytics: true, ts: Date.now() - 400 * 24 * 3600 * 1000, by: 'user' })));
    await p.reload(); await p.waitForTimeout(1000); ok(await bannerVisible(p), 'a 13-month-old choice expires: asked again');
    await p.evaluate(() => localStorage.setItem('eganow_consent', JSON.stringify({ v: 0, analytics: true, ts: Date.now(), by: 'user' })));
    await p.reload(); await p.waitForTimeout(1000); ok(await bannerVisible(p), 'an old consent version is ignored: asked again');
    await p.evaluate(() => localStorage.setItem('eganow_consent', '{not json'));
    await p.reload(); await p.waitForTimeout(1000); ok(await bannerVisible(p) && p.errs.length === 0, 'corrupt stored value: asked again, no crash', p.errs.join('|'));
    await c.ctx.close();
    c = await newCtx(browser, { blockStorage: true }); p = c.page; await p.goto(base + '/'); await p.waitForTimeout(1000);
    ok(await bannerVisible(p), 'storage blocked (private mode): banner still works');
    await p.click('[data-consent-accept]'); await p.waitForTimeout(800);
    ok(!(await bannerVisible(p)) && c.reqs.some((r) => /script\.js/.test(r.url)) && p.errs.length === 0, 'choice honoured for this visit without storage, no errors', p.errs.join('|'));
    await c.ctx.close();

    console.log('\n=== PLAUSIBLE: layout and keyboard ===');
    c = await newCtx(browser); p = c.page;
    await p.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
    await p.goto(base + '/legal/privacy'); await p.waitForTimeout(1500);
    ok((await p.evaluate(() => window.__cls)) < 0.01, 'the banner appearing causes no layout shift', String(await p.evaluate(() => window.__cls)));
    const firstFocus = await p.evaluate(() => { const els = [...document.querySelectorAll('a, button, summary, input')].filter((e) => e.offsetParent !== null || e.closest('[data-consent-banner]')); return els.slice(0, 4).map((e) => (e.closest('[data-consent-banner]') ? 'banner:' : '') + (e.textContent || '').trim().slice(0, 16)); });
    ok(firstFocus[1]?.startsWith('banner:'), 'banner is the first thing keyboard users reach (right after "Skip to content")', JSON.stringify(firstFocus.slice(0, 3)));
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(300);
    const gap = await p.evaluate(() => { const ft = document.querySelector('.ft__legal').getBoundingClientRect(); const cb = document.querySelector('[data-consent-banner]').getBoundingClientRect(); return { footerBottom: Math.round(ft.bottom), bannerTop: Math.round(cb.top), viewport: innerHeight }; });
    ok(gap.footerBottom <= gap.bannerTop, 'page has bottom space so the banner never covers the last content', JSON.stringify(gap));
    await c.ctx.close();
    c = await newCtx(browser, { ctx: { bypassCSP: true } }); p = c.page; await p.goto(base + '/security'); await p.waitForTimeout(1200); // scanner injection needs the CSP bypassed; the CSP itself is verified in every other scenario
    await p.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const ax = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map((v) => v.id + ' x' + v.nodes.length + ' ' + v.nodes[0].target.join(' ').slice(0, 50)));
    ok(ax.length === 0, 'accessibility scan (axe) with the banner open', ax.join('; '));
    await p.setViewportSize({ width: 360, height: 740 }); await p.waitForTimeout(400); if (SHOTS) await p.screenshot({ path: SHOTS + '/banner_mobile.png' });
    const ov = await p.evaluate(() => { let worst = 0; document.querySelectorAll('body *').forEach((e) => { if (e.closest('svg, .hp, .sr-only, .skip')) return; const r = e.getBoundingClientRect(); if (r.width && r.right > worst) worst = r.right; }); return { worst: Math.round(worst), vw: innerWidth }; });
    ok(ov.worst <= ov.vw + 1, 'banner fits a 360px phone', JSON.stringify(ov));
    await c.ctx.close();
  }

  if (MODE === 'ga4') {
    console.log('=== GA4: before consent ===');
    let c = await newCtx(browser); let p = c.page;
    await p.goto(base + '/'); await p.waitForTimeout(1500);
    ok(await bannerVisible(p), 'banner shown'); ok(vendorReqs(c.reqs) === 0, 'ZERO requests to Google before consent', String(vendorReqs(c.reqs)));
    ok(!(await p.evaluate(() => document.cookie)) && !(await p.evaluate(() => typeof window.dataLayer !== 'undefined')), 'no cookies, no dataLayer');
    ok(/_ga \(2 years\)/.test(await p.evaluate(() => document.querySelector('[data-consent-banner]').textContent)), 'banner discloses the cookie names');
    await c.ctx.close();
    console.log('\n=== GA4: Accept ===');
    c = await newCtx(browser); p = c.page; await p.goto(base + '/'); await p.waitForTimeout(1000); await p.click('[data-consent-accept]'); await p.waitForTimeout(1500);
    ok(c.reqs.some((r) => r.url === `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`), 'gtag.js requested from the exact configured URL');
    const dl = await p.evaluate(() => (window.dataLayer || []).map((a) => Array.from(a)));
    ok(dl.some((a) => a[0] === 'consent' && a[1] === 'default' && a[2].ad_storage === 'denied' && a[2].analytics_storage === 'granted'), 'consent mode: ads storage denied, analytics granted');
    const cfg = dl.find((a) => a[0] === 'config');
    ok(cfg && cfg[1] === GA_ID && cfg[2].anonymize_ip === true && cfg[2].allow_google_signals === false && cfg[2].allow_ad_personalization_signals === false, 'configured with IP anonymisation and advertising features off', JSON.stringify(cfg));
    await p.click('a[data-track="store_click"][data-track-store="google_play"]').catch(() => {}); await p.waitForTimeout(600);
    const dl2 = await p.evaluate(() => (window.dataLayer || []).map((a) => Array.from(a)));
    const ev = dl2.find((a) => a[0] === 'event' && a[1] === 'store_click');
    ok(ev && ev[2].store === 'google_play' && ev[2].transport_type === 'beacon', 'event sent via gtag with beacon transport', JSON.stringify(ev));
    ok(events(c.reqs).length > 0, 'events reach the collect endpoint (allowed by the CSP)');
    ok((await c.getViol()).length === 0, 'no CSP violations', JSON.stringify(await c.getViol())); ok(p.errs.length === 0, 'no console errors', p.errs.join('|'));
    console.log('\n=== GA4: withdrawing consent clears Google cookies and stops sending ===');
    await p.evaluate(() => { document.cookie = '_ga=GA1.1.123.456; path=/'; document.cookie = '_ga_TEST123456=GS1.1.1; path=/'; document.cookie = 'keepme=1; path=/'; });
    await p.click('[data-consent-open]'); await p.waitForTimeout(300); await p.click('[data-consent-reject]'); await p.waitForTimeout(500);
    const cookies = await p.evaluate(() => document.cookie);
    ok(!/_ga/.test(cookies) && /keepme=1/.test(cookies), '_ga cookies removed, unrelated cookies untouched', cookies);
    ok(await p.evaluate((id) => window[`ga-disable-${id}`] === true, GA_ID), 'Google\'s own opt-out flag is set');
    const n0 = c.reqs.length; await p.click('a[data-track="store_click"]').catch(() => {}); await p.waitForTimeout(600); ok(c.reqs.length === n0, 'nothing more is sent');
    await c.ctx.close();
  }
  await browser.close();
  console.log(`\n${MODE}: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
})();
