// Bundles src/3d-printer-card.js into the single file dist/3d-printer-card.js, inlining the integration logos
// (Bambu Lab, OctoPrint, Moonraker, PrusaLink) so the card needs no extra resource.
// Usage: node scripts/build.mjs  (dist/ is not committed: CI and the release workflow build it)
import { mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { splitDist } from "./i18n-split.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const pkg = JSON.parse(readFileSync(`${root}package.json`, "utf8"));
const dataUri = (file) => `data:image/png;base64,${readFileSync(`${root}images/${file}`).toString("base64")}`;

const out = readFileSync(`${root}src/3d-printer-card.js`, "utf8")
  .replace("__VERSION__", pkg.version)
  .replace("__IMG_LOGO_BAMBU__", dataUri("bambu_lab.png"))
  .replace("__IMG_LOGO_OCTOPRINT__", dataUri("octoprint.png"))
  .replace("__IMG_LOGO_MOONRAKER__", dataUri("moonraker.png"))
  .replace("__IMG_LOGO_PRUSALINK__", dataUri("prusalink.png"));

mkdirSync(`${root}dist`, { recursive: true });
writeFileSync(`${root}dist/3d-printer-card.js`, out);
console.log(`Built dist/3d-printer-card.js (${(out.length / 1024).toFixed(1)} KB)`);

// Translations: English stays in the bundle, each other language goes to dist/3d-printer-card.i18n.<lang>.js,
// fetched when a card needs it (scripts/i18n-split.mjs).
if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) splitDist(`${root}dist`, "3d-printer-card.js", { version: pkg.version });
