// Draft switch for the About and Security pages.
// While true: pages show a "draft" note and are `noindex`; [[placeholders]] render highlighted.
// Turning it off while any [[placeholder]] remains FAILS the build (see src/lib/text.ts).
// Security claims in particular must be verified by Eganow's security/compliance team before this is switched off.
export const COMPANY_DRAFT = true;
