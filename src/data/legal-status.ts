// Single switch for every legal page.
// While true: pages show a "draft for legal review" banner and are `noindex`.
// Flip to false ONLY after counsel has approved the text and every [[placeholder]] has been replaced.
export const LEGAL_DRAFT = true;
export const LEGAL_DRAFT_DATE = '16 November 2026';

export const LEGAL_DOCS = [
  { href: '/legal/terms', title: 'Terms of Use', blurb: 'The rules for using Eganow’s website, apps and services.' },
  { href: '/legal/privacy', title: 'Privacy Policy', blurb: 'What personal data we collect, why, and the choices you have.' },
  { href: '/legal/cookies', title: 'Cookie Policy', blurb: 'How this website uses cookies and similar technologies.' },
  { href: '/legal/aml-policy', title: 'AML and KYC', blurb: 'How we verify identity and help prevent financial crime.' },
  { href: '/legal/complaints', title: 'Complaints', blurb: 'How to tell us when something goes wrong, and what happens next.' },
] as const;
