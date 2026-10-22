// The departures board's state: what each line says, the soft-close demo and the event log.
// It knows nothing about rendering. Views (the flat HTML board, the three.js board) subscribe to it.

export type Variant = 'home' | '404';
export type Row = { text: string; cls: string };
export type RowName = 'pagevow' | 'velabid' | 'startupblink' | 'email';
export type LogEntry = { t: string; k: string; v: string };
export type Panel = { id: 'name' | 'code'; lines: string[]; cls: string[] };

export interface BoardView {
  setRow(i: number, row: Row): void;
  highlight?(method: string): void;
}

// Every glyph a flap can show. Index 0 is a blank flap.
export const CHARSET = (() => {
  let ch = ' ';
  for (let a = 33; a <= 126; a++) ch += String.fromCharCode(a);
  return ch + '█·';
})();
// Syntax classes: d = value, k = YAML key, m = comment or gutter, h = highlighted flap.
export const VMAP: Record<string, number> = { d: 0, k: 1, m: 2, h: 3 };
export const WINDOW = 30;

const PV = ['123 users', '600+ pages', '79 requests', '0 marketing', '$200 organic'];
const PV_MOBILE = PV.slice(0, 4);
const SB = ['596K+ req/day', '~70% cached', 'team of 7', '2+ deploys/wk', '118 countries'];

type Layout = {
  rows: { pv: number; vbTime: number; sb: number; time: number; msg: number };
  nRows: number;
  cols: number;
  hits: Partial<Record<RowName, [number, number]>>;
};

export class Board {
  readonly variant: Variant;
  readonly mobile: boolean;
  readonly reduce: boolean;
  readonly views = new Set<BoardView>();
  log: LogEntry[] = [];
  note = 'The velabid_demo line is a soft-close demo, not a real auction. Bid in the last 30 seconds and the clock flips back.';
  closed = false;
  onChange?: () => void;

  private pvI = 0;
  private sbI = 0;
  private left = 45;
  private msg = '';
  private idle = 0;
  private closedFor = 0;
  private lastFlip = 0;
  private lastTime = '';
  private idleSide = false;
  private live: boolean;
  private timer = 0;
  private startTimer = 0;

  constructor(opts: { variant: Variant; mobile: boolean; reduce?: boolean; live?: boolean }) {
    this.variant = opts.variant;
    this.mobile = opts.mobile;
    this.reduce = !!opts.reduce;
    this.live = !!opts.live;
    if (this.live) this.lastTime = this.nairobiTime();
  }

  // ---- text helpers ----
  fmt(s: number): string {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }
  pad(str: string, n: number): string {
    str = str || '';
    while (str.length < n) str += ' ';
    return str.slice(0, n);
  }
  nairobiTime(): string {
    const d = new Date();
    const h = (d.getUTCHours() + 3) % 24;
    const m = d.getUTCMinutes();
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }
  private stamp(): string {
    const d = new Date();
    const z = (n: number, w: number) => String(n).padStart(w, '0');
    return z((d.getUTCHours() + 3) % 24, 2) + ':' + z(d.getUTCMinutes(), 2) + ':' + z(d.getUTCSeconds(), 2) + '.' + z(d.getUTCMilliseconds(), 3);
  }

  tokenize(s: string): string {
    let out = '';
    const hash = s.indexOf('#');
    const body = hash >= 0 ? s.slice(0, hash) : s;
    const rest = hash >= 0 ? s.slice(hash) : '';
    const lead = (body.match(/^\s*(- )?/) || [''])[0].length;
    const colon = body.indexOf(':', lead);
    for (let i = 0; i < body.length; i++) {
      if (i < lead) out += body[i] === '-' ? 'm' : 'd';
      else if (colon >= 0 && i <= colon) out += 'k';
      else out += 'd';
    }
    return out + 'm'.repeat(rest.length);
  }

  // ---- what the board says ----
  layout(): Layout {
    if (this.variant === '404') {
      return { rows: { pv: -1, vbTime: -1, sb: -1, time: -1, msg: -1 }, nRows: this.mobile ? 7 : 11, cols: this.mobile ? 20 : 32, hits: {} };
    }
    return this.mobile
      ? { rows: { pv: 3, vbTime: 4, sb: -1, time: -1, msg: -1 }, nRows: 8, cols: 20, hits: { pagevow: [3, 3], velabid: [4, 4], email: [6, 7] } }
      : { rows: { pv: 5, vbTime: 6, sb: 7, time: 9, msg: 10 }, nRows: 11, cols: 32, hits: { pagevow: [5, 5], velabid: [6, 6], startupblink: [7, 7], email: [8, 8] } };
  }

  private vbText(): string {
    return this.closed ? 'SOLD' : 'closes ' + this.fmt(this.left);
  }

  private codeRow(i: number): string {
    if (this.variant === '404') {
      return (this.mobile
        ? ['status: 404', 'route: not found', 'try:', '- /', '- /work/pagevow', '- /work/velabid', '- /work/startupblink']
        : ['# 404.yaml', 'status: 404', 'route: not found', 'shipped_here: nothing', '', 'try:', '  - /', '  - /work/pagevow', '  - /work/velabid', '  - /work/startupblink', '  - desirekaleba@gmail.com'])[i] ?? '';
    }
    if (this.mobile) {
      return ['role: Lead Engineer', 'at: StartupBlink', 'from: Nairobi', 'pagevow: ' + PV_MOBILE[this.pvI % PV_MOBILE.length], 'velabid_demo: ' + this.vbText(), 'traffic: 596K+/day', '# desirekaleba', '#   @gmail.com'][i] ?? '';
    }
    const time = this.live ? '# nairobi ' + this.lastTime + ' utc+3' : '# nairobi · utc+3';
    return ['# hover a line to flip it', 'role: Lead Engineer', 'at: StartupBlink', 'from: Nairobi, Kenya', 'remote: true',
      'pagevow: ' + PV[this.pvI % PV.length], 'velabid_demo: ' + this.vbText(), 'startupblink: ' + SB[this.sbI % SB.length],
      'email: desirekaleba@gmail.com', time, '# ' + (this.msg.trim() || 'write on this line below')][i] ?? '';
  }

  rowSpec(i: number): Row {
    const body = this.codeRow(i);
    const gutter = this.mobile ? '' : (i + 1 < 10 ? ' ' : '') + (i + 1) + ' ';
    const text = gutter + body;
    let cls = (this.mobile ? '' : 'mmm') + this.tokenize(body);
    if (i === this.layout().rows.vbTime && !this.closed && this.left <= WINDOW) {
      const t = this.fmt(this.left);
      const at = text.lastIndexOf(t);
      if (at >= 0) cls = cls.slice(0, at) + 'hhhh' + cls.slice(at + 4);
    }
    return { text, cls };
  }

  rows(): Row[] {
    return Array.from({ length: this.layout().nRows }, (_, i) => this.rowSpec(i));
  }

  namePanel(): Panel {
    const nf = this.variant === '404';
    return this.mobile
      ? { id: 'name', lines: nf ? ['Error', '404█'] : ['Desire', 'Kaleba█'], cls: nf ? ['ddddd', 'kkkk'] : ['dddddd', 'ddddddk'] }
      : { id: 'name', lines: [nf ? '404 Not Found█' : 'Desire Kaleba█'], cls: [nf ? 'kkkddddddddddk' : 'dddddddddddddk'] };
  }

  print(): { left: string; right: string } {
    const file = this.variant === '404' ? '404.yaml' : this.mobile ? 'me.yaml' : 'desire.yaml';
    return { left: '~/desire-kaleba/' + file, right: this.mobile ? '' : 'main · YAML · UTF-8' };
  }

  // ---- behaviour ----
  start(): void {
    if (this.variant === '404') return;
    // The intro flips run for about three seconds; the clock starts after them.
    this.startTimer = window.setTimeout(() => {
      this.timer = window.setInterval(() => this.second(), 1000);
    }, this.reduce ? 0 : 3200);
  }

  stop(): void {
    clearTimeout(this.startTimer);
    clearInterval(this.timer);
    clearTimeout(this.typeTimer);
  }

  second() {
    const R = this.layout().rows;
    if (this.live && R.time >= 0) {
      const t = this.nairobiTime();
      if (t !== this.lastTime) {
        this.lastTime = t;
        this.emit(R.time);
        this.addLog('clock', '// nairobi ' + t + ' utc+3');
      }
    }
    if (this.reduce) return;
    if (!this.closed) this.setLeft(this.left - 1);
    else if (++this.closedFor > 5) {
      this.closedFor = 0;
      this.closed = false;
      this.left = 45;
      this.emit(R.vbTime);
      this.addLog('auction', 'reopened · velabid_demo: closes 0:45');
    }
    if (++this.idle > 9) {
      this.idle = 0;
      this.lastFlip = 0;
      this.flipRow(this.idleSide || R.sb < 0 ? 'pagevow' : 'startupblink');
      this.idleSide = !this.idleSide;
    }
  }

  setLeft(n: number) {
    this.left = Math.max(0, n);
    if (this.left === 0) {
      this.closed = true;
      this.addLog('auction', 'closes hit 0:00 → SOLD');
    }
    if (this.left === WINDOW) this.addLog('softclose', 'window open · a bid now extends the close');
    this.emit(this.layout().rows.vbTime);
    this.onChange?.();
  }

  bid() {
    if (this.closed || this.variant === '404') return;
    const before = this.left;
    const late = before <= WINDOW;
    if (late) this.left = WINDOW;
    this.emit(this.layout().rows.vbTime);
    this.highlight('bid');
    this.note = late
      ? 'Bid at ' + this.fmt(before) + ' was late, so the clock flipped back to 0:30. That’s a soft close: sniping stops working.'
      : 'Bid at ' + this.fmt(before) + '. Not in the last 30 s, so the clock keeps running.';
    this.addLog('bid', 'at ' + this.fmt(before) + ' · late=' + late + (late ? ' → closes 0:30' : ' → no extension'));
  }

  skip() {
    if (!this.closed) this.setLeft(this.left - 10);
  }

  flipRow(row: RowName, force = false) {
    const R = this.layout().rows;
    if (row === 'velabid') return this.bid();
    if (row === 'email') return;
    const now = performance.now();
    if (!force && now - this.lastFlip < 350) return;
    this.lastFlip = now;
    this.idle = 0;
    if (row === 'pagevow' && R.pv >= 0) {
      const list = this.mobile ? PV_MOBILE : PV;
      this.pvI = (this.pvI + 1) % list.length;
      this.emit(R.pv);
      this.addLog('flip', 'pagevow: ' + list[this.pvI]);
    }
    if (row === 'startupblink' && R.sb >= 0) {
      this.sbI = (this.sbI + 1) % SB.length;
      this.emit(R.sb);
      this.addLog('flip', 'startupblink: ' + SB[this.sbI]);
    }
    this.highlight('flipRow');
  }

  next() {
    this.flipRow('pagevow', true);
    this.flipRow('startupblink', true);
  }

  private typeTimer = 0;
  typeMessage(v: string) {
    let out = '';
    for (const ch of (v || '').slice(0, 27)) out += CHARSET.indexOf(ch) > 0 || ch === ' ' ? ch : ' ';
    this.msg = out;
    this.emit(this.layout().rows.msg);
    this.highlight('typeMessage');
    clearTimeout(this.typeTimer);
    this.typeTimer = window.setTimeout(() => {
      this.addLog('comment', '"' + (out.trim() || 'write on this line below') + '" → line 11');
    }, 600);
  }

  addLog(k: string, v: string) {
    this.log = [{ t: this.stamp(), k, v }, ...this.log].slice(0, this.mobile ? 5 : 6);
    this.onChange?.();
  }

  private emit(i: number) {
    if (i < 0) return;
    const row = this.rowSpec(i);
    this.views.forEach((view) => view.setRow(i, row));
  }

  private highlight(method: string) {
    this.views.forEach((view) => view.highlight?.(method));
  }
}
