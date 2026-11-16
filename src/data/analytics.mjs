// Analytics + consent configuration. Resolved at BUILD time from environment variables and shared by
//   - the page templates (banner, footer link)
//   - integrations/launch-files.mjs (the matching Content-Security-Policy hosts)
//   - scripts/check-site.mjs
// so what the pages load and what the CSP allows can never drift apart.
//
//   ANALYTICS_PROVIDER = none (default) | plausible | ga4
//   PLAUSIBLE_DOMAIN   = eganow.com                         (plausible)
//   PLAUSIBLE_SRC      = https://plausible.io/js/script.js  (plausible; set to your own host if self-hosted)
//   GA4_MEASUREMENT_ID = G-XXXXXXXXXX                       (ga4)
//   ANALYTICS_IN_STAGING = true   enable on non-production builds too (testing only; default is production only,
//                                 so staging traffic never pollutes real numbers)
//
// With the default (none), the site ships NO banner and NO tracking code at all.

export const CONSENT_VERSION = 1; // bump when what you ask consent for changes: everyone is asked again

const hostOf = (url) => new URL(url).origin;

export function resolveAnalytics(env = process.env) {
  const provider = (env.ANALYTICS_PROVIDER || 'none').toLowerCase().trim();
  if (provider === 'none') return { enabled: false, provider: 'none' };
  if (!['plausible', 'ga4'].includes(provider)) throw new Error(`ANALYTICS_PROVIDER must be none, plausible or ga4 (got "${env.ANALYTICS_PROVIDER}")`);
  if (env.SITE_ENV !== 'production' && env.ANALYTICS_IN_STAGING !== 'true') return { enabled: false, provider: 'none', skipped: provider };

  if (provider === 'plausible') {
    const domain = (env.PLAUSIBLE_DOMAIN || '').trim();
    const src = (env.PLAUSIBLE_SRC || 'https://plausible.io/js/script.js').trim();
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) throw new Error('ANALYTICS_PROVIDER=plausible needs PLAUSIBLE_DOMAIN (e.g. eganow.com)');
    if (!/^https:\/\//.test(src)) throw new Error('PLAUSIBLE_SRC must be an https:// URL');
    const origin = hostOf(src);
    return { enabled: true, provider, label: 'Plausible Analytics', domain, src, cookies: [],
      csp: { scriptSrc: [origin], connectSrc: [origin], imgSrc: [], trustedTypes: true } };
  }

  const id = (env.GA4_MEASUREMENT_ID || '').trim();
  if (!/^G-[A-Z0-9]{6,14}$/.test(id)) throw new Error('ANALYTICS_PROVIDER=ga4 needs GA4_MEASUREMENT_ID like G-XXXXXXXXXX');
  return { enabled: true, provider, label: 'Google Analytics', id,
    cookies: [['_ga', '2 years', 'Tells one visitor from another'], [`_ga_${id.slice(2)}`, '2 years', 'Keeps session state']],
    // trustedTypes:false -> the CSP omits require-trusted-types-for: gtag.js is third-party code we cannot test offline.
    csp: { scriptSrc: ['https://www.googletagmanager.com'],
           connectSrc: ['https://www.google-analytics.com', 'https://*.google-analytics.com', 'https://analytics.google.com', 'https://www.googletagmanager.com'],
           imgSrc: ['https://www.google-analytics.com', 'https://www.googletagmanager.com'], trustedTypes: false } };
}

export const ANALYTICS = resolveAnalytics();

// What the browser-side scripts need (never anything secret: a measurement ID / domain is public by design).
export function clientConfig(a = ANALYTICS) {
  if (!a.enabled) return null;
  return { v: CONSENT_VERSION, provider: a.provider, label: a.label, domain: a.domain, src: a.src, id: a.id, cookies: a.cookies };
}
