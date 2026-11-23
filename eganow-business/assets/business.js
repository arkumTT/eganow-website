(() => {
  const d = document.documentElement; d.classList.add("js");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // mobile drawer
  const mb = document.querySelector(".menu-btn"), dr = document.querySelector(".drawer");
  if (mb && dr) mb.addEventListener("click", () => { const o = dr.classList.toggle("open"); mb.setAttribute("aria-expanded", o); });
  // reveal on scroll
  const rv = document.querySelectorAll(".rv");
  if (reduce || !("IntersectionObserver" in window)) rv.forEach(e => e.classList.add("in"));
  else { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
         rv.forEach(e => io.observe(e)); }
  // pinned story (hub): swap stage panel as steps scroll past the middle
  const steps = document.querySelectorAll(".story__step"), panels = document.querySelectorAll(".story__panel");
  if (steps.length) {
    const set = i => { steps.forEach((s, k) => s.classList.toggle("on", k === i)); panels.forEach((p, k) => p.classList.toggle("on", k === i)); };
    set(0);
    const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) set([...steps].indexOf(e.target)); }), { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(s => so.observe(s));
  }
  // hero -> phone hand-off: ease the hero phone down/away as the page scrolls
  const hv = document.querySelector(".hhero__vis");
  if (hv && !reduce) {
    let tick = false;
    const upd = () => { tick = false; const h = hv.closest(".hhero").offsetHeight; hv.style.setProperty("--p", Math.min(1, Math.max(0, scrollY / h)).toFixed(3)); };
    addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true }); upd();
  }
  // code copy buttons
  document.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", async () => {
    const t = document.querySelector(b.dataset.copy)?.textContent || "";
    try { await navigator.clipboard.writeText(t); b.textContent = "Copied"; } catch { b.textContent = "Press Ctrl/Cmd+C"; }
    setTimeout(() => (b.textContent = "Copy"), 1800);
  }));
})();
