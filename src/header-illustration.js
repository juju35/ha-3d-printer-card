// ---------------------------------------------------------------------------
// Header illustration: the printer on a workshop bench, at the right of a 90 px banner
// ---------------------------------------------------------------------------
import { printerSvg } from "./printer-picture.js";

// Window of the workshop: blue sky and sun by day, night sky and moon at night.
export const workshopWindow = (x, y, w, h, n) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="${n ? "#1b2f52" : "#bfe0f7"}" stroke="${n ? "#4a5568" : "#fff"}" stroke-width="1.6"/>${
    n ? `<circle cx="${x + w * 0.7}" cy="${y + h * 0.3}" r="2.4" fill="#f3eed2"/>` : `<circle cx="${x + w * 0.7}" cy="${y + h * 0.35}" r="3" fill="#ffd65a"/>`
  }<line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="${n ? "#4a5568" : "#fff"}" stroke-width="1.2"/>`;

// The workshop behind the printer, in a 200 × 80 picture: pegboard with its tools, a shelf of filament spools and
// the window. No id: several cards on a page cannot clash.
export const workshopSvg = (n) => {
  const holes = Array.from({ length: 12 }, (_, i) => `<circle cx="${16 + (i % 6) * 11}" cy="${18 + Math.floor(i / 6) * 14}" r="1.2"/>`).join("");
  return `<rect width="200" height="80" fill="${n ? "#2a2a33" : "#f1ece4"}"/><rect x="10" y="10" width="70" height="40" fill="${n ? "#33333f" : "#e2d7c6"}"/><g fill="${
    n ? "#555" : "#9c8b74"
  }">${holes}</g><rect x="20" y="22" width="3" height="18" fill="#c0603a"/><rect x="40" y="20" width="12" height="4" fill="#5c6a7a"/><circle cx="110" cy="28" r="6" fill="#e8a33d"/><circle cx="126" cy="28" r="6" fill="#43a3d8"/><circle cx="142" cy="28" r="6" fill="#7ac143"/><rect x="100" y="34" width="52" height="2" fill="${
    n ? "#555" : "#9c8b74"
  }"/>${workshopWindow(164, 8, 28, 24, n)}`;
};

// The printer of the card (printerSvg, same drawing and animations) standing on the bench: its picture cropped to
// the drawing (foot on the bottom edge), 72 high, its right side at x 196 of the scene.
export const bannerPrinterSvg = (phase, pct, filament) =>
  printerSvg(phase, pct, filament).replace('<svg class="printer" viewBox="0 0 80 80"', '<svg class="printer" x="126.4" y="8" width="69.6" height="72" viewBox="5.4 3.4 69.2 71.6"');

// Night picture: forced by illustration_theme, else Home Assistant's dark mode alone (a light theme keeps the day
// picture after sunset).
export const isNight = (hass, config) => {
  const theme = config.illustration_theme;
  if (theme === "night") return true;
  if (theme === "day") return false;
  return !!hass?.themes?.darkMode;
};
