// Shared text helpers for content pages (legal, help, about, security).
// Input is HTML-escaped first, so only these tokens can ever produce markup:
//   [[placeholder]] -> highlighted <mark>   **bold** -> <strong>   [label — /path] -> internal link
export const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const fmt = (t: string) =>
  esc(t)
    .replace(/\[\[(.+?)\]\]/g, '<mark class="todo">$1</mark>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\[\]]+?) — (\/[a-z0-9\-\/#?=]*)\]/gi, '<a href="$2">$1</a>');

// Safety net: once a page's draft switch is OFF, any leftover [[placeholder]] must fail the build instead of shipping.
export function assertNoPlaceholders(label: string, content: unknown, draft: boolean) {
  if (!draft && JSON.stringify(content).includes('[[')) {
    throw new Error(`${label} still contains [[placeholders]]. Complete them before turning its draft switch off.`);
  }
}
