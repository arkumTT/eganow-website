// Help centre content. DRAFT: written from the product brief, in general terms.
// TODO(verify): Eganow's support team must confirm every answer against the live app/portal (exact screens, limits,
// timings, availability) before launch. Anything specific that isn't confirmed is marked [[...]] in the answer text.
// While true, [[placeholders]] render highlighted. When false, the build FAILS if any remain.
export const HELP_DRAFT = true;

export interface HelpItem { q: string; a: string; link?: [label: string, href: string] }
export interface HelpCategory { id: string; title: string; blurb: string; world: 'personal' | 'business'; items: HelpItem[] }

export const HELP: HelpCategory[] = [
  { id: 'getting-started', title: 'Getting started', blurb: 'Download the app and set up your account.', world: 'personal', items: [
    { q: 'How do I get the Eganow app?', a: 'Download Eganow from the App Store on iPhone or Google Play on Android, then follow the steps to create your account.', link: ['Get the app', '/#download'] },
    { q: 'Why do you need to verify my identity?', a: 'Verifying your identity keeps your money safe and is required by law. The more fully you are verified, the higher your limits can be.', link: ['How we verify identity', '/legal/aml-policy'] },
    { q: 'I can’t sign in. What should I do?', a: 'Check your phone number and PIN, and make sure you have a good connection. If you still can’t sign in, contact us and we’ll help you get back in. [[confirm the PIN-reset steps]]', link: ['Contact support', '/contact?topic=support'] },
  ] },
  { id: 'money-transfer', title: 'Money transfer', blurb: 'Send money at home and abroad.', world: 'personal', items: [
    { q: 'How do I send money?', a: 'Choose Money Transfer in the app, pick or add a recipient, enter the amount and check every detail before you confirm.' },
    { q: 'Can I send money to another country?', a: 'Eganow supports local and cross-border transfers. The countries available, any fees and the exchange rate are shown before you confirm. [[confirm supported corridors]]' },
    { q: 'Can I cancel a transfer?', a: 'Once a transfer is confirmed it may not be possible to cancel it. If you made a mistake, contact us straight away and we will do what we can.', link: ['Contact support', '/contact?topic=support'] },
  ] },
  { id: 'bill-payments', title: 'Bill payments', blurb: 'Pay utilities, airtime, TV and more.', world: 'personal', items: [
    { q: 'Which bills can I pay?', a: 'You can pay a range of bills, such as utilities, airtime and TV, from the app. The billers available are listed under Bill Payments. [[confirm biller list]]' },
    { q: 'Where can I find my receipt?', a: 'You get a confirmation after each payment, and you can find past payments in your transaction history.' },
    { q: 'I paid a bill but it hasn’t updated. What now?', a: 'Some billers take a little while to update. If it still hasn’t shown after [[time]], contact us with your payment reference and we’ll look into it.', link: ['Contact support', '/contact?topic=support'] },
  ] },
  { id: 'cards', title: 'Cards', blurb: 'Virtual and physical Mastercard cards.', world: 'personal', items: [
    { q: 'What cards can I get?', a: 'You can get a virtual Mastercard card for online spending, and order a physical Mastercard card for spending in person. [[confirm availability and delivery]]' },
    { q: 'How do I freeze my card?', a: 'Open the Cards section of the app and freeze the card. You can unfreeze it again whenever you are ready. [[confirm the steps]]' },
    { q: 'My card was lost or stolen.', a: 'Freeze it in the app straight away, then contact us so we can help you replace it.', link: ['Contact support', '/contact?topic=support'] },
  ] },
  { id: 'groups', title: 'Groups', blurb: 'Pool money with family, friends or a community.', world: 'personal', items: [
    { q: 'What are Groups?', a: 'Groups let you pool money with other people towards a shared goal. You can start a private Group for people you invite, or a public Group for a cause.' },
    { q: 'What is the difference between private and public Groups?', a: 'A private Group is for the people you invite. A public Group is open to a wider audience. [[confirm how public Groups are shared and discovered]]' },
    { q: 'Can I see who has contributed?', a: 'Members can follow a Group’s progress. What each person can see depends on the Group’s settings. [[confirm]]' },
  ] },
  { id: 'account-security', title: 'Account and security', blurb: 'Keep your money and details safe.', world: 'personal', items: [
    { q: 'How do I keep my account safe?', a: 'Never share your PIN, password or one-time codes with anyone. Eganow will never ask for them. Use a phone you control and keep it secure.' },
    { q: 'I think someone used my account without my permission.', a: 'Contact us immediately. Freeze your card in the app, change your PIN, and keep any messages as evidence.', link: ['Make a complaint or report fraud', '/contact?topic=complaint'] },
    { q: 'How do I report a scam?', a: 'Tell us what happened through the contact form and include any messages or numbers involved. Never reply to a message that asks for your PIN or codes.', link: ['Contact support', '/contact?topic=support'] },
  ] },

  { id: 'bizcollect', title: 'BizCollect', blurb: 'Collections, payouts and your dashboard.', world: 'business', items: [
    { q: 'How do I start collecting payments?', a: 'Open a business account, then choose how to collect: the API, Hosted Checkout, a Payment Link or USSD.', link: ['About BizCollect', '/business/bizcollect'] },
    { q: 'Where can I see my transactions?', a: 'Your BizCollect dashboard lists every transaction, so you can follow each payment from start to finish.' },
    { q: 'How do payouts work?', a: 'You can pay out to one recipient or many from your dashboard. Check the total before you send. [[confirm payout limits and timing]]' },
  ] },
  { id: 'egapos', title: 'EgaPOS', blurb: 'POS devices and the management platform.', world: 'business', items: [
    { q: 'How do I get a POS device?', a: 'Apply for a business account and tell us what you need. Once you are verified, Eganow issues and sets up your device. [[confirm lead time]]', link: ['About EgaPOS', '/business/egapos'] },
    { q: 'How do I see all my terminals?', a: 'The POS management platform lists every device with its status and what it has sold.' },
    { q: 'My terminal is offline or faulty.', a: 'Check the power and the connection first. If it still isn’t working, contact us and we’ll help you get back to selling.', link: ['Contact support', '/contact?topic=support'] },
  ] },
  { id: 'card-issuing', title: 'Card Issuing', blurb: 'Mastercard cards for your team or customers.', world: 'business', items: [
    { q: 'Can I issue cards for my team?', a: 'Yes. You can issue virtual and physical Mastercard cards for your organisation’s expenses.', link: ['About Card Issuing', '/business/card-issuing'] },
    { q: 'How do I become a re-issuer?', a: 'Apply through the contact form and choose “Become a re-issuer”. Our team will guide you through eligibility and onboarding.', link: ['Apply as a re-issuer', '/contact?topic=reissuer'] },
    { q: 'Can I set a limit on a card?', a: 'You can set how much each card can spend and freeze or unfreeze a card from your dashboard. [[confirm]]' },
  ] },
  { id: 'agency-banking', title: 'Agency Banking', blurb: 'Cash in and cash out for your customers.', world: 'business', items: [
    { q: 'How do I become an agent?', a: 'Apply through the contact form and choose “Become an agent”. We’ll verify your business and set you up.', link: ['Become an agent', '/contact?topic=agent'] },
    { q: 'What can customers do at my agent point?', a: 'They can put cash into their mobile wallet or bank account (cash in) and take cash out of them (cash out).', link: ['About Agency Banking', '/business/agency-banking'] },
    { q: 'A customer’s cash out is still pending. What should I do?', a: 'Check the status in your dashboard and wait for confirmation before handing over any cash. If it stays pending, contact us.', link: ['Contact support', '/contact?topic=support'] },
  ] },
  { id: 'bulk-messaging', title: 'Bulk Messaging', blurb: 'Bulk SMS and email for your business.', world: 'business', items: [
    { q: 'Can I send both SMS and email?', a: 'Yes. Bulk Messaging covers bulk SMS and bulk email from one account.', link: ['About Bulk Messaging', '/business/bulk-messaging'] },
    { q: 'Do I need permission to message people?', a: 'Yes. Only message people who have agreed to hear from you, and always honour opt-out requests.' },
    { q: 'How do I see whether my messages were delivered?', a: 'Your delivery report shows how many messages were sent, delivered and not delivered. [[confirm report detail]]' },
  ] },
  { id: 'egahub', title: 'Egahub', blurb: 'The Eganow Business mobile app.', world: 'business', items: [
    { q: 'What is Egahub?', a: 'Egahub is the Eganow Business app. It puts the merchant portal on your phone so you can run your business from anywhere.', link: ['About Egahub', '/business/egahub'] },
    { q: 'Do I use the same login as the portal?', a: 'Egahub uses your Eganow business account. [[confirm shared login]]' },
    { q: 'Where do I download Egahub?', a: 'Get Egahub from the App Store or Google Play.', link: ['Download Egahub', '/business/egahub#download'] },
  ] },
];
