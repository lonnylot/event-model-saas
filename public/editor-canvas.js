function ensurePanLayer(board) {
  if (!(board instanceof HTMLElement) || typeof board.querySelector !== "function") {
    return null;
  }
  let layer = board.querySelector(":scope > .board-pan");
  if (layer) return layer;
  const doc = board.ownerDocument;
  if (!doc) return null;
  layer = doc.createElement("div");
  layer.className = "board-pan";
  while (board.firstChild) layer.append(board.firstChild);
  board.append(layer);
  return layer;
}

export function bindCanvas(root, ctx) {
  const timeline = ctx.timeline;
  const board = ctx.board;
  let scale = 1;
  let panX = 0;
  let panY = 0;
  const applyTimelineTransform = () => {
    if (!(board instanceof HTMLElement)) return;
    const parts = [`scale(${scale})`];
    if (panX !== 0 || panY !== 0) {
      parts.push(`translate(${panX}px, ${panY}px)`);
    }
    board.style.transform = parts.join(" ");
    const lift = panY < 0 ? -panY : 0;
    board.style.marginTop = lift ? `${lift}px` : "";
    const layer = ensurePanLayer(board);
    if (layer instanceof HTMLElement) {
      layer.style.transform = lift ? `translate(0px, ${panY}px)` : "";
    }
  };
  Object.defineProperty(ctx, "scale", {
    get() {
      return scale;
    },
    set(v) {
      scale = v;
    },
    configurable: true,
  });
  ctx.applyTimelineTransform = applyTimelineTransform;
  ensurePanLayer(board);
  if (timeline instanceof HTMLElement) {
    timeline.style.minHeight = "48px";
    timeline.addEventListener(
      "wheel",
      (event) => {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          scale *= Math.exp(-event.deltaY * 0.01);
          applyTimelineTransform();
          return;
        }
        panX -= event.deltaX;
        panY -= event.deltaY;
        applyTimelineTransform();
      },
      { passive: false },
    );
  }
  root.querySelectorAll("button").forEach((button) => {
    if (button.textContent === "Zoom in") {
      button.addEventListener("click", () => {
        scale = 1.25;
        applyTimelineTransform();
      });
    }
    if (button.textContent === "Zoom out") {
      button.addEventListener("click", () => {
        scale = 0.8;
        applyTimelineTransform();
      });
    }
    if (button.textContent === "Reset zoom") {
      button.addEventListener("click", () => {
        scale = 1;
        applyTimelineTransform();
      });
    }
  });
}
