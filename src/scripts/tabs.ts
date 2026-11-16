// Accessible tabs. Markup: [data-tabs] containing role="tab" buttons (id="tab-x", aria-controls="panel-x")
// and role="tabpanel" panels (in the same order). Without JS every panel shows, stacked.
document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((tabs) => {
  const btns = Array.from(tabs.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const panels = Array.from(tabs.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
  const select = (i: number, focus = false) => {
    btns.forEach((b, k) => { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
    panels.forEach((p, k) => (p.hidden = k !== i));
    if (focus) btns[i].focus();
  };
  tabs.classList.add('ready');
  const fromHash = btns.findIndex((b) => '#' + b.id.replace('tab-', '') === location.hash);
  select(fromHash >= 0 ? fromHash : 0);
  btns.forEach((b, i) => {
    b.addEventListener('click', () => select(i));
    b.addEventListener('keydown', (e) => {
      const n = btns.length;
      const map: Record<string, number> = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 };
      if (e.key in map) { e.preventDefault(); select(map[e.key], true); }
    });
  });
});
