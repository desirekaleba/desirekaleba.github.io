// The stack graph's detail panel, rendered the same way on the server and in the browser.
import { edges, places, tools } from '../data/stack';

export type Sel = { k: 'tool' | 'place'; id: string };

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const toolById = Object.fromEntries(tools.map((t) => [t.id, t]));
export const placeById = Object.fromEntries(places.map((p) => [p.id, p]));

export function neighbours(sel: Sel): string[] {
  return edges
    .filter((e) => (sel.k === 'tool' ? e.tool === sel.id : e.place === sel.id))
    .map((e) => (sel.k === 'tool' ? e.place : e.tool));
}

export function detailHtml(sel: Sel): string {
  if (sel.k === 'tool') {
    const t = toolById[sel.id];
    const n = t.uses.length;
    const items = t.uses
      .map(([pid, text]) => {
        const p = placeById[pid];
        return `<li class="d-item"><div class="d-row"><button type="button" class="d-link" data-go-place="${esc(p.id)}">${esc(p.name)}</button><span class="d-meta">${esc(p.kind)} · ${esc(p.when)}</span></div><p>${esc(text)}</p></li>`;
      })
      .join('');
    return `<span class="d-eyebrow">${esc(t.cat)}</span><h3 class="d-name">${esc(t.name)}</h3><span class="d-sub">Used at ${n} ${n === 1 ? 'place' : 'places'}</span><ul class="d-list">${items}</ul>`;
  }
  const p = placeById[sel.id];
  const es = edges.filter((e) => e.place === p.id);
  const items = es
    .map((e) => {
      const t = toolById[e.tool];
      return `<li class="d-item d-item-place"><button type="button" class="d-link" data-go-tool="${esc(t.id)}">${esc(t.name)}</button><span>${esc(e.text)}</span></li>`;
    })
    .join('');
  const link = p.link ? `<a class="d-case" href="${esc(p.link)}">case-study →</a>` : '';
  return `<span class="d-eyebrow">${esc((p.kind + ' · ' + p.role).toUpperCase())}</span><h3 class="d-name">${esc(p.name)}</h3><span class="d-when">${esc(p.when)}</span><p class="d-line">${esc(p.line)}</p><span class="d-eyebrow">Stack · ${es.length} tools</span><ul class="d-list">${items}</ul>${link}`;
}
