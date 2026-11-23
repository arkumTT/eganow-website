import { MockRateProvider, RateError } from "./rate-provider.js";

const fmt = (n, d = 2) => new Intl.NumberFormat("en-GB", { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
const parse = v => { const n = parseFloat(String(v).replace(/,/g, "")); return Number.isFinite(n) ? n : NaN; };
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

/**
 * createCalculator(root, { provider, defaultFrom, defaultTo, appUrl, showSampleBadge })
 * root contains the markup from index.html (data-calc hooks).
 */
export function createCalculator(root, opts = {}) {
  const provider = opts.provider || new MockRateProvider();
  const appUrl = opts.appUrl || "https://eganow.com/download";
  const $ = s => root.querySelector(s);
  const el = {
    sendAmt: $("[data-send-amount]"), recvAmt: $("[data-receive-amount]"),
    sendCur: $("[data-send-currency]"), recvCur: $("[data-receive-currency]"),
    swap: $("[data-swap]"), rate: $("[data-rate]"), fee: $("[data-fee]"), eta: $("[data-eta]"),
    methods: $("[data-methods]"), cta: $("[data-cta]"), error: $("[data-error]"), retry: $("[data-retry]"),
    sample: $("[data-sample]"), live: $("[data-live]"), expiry: $("[data-expiry]"), card: root,
  };
  const state = { corridors: null, from: opts.defaultFrom || "GBP", to: opts.defaultTo || "GHS", method: "momo",
                  amount: 200, direction: "send", quote: null, seq: 0, loading: false };

  const flag = c => `${c.flag} ${c.code}`;
  function fillSelect(sel, list, value) {
    sel.innerHTML = list.map(c => `<option value="${c.code}">${flag(c)}</option>`).join("");
    sel.value = value;
  }
  function setLoading(on) {
    state.loading = on; el.card.classList.toggle("is-loading", on);
    el.card.setAttribute("aria-busy", on ? "true" : "false");
  }
  function showError(err) {
    const msgs = {
      offline: "You appear to be offline. Reconnect to see the live rate.",
      unavailable: "We can't load the rate right now. See the rate in the app.",
      unsupported: "This route isn't available yet. Choose another currency.",
      limit: "Amount is outside the allowed range" + (err.message && err.message !== "limit" ? ` (${err.message}).` : "."),
    };
    el.error.hidden = false; el.error.querySelector("[data-error-text]").textContent = msgs[err.code] || msgs.unavailable;
    el.retry.hidden = err.code === "limit" || err.code === "unsupported";
    el.card.classList.add("has-error"); el.cta.setAttribute("aria-disabled", err.code === "limit" || err.code === "unsupported" ? "true" : "false");
    el.rate.textContent = "—"; el.fee.textContent = "—"; el.eta.textContent = "—";
  }
  function clearError() { el.error.hidden = true; el.card.classList.remove("has-error"); el.cta.removeAttribute("aria-disabled"); }

  function render(q) {
    const sym = state.from;
    // write only the *derived* field so the user's typing is never overwritten
    if (state.direction === "send") el.recvAmt.value = fmt(q.receiveAmount);
    else el.sendAmt.value = fmt(q.sendAmount);
    el.rate.textContent = `1 ${state.from} = ${fmt(q.rate, 2)} ${state.to}`;
    el.fee.textContent = `${fmt(q.fee)} ${sym}`;
    el.eta.textContent = q.eta;
    el.sample.hidden = !(q.isSample && opts.showSampleBadge !== false);
    el.live.textContent = `They receive ${fmt(q.receiveAmount)} ${state.to} for ${fmt(q.sendAmount)} ${state.from}. Rate ${fmt(q.rate, 2)}.`;
    updateCta(q);
  }
  function updateCta(q) {
    const u = new URL(appUrl);
    u.searchParams.set("from", state.from); u.searchParams.set("to", state.to);
    u.searchParams.set("amount", String(q.sendAmount)); u.searchParams.set("method", state.method);
    u.searchParams.set("quote", q.quoteId); // app must re-quote; never trust this value
    el.cta.href = u.toString();
  }

  async function refresh() {
    const amount = parse(state.direction === "send" ? el.sendAmt.value : el.recvAmt.value);
    if (!(amount > 0)) { clearError(); state.quote = null; (state.direction === "send" ? el.recvAmt : el.sendAmt).value = ""; return; }
    const mine = ++state.seq; setLoading(true);
    try {
      const q = await provider.getQuote({ from: state.from, to: state.to, amount, direction: state.direction, payoutMethod: state.method });
      if (mine !== state.seq) return; // stale response
      clearError(); state.quote = q; render(q); startExpiry(q.expiresAt);
    } catch (e) {
      if (mine !== state.seq) return;
      showError(e instanceof RateError ? e : new RateError("unavailable"));
    } finally { if (mine === state.seq) setLoading(false); }
  }
  const refreshSoon = debounce(refresh, 300);

  let expiryTimer;
  function startExpiry(at) {
    clearInterval(expiryTimer);
    const tick = () => {
      const s = Math.max(0, Math.round((at - Date.now()) / 1000));
      el.expiry.textContent = s > 0 ? `Rate held for ${Math.ceil(s / 60)} min` : "Rate expired – refreshing";
      if (s === 0) { clearInterval(expiryTimer); refresh(); }
    };
    tick(); expiryTimer = setInterval(tick, 15000);
  }

  function bindAmount(input, direction) {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^\d.,]/g, "");
      state.direction = direction; refreshSoon();
    });
    input.addEventListener("blur", () => { const n = parse(input.value); if (n > 0) input.value = fmt(n); });
  }
  bindAmount(el.sendAmt, "send"); bindAmount(el.recvAmt, "receive");
  el.sendCur.addEventListener("change", () => { state.from = el.sendCur.value; syncUrl(); refresh(); });
  el.recvCur.addEventListener("change", () => { state.to = el.recvCur.value; refresh(); });
  el.retry.addEventListener("click", refresh);
  el.cta.addEventListener("click", e => { if (el.cta.getAttribute("aria-disabled") === "true") e.preventDefault();
    root.dispatchEvent(new CustomEvent("calculator:cta", { detail: { ...state, quote: state.quote }, bubbles: true })); });

  // swap: only swaps if the reverse corridor exists; otherwise nudges the user
  el.swap.addEventListener("click", () => {
    const { send, receive } = state.corridors;
    const canSwap = send.some(c => c.code === state.to) && receive.some(c => c.code === state.from);
    if (!canSwap) { el.swap.classList.remove("shake"); void el.swap.offsetWidth; el.swap.classList.add("shake");
      el.live.textContent = "Transfers are currently sent to Ghana only."; return; }
    [state.from, state.to] = [state.to, state.from]; fillSelect(el.sendCur, send, state.from); fillSelect(el.recvCur, receive, state.to); refresh();
  });

  function renderMethods(list) {
    el.methods.innerHTML = list.map(m => `<button type="button" role="radio" aria-checked="${m.id === state.method}" data-method="${m.id}" class="chip">
      <strong>${m.label}</strong><small>${m.detail}</small></button>`).join("");
    el.methods.addEventListener("click", e => {
      const b = e.target.closest("[data-method]"); if (!b) return;
      state.method = b.dataset.method;
      el.methods.querySelectorAll("[data-method]").forEach(x => x.setAttribute("aria-checked", String(x === b)));
      refresh();
    });
    el.methods.addEventListener("keydown", e => {
      if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
      const bs = [...el.methods.querySelectorAll("[data-method]")]; const i = bs.indexOf(document.activeElement);
      const n = bs[(i + (e.key === "ArrowRight" ? 1 : bs.length - 1)) % bs.length]; n.focus(); n.click();
    });
  }
  function syncUrl() { root.dispatchEvent(new CustomEvent("calculator:change", { detail: { from: state.from, to: state.to }, bubbles: true })); }

  (async function init() {
    setLoading(true);
    try {
      state.corridors = await provider.getCorridors();
      const { send, receive, payoutMethods } = state.corridors;
      if (!send.some(c => c.code === state.from)) state.from = send[0].code;
      if (!receive.some(c => c.code === state.to)) state.to = receive[0].code;
      fillSelect(el.sendCur, send, state.from); fillSelect(el.recvCur, receive, state.to);
      renderMethods(payoutMethods);
      el.sendAmt.value = fmt(state.amount);
      await refresh();
    } catch (e) { showError(e instanceof RateError ? e : new RateError("unavailable")); setLoading(false); }
  })();

  // online/offline awareness
  window.addEventListener("online", refresh);
  window.addEventListener("offline", () => showError(new RateError("offline")));

  return { refresh, get state() { return state; }, destroy() { clearInterval(expiryTimer); } };
}
