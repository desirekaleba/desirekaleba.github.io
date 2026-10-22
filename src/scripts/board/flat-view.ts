// The board drawn as plain HTML: one span per flap. It paints instantly, works without WebGL,
// and stays underneath the three.js board as its fallback.
import type { Board, BoardView, Row } from './board';

const CLASS: Record<string, string> = { d: 'c-d', k: 'c-k', m: 'c-m', h: 'c-h' };

function fillRow(el: HTMLElement, text: string, cls: string, cols: number) {
  const cells = el.children;
  for (let c = 0; c < cols; c++) {
    const cell = cells[c] as HTMLElement | undefined;
    if (!cell) continue;
    const ch = text[c] ?? ' ';
    cell.textContent = ch === ' ' ? ' ' : ch;
    cell.className = CLASS[cls[c] ?? 'd'] ?? 'c-d';
  }
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

  const namePanel = document.createElement('div');
  namePanel.className = 'flat-name';
  name.lines.forEach((line, r) => {
    const row = makeRow(nameCols);
    fillRow(row, line, name.cls[r] ?? '', nameCols);
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
  const rows = board.rows().map((r) => {
    const el = makeRow(cols);
    fillRow(el, r.text, r.cls, cols);
    code.appendChild(el);
    return el;
  });

  container.append(namePanel, print, code);

  return {
    setRow(i: number, row: Row) {
      const el = rows[i];
      if (el) fillRow(el, row.text, row.cls, cols);
    },
  };
}
