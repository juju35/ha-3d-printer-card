# Changelog

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
