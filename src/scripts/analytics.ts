// Loaded ONLY after a visitor accepts analytics (dynamic import from consent.ts), so declining costs nothing.
// Providers: Plausible (no cookies) and Google Analytics 4. Everything is in this one small module.
//
// Events: any script can announce one with
//     document.dispatchEvent(new CustomEvent('eganow:track', { detail: { name: 'chapter_reached', props: { chapter: 'cards' } } }))
// Before consent (or after it is withdrawn) nobody is listening, so those events simply go nowhere.
// Links are tracked automatically: [data-track="name"] (+ data-track-* as props) and any link to /contact?topic=X.
type Cfg = { provider: 'plausible' | 'ga4'; domain?: string; src?: string; id?: string };
type Props = Record<string, string | number>;
const w = window as any;

let active = false, started = false, sender: (name: string, props?: Props) => void = () => {};
let ttPolicy: any;

// Under Trusted Types the script URL must come from a policy; ours only ever returns the one URL we configured.
function scriptUrl(url: string): any {
  const tt = w.trustedTypes;
  if (!tt?.createPolicy) return url;
  try { ttPolicy ??= tt.createPolicy('eganow-analytics', { createScriptURL: (u: string) => { if (u !== url) throw new TypeError('Unexpected analytics script URL'); return u; } }); return ttPolicy.createScriptURL(url); }
  catch { return url; }
}

function loadPlausible(cfg: Cfg) {
  w.plausible = w.plausible || function () { (w.plausible.q = w.plausible.q || []).push(arguments); };
  const s = document.createElement('script');
  s.defer = true; s.dataset.domain = cfg.domain!; s.src = scriptUrl(cfg.src!);
  document.head.append(s);
  sender = (name, props) => w.plausible(name, props ? { props } : undefined);
}

function loadGa4(cfg: Cfg) {
  w[`ga-disable-${cfg.id}`] = false;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () { w.dataLayer.push(arguments); }; // must push the arguments object, not an array
  w.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  w.gtag('js', new Date());
  w.gtag('config', cfg.id, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });
  const s = document.createElement('script');
  s.async = true; s.src = scriptUrl(`https://www.googletagmanager.com/gtag/js?id=${cfg.id}`);
  document.head.append(s);
  sender = (name, props) => w.gtag('event', name, { ...props, transport_type: 'beacon' });
}

const send = (name: string, props?: Props) => { if (active) sender(name, props); };

function onTrack(e: Event) { const d = (e as CustomEvent).detail; if (d?.name) send(String(d.name), d.props); }

function onClick(e: MouseEvent) {
  const a = (e.target as Element | null)?.closest?.('a');
  if (!a) return;
  const name = a.getAttribute('data-track');
  if (name) {
    const props: Props = { page: location.pathname };
    for (const [k, v] of Object.entries(a.dataset)) if (k.startsWith('track') && k !== 'track' && v) props[k[5].toLowerCase() + k.slice(6)] = v;
    return send(name, props);
  }
  try {
    const u = new URL(a.href, location.href); const topic = u.searchParams.get('topic');
    if (topic && u.origin === location.origin && u.pathname.replace(/\/$/, '') === '/contact') send('contact_cta', { topic, page: location.pathname });
  } catch { /* not a valid URL: ignore */ }
}

export function start(cfg: Cfg) {
  active = true;
  if (started) return;
  started = true;
  cfg.provider === 'plausible' ? loadPlausible(cfg) : loadGa4(cfg);
  document.addEventListener('eganow:track', onTrack);
  document.addEventListener('click', onClick, true); // capture: runs before a link navigates away
}

// Consent withdrawn: stop sending now and clear what Google set. (A page reload drops the loaded script entirely.)
export function stop(cfg: Cfg) {
  active = false;
  if (cfg.provider !== 'ga4') return;
  w[`ga-disable-${cfg.id}`] = true;
  const host = location.hostname, parts = host.split('.');
  const domains = new Set([host, '.' + host, parts.length > 2 ? '.' + parts.slice(-2).join('.') : '.' + host]);
  for (const c of document.cookie.split('; ')) { const n = c.split('=')[0]; if (n === '_ga' || n.startsWith('_ga_')) for (const d of domains) document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`; }
}
