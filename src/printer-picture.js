// ---------------------------------------------------------------------------
// Printer picture: a drawn enclosed printer, animated by its phase
// ---------------------------------------------------------------------------
import { JOB_PHASES } from "./integrations.js";
import { clamp, esc } from "./helpers.js";

// Status badge of the picture (bottom right), per phase.
export const BADGES = {
  paused: `<svg viewBox="0 0 24 24"><path d="M8 6.5h2.6v11H8zM13.4 6.5H16v11h-2.6z" fill="#fff"/></svg>`,
  attention: `<svg viewBox="0 0 24 24"><path d="M8 6.5h2.6v11H8zM13.4 6.5H16v11h-2.6z" fill="#fff"/></svg>`,
  finished: `<svg viewBox="0 0 24 24"><path class="check" d="M6.5 12.5l3.6 3.6 7.4-8" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  failed: `<svg viewBox="0 0 24 24"><path d="M10.6 5.5h2.8v8.5h-2.8zM10.6 15.8h2.8v2.7h-2.8z" fill="#fff"/></svg>`,
  error: `<svg viewBox="0 0 24 24"><path d="M10.6 5.5h2.8v8.5h-2.8zM10.6 15.8h2.8v2.7h-2.8z" fill="#fff"/></svg>`,
};

// The printer in a 80 × 80 box: frame, glass door, gantry with its toolhead, a spool, the bed and the part being
// printed, as high as the progress. Printing: the toolhead sweeps across, the spool turns and the top layer glows;
// preparing: heat rises from the bed and the nozzle glows; paused: the toolhead is parked; finished: the part is
// complete and sparkles.
export const printerSvg = (phase, pct, filament) => {
  const job = JOB_PHASES.has(phase);
  const h = phase === "finished" ? 24 : job ? Math.round(2 + (22 * clamp(pct ?? 0, 0, 100)) / 100) : 0;
  const top = 56 - h;
  const lines = [];
  for (let y = 56 - 4; y > top + 1; y -= 4) lines.push(`<path d="M30 ${y}h20"/>`);
  const part = h
    ? `<g class="part"><rect x="30" y="${top}" width="20" height="${h}" rx="1.5" style="fill:${esc(filament)}"/><g class="lines">${lines.join("")}</g>${
        phase === "printing" ? `<rect class="layer" x="30" y="${top}" width="20" height="1.4" rx=".7"/>` : ""
      }</g>`
    : "";
  return `<svg class="printer" viewBox="0 0 80 80" aria-hidden="true">
    <rect class="frame" x="8" y="6" width="64" height="68" rx="7"/>
    <rect class="glass" x="13" y="12" width="54" height="52" rx="3.5"/>
    <g class="spool"><circle cx="22" cy="40" r="6"/><circle class="hub" cx="22" cy="40" r="2"/><path d="M22 34.5v3M22 42.5v3M16.5 40h3M24.5 40h3"/></g>
    <g class="heat"><path d="M31 54c2-2.5-2-5 0-7.5s-2-5 0-7.5"/><path d="M40 54c2-2.5-2-5 0-7.5s-2-5 0-7.5"/><path d="M49 54c2-2.5-2-5 0-7.5s-2-5 0-7.5"/></g>
    <rect class="bed" x="16" y="56" width="48" height="3" rx="1.2"/>
    ${part}
    <rect class="rail" x="13" y="18" width="54" height="2.6" rx="1"/>
    <g class="head"><rect class="carriage" x="34" y="16" width="12" height="10" rx="2"/><path class="nozzle" d="M38 26h4l-2 4z"/><circle class="tip" cx="40" cy="30.6" r="1.3"/></g>
    <g class="sparkles"><path d="M20 22l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z"/><path d="M58 30l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8z"/><path d="M56 46l.7 1.5 1.5.7-1.5.7-.7 1.5-.7-1.5-1.5-.7 1.5-.7z"/></g>
    <rect class="foot" x="14" y="73" width="52" height="2" rx="1"/>
  </svg>`;
};

// Progress ring around the picture: the track, the progress arc, and the moving highlight of the phase.
export const ringSvg = (pct) => {
  const v = clamp(pct ?? 0, 0, 100);
  return `<svg class="ring-svg" viewBox="0 0 100 100" aria-hidden="true"><circle class="track" cx="50" cy="50" r="45"/>${
    v > 0 ? `<circle class="val" cx="50" cy="50" r="45" pathLength="100" stroke-dasharray="${v} 100"/>` : ""
  }<circle class="fx" cx="50" cy="50" r="45" pathLength="100"/></svg>`;
};
