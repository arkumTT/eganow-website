// Consent banner + gate. Shipped to every page ONLY when analytics is configured (see src/data/analytics.mjs).
// Rules this implements:
//   - nothing is loaded, set or sent before the visitor says yes
//   - Accept and Reject are equal-sized buttons; the choice is remembered for 12 months, then asked again
//   - a browser "Global Privacy Control" signal counts as a No (no banner), and can still be overridden in Cookie settings
//   - the footer "Cookie settings" button reopens the banner so the choice can always be changed
// The choice itself is stored in localStorage (first-party, never sent anywhere).
type Cfg = { v: number; provider: 'plausible' | 'ga4'; label: string; domain?: string; src?: string; id?: string; cookies: [string, string, string][] };
type Choice = { v: number; analytics: boolean; ts: number; by: 'user' | 'gpc' };

const KEY = 'eganow_consent';
const YEAR = 365 * 24 * 3600 * 1000;
const cfg: Cfg = JSON.parse(document.getElementById('consent-config')!.textContent!);
const banner = document.querySelector<HTMLElement>('[data-consent-banner]')!;
const status = banner.querySelector<HTMLElement>('[data-consent-status]')!;
const heading = banner.querySelector<HTMLElement>('[data-consent-heading]')!;
const root = document.documentElement;

let memory: Choice | null = null; // used if storage is blocked
const read = (): Choice | null => {
  try { const r = JSON.parse(localStorage.getItem(KEY) || 'null'); if (r && r.v === cfg.v && typeof r.analytics === 'boolean' && Date.now() - r.ts < YEAR) return r; } catch { /* unavailable or corrupt */ }
  return memory && memory.v === cfg.v && Date.now() - memory.ts < YEAR ? memory : null;
};
const write = (c: Choice) => { memory = c; try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* blocked: remembered for this visit only */ } };

let analytics: Promise<typeof import('./analytics')> | null = null;
function apply(on: boolean) {
  root.dataset.analytics = on ? 'on' : 'off';
  if (on) { analytics ??= import('./analytics'); analytics.then((m) => m.start(cfg)); }
  else analytics?.then((m) => m.stop(cfg));
}

let opener: HTMLElement | null = null, ro: ResizeObserver | null = null;
const setHeight = () => root.style.setProperty('--consent-h', banner.offsetHeight + 'px');
function show(fromUser: boolean) {
  const c = read();
  status.textContent = c ? `Your current choice: analytics ${c.analytics ? 'on' : 'off'}${c.by === 'gpc' ? ' (set by your browser’s Global Privacy Control)' : ''}.` : '';
  root.classList.add('needs-consent', 'has-consent-banner'); setHeight();
  ro ??= new ResizeObserver(setHeight); ro.observe(banner);
  if (fromUser) { opener = document.activeElement as HTMLElement; heading.focus(); } // only move focus when the visitor asked for it
}
function hide() {
  root.classList.remove('needs-consent', 'has-consent-banner'); root.style.removeProperty('--consent-h'); ro?.disconnect();
  if (opener?.isConnected) opener.focus(); opener = null;
}
function choose(analyticsOn: boolean) { write({ v: cfg.v, analytics: analyticsOn, ts: Date.now(), by: 'user' }); hide(); apply(analyticsOn); }

banner.querySelector('[data-consent-accept]')!.addEventListener('click', () => choose(true));
banner.querySelector('[data-consent-reject]')!.addEventListener('click', () => choose(false));
document.addEventListener('click', (e) => { if ((e.target as Element).closest('[data-consent-open]')) { e.preventDefault(); show(true); } });

const existing = read();
root.classList.toggle('needs-consent', false); // the pre-paint check in <head> may have guessed; this is the authority
if (existing) apply(existing.analytics);
else if ((navigator as any).globalPrivacyControl === true) { write({ v: cfg.v, analytics: false, ts: Date.now(), by: 'gpc' }); apply(false); }
else show(false);
