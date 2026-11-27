# Changelog

## 1.3.1 - 2026-11-27

### Fixes
- Idle states use the theme's secondary text colour (`--secondary-text-color`), like every ha-* card.

## 1.3.0 - 2026-11-26

### Features
- The print's stage on the full card (and the mini card's detail view), in place of the ring, the thumbnail and the camera section: the print's preview filling up layer by layer — what is left faded, the printed part in color under a level line in the state's color — or the camera, switched by a round button in its corner and kept per printer in the browser. Under it, the big percentage, the remaining time and estimated end, and a progress bar in the state's color (a highlight runs along it while printing, stripes slide while preparing, it breathes when paused). With neither picture, the drawn printer takes the stage
- Live camera: the camera streams through Home Assistant's own player (WebRTC, HLS or MJPEG), kept running across the card's updates and stopped as soon as it leaves the screen; a « Live » tag, and a button to open it full size. New options `media_view` (`print` or `camera`, the picture shown first) and `camera_view` (`live` or `auto` for the snapshot alone, refreshed every 10 s like the snapshot shown until the player is loaded), in the visual editor too
- AMS and external spool: each spool drawn in its filament's color, as full as what is left, with its remaining percentage (amber, then red when running low); the spool in use turns while printing; AMS temperature with its icon
- Preparing before the first percent: the state as the big word over a striped bar that waits
- The `camera` section is gone (the camera is on the stage): `collapsed` keeps `ams` and `job`, a former `camera` value is ignored (the visual editor drops it too)

## 1.2.0 - 2026-11-24

### Features
- Power button: the new `power_entity` option (a switch such as a Zigbee smart plug, a light or an input boolean, also in the visual editor and as the `power` key of `entities`) adds a power button next to the light button, on the full and the mini card. Turning the printer on is immediate; turning it off asks for a confirmation at the top of the card, which warns that the print under way will be lost while a job runs. The button stays while the printer is off or offline (#25)

## 1.1.5 - 2026-11-24

### Maintenance
- The card source is split into ES modules: `src/` (entry `src/index.js`), cut at its sections, with the translations in one file per language (`i18n/<lang>.js`). `scripts/bundle.mjs` concatenates them back, in their original order, into the same single file and per-language files as before; the tests evaluate that bundle.

## 1.1.4 - 2026-11-22

### Performance
- Card picker: the previews are back (`preview: true`), and light. Each card's preview is drawn only once it scrolls into view of Home Assistant's card picker, which otherwise builds the preview of every card at once: until then it holds Home Assistant's state (no render, no history request, no animation). On a dashboard or in the card editor the card is drawn as before.

## 1.1.3 - 2026-11-22

### Performance
- Card picker: the cards no longer ask Home Assistant for a live preview (`preview: false` in `window.customCards`). The picker drew every card at once (history requests, animations), which made the list slow to open; it now shows each card's description instead.

## 1.1.2 - 2026-11-20

### Fixes
- The frosted expand / collapse button of the illustrated header keeps its blur on Safari before 18 (WebKit prefix).
- A status pill measurement still pending when the card leaves the page is cancelled.

### Maintenance
- Tests: the coverage of the card source is now measured (`node --test --experimental-test-coverage`).

## 1.1.1 - 2026-11-18

### Fixes
- Illustrated header: `auto` now follows the Home Assistant theme alone — a light theme keeps the day picture after sunset, a dark theme still shows the night one.

## 1.1.0 - 2026-11-17

### Features
- **Illustrated header**: the full and the mini card open on a 90 px banner. The card's own drawn printer stands on a workshop bench at the right (pegboard, filament spools, window), with its animations of the state: the toolhead sweeps and the spool turns while printing, heat rises while preparing, the toolhead parks when paused, the part sparkles when finished. The name and the status (with the progress while a job runs) sit on the wall at the left, next to the round printer icon and its integration logo badge; a 10 px bench strip runs edge to edge at the bottom.
- **Status color on the icon**: the round icon always tells the state, day and night: blue printing or preparing, amber paused, green finished, red on an error or offline, grey idle.
- **Night picture**: after sunset (`sun.sun`) or with the dark theme; `illustration_theme: day | night` forces one. `illustration: false` brings back the classic header. Both options are in the visual editors, translated in every language. Animations stop with `prefers-reduced-motion`.
- **No repeated progress**: where the body's ring shows the big progress (full card, expanded mini card), the header's subtitle names the print being made (else the model) instead of repeating the percentage, and the progress lines no longer repeat the name; the compact mini card, which has no room for the name, keeps the progress in its subtitle.
- **Status pill**: the colored status pill (same color as the icon) is back on the name's line, right after the name, on the full and the mini card, with or without the illustration, as long as the name stays whole and the pill keeps its whole label beside it (measured by the card in every language, no fixed width threshold). Otherwise it takes its own line under the subtitle, which then keeps one line; it keeps only its dot when even that does not fit the banner, and below 200 px.
- **Mini card detail button**: a 24 px glass disc in the banner's top-right corner, the printer drawn clear of it (smaller and below the button on a card of 300 px or less).
- **Night picture with the dark theme even while the sun is up**: in `auto`, the banner shows the night picture when the sun is below the horizon or Home Assistant's theme is dark.

## 1.0.3 - 2026-11-14

### Fixes
- **Mini card visual editor**: its detail view is the full card, but its editor offered only the header, controls, light and detail button options. It now offers every option of the full card too: thumbnail, temperatures, AMS, job and camera sections, folded sections and camera entity.
- **README**: these options are marked as working on both cards, and `entities` is marked as YAML only (the visual editor keeps it).

## 1.0.2 - 2026-11-13

### Fixes
- **Clicks lost under an update**: Home Assistant updates the card several times a second. When an update rewrote the card between the press and the release, the element pressed was replaced and the click landed on the card itself, doing nothing (a section, the light or a print control that did not react). The card is no longer rewritten while a press is in progress; the pending update is drawn right after the click, or after the release when no click follows.
- **Focus ring after a mouse click**: the focus was put back on the clicked element after each update, which drew the focus ring. It is now kept across updates for the keyboard only.

## 1.0.1 - 2026-11-13

### Fixes
- Folding back on a tap elsewhere now works on iOS (Safari and the companion app): a tap on something that is not clickable sent no click to the page, so the unfolded sections, the confirmation popup and the detailed view of the mini card stayed open. The press and the release are caught instead; a press in the card released outside of it and a scroll do not fold anything.
- Leaving the card (another dashboard view, a conditional card hidden) brings it back in its default state: sections folded as configured, popup closed, mini card compact.

## 1.0.0 - 2026-11-13

### Features
- Two cards: a full **3D Printer Card** (`custom:printer-3d-card`) and a compact **3D Printer Mini Card** (`custom:printer-3d-mini-card`) with a detail button that switches it to the full card's content and back.
- Bambu Lab (ha-bambulab), OctoPrint, Moonraker / Klipper and PrusaLink printers, found automatically from the Home Assistant registries.
- Progress ring around a drawn printer animated by its state: the toolhead sweeps and the spool turns while printing, heat rises while preparing, the toolhead parks when paused, the part sparkles when finished, the alert badge blinks on an error.
- Remaining time and estimated end (each computed from the other when the integration gives only one), current and total layers, Bambu Lab stage and HMS errors.
- Nozzle (single or dual), bed and chamber temperatures with their targets.
- Bambu Lab AMS units and external spool: filament color, type, name, remaining amount, active slot, AMS humidity and temperature.
- Print job details: start time, weight, filament length, speed, material, file.
- Print thumbnail (cover image) and camera.
- Pause / resume / stop buttons with an in-card confirmation, and a light button.
- Collapsible sections, visual editor, light and dark themes, 22 languages loaded on demand.
