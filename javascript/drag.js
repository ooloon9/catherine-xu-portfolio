const PROJECTS = [
  { image: "../images/drag/graphic-design-experiment.png", alt: "Portfolio project 1" },
  { image: "../images/drag/graphic-design-experiment.png", alt: "Portfolio project 2" },
  { image: "../images/drag/graphic-design-experiment.png", alt: "Portfolio project 3" },
  { image: "../images/drag/graphic-design-experiment.png", alt: "Portfolio project 4" },
  { image: "../images/drag/graphic-design-experiment.png", alt: "Portfolio project 5" },
  { image: "../images/drag/graphic-design-experiment.png", alt: "Portfolio project 6" },
  { image: "../images/drag/graphic-design-experiment.png", alt: "Portfolio project 7" },
  { image: "../images/drag/graphic-design-experiment.png", alt: "Portfolio project 8" },
];

// ─── Layout constants ─────────────────────────────────────────────────────────

const CARD_W = 160;
const CARD_H = 220;
const GAP_X  = 220;
const GAP_Y  = 140;

const STEP_X = CARD_W + GAP_X;  // 380
const STEP_Y = CARD_H + GAP_Y;  // 360

const COLS = 4;
const ROWS = 3;

const TILE_W = COLS * STEP_X;   // 1520
const TILE_H = ROWS * STEP_Y;   // 1080

// The cell within each tile that stays empty (so text has breathing room)
const EMPTY_COL = 1;
const EMPTY_ROW = 1;

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const wrap      = document.getElementById("canvas-wrap");
const container = document.getElementById("grid-container");
const textEl    = document.getElementById("center-text");
const hint      = document.getElementById("hint");

// ─── State ────────────────────────────────────────────────────────────────────

// ox/oy: the raw grid offset fed into mod() for tiling.
// Initialized so the empty slot lines up with screen center.
let ox = 0;
let oy = 0;

// dx/dy: cumulative drag delta from the initial position (starts at 0).
// Used to move the text overlay — completely separate from ox/oy.
let dx = 0;
let dy = 0;

let isDragging = false;
let startX, startY, startOx, startOy, startDx, startDy;
let velX = 0, velY = 0;
let lastX, lastY, lastTime;
let rafId;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mod(n, m) {
  return ((n % m) + m) % m;
}

// ─── Grid build ───────────────────────────────────────────────────────────────

function createCard(project, globalCol, globalRow) {
  const card = document.createElement("div");
  card.className = "project-card";
  card.style.left = `${globalCol * STEP_X}px`;
  card.style.top  = `${globalRow * STEP_Y}px`;

  const img = document.createElement("img");
  img.className = "project-image";
  img.src = project.image;
  img.alt = project.alt;
  card.appendChild(img);
  return card;
}

function buildGrid() {
  container.innerHTML = "";
  container.style.width  = `${TILE_W * 3}px`;
  container.style.height = `${TILE_H * 3}px`;

  let idx = 0;
  for (let tileY = 0; tileY < 3; tileY++) {
    for (let tileX = 0; tileX < 3; tileX++) {
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          // Leave the empty slot blank in every tile
          if (col === EMPTY_COL && row === EMPTY_ROW) continue;

          const globalCol = col + tileX * COLS;
          const globalRow = row + tileY * ROWS;
          const project = PROJECTS[idx % PROJECTS.length];
          idx++;
          container.appendChild(createCard(project, globalCol, globalRow));
        }
      }
    }
  }
}

// ─── Render ───────────────────────────────────────────────────────────────────

function render() {
  const vw = wrap.offsetWidth;
  const vh = wrap.offsetHeight;

  // 1. Tile the image grid
  const tx = mod(ox, TILE_W);
  const ty = mod(oy, TILE_H);
  container.style.transform = `translate(${-TILE_W + tx}px, ${-TILE_H + ty}px)`;

  // 2. Text overlay: starts at screen center, moves by drag delta only.
  //    The CSS has margin-left: -CARD_W/2 and margin-top: -CARD_H/2
  //    so the element is centered on the translated point.
  textEl.style.transform = `translate(${vw / 2 + dx}px, ${vh / 2 + dy}px)`;
}

// ─── Initialize ───────────────────────────────────────────────────────────────

// Set ox/oy so the empty grid slot is centered in the viewport.
//
// Screen x of a card at globalCol in the rendered grid:
//   x = (-TILE_W + mod(ox, TILE_W)) + globalCol * STEP_X
//
// The empty slot is at globalCol = COLS + EMPTY_COL (tile index 1, col EMPTY_COL).
// We want x + CARD_W/2 = vw/2:
//   mod(ox, TILE_W) = vw/2 - CARD_W/2 - (COLS + EMPTY_COL)*STEP_X + TILE_W
//
// Wrap into [0, TILE_W) so mod() is a no-op at init time.

function initializePosition() {
  const vw = wrap.offsetWidth;
  const vh = wrap.offsetHeight;

  ox = mod(vw / 2 - CARD_W / 2 - (COLS + EMPTY_COL) * STEP_X + TILE_W, TILE_W);
  oy = mod(vh / 2 - CARD_H / 2 - (ROWS + EMPTY_ROW) * STEP_Y + TILE_H, TILE_H);

  // Reset drag delta — text always starts centered
  dx = 0;
  dy = 0;

  render();
}

// ─── Input ────────────────────────────────────────────────────────────────────

function getPointer(e) {
  return e.touches ? e.touches[0] : e;
}

function pointerDown(e) {
  isDragging = true;
  wrap.classList.add("is-dragging");
  hint.style.opacity = "0";

  const pt = getPointer(e);
  startX  = pt.clientX;
  startY  = pt.clientY;
  startOx = ox;
  startOy = oy;
  startDx = dx;
  startDy = dy;
  lastX   = pt.clientX;
  lastY   = pt.clientY;
  lastTime = Date.now();
  velX = velY = 0;

  cancelAnimationFrame(rafId);
}

function pointerMove(e) {
  if (!isDragging) return;
  e.preventDefault();

  const pt  = getPointer(e);
  const now = Date.now();
  const dt  = now - lastTime || 1;

  velX  = (pt.clientX - lastX) / dt;
  velY  = (pt.clientY - lastY) / dt;
  lastX = pt.clientX;
  lastY = pt.clientY;
  lastTime = now;

  const moveX = pt.clientX - startX;
  const moveY = pt.clientY - startY;

  ox = startOx + moveX;
  oy = startOy + moveY;
  dx = startDx + moveX;
  dy = startDy + moveY;

  render();
}

function pointerUp() {
  if (!isDragging) return;
  isDragging = false;
  wrap.classList.remove("is-dragging");

  let vx = velX * 14;
  let vy = velY * 14;

  function inertia() {
    if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) return;
    ox += vx;
    oy += vy;
    dx += vx;
    dy += vy;
    vx *= 0.93;
    vy *= 0.93;
    render();
    rafId = requestAnimationFrame(inertia);
  }

  inertia();
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function init() {
  buildGrid();
  initializePosition();

  wrap.addEventListener("mousedown",   pointerDown);
  window.addEventListener("mousemove", pointerMove);
  window.addEventListener("mouseup",   pointerUp);
  wrap.addEventListener("touchstart",  pointerDown, { passive: true });
  wrap.addEventListener("touchmove",   pointerMove, { passive: false });
  wrap.addEventListener("touchend",    pointerUp);
  window.addEventListener("resize",    initializePosition);
}

init();