# Changelog

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
