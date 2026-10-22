// The board in three.js: real split flaps with hinges, a housing, cables and a shadow on the wall.
// Loaded only after the page has painted; the flat HTML board shows until this is ready.
import {
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  InstancedMesh,
  LinearFilter,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  REVISION,
  Raycaster,
  RepeatWrapping,
  Scene,
  Shape,
  ShadowMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
} from 'three';
import boardSource from './board.ts?raw';
import { CHARSET, VMAP, type Board, type BoardView, type Row, type RowName } from './board';

const N = CHARSET.length;
const MONO = '"JetBrains Mono Variable", ui-monospace, Menlo, monospace';

type PanelSpec = { id: 'name' | 'code'; cols: number; cw: number; ch: number; gap: number; x: number; y: number; lines: string[]; cls: string[] };
type Cell = {
  pn: BuiltPanel; r: number; c: number;
  top: Mesh; bot: Mesh; flap: Group; ff: Mesh; fb: Mesh;
  cur: number; v: number; tci: number; tv: number; nci: number; nv: number;
  t: number; dur: number; flipping: boolean; settle: number; delay: number;
};
type BuiltPanel = PanelSpec & { G: { top: PlaneGeometry[]; bot: PlaneGeometry[] }; cells: Cell[][] };

export type ThreeView = BoardView & {
  applyTheme(): void;
  setActive(active: boolean): void;
  dispose(): void;
};

function palette() {
  return document.documentElement.dataset.theme === 'light'
    ? { housing: 0x1d1e22, slot: 0x07080a, flap: '#F6F5F1', glyph: '#141518', key: '#8F5300', muted: '#6B7078', hflap: '#FFB000', hglyph: '#16171A', print: '#C9C5BC', hemi: 0.72, light: 1.0, shadow: 0.24, glare: 0.03, dark: false }
    : { housing: 0x16171a, slot: 0x040405, flap: '#1F2024', glyph: '#F3F1EC', key: '#FFB000', muted: '#9AA0A8', hflap: '#FFB000', hglyph: '#16171A', print: '#A9A49A', hemi: 0.6, light: 1.2, shadow: 0.55, glare: 0.04, dark: true };
}

function srgb(tex: CanvasTexture) {
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

export function createThreeView(
  canvas: HTMLCanvasElement,
  board: Board,
  // intro: flip every line in from blank. Off when the flat board is already showing the same text.
  opts: { reduce: boolean; intro?: boolean; onHud?: (s: string) => void },
): ThreeView {
  const reduce = opts.reduce;
  const mobile = board.mobile;
  const pad = (s: string, n: number) => board.pad(s, n);

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  const scene = new Scene();
  const camera = new PerspectiveCamera(20, 1, 10, 20000);
  const root = new Group();
  scene.add(root);

  // ---- layout ----
  const name = board.namePanel();
  const rows = board.rows();
  const L = board.layout();
  const panels: PanelSpec[] = mobile
    ? [
        { id: 'name', cols: 7, cw: 40, ch: 60, gap: 4, x: 0, y: 0, lines: name.lines, cls: name.cls },
        { id: 'code', cols: 20, cw: 15.6, ch: 24, gap: 1.2, x: 0, y: -144, lines: rows.map((r) => r.text), cls: rows.map((r) => r.cls) },
      ]
    : [
        { id: 'name', cols: 14, cw: 80, ch: 118, gap: 6, x: 0, y: 0, lines: name.lines, cls: name.cls },
        { id: 'code', cols: 32, cw: 38, ch: 56, gap: 2, x: 0, y: -150, lines: rows.map((r) => r.text), cls: rows.map((r) => r.cls) },
      ];
  const printSpec = mobile ? { x: 0, y: 30, w: 334, h: 18 } : { x: 0, y: 44, w: 1278, h: 28 };
  const housingPad = mobile ? 14 : 28;
  const radius = mobile ? 9 : 16;
  const atlasCell = mobile ? [64, 96] : [96, 144];

  // ---- glyph atlas: every character in four styles (plain, key, comment, highlighted) ----
  const atlasCols = 20;
  const gw = atlasCell[0];
  const gh = atlasCell[1];
  const atlasRows = Math.ceil((N * 4) / atlasCols);
  const atlasCanvas = document.createElement('canvas');
  atlasCanvas.width = atlasCols * gw;
  atlasCanvas.height = atlasRows * gh;
  const atlasCtx = atlasCanvas.getContext('2d')!;
  const atlasTex = srgb(new CanvasTexture(atlasCanvas));
  atlasTex.generateMipmaps = false;
  atlasTex.minFilter = LinearFilter;
  atlasTex.magFilter = LinearFilter;
  atlasTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

  function drawAtlas() {
    const P = palette();
    const W = atlasCanvas.width;
    const H = atlasCanvas.height;
    atlasCtx.clearRect(0, 0, W, H);
    for (let g = 0; g < N * 4; g++) {
      const v = Math.floor(g / N);
      const ch = CHARSET[g % N];
      const x = (g % atlasCols) * gw;
      const y = Math.floor(g / atlasCols) * gh;
      atlasCtx.fillStyle = v === 3 ? P.hflap : P.flap;
      atlasCtx.fillRect(x, y, gw, gh);
      const g1 = atlasCtx.createLinearGradient(0, y, 0, y + gh / 2);
      g1.addColorStop(0, 'rgba(255,255,255,0.08)');
      g1.addColorStop(1, 'rgba(0,0,0,0.04)');
      atlasCtx.fillStyle = g1;
      atlasCtx.fillRect(x, y, gw, gh / 2);
      const g2 = atlasCtx.createLinearGradient(0, y + gh / 2, 0, y + gh);
      g2.addColorStop(0, 'rgba(0,0,0,0.26)');
      g2.addColorStop(0.18, 'rgba(0,0,0,0.06)');
      g2.addColorStop(1, 'rgba(0,0,0,0.02)');
      atlasCtx.fillStyle = g2;
      atlasCtx.fillRect(x, y + gh / 2, gw, gh / 2);
      atlasCtx.fillStyle = 'rgba(0,0,0,0.18)';
      atlasCtx.fillRect(x, y, 2, gh);
      atlasCtx.fillRect(x + gw - 2, y, 2, gh);
      atlasCtx.fillStyle = v === 1 ? P.key : v === 2 ? P.muted : v === 3 ? P.hglyph : P.glyph;
      if (ch === '█') {
        atlasCtx.fillRect(x + gw * 0.2, y + gh * 0.16, gw * 0.6, gh * 0.68);
        continue;
      }
      atlasCtx.font = '700 ' + Math.round(gh * 0.68) + 'px ' + MONO;
      atlasCtx.textAlign = 'center';
      atlasCtx.textBaseline = 'middle';
      atlasCtx.fillText(ch, x + gw / 2, y + gh * 0.53);
    }
    atlasTex.needsUpdate = true;
  }
  drawAtlas();
  const flapMat = new MeshStandardMaterial({ map: atlasTex, roughness: 0.42, metalness: 0.05 });

  // Lights. Intensities are the original values scaled for physically based lighting.
  const hemi = new HemisphereLight(0xffffff, 0x6b6f76, 0.7 * Math.PI);
  scene.add(hemi);
  const key = new DirectionalLight(0xfff6ea, 1.05 * Math.PI);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0008;
  scene.add(key, key.target);

  const housingMat = new MeshStandardMaterial({ color: 0x1d1e22, roughness: 0.55, metalness: 0.25 });
  const slotMat = new MeshStandardMaterial({ color: 0x07080a, roughness: 0.9 });
  const steel = new MeshStandardMaterial({ color: 0x9ea3a8, roughness: 0.35, metalness: 0.85 });

  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  const pinPos: [number, number, number][] = [];
  const hingePos: [number, number, number, number][] = [];
  const cells: Cell[] = [];
  const built: Record<string, BuiltPanel> = {};

  for (const spec of panels) {
    const pn = spec as BuiltPanel;
    built[pn.id] = pn;
    const rowsN = pn.lines.length;
    const pw = pn.cols * (pn.cw + pn.gap) - pn.gap;
    const ph = rowsN * (pn.ch + pn.gap) - pn.gap;
    minX = Math.min(minX, pn.x);
    maxX = Math.max(maxX, pn.x + pw);
    maxY = Math.max(maxY, pn.y);
    minY = Math.min(minY, pn.y - ph);
    const slot = new Mesh(new PlaneGeometry(pw + 4, ph + 4), slotMat);
    slot.position.set(pn.x + pw / 2, pn.y - ph / 2, -1.5);
    slot.receiveShadow = true;
    root.add(slot);

    // One pair of half-flap geometries per glyph, sharing the atlas texture.
    const hh = pn.ch / 2 - Math.max(0.4, pn.ch * 0.012);
    const top: PlaneGeometry[] = [];
    const bot: PlaneGeometry[] = [];
    for (let g = 0; g < N * 4; g++) {
      const cx = g % atlasCols;
      const cy = Math.floor(g / atlasCols);
      const u0 = (cx * gw) / atlasCanvas.width + 0.001;
      const u1 = ((cx + 1) * gw) / atlasCanvas.width - 0.001;
      const vt = 1 - (cy * gh) / atlasCanvas.height - 0.002;
      const vb = 1 - ((cy + 1) * gh) / atlasCanvas.height + 0.002;
      const vm = (vt + vb) / 2;
      const gt = new PlaneGeometry(pn.cw, hh);
      (gt.attributes.uv.array as Float32Array).set([u0, vt, u1, vt, u0, vm, u1, vm]);
      gt.attributes.uv.needsUpdate = true;
      const gb = new PlaneGeometry(pn.cw, hh);
      (gb.attributes.uv.array as Float32Array).set([u0, vm, u1, vm, u0, vb, u1, vb]);
      gb.attributes.uv.needsUpdate = true;
      top.push(gt);
      bot.push(gb);
    }
    pn.G = { top, bot };
    pn.cells = [];
    for (let r = 0; r < rowsN; r++) {
      pn.cells.push([]);
      const line = pad(pn.lines[r] ?? '', pn.cols);
      const cl0 = pad(pn.cls[r] ?? '', pn.cols);
      for (let c = 0; c < pn.cols; c++) {
        const cx2 = pn.x + c * (pn.cw + pn.gap) + pn.cw / 2;
        const cy2 = pn.y - r * (pn.ch + pn.gap) - pn.ch / 2;
        const q = hh / 2 + (pn.ch / 2 - hh);
        const tm = new Mesh(top[0], flapMat);
        tm.position.set(cx2, cy2 + q, 0);
        tm.receiveShadow = true;
        root.add(tm);
        const bm = new Mesh(bot[0], flapMat);
        bm.position.set(cx2, cy2 - q, 0);
        bm.receiveShadow = true;
        root.add(bm);
        hingePos.push([cx2, cy2, pn.cw, Math.max(0.6, pn.ch * 0.02)]);
        const flap = new Group();
        flap.position.set(cx2, cy2, 1.2);
        flap.visible = false;
        root.add(flap);
        const ff = new Mesh(top[0], flapMat);
        ff.position.set(0, q, 0);
        ff.castShadow = true;
        flap.add(ff);
        const fb = new Mesh(bot[0], flapMat);
        fb.position.set(0, q, -0.15);
        fb.rotation.x = Math.PI;
        flap.add(fb);
        if (pn.cw > 20) {
          const pr = Math.max(1.0, pn.cw * 0.045);
          pinPos.push([cx2 - pn.cw / 2 - pn.gap / 2, cy2, pr], [cx2 + pn.cw / 2 + pn.gap / 2, cy2, pr]);
        }
        const cell: Cell = {
          pn, r, c, top: tm, bot: bm, flap, ff, fb,
          cur: 0, v: 0, tci: Math.max(0, CHARSET.indexOf(line[c])), tv: VMAP[cl0[c]] ?? 0, nci: 0, nv: 0,
          t: 0, dur: 0.045, flipping: false, settle: 0, delay: 0,
        };
        pn.cells[r].push(cell);
        cells.push(cell);
      }
    }
  }

  const hinges = new InstancedMesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.12 }), hingePos.length);
  const m4 = new Matrix4();
  hingePos.forEach((h, i) => {
    m4.makeScale(h[2], h[3], 1);
    m4.setPosition(h[0], h[1], 0.2);
    hinges.setMatrixAt(i, m4);
  });
  root.add(hinges);
  if (pinPos.length) {
    const pins = new InstancedMesh(new SphereGeometry(1, 10, 8), steel, pinPos.length);
    pinPos.forEach((p, i) => {
      m4.makeScale(p[2], p[2], p[2]);
      m4.setPosition(p[0], p[1], 1.0);
      pins.setMatrixAt(i, m4);
    });
    root.add(pins);
  }

  // The file name printed on the housing.
  const printCanvas = document.createElement('canvas');
  printCanvas.width = Math.round(printSpec.w * 2);
  printCanvas.height = Math.round(printSpec.h * 2);
  const printCtx = printCanvas.getContext('2d')!;
  const printTex = srgb(new CanvasTexture(printCanvas));
  const printMesh = new Mesh(new PlaneGeometry(printSpec.w, printSpec.h), new MeshStandardMaterial({ map: printTex, transparent: true, roughness: 0.8 }));
  printMesh.position.set(printSpec.x + printSpec.w / 2, printSpec.y - printSpec.h / 2, -1.2);
  root.add(printMesh);
  maxY = Math.max(maxY, printSpec.y);
  function drawPrint() {
    const P = palette();
    const { left, right } = board.print();
    const w = printCanvas.width;
    const h = printCanvas.height;
    printCtx.clearRect(0, 0, w, h);
    printCtx.fillStyle = P.print;
    printCtx.textBaseline = 'middle';
    printCtx.font = '500 ' + Math.round(h * 0.55) + 'px ' + MONO;
    printCtx.textAlign = 'left';
    printCtx.fillText(left, 0, h * 0.55);
    if (right) {
      printCtx.textAlign = 'right';
      printCtx.fillText(right, w, h * 0.55);
    }
    printTex.needsUpdate = true;
  }
  drawPrint();

  // Invisible hit areas over the lines you can click.
  const code = built.code;
  const cpw = code.cols * (code.cw + code.gap) - code.gap;
  const hitMeshes: Mesh[] = [];
  (Object.keys(L.hits) as RowName[]).forEach((k) => {
    const h = L.hits[k]!;
    const y0 = code.y - h[0] * (code.ch + code.gap);
    const y1 = code.y - (h[1] + 1) * (code.ch + code.gap) + code.gap;
    const hm = new Mesh(new PlaneGeometry(cpw, y0 - y1), new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    hm.position.set(code.x + cpw / 2, (y0 + y1) / 2, 3);
    hm.userData.row = k;
    root.add(hm);
    hitMeshes.push(hm);
  });

  // Housing, screws and the cables it hangs from.
  minX -= housingPad;
  maxX += housingPad;
  minY -= housingPad;
  maxY += housingPad * 0.8;
  const hw = maxX - minX;
  const hh2 = maxY - minY;
  const sh = new Shape();
  const x0 = -hw / 2;
  const y0 = -hh2 / 2;
  sh.moveTo(x0 + radius, y0);
  sh.lineTo(x0 + hw - radius, y0);
  sh.quadraticCurveTo(x0 + hw, y0, x0 + hw, y0 + radius);
  sh.lineTo(x0 + hw, y0 + hh2 - radius);
  sh.quadraticCurveTo(x0 + hw, y0 + hh2, x0 + hw - radius, y0 + hh2);
  sh.lineTo(x0 + radius, y0 + hh2);
  sh.quadraticCurveTo(x0, y0 + hh2, x0, y0 + hh2 - radius);
  sh.lineTo(x0, y0 + radius);
  sh.quadraticCurveTo(x0, y0, x0 + radius, y0);
  const housing = new Mesh(new ExtrudeGeometry(sh, { depth: 22, bevelEnabled: true, bevelThickness: 3, bevelSize: 3, bevelSegments: 4, curveSegments: 12 }), housingMat);
  housing.position.set((minX + maxX) / 2, (minY + maxY) / 2, -28);
  housing.castShadow = true;
  housing.receiveShadow = true;
  root.add(housing);
  const sr = mobile ? 3 : 4.5;
  [
    [minX + housingPad * 0.45, maxY - housingPad * 0.45],
    [maxX - housingPad * 0.45, maxY - housingPad * 0.45],
    [minX + housingPad * 0.45, minY + housingPad * 0.45],
    [maxX - housingPad * 0.45, minY + housingPad * 0.45],
  ].forEach(([px, py]) => {
    const screw = new Mesh(new CylinderGeometry(sr, sr, 2, 16), steel);
    screw.rotation.x = Math.PI / 2;
    screw.position.set(px, py, -2);
    root.add(screw);
    const slot = new Mesh(new BoxGeometry(sr * 1.6, sr * 0.28, 1), slotMat);
    slot.rotation.z = 0.6;
    slot.position.set(px, py, -0.6);
    root.add(slot);
  });
  const cableLen = 2400;
  [minX + hw * 0.16, maxX - hw * 0.16].forEach((x) => {
    const cable = new Mesh(new CylinderGeometry(1.4, 1.4, cableLen, 8), steel);
    cable.position.set(x, maxY + cableLen / 2 + 6, -16);
    cable.castShadow = true;
    root.add(cable);
    const eye = new Mesh(new TorusGeometry(7, 2, 8, 20), steel);
    eye.position.set(x, maxY + 6, -16);
    eye.castShadow = true;
    root.add(eye);
  });

  // A faint glare sweeping across the glass as the pointer moves.
  const glareCanvas = document.createElement('canvas');
  glareCanvas.width = 512;
  glareCanvas.height = 256;
  const gx = glareCanvas.getContext('2d')!;
  const gr = gx.createLinearGradient(0, 0, 512, 256);
  gr.addColorStop(0, 'rgba(255,255,255,0)');
  gr.addColorStop(0.42, 'rgba(255,255,255,0)');
  gr.addColorStop(0.5, 'rgba(255,255,255,1)');
  gr.addColorStop(0.62, 'rgba(255,255,255,0)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  gx.fillStyle = gr;
  gx.fillRect(0, 0, 512, 256);
  const glareTex = srgb(new CanvasTexture(glareCanvas));
  glareTex.wrapS = RepeatWrapping;
  const glass = new Mesh(new PlaneGeometry(hw - housingPad, hh2 - housingPad), new MeshBasicMaterial({ map: glareTex, transparent: true, opacity: 0.06, depthWrite: false, blending: AdditiveBlending }));
  glass.position.set((minX + maxX) / 2, (minY + maxY) / 2, 6);
  root.add(glass);

  const wall = new Mesh(new PlaneGeometry(hw * 4, hh2 * 6), new ShadowMaterial({ opacity: 0.24 }));
  wall.position.set((minX + maxX) / 2, (minY + maxY) / 2, -80);
  wall.receiveShadow = true;
  root.add(wall);

  // The wall behind the board shows the source code that runs it; the method that just ran lights up.
  const codeWall = buildCodeWall((minX + maxX) / 2, (minY + maxY) / 2);

  root.position.set(-(minX + maxX) / 2, -(minY + maxY) / 2, 0);
  const D = hw * 1.6;
  key.position.set(-D * 0.34, D * 0.62, D * 0.72);
  const kc = key.shadow.camera;
  kc.left = -hw * 0.95;
  kc.right = hw * 0.95;
  kc.top = hh2 * 1.6;
  kc.bottom = -hh2 * 1.6;
  kc.near = D * 0.2;
  kc.far = D * 2.5;
  kc.updateProjectionMatrix();

  // ---- flipping ----
  let active: Cell[] = [];
  let dirty = true;

  function setInstant(cl: Cell) {
    const g = cl.tci + cl.tv * N;
    cl.cur = cl.tci;
    cl.v = cl.tv;
    cl.flipping = false;
    cl.settle = 0;
    cl.flap.visible = false;
    cl.top.geometry = cl.pn.G.top[g];
    cl.bot.geometry = cl.pn.G.bot[g];
  }

  function setCells(list: Cell[], text: string, cls: string) {
    const s = pad(text, list.length);
    const k = pad(cls, list.length);
    list.forEach((cl, i) => {
      const ci = Math.max(0, CHARSET.indexOf(s[i]));
      const v = VMAP[k[i]] ?? 0;
      if (cl.tci === ci && cl.tv === v) return;
      cl.tci = ci;
      cl.tv = v;
      if (!cl.flipping) cl.delay = reduce ? 0 : i * 0.012;
      if (reduce) setInstant(cl);
      else if (!active.includes(cl)) active.push(cl);
    });
    dirty = true;
  }

  // Intro: the name first, then the code, line by line.
  const instant = reduce || !opts.intro;
  for (const cl of cells) {
    cl.delay = instant ? 0 : 0.2 + (cl.pn.id === 'name' ? 0 : 0.45) + cl.c * 0.012 + cl.r * (cl.pn.id === 'name' ? 0.1 : 0.085);
    if (instant) setInstant(cl);
    else if (cl.tci !== 0 || cl.tv !== 0) active.push(cl);
  }
  const nameCells = built.name.cells;
  const cursor = nameCells[nameCells.length - 1][nameCells[nameCells.length - 1].length - 1];

  // ---- pointer ----
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const ray = new Raycaster();
  const ndc = new Vector2();
  let hover: string | null = null;

  function rowAt(e: PointerEvent | MouseEvent): RowName | null {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(hitMeshes, false);
    return hit.length ? (hit[0].object.userData.row as RowName) : null;
  }
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    const row = rowAt(e);
    canvas.style.cursor = row ? 'pointer' : 'default';
    if (row && row !== hover && e.pointerType === 'mouse' && (row === 'pagevow' || row === 'startupblink')) board.flipRow(row);
    hover = row;
  };
  const onLeave = () => {
    hover = null;
    mouse.tx = 0;
    mouse.ty = 0;
  };
  const onClick = (e: MouseEvent) => {
    const row = rowAt(e);
    if (row === 'email') {
      board.addLog('mailto', 'desirekaleba@gmail.com');
      window.location.href = 'mailto:desirekaleba@gmail.com';
      return;
    }
    if (row) board.flipRow(row);
  };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('click', onClick);

  // ---- size ----
  let dist = 1000;
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const t = Math.tan((camera.fov * Math.PI) / 180 / 2);
    dist = Math.max(((hw / 2) * 1.07) / (t * camera.aspect), ((hh2 / 2) * 1.28) / t);
    camera.near = dist * 0.2;
    camera.far = dist * 4;
    camera.updateProjectionMatrix();
    dirty = true;
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  function applyTheme() {
    const P = palette();
    drawAtlas();
    drawPrint();
    codeWall.draw();
    codeWall.drawVignette();
    housingMat.color.set(P.housing);
    slotMat.color.set(P.slot);
    hemi.intensity = P.hemi * Math.PI;
    key.intensity = P.light * Math.PI;
    (wall.material as ShadowMaterial).opacity = P.shadow;
    (glass.material as MeshBasicMaterial).opacity = P.glare;
    dirty = true;
  }
  applyTheme();
  document.fonts?.load('600 60px "JetBrains Mono Variable"').then(() => {
    drawAtlas();
    drawPrint();
    codeWall.draw();
    dirty = true;
  }).catch(() => {});

  // ---- frame loop ----
  let raf = 0;
  let last = 0;
  let running = false;
  const started = performance.now();
  let blink = 0;
  let frames = 0;
  let renders = 0;
  let hudAcc = 0;

  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.1, (now - (last || now)) / 1000);
    last = now;
    const DUR = mobile ? 0.05 : 0.045;

    if (active.length) {
      const still: Cell[] = [];
      for (const cl of active) {
        if (cl.delay > 0) {
          cl.delay -= dt;
          still.push(cl);
          continue;
        }
        if (cl.settle > 0) {
          cl.settle = Math.max(0, cl.settle - dt);
          const b = 1 - cl.settle / 0.07;
          cl.flap.rotation.x = -Math.PI + 0.16 * Math.sin(b * Math.PI) * (1 - b);
          if (cl.settle === 0) cl.flap.visible = false;
          still.push(cl);
          continue;
        }
        if (cl.flipping) {
          cl.t += dt;
          const p = Math.min(1, cl.t / cl.dur);
          cl.flap.rotation.x = -Math.PI * p * p;
          if (p >= 1) {
            cl.cur = cl.nci;
            cl.v = cl.nv;
            cl.flipping = false;
            cl.bot.geometry = cl.pn.G.bot[cl.cur + cl.v * N];
            if (cl.cur === cl.tci && cl.v === cl.tv) {
              cl.settle = 0.07;
              still.push(cl);
              continue;
            }
            cl.flap.visible = false;
          }
        }
        if (!cl.flipping && (cl.cur !== cl.tci || cl.v !== cl.tv)) {
          let nci: number;
          const fwd = (cl.tci - cl.cur + N) % N;
          const digits = (n: number) => n >= 16 && n <= 25;
          if (cl.cur === cl.tci) nci = cl.cur;
          // The demo clock counts down through the digits, like a real board.
          else if (digits(cl.cur) && digits(cl.tci) && cl.pn.id === 'code' && cl.r === L.rows.vbTime) nci = 16 + ((cl.cur - 16 + 9) % 10);
          else if (fwd > 12) nci = (cl.tci - 9 + N) % N;
          else nci = (cl.cur + 1) % N;
          const gc = cl.cur + cl.v * N;
          const gn = nci + cl.tv * N;
          cl.top.geometry = cl.pn.G.top[gn];
          cl.ff.geometry = cl.pn.G.top[gc];
          cl.fb.geometry = cl.pn.G.bot[gn];
          cl.bot.geometry = cl.pn.G.bot[gc];
          cl.flap.rotation.x = 0;
          cl.flap.visible = true;
          cl.t = 0;
          cl.dur = DUR * (0.85 + Math.random() * 0.3);
          cl.flipping = true;
          cl.nci = nci;
          cl.nv = cl.tv;
        }
        if (cl.flipping || cl.settle > 0 || cl.cur !== cl.tci || cl.v !== cl.tv) still.push(cl);
      }
      active = still;
      dirty = true;
    }

    // A blinking cursor after the name: an instant swap, not a flip.
    if (now - started > (opts.intro ? 3200 : 0) && !reduce && !cursor.flipping && cursor.settle === 0) {
      blink += dt;
      if (blink > 0.53) {
        blink = 0;
        cursor.tci = cursor.tci === 0 ? CHARSET.length - 2 : 0;
        cursor.tv = 1;
        setInstant(cursor);
        dirty = true;
      }
    }

    // Gentle parallax that follows the pointer.
    const k = reduce ? 1 : Math.min(1, dt * 4);
    const mx = reduce ? 0 : mouse.tx;
    const my = reduce ? 0 : mouse.ty;
    mouse.x += (mx - mouse.x) * k;
    mouse.y += (my - mouse.y) * k;
    const px = mouse.x * dist * 0.035;
    const py = hh2 * 0.08 - mouse.y * dist * 0.02;
    if (Math.abs(camera.position.x - px) > 0.05 || Math.abs(camera.position.y - py) > 0.05 || Math.abs(camera.position.z - dist) > 0.05) dirty = true;
    camera.position.set(px, py, dist);
    camera.lookAt(0, 0, 0);
    glareTex.offset.x = 0.25 - mouse.x * 0.18;

    if (codeWall.step(dt, now)) dirty = true;

    if (dirty) {
      renderer.render(scene, camera);
      dirty = false;
      renders++;
    }
    frames++;
    hudAcc += dt;
    if (hudAcc >= 1 && opts.onHud) {
      const info = renderer.info.render;
      opts.onHud('raf ' + Math.round(frames / hudAcc) + '/s · renders ' + Math.round(renders / hudAcc) + '/s · ' + info.calls + ' draw calls · ' + (info.triangles / 1000).toFixed(1) + 'k tris');
      frames = 0;
      renders = 0;
      hudAcc = 0;
    }
  }

  function setActive(on: boolean) {
    if (on === running) return;
    running = on;
    if (on) {
      last = 0;
      dirty = true;
      raf = requestAnimationFrame(tick);
    } else cancelAnimationFrame(raf);
  }
  setActive(true);
  board.addLog('boot', cells.length + ' flaps · ' + L.nRows + ' lines of YAML · three.js r' + REVISION);

  // ---- the code wall ----
  function buildCodeWall(cx: number, cy: number) {
    const all = boardSource.split('\n');
    const starts: { name: string; i: number }[] = [];
    all.forEach((l, i) => {
      const m = /^ {2}(?:private |public )?([A-Za-z]+)\(.*\)(?::[^{]*)?\s*\{\s*$/.exec(l);
      if (m) starts.push({ name: m[1], i });
    });
    const picks = ['second', 'setLeft', 'bid', 'flipRow', 'typeMessage', 'rowSpec', 'tokenize', 'codeRow', 'next', 'skip'];
    let lines: { n: number; text: string }[] = [];
    const ranges: Record<string, { from: number; to: number }> = {};
    for (const nameP of picks) {
      const j = starts.findIndex((s) => s.name === nameP);
      if (j < 0) continue;
      const end = j + 1 < starts.length ? starts[j + 1].i : all.length;
      const from = lines.length;
      for (let k = starts[j].i; k < end; k++) {
        if (all[k].trim() === '' && k === end - 1) continue;
        lines.push({ n: k + 1, text: all[k].replace(/\t/g, '  ').slice(2, 150) });
      }
      ranges[nameP] = { from, to: lines.length };
      lines.push({ n: 0, text: '' });
    }
    if (lines.length < 10) lines = [{ n: 1, text: '// source unavailable' }];
    const colsN = mobile ? 1 : 2;
    const LH = 20;
    const rowsN = Math.min(170, Math.ceil(lines.length / colsN));
    lines = lines.slice(0, rowsN * colsN);
    const cw = mobile ? 1024 : 2048;
    const chh = rowsN * LH + 12;
    const cv = document.createElement('canvas');
    cv.width = cw;
    cv.height = chh;
    const ctx = cv.getContext('2d')!;
    const tex = srgb(new CanvasTexture(cv));
    tex.wrapT = RepeatWrapping;
    tex.generateMipmaps = false;
    tex.minFilter = LinearFilter;
    const unit = mobile ? (hw * 2.2) / cw : 1.0;
    const pw = cw * unit;
    const ph = hh2 * 2.6;
    tex.repeat.set(1, Math.min(1, ph / (chh * unit)));
    const plane = new Mesh(new PlaneGeometry(pw, ph), new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    plane.position.set(cx, cy, -90);
    root.add(plane);
    const vc = document.createElement('canvas');
    vc.width = 256;
    vc.height = 256;
    const vctx = vc.getContext('2d')!;
    const vtex = srgb(new CanvasTexture(vc));
    const vig = new Mesh(new PlaneGeometry(pw * 1.002, ph * 1.002), new MeshBasicMaterial({ map: vtex, transparent: true, depthWrite: false }));
    vig.position.set(cx, cy, -88);
    root.add(vig);
    tex.offset.y = 1 - tex.repeat.y;

    let hl: string | null = null;
    let hlUntil = 0;
    let lastHl = 0;
    let target: number | null = null;

    const draw = () => {
      const dark = palette().dark;
      const r = hl ? ranges[hl] : null;
      ctx.clearRect(0, 0, cw, chh);
      ctx.font = '400 13px ' + MONO;
      ctx.textBaseline = 'top';
      const base = dark ? 'rgba(236,237,238,0.09)' : 'rgba(20,21,24,0.08)';
      const num = dark ? 'rgba(236,237,238,0.05)' : 'rgba(20,21,24,0.045)';
      const hiBg = dark ? 'rgba(255,176,0,0.10)' : 'rgba(255,176,0,0.16)';
      const hiFg = dark ? 'rgba(255,176,0,0.9)' : 'rgba(138,79,0,0.85)';
      const colW = cw / colsN;
      for (let c = 0; c < colsN; c++) {
        for (let rr = 0; rr < rowsN; rr++) {
          const idx = c * rowsN + rr;
          const ln = lines[idx];
          if (!ln) continue;
          const x = 28 + c * colW;
          const y = 6 + rr * LH;
          const on = !!r && idx >= r.from && idx < r.to;
          if (on) {
            ctx.fillStyle = hiBg;
            ctx.fillRect(x - 10, y - 3, colW - 36, LH);
          }
          if (ln.n) {
            ctx.fillStyle = on ? hiFg : num;
            ctx.fillText(String(ln.n), x, y);
          }
          ctx.fillStyle = on ? hiFg : base;
          ctx.fillText(ln.text, x + 44, y);
        }
      }
      tex.needsUpdate = true;
      dirty = true;
    };
    const drawVignette = () => {
      const bg = palette().dark ? '11,12,14' : '233,234,236';
      vctx.clearRect(0, 0, 256, 256);
      const g = vctx.createRadialGradient(128, 128, 40, 128, 128, 128);
      g.addColorStop(0, 'rgba(' + bg + ',0)');
      g.addColorStop(0.62, 'rgba(' + bg + ',0.15)');
      g.addColorStop(1, 'rgba(' + bg + ',1)');
      vctx.fillStyle = g;
      vctx.fillRect(0, 0, 256, 256);
      vtex.needsUpdate = true;
    };
    const highlight = (method: string) => {
      if (!ranges[method]) return;
      const now = performance.now();
      if (hl === method) {
        hlUntil = now + 1600;
        return;
      }
      if (now - lastHl < 300) return;
      lastHl = now;
      hl = method;
      hlUntil = now + 1600;
      const r = ranges[method];
      const row = r.from % rowsN;
      const y = (6 + (row + (r.to - r.from) / 2) * LH) / chh;
      target = 1 - y - tex.repeat.y / 2;
      if (reduce) {
        tex.offset.y = target;
        target = null;
      }
      draw();
    };
    // Returns true when the wall moved and needs a render.
    const step = (dt: number, now: number) => {
      let moved = false;
      if (target !== null) {
        const dy = target - tex.offset.y;
        tex.offset.y += dy * Math.min(1, dt * 3.5);
        if (Math.abs(dy) < 0.0005) target = null;
        moved = true;
      } else if (!reduce) {
        tex.offset.y -= dt * 0.0035;
        moved = true;
      }
      if (hl && now > hlUntil) {
        hl = null;
        draw();
      }
      return moved;
    };
    return { draw, drawVignette, highlight, step };
  }

  return {
    setRow(i: number, row: Row) {
      const list = built.code.cells[i];
      if (list) setCells(list, row.text, row.cls);
    },
    highlight(method: string) {
      codeWall.highlight(method);
    },
    applyTheme,
    setActive,
    dispose() {
      setActive(false);
      ro.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick);
      scene.traverse((o) => {
        const mesh = o as Mesh;
        if (mesh.isMesh) mesh.geometry?.dispose();
      });
      Object.values(built).forEach((pn) => {
        pn.G.top.forEach((g) => g.dispose());
        pn.G.bot.forEach((g) => g.dispose());
      });
      renderer.dispose();
    },
  };
}

