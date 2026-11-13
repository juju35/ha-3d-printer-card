// The README screenshots (PNG) and animations (GIF) rendered by scripts/screenshots.mjs.
// Every capture has a twin in the other theme ("-dark" for a light capture, "-light" for a dark one) that shows
// exactly the same state: only the theme differs (checked by test/screenshots.test.mjs).
import { failed, finished, paused, preparing, printing } from "./mock-states.mjs";

const twins = (list) =>
  list.flatMap((s) => [s, { ...s, file: `${s.file}-${s.theme === "light" ? "dark" : "light"}`, theme: s.theme === "light" ? "dark" : "light" }]);

const FULL = { type: "printer-3d-card", width: 460 };
const MINI = { type: "printer-3d-mini-card", width: 380 };

export const shots = twins([
  { file: "card", theme: "light", ...FULL, config: { device: "X1 Carbon", collapsed: [] } },
  { file: "card-octoprint", theme: "dark", ...FULL, config: { device: "Workshop printer" } },
  { file: "card-moonraker", theme: "light", ...FULL, config: { device: "Voron 2.4", collapsed: [] } },
  { file: "card-prusalink", theme: "dark", ...FULL, config: { device: "Prusa MK4", collapsed: [] } },
  { file: "card-finished", theme: "light", ...FULL, config: { device: "X1 Carbon", show_camera: false, show_ams: false }, overrides: finished },
  { file: "card-confirm", theme: "dark", ...FULL, config: { device: "X1 Carbon", show_camera: false }, clicks: ['[data-cmd="stop"]'] },
  { file: "mini-card", theme: "light", ...MINI, config: { device: "X1 Carbon" } },
  { file: "mini-card-octoprint", theme: "dark", ...MINI, config: { device: "Workshop printer" } },
  { file: "mini-card-moonraker", theme: "light", ...MINI, config: { device: "Voron 2.4" } },
  { file: "mini-card-prusalink", theme: "dark", ...MINI, config: { device: "Prusa MK4" } },
  { file: "mini-card-zoom", theme: "light", ...MINI, width: 460, config: { device: "X1 Carbon", show_camera: false }, clicks: [".zoom"] },
  // Narrow cards: the full card at 6 of 12 columns of a phone's Sections view (~170 px is the mini card's; the full
  // card is shown at 238 px) with the ring, tiles and filament slots laid out for that width.
  { file: "card-narrow", theme: "light", ...FULL, width: 238, config: { device: "X1 Carbon", show_camera: false, collapsed: [] } },
  { file: "mini-card-narrow", theme: "light", ...MINI, width: 170, config: { device: "X1 Carbon" } },
]);

// One looping GIF per animated state (each plays different keyframes):
//   printing  — the toolhead sweeps across the bed, the spool turns, the top layer glows, a highlight runs on the ring
//   preparing — heat waves rise from the bed, the nozzle glows and the ring spins (heating, levelling)
//   paused    — the toolhead parks at the side, the progress arc and the pause badge breathe
//   finished  — the check mark draws itself and the part sparkles
//   failed    — the alert badge blinks (print error, HMS message)
const GIF = { ...FULL, config: { device: "X1 Carbon", show_camera: false, show_ams: false, show_job: false } };
export const gifs = twins([
  { file: "printing", theme: "light", ...GIF, overrides: printing },
  { file: "preparing", theme: "dark", ...GIF, overrides: preparing },
  { file: "paused", theme: "light", ...GIF, overrides: paused },
  { file: "finished", theme: "dark", ...GIF, overrides: finished },
  { file: "failed", theme: "light", ...GIF, overrides: failed },
]);
