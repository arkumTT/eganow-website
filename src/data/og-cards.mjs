// One entry per shareable page. Used by BOTH:
//   - scripts/make-og.mjs  (renders public/og/<slug>.png, 1200x630)
//   - src/layouts/Base.astro (picks the og:image for the current path)
// world: 'personal' (red) | 'business' (blue) | 'neutral' (dark, both colours)
export const OG_SIZE = { width: 1200, height: 630 };

export const OG_CARDS = [
  { slug: 'default',        path: null,                         world: 'personal', label: 'Eganow',            headline: 'Simple. Speed. Secure.',          sub: 'Send, pay, collect and spend money.' },
  { slug: 'home',           path: '/',                          world: 'personal', label: 'The Eganow app',    headline: 'Money that moves with you.',      sub: 'Send, pay and spend in a few taps.' },
  { slug: 'business',       path: '/business',                  world: 'business', label: 'Eganow Business',   headline: 'Business, made simple.',          sub: 'Collect. Pay out. Issue cards. Accept at the counter.' },
  { slug: 'bizcollect',     path: '/business/bizcollect',       world: 'business', label: 'BizCollect',        headline: 'Get paid in seconds.',            sub: 'API, Hosted Checkout, Payment Links and USSD.' },
  { slug: 'egapos',         path: '/business/egapos',           world: 'business', label: 'EgaPOS',            headline: 'Tap. Paid.',                      sub: 'POS devices and one platform to manage them.' },
  { slug: 'card-issuing',   path: '/business/card-issuing',     world: 'business', label: 'Card Issuing',      headline: 'Issue cards. Control spend.',     sub: 'Mastercard cards for your team or your customers.' },
  { slug: 'agency-banking', path: '/business/agency-banking',   world: 'business', label: 'Agency Banking',    headline: 'Cash in. Cash out. Anywhere.',    sub: 'Turn your shop into a service point.' },
  { slug: 'bulk-messaging', path: '/business/bulk-messaging',   world: 'business', label: 'Bulk Messaging',    headline: 'Reach everyone. Instantly.',      sub: 'Bulk SMS and email, with delivery reports.' },
  { slug: 'egahub',         path: '/business/egahub',           world: 'business', label: 'Egahub',            headline: 'Your business, in your pocket.',  sub: 'The Eganow Business app.' },
  { slug: 'contact',        path: '/contact',                   world: 'neutral',  label: 'Contact',           headline: 'Let’s talk.',                sub: 'Questions, sales, support or just hello.' },
  { slug: 'help',           path: '/help',                      world: 'neutral',  label: 'Help centre',       headline: 'How can we help?',                sub: 'Answers for the Eganow app and Eganow Business.' },
  { slug: 'about',          path: '/about',                     world: 'neutral',  label: 'About Eganow',      headline: 'Money, made simple.',             sub: 'Simple. Speed. Secure.' },
  { slug: 'security',       path: '/security',                  world: 'neutral',  label: 'Security',          headline: 'Your money. Protected.',          sub: 'How we protect you, and how to stay safe.' },
  { slug: 'legal',          path: '/legal',                     world: 'neutral',  label: 'Legal',             headline: 'The small print, made clear.',    sub: 'Terms, privacy, cookies, AML and complaints.' },
];

// path -> slug, tolerant of a trailing slash
export function ogSlugFor(pathname) {
  const p = pathname.replace(/\/+$/, '') || '/';
  const hit = OG_CARDS.find((c) => c.path === p);
  if (hit) return hit.slug;
  if (p.startsWith('/legal/')) return 'legal'; // the individual legal documents share the legal card
  return 'default';
}
