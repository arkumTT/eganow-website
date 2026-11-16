// Copy-to-clipboard buttons: <button data-copy="#some-id">Copy</button>
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const t = document.querySelector(btn.dataset.copy!)?.textContent ?? '';
    try { await navigator.clipboard.writeText(t); btn.textContent = 'Copied'; } catch { btn.textContent = 'Press Ctrl+C'; }
    setTimeout(() => (btn.textContent = 'Copy'), 1800);
  });
});
