// Mounts the exchange calculator into the Money Transfer hero (money-transfer, uk, us, canada pages).
// Pure additive: appends one node to the hero <header> and a sticky bar to <body>; no Framer markup is edited.
import { createCalculator } from "./calculator.js";
import { MockRateProvider } from "./rate-provider.js"; // TODO: swap for EganowRateProvider when the API is ready

const PAGE_DEFAULTS = { "/uk": "GBP", "/us": "USD", "/canada": "CAD" };
function defaultCurrency() {
  const path = location.pathname.replace(/\.html$/, "").replace(/\/$/, "");
  if (PAGE_DEFAULTS[path]) return PAGE_DEFAULTS[path];
  const region = (navigator.language || "").split("-")[1];
  return { US: "USD", CA: "CAD", GB: "GBP" }[region] || "GBP";
}

const HTML = `
<div class="calc" id="mt-calculator" role="region" aria-labelledby="mt-calc-title">
  <div class="calc__head"><h2 class="calc__title" id="mt-calc-title">Currency exchange calculator</h2><span class="badge" data-sample hidden>Sample rates</span></div>
  <div class="field"><div class="field__main"><label for="mt-send">You send</label><input id="mt-send" data-send-amount inputmode="decimal" autocomplete="off"></div><select data-send-currency aria-label="Currency you send"></select></div>
  <div class="swap-row"><button type="button" class="swap" data-swap aria-label="Swap currencies"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v14M3 14l4 4 4-4M17 20V6M13 10l4-4 4 4"/></svg></button></div>
  <div class="field"><div class="field__main"><label for="mt-recv">They receive</label><input id="mt-recv" data-receive-amount inputmode="decimal" autocomplete="off"></div><select data-receive-currency aria-label="Currency they receive"></select></div>
  <dl class="details"><div><dt>Rate</dt><dd data-rate>—</dd></div><div><dt>Fee</dt><dd data-fee>—</dd></div><div><dt>Arrives</dt><dd data-eta>—</dd></div></dl>
  <p class="expiry" data-expiry></p>
  <p class="methods-label" id="mt-ml">Payout method</p>
  <div class="methods" role="radiogroup" aria-labelledby="mt-ml" data-methods></div>
  <div class="error" data-error role="alert" hidden><span data-error-text></span><button type="button" class="retry" data-retry>Retry</button></div>
  <a class="cta" data-cta href="/money-transfer#download">Send money</a>
  <p class="legal">Indicative rate; the final rate and fee are shown before you confirm. Eganow is a fintech, not a bank, licensed by the Bank of Ghana.</p>
  <p class="sr" data-live aria-live="polite"></p>
</div>`;

function whenReady(fn) {
  const find = () => [...document.querySelectorAll('header[data-framer-name="Header Image"], #main header')]
    .find(h => h.getBoundingClientRect().height > 200 && /get started/i.test(h.textContent));
  const t0 = Date.now();
  (function poll() { const h = find(); if (h) return fn(h); if (Date.now() - t0 < 15000) setTimeout(poll, 200); })();
}

const findHero = () => [...document.querySelectorAll('header[data-framer-name="Header Image"], #main header')]
  .find(h => h.getBoundingClientRect().height > 200 && /get started/i.test(h.textContent));

whenReady(firstHeader => {
  let header = firstHeader;
  const css = document.createElement("link"); css.rel = "stylesheet"; css.href = "/mt-calculator/calculator.css"; document.head.appendChild(css);
  const wrap = document.createElement("div"); wrap.id = "mt-calc-wrap"; wrap.innerHTML = HTML;
  const style = document.createElement("style");
  style.textContent = `
  #mt-calc-wrap{position:absolute;z-index:5;pointer-events:none;left:0;right:0;top:128px;display:flex;justify-content:flex-end;padding:0 max(24px,calc((100% - 1200px)/2))}
  #mt-calc-wrap .calc{pointer-events:auto;max-width:440px;box-shadow:0 24px 60px rgba(20,32,46,.22)}
  @media (max-width:1199.98px){#mt-calc-wrap{padding:0 24px;justify-content:center}#mt-calc-wrap .calc{max-width:480px}}
  @media (max-width:809.98px){#mt-calc-wrap{padding:0 16px}}`;
  document.head.appendChild(style);
  // Framer's hydration can replace the hero element after we mount: always re-attach to the live hero.
  const attach = () => {
    const h = findHero(); if (!h) return;
    header = h;
    if (getComputedStyle(h).position === "static") h.style.position = "relative";
    if (wrap.parentElement !== h) { h.appendChild(wrap); if (typeof layout === "function") layout(); }
  };
  attach();
  let raf = 0;
  new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(attach); })
    .observe(document.body, { childList: true, subtree: true });

  // Place under the hero copy on narrow screens; make sure the hero is tall enough to contain the card.
  function layout() {
    if (!header.isConnected) return;
    const narrow = matchMedia("(max-width:1199.98px)").matches;
    const hb = header.getBoundingClientRect();
    if (narrow) {
      const cta = [...header.querySelectorAll("a")].find(a => /get started/i.test(a.textContent));
      const base = cta ? cta.getBoundingClientRect().bottom - hb.top : 420;
      wrap.style.top = Math.round(base + 32) + "px";
    } else wrap.style.top = "128px";
    const need = parseInt(wrap.style.top, 10) + wrap.firstElementChild.offsetHeight + 48;
    // Don't resize the hero (Framer vertically centres its copy); push following content down instead.
    header.style.marginBottom = Math.max(0, Math.round(need - hb.height)) + "px";
  }
  const calcEl = wrap.firstElementChild;
  new ResizeObserver(layout).observe(calcEl); addEventListener("resize", layout); layout();

  const calc = createCalculator(calcEl, { provider: new MockRateProvider(), defaultFrom: defaultCurrency() });

  // Sticky compact bar once the calculator scrolls out of view
  const bar = document.createElement("div"); bar.className = "stickybar"; bar.setAttribute("aria-hidden", "true");
  bar.innerHTML = '<span>Send money to Ghana</span><button type="button" tabindex="-1">Calculate</button>';
  document.body.appendChild(bar);
  const btn = bar.querySelector("button"), txt = bar.querySelector("span");
  new IntersectionObserver(([e]) => { const on = !e.isIntersecting; bar.classList.toggle("is-visible", on); bar.setAttribute("aria-hidden", String(!on)); btn.tabIndex = on ? 0 : -1; }).observe(calcEl);
  setInterval(() => { const s = calc.state; txt.textContent = s.quote ? `1 ${s.from} = ${s.quote.rate.toFixed(2)} ${s.to} · Send money to Ghana` : "Send money to Ghana"; }, 1000);
  btn.addEventListener("click", () => {
    scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth" });
    setTimeout(() => calcEl.querySelector("[data-send-amount]").focus({ preventScroll: true }), 500);
  });
});
