// The board drawn as plain HTML: one span per flap. It paints instantly, works without WebGL,
// and stays underneath the three.js board as its fallback.
import type { Board, BoardView, Row } from './board';

const CLASS: Record<string, string> = { d: 'c-d', k: 'c-k', m: 'c-m', h: 'c-h' };
const FLAP: Keyframe[] = [
  { transform: 'perspective(300px) rotateX(0)' },
  { transform: 'perspective(300px) rotateX(-88deg)', offset: 0.45 },
  { transform: 'perspective(300px) rotateX(0)' },
];

// Returns the columns whose glyph or colour changed.
function fillRow(el: HTMLElement, text: string, cls: string, cols: number): number[] {
  const changed: number[] = [];
  const cells = el.children;
  for (let c = 0; c < cols; c++) {
    const cell = cells[c] as HTMLElement | undefined;
    if (!cell) continue;
    const ch = text[c] ?? ' ';
    const glyph = ch === ' ' ? ' ' : ch;
    const className = CLASS[cls[c] ?? 'd'] ?? 'c-d';
    if (cell.textContent === glyph && cell.className === className) continue;
    cell.textContent = glyph;
    cell.className = className;
    changed.push(c);
  }
  return changed;
}

function makeRow(cols: number): HTMLElement {
  const row = document.createElement('div');
  row.className = 'flat-row';
  for (let c = 0; c < cols; c++) row.appendChild(document.createElement('span'));
  return row;
}

export function renderFlat(container: HTMLElement, board: Board): BoardView {
  const { cols } = board.layout();
  const name = board.namePanel();
  const nameCols = Math.max(...name.lines.map((l) => l.length));
  container.innerHTML = '';
  container.style.setProperty('--cols', String(cols));
  container.style.setProperty('--name-cols', String(nameCols));

  // Fold flaps down and back, left to right, like a line on a real board settling.
  const flap = (row: HTMLElement, columns: number[]) => {
    if (board.reduce) return;
    columns.forEach((c, k) => {
      (row.children[c] as HTMLElement | undefined)?.animate(FLAP, { duration: 320, delay: k * 12, easing: 'ease-in-out' });
    });
  };
  const lettered = (row: HTMLElement) =>
    [...row.children].flatMap((cell, c) => (cell.textContent?.trim() ? [c] : []));

  const namePanel = document.createElement('div');
  namePanel.className = 'flat-name';
  name.lines.forEach((line, r) => {
    const row = makeRow(nameCols);
    fillRow(row, line, name.cls[r] ?? '', nameCols);
    row.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') flap(row, lettered(row));
    });
    namePanel.appendChild(row);
  });

  const print = document.createElement('div');
  print.className = 'flat-print';
  const p = board.print();
  print.innerHTML = '<span></span><span></span>';
  (print.children[0] as HTMLElement).textContent = p.left;
  (print.children[1] as HTMLElement).textContent = p.right;

  const code = document.createElement('div');
  code.className = 'flat-code';
  const rows = board.rows().map((r, i) => {
    const el = makeRow(cols);
    fillRow(el, r.text, r.cls, cols);
    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') board.hoverRow(i);
    });
    el.addEventListener('click', () => board.clickRow(i));
    if (board.rowName(i)) el.classList.add('clickable');
    code.appendChild(el);
    return el;
  });

  container.append(namePanel, print, code);

  return {
    setRow(i: number, row: Row) {
      const el = rows[i];
      if (el) flap(el, fillRow(el, row.text, row.cls, cols));
    },
    replay(i: number) {
      const el = rows[i];
      if (el) flap(el, lettered(el));
    },
  };
}
