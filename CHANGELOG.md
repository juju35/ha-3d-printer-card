# Changelog

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
