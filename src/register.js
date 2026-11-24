// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------
import { pickerDefine } from "./card-picker.js";
import { VERSION } from "./core.js";
import { PrinterCard, PrinterMiniCard } from "./styles.js";
import { PrinterCardEditor, PrinterMiniCardEditor } from "./visual-editors.js";

export const define = (name, cls) => {
  if (!customElements.get(name)) pickerDefine(name, cls);
};
define("printer-3d-card", PrinterCard);
define("printer-3d-mini-card", PrinterMiniCard);
define("printer-3d-card-editor", PrinterCardEditor);
define("printer-3d-mini-card-editor", PrinterMiniCardEditor);

window.customCards = window.customCards || [];
for (const card of [
  {
    type: "printer-3d-card",
    name: "3D Printer Card",
    description: "Monitor and control a Bambu Lab, OctoPrint, Moonraker (Klipper) or PrusaLink 3D printer: progress, remaining time, layers, temperatures, AMS filaments, camera and pause / resume / stop.",
  },
  {
    type: "printer-3d-mini-card",
    name: "3D Printer Mini Card",
    description: "Compact 3D printer progress: ring, remaining time, end time and layers, with a detail view.",
  },
]) {
  if (!window.customCards.some((c) => c.type === card.type)) window.customCards.push({ ...card, preview: true, documentationURL: "https://github.com/juju35/ha-3d-printer-card" });
}

console.info(`%c 3D-PRINTER-CARD %c v${VERSION} `, "color: white; background: #00ae42; font-weight: 700;", "color: #00ae42; background: white; font-weight: 700;");
