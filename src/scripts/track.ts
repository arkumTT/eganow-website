// Announce an analytics event. Costs nothing and goes nowhere unless a visitor has accepted analytics
// (only then is src/scripts/analytics.ts listening). Never put personal data in props: topics, names of
// sections and similar only.
export const track = (name: string, props?: Record<string, string | number>) =>
  document.dispatchEvent(new CustomEvent('eganow:track', { detail: { name, props } }));
