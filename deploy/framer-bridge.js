/* Eganow Framer bridge.
 * The few pages still built in Framer (blog, privacy policy, money-transfer T&Cs, 404) use Framer's client-side router.
 * Without this, clicking a link to a page that has been rebuilt would render the OLD Framer version inside the SPA.
 * This forces a normal page load for every route that now belongs to the new site. */
(function () {
  var NEW = ["/", "/money-transfer", "/uk", "/us", "/canada", "/bill-payment", "/cards", "/groups", "/about", "/contact", "/help", "/security", "/business", "/pos", "/developer"];
  var HASH = { "#pos": "/business/egapos", "#bizcollect-1": "/business/bizcollect", "#bizcollect": "/business/bizcollect" };
  function target(a) {
    var u;
    try { u = new URL(a.getAttribute("href"), location.href); } catch (e) { return null; }
    if (u.origin !== location.origin) return null;
    var p = u.pathname.replace(/\/+$/, "") || "/";
    if (p === "/business" && HASH[u.hash]) return HASH[u.hash];
    if (p === "/pos") return "/business/egapos";
    if (p === "/developer") return "/business/developers";
    if (NEW.indexOf(p) > -1 || p.indexOf("/business/") === 0) return p + u.search + u.hash;
    return null;
  }
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    var t = target(a);
    if (!t) return;
    e.preventDefault(); e.stopImmediatePropagation();
    location.assign(t);
  }, true);
})();
