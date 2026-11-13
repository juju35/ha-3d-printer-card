# ha-3d-printer-card

[![Marketplace](https://img.shields.io/badge/Marketplace-Custom-41BDF5.svg)](https://www.home-assistant.io/integrations/marketplace/)
[![HACS Validation](https://github.com/juju35/ha-3d-printer-card/actions/workflows/hacs.yml/badge.svg)](https://github.com/juju35/ha-3d-printer-card/actions/workflows/hacs.yml)
[![Validate](https://github.com/juju35/ha-3d-printer-card/actions/workflows/validate.yml/badge.svg)](https://github.com/juju35/ha-3d-printer-card/actions/workflows/validate.yml)
[![Lint](https://github.com/juju35/ha-3d-printer-card/actions/workflows/lint.yml/badge.svg)](https://github.com/juju35/ha-3d-printer-card/actions/workflows/lint.yml)
[![Release](https://img.shields.io/github/v/release/juju35/ha-3d-printer-card)](https://github.com/juju35/ha-3d-printer-card/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/juju35/ha-3d-printer-card/blob/main/LICENSE)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/julienstep9)

<p align="center"><img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/icon.svg" alt="3D Printer Card" width="120"></p>

<p align="center">
  <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/bambu_lab.png" alt="Bambu Lab" width="64">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/octoprint.png" alt="OctoPrint" width="64">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/moonraker.png" alt="Moonraker" width="64">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/prusalink.png" alt="PrusaLink" width="64">
</p>

Lovelace cards for Home Assistant to follow and control **3D printers**: **[Bambu Lab](https://bambulab.com)**, **[OctoPrint](https://octoprint.org)**, **[Klipper](https://www.klipper3d.org) through [Moonraker](https://moonraker.readthedocs.io)** and **[Prusa](https://www.prusa3d.com) through PrusaLink**. State, progress ring, remaining time and estimated end, layers, nozzle / bed / chamber temperatures, print thumbnail and camera, Bambu Lab AMS filaments, and pause / resume / stop buttons with a confirmation, at a glance.

The cards work on top of the integrations you already use — [Bambu Lab](https://github.com/greghesp/ha-bambulab), [OctoPrint](https://www.home-assistant.io/integrations/octoprint/), [Moonraker](https://github.com/marcolivierarsenault/moonraker-home-assistant) and [PrusaLink](https://www.home-assistant.io/integrations/prusalink/). Entities are **discovered automatically** from the Home Assistant registries: you don't pick them one by one, and it works whatever your entity ids. The drawn printer in the ring is animated by what the printer is doing.

[![Open your Home Assistant instance and open a repository inside the Marketplace.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=juju35&repository=ha-3d-printer-card&category=plugin)

| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/bambu_lab.png" alt="" width="20"> Bambu Lab | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/octoprint.png" alt="" width="20"> OctoPrint |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card.png" alt="bambu lab card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-octoprint-light.png" alt="octoprint card" width="400"> |
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card.png" alt="bambu lab mini card" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card-octoprint-light.png" alt="octoprint mini card" width="380"> |

| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/moonraker.png" alt="" width="20"> Moonraker / Klipper | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/prusalink.png" alt="" width="20"> PrusaLink |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-moonraker.png" alt="moonraker card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-prusalink-light.png" alt="prusalink card" width="400"> |
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card-moonraker.png" alt="moonraker mini card" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card-prusalink-light.png" alt="prusalink mini card" width="380"> |

## Features

- Two cards: a full **3D Printer Card** (`custom:printer-3d-card`) and a compact **3D Printer Mini Card** (`custom:printer-3d-mini-card`)
- Bambu Lab, OctoPrint, Moonraker (Klipper) and PrusaLink printers, several printers supported, the Bambu Lab AMS units merged with their printer
- Progress ring around a drawn printer, animated by its state (see [Animations](#animations)): the toolhead sweeps across and the spool turns while printing, heat rises while preparing, the toolhead parks when paused, the part sparkles when finished, the alert badge blinks on an error
- Header icon of a 3D printer with the integration's logo as a badge (opens its site), tinted with the printer state: blue printing or preparing, orange paused, green finished, red on an error or offline, grey idle; buttons in the integration's color
- Remaining time and estimated end (computed from each other when the integration gives only one), current / total layers, the Bambu Lab stage (heating, levelling, filament change…) and its HMS error messages
- Nozzle (or left and right nozzles on a dual-nozzle Bambu Lab), bed and chamber temperatures, with their target while heating
- Bambu Lab AMS and external spool: color swatch, filament type and name, remaining amount, active slot, AMS humidity and temperature
- Print job details: start time, weight, filament length, speed, material and file
- Print thumbnail (Bambu Lab cover image, PrusaLink and Moonraker previews) and camera
- Pause / resume / stop buttons, each with a confirmation at the top of the card, and a light button (chamber light, case light…)
- Collapsible sections (print job folded by default), folded back by a click anywhere else
- Sections view: the full card takes 12 columns by default and at least 6, the mini card 6; narrow widths get their own layout (see [Screenshots](#screenshots))
- Detail button on the mini card (top right): it switches the mini card to the full card's content and back; a click anywhere outside the card brings the compact view back
- Click any value to open its Home Assistant history (more-info dialog)
- Visual editor in the dashboard UI for both cards (no YAML needed)
- Light and dark mode, English, French, German, Spanish, Serbian (Cyrillic and Latin), Italian, Dutch, European Portuguese, Polish, Romanian, Danish, Swedish, Bulgarian, Russian, Ukrainian, Hungarian, Slovak, Czech, Slovenian, Latvian and Greek, each language loaded only when needed
- Single file, no external dependency, the logos are embedded

## Supported integrations

| Integration | Printers | What the cards show |
|---|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/bambu_lab.png" alt="" width="16"> [Bambu Lab](https://github.com/greghesp/ha-bambulab) (custom, `bambu_lab`) | Bambu Lab X1, P1, A1, H2D… | Everything: state and stage, progress, remaining time and end, layers, nozzle(s) / bed / chamber, **AMS and external spool**, HMS errors, cover image, camera, chamber light, pause / resume / stop, weight, length, speed profile |
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/octoprint.png" alt="" width="16"> [OctoPrint](https://www.home-assistant.io/integrations/octoprint/) (core) | Any printer driven by OctoPrint | State, progress, estimated finish and start time, tool and bed (and chamber) temperatures, file, printing error, camera, pause / resume / stop |
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/moonraker.png" alt="" width="16"> [Moonraker](https://github.com/marcolivierarsenault/moonraker-home-assistant) (custom, `moonraker`) | Klipper printers (Voron, Creality K1 with Moonraker, RatRig…) | Print state (or Klipper state), progress, time left and ETA, layers, extruder / bed / chamber temperatures and targets, file, filament used, speed, thumbnail, cameras, lights, pause / resume / cancel |
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/prusalink.png" alt="" width="16"> [PrusaLink](https://www.home-assistant.io/integrations/prusalink/) (core) | Prusa MK4, MK3.9, XL, MINI, CORE One… | State, progress, start and finish time, nozzle and bed temperatures and targets, file, material, speed, job preview, pause / resume / cancel |

OctoPrint and Moonraker give most of their entities no translation key: the card recognizes them by their names, which these integrations write in English (`Job Percentage`, `Print Time Left`…). If you renamed one, set it by hand with [`entities`](#options-reference). Details in [How it works](#how-it-works).

## Prerequisites

Home Assistant 2024.8 or later, with at least one of the [supported integrations](#supported-integrations) configured.

## Installation

### Via the Marketplace (recommended)

Click the button below to add the repository directly:

[![Add to the Marketplace](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=juju35&repository=ha-3d-printer-card&category=plugin)

Then click **Install**, and reload your browser when the Marketplace asks you to.

Or manually:

1. Open **Settings → Marketplace → Add from link** (top right; this needs a GitHub account connected)
2. Add `https://github.com/juju35/ha-3d-printer-card` — Type: **Dashboard**
3. Open **3D Printer Card** and click **Install**
4. Check that **Settings → Dashboards → ⋮ → Resources** lists `/local/community/ha-3d-printer-card/3d-printer-card.js`, then clear your browser cache and refresh

### Manual

1. Download `3d-printer-card.js` and the `3d-printer-card.i18n.*.js` translation files from the [latest release](https://github.com/juju35/ha-3d-printer-card/releases/latest)
2. Copy them all to `/config/www/` (without the translation files, the cards show in English)
3. Go to **Settings → Dashboards → ⋮ → Resources** → Add resource:
   - URL: `/local/3d-printer-card.js`
   - Type: **JavaScript Module**
4. Clear your browser cache and refresh

## Configuration

### Card types

| Card | Type |
|---|---|
| 3D Printer Card | `custom:printer-3d-card` |
| 3D Printer Mini Card | `custom:printer-3d-mini-card` |

> [!NOTE]
> A custom element name must start with a letter, so the types cannot be `3d-printer-card`: they are `printer-3d-card` and `printer-3d-mini-card` (the file keeps the repository's name, `3d-printer-card.js`).

### Visual editor

Edit a dashboard, click **Add card** and search for **3D Printer Card** or **3D Printer Mini Card**. The first printer is preselected; pick another one in the list if you have several, set an optional title, the sections to display, a camera or light entity of your own and the language. The preview updates live, and options left at their default are kept out of the generated YAML.

### Minimal

```yaml
type: custom:printer-3d-card
```

```yaml
type: custom:printer-3d-mini-card
```

### Full options

```yaml
type: custom:printer-3d-card
device: X1 Carbon
title: Workshop X1
show_title: true
show_subtitle: true
show_controls: true
show_light: true
show_thumbnail: true
show_temperatures: true
show_ams: true
show_job: true
show_camera: true
collapsed:
  - job
camera_entity: camera.x1_carbon_camera
light_entity: light.x1_carbon_chamber_light
entities:
  chamber: sensor.enclosure_temperature
language: fr
```

```yaml
type: custom:printer-3d-mini-card
device: Voron 2.4
title: Voron
show_controls: true
show_light: false
zoom: true
language: fr
```

### Options reference

| Option | Card | Default | Description |
|---|---|---|---|
| `device` | both | First printer | Printer to display: its name (as shown in Home Assistant) or its device id (set by the visual editor) |
| `title` | both | Device name | Card title |
| `show_title` | both | `true` | Show the title in the header (e.g. `false` under a section heading of your own) |
| `show_subtitle` | both | `true` | Show the subtitle under the title (file being printed, else the printer model) |
| `show_controls` | both | `true` | Pause / resume / stop buttons while a print is under way, each asking for a confirmation |
| `show_light` | both | `true` | Light button (the printer's light, or `light_entity`) |
| `zoom` | mini | `true` | Detail button at the top right of the mini card: it shows the full card's content (with the same options, so `show_ams`, `collapsed`, `camera_entity`… can be set on the mini card too, in its visual editor as well) and switches back to the compact view; a click outside the card also brings the compact view back. `false` removes the button |
| `show_thumbnail` | both | `true` | Thumbnail of the print next to the ring (cover image or job preview; the camera when `show_camera` is `false`) |
| `show_temperatures` | both | `true` | Nozzle, bed and chamber temperatures |
| `show_ams` | both | `true` | Filaments of the Bambu Lab AMS units and external spool |
| `show_job` | both | `true` | Print job details: start time, weight, filament length, speed, material, file |
| `show_camera` | both | `true` | Camera picture (click it for the live view) |
| `collapsed` | both | `[job]` | Sections folded by default, among `ams`, `job` and `camera` (`[]` to unfold everything). Click a section title (or Tab to it and press Enter or Space) to fold or unfold it; a click anywhere else folds them back |
| `camera_entity` | both | — | Camera or image entity to show instead of the integration's camera |
| `light_entity` | both | — | Light or switch entity for the light button |
| `entities` | both | — | Entities set by hand, by key, on top of the ones found: `status`, `progress`, `remaining`, `end_time`, `start_time`, `layer`, `total_layers`, `nozzle`, `nozzle_target`, `bed`, `bed_target`, `chamber`, `chamber_target`, `file`, `cover`, `camera`, `light`, `pause`, `resume`, `continue`, `stop`, `weight`, `length`, `speed`, `material`. YAML only (the visual editor keeps it) |
| `language` | both | Auto | Force language: `fr`, `en`, `de`, `es`, `sr`, `sr-Latn`, `it`, `nl`, `pt`, `pl`, `ro`, `da`, `sv`, `bg`, `ru`, `uk`, `hu`, `sk`, `cs`, `sl`, `lv` or `el` (auto-detects from HA settings) |

## Screenshots

All captures are rendered from mock data by `npm run screenshots`, in English, each in the light and the dark theme.

### Animations

The drawn printer in the progress ring animates to match what the printer is doing and settles back to a still picture once it is idle. Each state plays its own animation, and every one of them honours `prefers-reduced-motion`.

While printing, the toolhead sweeps across the bed with a glowing nozzle tip, the spool turns, the top layer of the part glows and a highlight runs around the ring; the part grows with the progress:

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/printing.gif" alt="printing animation" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/printing-dark.gif" alt="printing animation dark" width="400"> |

While preparing (heating, levelling, loading filament), heat rises from the bed, the nozzle glows and the ring spins; Pause and Stop stay greyed out until the printer accepts them:

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/preparing-light.gif" alt="preparing animation" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/preparing.gif" alt="preparing animation dark" width="400"> |

Paused, the toolhead waits parked at the side while the progress arc and the pause badge breathe:

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/paused.gif" alt="paused animation" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/paused-dark.gif" alt="paused animation dark" width="400"> |

Finished, the check mark draws itself in a green badge and the finished part sparkles:

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/finished-light.gif" alt="finished animation" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/finished.gif" alt="finished animation dark" width="400"> |

On a failed print or an error, the red alert badge blinks and the header icon turns red, with the printer's message (Bambu Lab HMS) under the title:

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/failed.gif" alt="failed animation" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/failed-dark.gif" alt="failed animation dark" width="400"> |

### <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/bambu_lab.png" alt="" width="24"> Bambu Lab

X1 Carbon with its AMS, printing: progress ring, remaining time and end, layers, temperatures, the four AMS slots (the active one outlined, the empty one dashed) and the external spool, print job details and camera:

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card.png" alt="bambu lab card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-dark.png" alt="bambu lab card dark" width="400"> |

Mini card, and its detail view (detail button at the top right):

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card.png" alt="bambu lab mini card" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card-dark.png" alt="bambu lab mini card dark" width="380"> |

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card-zoom.png" alt="mini card detail view" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card-zoom-dark.png" alt="mini card detail view dark" width="400"> |

Finished print, and the confirmation asked before stopping a print (also before pausing and resuming), at the top of the card:

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-finished.png" alt="finished card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-finished-dark.png" alt="finished card dark" width="400"> |

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-confirm-light.png" alt="stop confirmation" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-confirm.png" alt="stop confirmation dark" width="400"> |

### <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/octoprint.png" alt="" width="24"> OctoPrint

A printer driven by OctoPrint: the remaining time comes from the estimated finish time, and the webcam shows in the camera section:

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-octoprint-light.png" alt="octoprint card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-octoprint.png" alt="octoprint card dark" width="400"> |

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card-octoprint-light.png" alt="octoprint mini card" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card-octoprint.png" alt="octoprint mini card dark" width="380"> |

### <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/moonraker.png" alt="" width="24"> Moonraker / Klipper

A Klipper printer through Moonraker: time left and ETA, layers, extruder, bed and chamber temperatures with their targets, the file's thumbnail and the case light:

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-moonraker.png" alt="moonraker card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-moonraker-dark.png" alt="moonraker card dark" width="400"> |

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card-moonraker.png" alt="moonraker mini card" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card-moonraker-dark.png" alt="moonraker mini card dark" width="380"> |

### <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/images/prusalink.png" alt="" width="24"> PrusaLink

A paused Prusa MK4: Resume and Stop, the job preview, material and speed:

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-prusalink-light.png" alt="prusalink card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-prusalink.png" alt="prusalink card dark" width="400"> |

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card-prusalink-light.png" alt="prusalink mini card" width="380"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card-prusalink.png" alt="prusalink mini card dark" width="380"> |

### Narrow cards

The full card in a narrow column (238 px) and the mini card at 6 columns of a phone's Sections view (170 px): the ring shrinks, the thumbnail gives way, the AMS slots go two by two and the status chip keeps its colored dot:

| Full card | Mini card |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-narrow.png" alt="narrow card" width="240"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card-narrow.png" alt="narrow mini card" width="170"> |
| <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/card-narrow-dark.png" alt="narrow card dark" width="240"> | <img src="https://raw.githubusercontent.com/juju35/ha-3d-printer-card/main/screenshots/mini-card-narrow-dark.png" alt="narrow mini card dark" width="170"> |

## How it works

### Entity discovery

The card reads the entity and device registries (`hass.entities`, `hass.devices`): every entity of a supported integration (its `platform`) is attached to its device, and recognized by its `translation_key` (Bambu Lab, PrusaLink, the OctoPrint state and file) or, for the integrations that have none, by its name (OctoPrint, Moonraker). A device with a state or progress entity is a printer; a Bambu Lab AMS or external spool (each a device of its own, linked to its printer) brings its trays, humidity or spool to its printer. On Moonraker, a Klipper `shutdown` or `error` wins over the print state. Entity ids and the Home Assistant language do not matter.

### States

Each integration's states are mapped to the card's phases, which set the chip, the icon color, the buttons and the animation:

| Phase | Bambu Lab | OctoPrint | Moonraker | PrusaLink |
|---|---|---|---|---|
| Printing | `running` | `printing`, `printing_sd`, `finishing`, `resuming` | `printing` | `printing` |
| Preparing | `prepare`, `slicing`, `init` | `starting`, `connecting`, `transferring_file` | (Klipper `startup`) | `busy` |
| Paused | `pause` | `pausing`, `paused` | `paused` | `paused`; `attention` (needs attention) |
| Finished | `finish` | — | `complete` | `finished` |
| Failed / error | `failed` | `error`, `offline_after_error` | `error`, Klipper `error` | `error` |
| Cancelled / stopping | — | `cancelling` | `cancelled` | `stopped` |
| Idle | `idle` | `operational` | `standby` (Klipper `ready`) | `idle`, `ready` |
| Offline | `offline`, unavailable | `offline`, unavailable | Klipper `shutdown` (over the print state), unavailable | unavailable |

### Controls

Pause, Resume and Stop press the integration's own button entities (`button.press`), after a confirmation at the top of the card; Escape or Cancel closes it. They show only while a print is under way: Pause and Stop while printing or preparing, Resume and Stop while paused (on a PrusaLink printer that needs attention, Resume presses its **Continue** button). Bambu Lab and PrusaLink make a button unavailable when the printer cannot take it — no Pause or Stop while a Bambu Lab printer heats and levels, for instance: the card then greys it out. The light button toggles the light (or switch) entity: the light the integration names (Bambu Lab chamber light), else the printer's first light, or `light_entity`.

## Development

```bash
npm install
npm run build        # bundles src/3d-printer-card.js + the logos of images/ into dist/3d-printer-card.js and its translation files
npm run check        # builds and checks the card (run in CI)
npm test             # unit tests (node --test)
npm run screenshots  # renders the cards (and one GIF per animated state, needs ffmpeg) with mock data into screenshots/
```

`dist/` is not committed: `npm run build` creates it locally, CI builds it on every push, and the release workflow attaches the built files to the release, which is where the Marketplace installs them from. The **Screenshots** workflow renders the captures on every pull request and commits them to its branch when a pixel changed.

### Releasing

1. Bump `version` in `package.json` (and `package-lock.json`, `npm install`)
2. Add a `## <version>` section at the top of [CHANGELOG.md](https://github.com/juju35/ha-3d-printer-card/blob/main/CHANGELOG.md)
3. Push to `main`: the **Release** workflow builds the card, creates the tag and the GitHub release with the changelog section as notes, and attaches `3d-printer-card.js` and its translation files

## Translations

The cards auto-detect the language from your Home Assistant settings. English is in the card itself; every other language is a small file next to it, loaded only when a card needs it. Currently supported:

| Language | Code |
|---|---|
| English | `en` |
| Français | `fr` |
| Deutsch | `de` |
| Español | `es` |
| Српски | `sr` |
| Srpski (latinica) | `sr-Latn` |
| Italiano | `it` |
| Nederlands | `nl` |
| Português (European; also used for `pt-BR`) | `pt` |
| Polski | `pl` |
| Română | `ro` |
| Dansk | `da` |
| Svenska | `sv` |
| Български | `bg` |
| Русский | `ru` |
| Українська | `uk` |
| Magyar | `hu` |
| Slovenčina | `sk` |
| Čeština | `cs` |
| Slovenščina | `sl` |
| Latviešu | `lv` |
| Ελληνικά | `el` |

Contributions for additional languages are welcome!

## Credits

Bambu Lab and its logo are trademarks of Shenzhen Tuozhu Technology; OctoPrint and its logo belong to the OctoPrint project; Prusa and PrusaLink are trademarks of Prusa Research; Moonraker and Klipper belong to their projects. Moonraker has no logo of its own, so its badge shows the mark of the [Klipper logo](https://github.com/Klipper3d/klipper/blob/master/docs/img/klipper.svg) (without its word mark, unreadable at badge size). The PrusaLink word mark is unreadable at badge size too, so its badge shows a plain monogram: a white P on orange. Icons from [Material Design Icons](https://pictogrammers.com/library/mdi/). This project is not affiliated with any of them.

## License

[MIT](https://github.com/juju35/ha-3d-printer-card/blob/main/LICENSE)

## Support

If you find this project useful, you can support its development:

<a href="https://buymeacoffee.com/julienstep9"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" height="50"></a>
