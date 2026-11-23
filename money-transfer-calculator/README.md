# Money Transfer calculator (UI + mock rates)

Framework-free (HTML/CSS/ES modules). Run: `python3 -m http.server 8099` here, open http://localhost:8099/

- `calculator.js` – UI logic: two-way recalculation, debounce, stale-response guard, swap, payout methods, loading/error/offline states, quote-expiry timer, CTA deep link, a11y (live region, radiogroup, keyboard).
- `rate-provider.js` – `RateProvider` contract + `MockRateProvider` (SAMPLE rates, flagged `isSample`, shows a "Sample rates" badge).
- `calculator.css` – Eganow tokens (red #CC0229, ice #F2F9FE, slate, amber), responsive, reduced-motion.
- `index.html` – demo hero + sticky compact bar. Dev toggles: `?corridor=USD|CAD|EUR`, `?latency=1500`, `?fail=1`, `?offline=1`.

## Connect the real rate engine
Implement `EganowRateProvider` with the same two methods (`getCorridors`, `getQuote`) calling a server-side proxy,
throw `RateError("unavailable"|"unsupported"|"limit"|"offline")`, then `createCalculator(root, { provider: new EganowRateProvider(), showSampleBadge:false })`.
Do not ship `MockRateProvider` to production. The CTA's `quote` param is informational; the app must re-quote.
