// RateProvider contract (what the real Eganow rate-engine adapter must implement):
//   getCorridors()            -> Promise<{ send: Currency[], receive: Currency[], payoutMethods: Method[] }>
//   getQuote({from,to,amount,direction,payoutMethod})
//        -> Promise<{ rate, fee, sendAmount, receiveAmount, eta, quoteId, expiresAt, isSample }>
//   direction: "send" (amount is what the sender pays) | "receive" (amount is what the recipient gets)
// Errors: throw RateError with code "unavailable" | "unsupported" | "limit" | "offline".
// To go live: implement EganowRateProvider (calls your server-side proxy) and pass it to createCalculator().

export class RateError extends Error {
  constructor(code, message) { super(message || code); this.code = code; }
}

const CURRENCIES = {
  GBP: { code: "GBP", name: "British pound", flag: "🇬🇧", symbol: "£" },
  USD: { code: "USD", name: "US dollar", flag: "🇺🇸", symbol: "$" },
  CAD: { code: "CAD", name: "Canadian dollar", flag: "🇨🇦", symbol: "C$" },
  EUR: { code: "EUR", name: "Euro", flag: "🇪🇺", symbol: "€" },
  GHS: { code: "GHS", name: "Ghana cedi", flag: "🇬🇭", symbol: "GH₵" },
};
const METHODS = [
  { id: "momo", label: "Mobile money", detail: "MTN · Telecel · AirtelTigo", eta: "Within minutes" },
  { id: "bank", label: "Bank account", detail: "Ghana bank accounts", eta: "Within 1 hour" },
];

// SAMPLE DATA ONLY. Not real rates. Never ship to production (isSample flag drives a visible label).
const SAMPLE_RATES = { GBP: 16.3, USD: 12.4, CAD: 9.1, EUR: 14.0 };
const SAMPLE_FEE = { GBP: 1.99, USD: 2.49, CAD: 2.99, EUR: 1.99 };
const LIMITS = { min: 1, max: 10000 };

export class MockRateProvider {
  /** @param {{latency?:number, failRate?:number, offline?:boolean}} opts */
  constructor(opts = {}) { this.opts = { latency: 450, failRate: 0, offline: false, ...opts }; }
  async #delay() { await new Promise(r => setTimeout(r, this.opts.latency * (0.6 + Math.random() * 0.8))); }
  async getCorridors() {
    await this.#delay();
    return {
      send: ["GBP", "USD", "CAD", "EUR"].map(c => CURRENCIES[c]),
      receive: [CURRENCIES.GHS],
      payoutMethods: METHODS,
    };
  }
  async getQuote({ from, to, amount, direction = "send", payoutMethod = "momo" }) {
    await this.#delay();
    if (this.opts.offline || (typeof navigator !== "undefined" && navigator.onLine === false)) throw new RateError("offline");
    if (Math.random() < this.opts.failRate) throw new RateError("unavailable");
    if (!SAMPLE_RATES[from] || to !== "GHS") throw new RateError("unsupported");
    const base = SAMPLE_RATES[from];
    const rate = +(base * (payoutMethod === "bank" ? 0.998 : 1)).toFixed(4);
    const fee = SAMPLE_FEE[from];
    let sendAmount, receiveAmount;
    if (direction === "send") { sendAmount = amount; receiveAmount = Math.max(0, (amount - fee) * rate); }
    else { receiveAmount = amount; sendAmount = amount / rate + fee; }
    sendAmount = Math.round(sendAmount * 100) / 100; receiveAmount = Math.round(receiveAmount * 100) / 100;
    if (sendAmount < LIMITS.min || sendAmount > LIMITS.max) throw new RateError("limit", `${LIMITS.min}–${LIMITS.max} ${from}`);
    const method = METHODS.find(m => m.id === payoutMethod) || METHODS[0];
    return { rate, fee, sendAmount, receiveAmount, eta: method.eta, quoteId: "sample-" + Date.now().toString(36),
             expiresAt: Date.now() + 30 * 60 * 1000, isSample: true };
  }
}
