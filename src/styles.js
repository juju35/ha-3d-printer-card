// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
import { ICONS } from "./core.js";
import { BRANDS, DEFAULT_COLLAPSED, JOB_PHASES, PHASE_CLASS, RING_ANIM } from "./integrations.js";
import { ago, clamp, esc, filamentColor, fmtClock, fmtHours, fmtTemp, fmtUnit, hoursOf, intlLocale, num, pretty, svgIcon, t, valid } from "./helpers.js";
import { findPrinter, phaseOf, resolve } from "./registry-based-resolution.js";
import { BADGES, printerSvg, ringSvg, spoolSvg } from "./printer-picture.js";
import { bannerPrinterSvg, isNight, workshopSvg } from "./header-illustration.js";

export const BASE_STYLE = `
  :host { --pc-accent: #00ae42; --pc-ok: var(--success-color, #43a047); --pc-warn: var(--warning-color, #ffa600);
          --pc-crit: var(--error-color, #db4437); --pc-idle: var(--disabled-text-color, #9e9e9e); --pc-active: var(--info-color, #039be5);
          /* Text in a state or brand color is mixed with the text color so that it reads at 4.5:1 at least. */
          --pc-accent-text: color-mix(in srgb, var(--pc-accent) 50%, var(--primary-text-color)); }
  ha-card { overflow: hidden; container: pc-card / inline-size; }
  /* Natural width in a parent that sizes to its content, without a minimum (see ha-vacuum-card). */
  :host { display: block; min-width: 0; --pc-natural-width: 380px; }
  :host::before { content: ""; display: grid; grid-template-columns: minmax(0, var(--pc-natural-width)); height: 0; }
  .icon { width: 18px; height: 18px; fill: currentColor; flex: none; }
  .muted { color: var(--secondary-text-color); }
  .clickable { cursor: pointer; }
  [role="button"]:focus-visible { outline: 2px solid var(--primary-color, var(--pc-accent)); outline-offset: 2px; border-radius: 4px; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; } }
  .ok { --c: var(--pc-ok); } .warn { --c: var(--pc-warn); } .crit { --c: var(--pc-crit); } .idle { --c: var(--pc-idle); } .active { --c: var(--pc-active); }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c, var(--pc-ok)); flex: none; display: inline-block; }
  .chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; white-space: nowrap;
          background: color-mix(in srgb, var(--c, var(--pc-ok)) 15%, transparent); color: color-mix(in srgb, var(--c, var(--pc-ok)) 50%, var(--primary-text-color));
          flex: 0 1 auto; min-width: 0; max-width: 50%; overflow: hidden; box-sizing: border-box; }
  .chip-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .bar { height: 4px; border-radius: 3px; background: var(--divider-color, rgba(127,127,127,.25)); overflow: hidden; }
  .bar > div { height: 100%; border-radius: 3px; background: var(--c, var(--pc-ok)); transition: width .6s ease; }
  .header { display: flex; align-items: center; gap: 10px; padding: 12px 12px 0; }
  .logo { width: 40px; height: 40px; object-fit: contain; flex: none; }
  a.logo-link { display: flex; flex: none; }
  .type-icon { position: relative; width: 40px; height: 40px; border-radius: 50%; align-items: center; justify-content: center;
               --pc-tint: var(--c, var(--pc-accent)); background: color-mix(in srgb, var(--pc-tint) 16%, transparent); transition: background-color .3s ease; }
  .type-icon .icon.type { width: 24px; height: 24px; fill: var(--pc-accent); transition: fill .3s ease; }
  .type-icon:is(.ok, .warn, .crit, .idle, .active) .icon.type { fill: color-mix(in srgb, var(--pc-tint) 60%, var(--primary-text-color)); }
  /* The brand logos are drawn for a light background: their badge stays white on the dark theme too. */
  .type-icon .logo { position: absolute; right: -4px; bottom: -4px; width: 18px; height: 18px; border-radius: 5px; box-sizing: border-box; padding: 1px;
                     background: #fff;
                     box-shadow: 0 0 0 1px var(--divider-color, rgba(0,0,0,.12)), 0 0 0 3px var(--card-background-color, #fff); }
  .titles { flex: 1 1 0; min-width: 5ch; font-size: 16px; }
  /* The status pill right after the title, its whole label on one line, while the title stays whole beside it
     (measured by the card, see _fitPill); otherwise on its own line under a one-line subtitle, and with its dot alone
     when even that does not fit the header. */
  .tline { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .tline > .name { flex: 0 1 auto; min-width: 0; }
  .tline > .chip { flex: none; max-width: none; }
  .tline > .chip .chip-text { white-space: nowrap; overflow: visible; }
  .titles.below { display: grid; grid-template-columns: minmax(0, 1fr); align-content: center; }
  .titles.below > .tline { display: contents; }
  .titles.below > .tline > .chip { order: 3; justify-self: start; align-self: start; margin-top: 3px; }
  .titles.below > .sub { order: 2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .titles.dot-only > .tline { display: flex; }
  .titles.dot-only > .tline > .chip { order: 0; margin-top: 0; align-self: center; padding: 4px; }
  .titles.dot-only > .tline > .chip .chip-text { display: none; }
  :host([hide-title]) .titles .name, :host([hide-subtitle]) .titles > .sub { display: none; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .warning { padding: 16px; color: color-mix(in srgb, var(--pc-warn) 50%, var(--primary-text-color)); }
  .info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .line { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--secondary-text-color); min-width: 0; }
  .line span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .line .icon { width: 16px; height: 16px; }
  .alert-line { display: flex; align-items: center; gap: 6px; font-size: 13px; color: color-mix(in srgb, var(--pc-crit) 50%, var(--primary-text-color)); }
  .alert-line .icon { width: 16px; height: 16px; color: var(--pc-crit); }
  .alert-line span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  /* Buttons are never filled: a smoked-glass background, the accent color for the main or active one. */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border: none; cursor: pointer; font: inherit; font-size: 13px;
         font-weight: 500; padding: 6px 12px; border-radius: 18px; background: var(--secondary-background-color, rgba(127,127,127,.12));
         color: var(--primary-text-color); min-width: 0; }
  .btn span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .btn:not(:disabled):hover { background: color-mix(in srgb, var(--pc-accent) 12%, var(--secondary-background-color, rgba(127,127,127,.12))); }
  .btn.primary, .btn.on { background: color-mix(in srgb, var(--pc-accent) 16%, transparent); color: var(--pc-accent-text); }
  .btn.primary .icon, .btn.on .icon { color: var(--pc-accent); }
  .btn.primary:not(:disabled):hover, .btn.on:not(:disabled):hover { background: color-mix(in srgb, var(--pc-accent) 24%, transparent); }
  .btn.danger .icon { color: var(--pc-crit); }
  .btn .icon { width: 18px; height: 18px; }
  .btn:disabled { opacity: .45; cursor: default; }
  .btn:focus-visible { outline: 2px solid var(--primary-color, var(--pc-accent)); outline-offset: 2px; }
  .zoom { all: unset; flex: none; cursor: pointer; width: 24px; height: 24px; margin: -4px -4px -4px 0; border-radius: 50%;
          display: grid; place-items: center; color: var(--secondary-text-color); }
  .zoom .icon { width: 16px; height: 16px; }
  .zoom:hover { background: color-mix(in srgb, var(--pc-idle) 16%, transparent); color: var(--primary-text-color); }
  .zoom:focus-visible { outline: 2px solid var(--primary-color, var(--pc-accent)); outline-offset: 1px; }

  /* Progress ring and the printer it surrounds */
  .ring { position: relative; flex: none; width: 112px; height: 112px; display: grid; place-items: center; }
  .ring-svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); overflow: visible; }
  .ring-svg circle { fill: none; stroke-width: 6; }
  .ring-svg .track { stroke: var(--divider-color, rgba(127,127,127,.25)); }
  .ring-svg .val { stroke: var(--c, var(--pc-accent)); stroke-linecap: round; transition: stroke-dasharray .6s ease; }
  .ring-svg .fx { stroke: var(--c, var(--pc-accent)); stroke-linecap: round; stroke-dasharray: 0 100; opacity: 0; transform-box: view-box; transform-origin: 50px 50px; }
  .ring .pct-in { position: relative; font-size: 15px; font-weight: 500; }
  .ring .pct-in small { font-size: 10px; margin-left: 1px; color: var(--secondary-text-color); }
  .printer { overflow: visible; filter: drop-shadow(0 3px 6px rgba(0,0,0,.18)); }
  .ring .printer { width: 64%; height: 64%; }
  .printer .frame { fill: var(--pc-frame); stroke: var(--pc-frame-edge); stroke-width: 1; }
  .printer .glass { fill: var(--pc-glass); }
  .printer .rail, .printer .bed, .printer .foot { fill: var(--pc-metal); }
  .printer .carriage { fill: var(--pc-accent); }
  .printer .nozzle { fill: var(--pc-metal-light); }
  .printer .tip { fill: #ff9f43; opacity: 0; }
  .printer .spool circle { fill: none; stroke: var(--pc-filament, var(--pc-accent)); stroke-width: 2.4; }
  .printer .spool .hub { fill: var(--pc-metal-light); stroke: none; }
  .printer .spool path { stroke: var(--pc-metal-light); stroke-width: 1; fill: none; }
  .printer .lines path { stroke: rgba(255,255,255,.22); stroke-width: .8; fill: none; }
  .printer .layer { fill: #fff; opacity: .75; }
  .printer .heat path { fill: none; stroke: #ff9f43; stroke-width: 1.8; stroke-linecap: round; opacity: 0; }
  .printer .sparkles path { fill: var(--pc-ok); opacity: 0; }
  .printer .head, .printer .spool, .printer .heat path, .printer .sparkles path, .printer .layer { transform-box: fill-box; transform-origin: center; }
  .printer .head { transform-box: view-box; transform-origin: 40px 22px; }
  .pbadge { position: absolute; right: 6px; bottom: 6px; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center;
            background: var(--c, var(--pc-accent)); box-shadow: 0 0 0 2px var(--card-background-color, #fff), 0 2px 6px rgba(0,0,0,.25);
            animation: pc-pop .35s cubic-bezier(.3,1.6,.6,1) both; }
  .pbadge svg { width: 72%; height: 72%; overflow: visible; }
  .pbadge .check { stroke-dasharray: 20; stroke-dashoffset: 0; animation: pc-draw .5s ease-out .2s both; }

  /* Printing: the toolhead sweeps across the bed, the spool turns, the top layer glows and a highlight runs on the ring. */
  .anim-printing .head { animation: pc-traverse 3s ease-in-out infinite; }
  .anim-printing .tip { animation: pc-blink .5s ease-in-out infinite; }
  .anim-printing .spool { animation: pc-spin 3s linear infinite; }
  .anim-printing .layer { animation: pc-blink 1.5s ease-in-out infinite; }
  .anim-printing .ring-svg .fx { opacity: .55; stroke: #fff; stroke-dasharray: 5 95; animation: pc-spin 3s linear infinite; }
  /* Preparing (heating, levelling): heat rises from the bed, the nozzle glows and the ring spins. */
  .anim-preparing .heat path { animation: pc-rise 1.5s ease-in infinite; }
  .anim-preparing .heat path:nth-child(2) { animation-delay: .5s; }
  .anim-preparing .heat path:nth-child(3) { animation-delay: 1s; }
  .anim-preparing .tip { animation: pc-glow 1.5s ease-in-out infinite alternate; }
  .anim-preparing .ring-svg .fx { opacity: 1; stroke-dasharray: 22 78; animation: pc-spin 1.5s linear infinite; }
  /* Paused: the toolhead waits parked at the side, the progress arc and the badge breathe. */
  .anim-paused .head, .ph-attention .head { transform: translateX(16px); }
  .anim-paused .ring-svg .val { animation: pc-fade 3s ease-in-out infinite; }
  .anim-paused .pbadge { animation: pc-pop .35s cubic-bezier(.3,1.6,.6,1) both, pc-breathe 3s ease-in-out .4s infinite; }
  /* Finished: the part sparkles. Error: the badge blinks. */
  .ph-finished .sparkles path { animation: pc-twinkle 1.5s ease-in-out infinite; }
  .ph-finished .sparkles path:nth-child(2) { animation-delay: .5s; }
  .ph-finished .sparkles path:nth-child(3) { animation-delay: 1s; }
  :is(.ph-error, .ph-failed) .pbadge { animation: pc-pop .35s cubic-bezier(.3,1.6,.6,1) both, pc-blink 1s ease-in-out .4s infinite; }
  :is(.ph-offline, .ph-idle, .ph-unknown, .ph-cancelled) .printer { opacity: .85; }
  @keyframes pc-traverse { 0%, 100% { transform: translateX(-12px); } 50% { transform: translateX(12px); } }
  @keyframes pc-spin { to { transform: rotate(360deg); } }
  @keyframes pc-blink { 0%, 100% { opacity: 1; } 50% { opacity: .25; } }
  @keyframes pc-glow { from { opacity: .2; } to { opacity: 1; } }
  @keyframes pc-fade { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
  @keyframes pc-rise { 0% { opacity: 0; transform: translateY(3px); } 30% { opacity: .85; } 100% { opacity: 0; transform: translateY(-10px); } }
  @keyframes pc-twinkle { 0%, 100% { opacity: 0; transform: scale(.4) rotate(0); } 50% { opacity: 1; transform: scale(1) rotate(45deg); } }
  @keyframes pc-pop { from { transform: scale(0); } to { transform: scale(1); } }
  @keyframes pc-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(.86); } }
  @keyframes pc-draw { from { stroke-dashoffset: 20; } to { stroke-dashoffset: 0; } }
  /* Narrow card: the status chip keeps only its colored dot (its text stays in title and aria-label). */
  @container (max-width: 200px) {
    .header .chip { padding: 4px; flex: none; }
    .header .chip-text { display: none; }
  }
  @container (max-width: 200px) {
    .header { gap: 6px; }
  }
`;

// Colors of the drawn printer, readable on the light and the dark theme.
export const THEME_STYLE = {
  light: ":host { --pc-frame: #e6e9ee; --pc-frame-edge: #c9ced6; --pc-glass: #2a3038; --pc-metal: #8b95a1; --pc-metal-light: #c7ccd3; }",
  dark: ":host { --pc-frame: #3b4149; --pc-frame-edge: #4c535d; --pc-glass: #15191e; --pc-metal: #7d8793; --pc-metal-light: #b9bfc7; }",
};

// In-card confirmation popup at the top of the card, as in the other cards: it stays in view when the card is long.
export const DIALOG_STYLE = `
  ha-card.dialog-open { position: relative; min-height: 160px; }
  .backdrop { position: absolute; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: flex-start; justify-content: center;
              padding-top: 12px; box-sizing: border-box; z-index: 9; border-radius: inherit; }
  .modal { background: var(--card-background-color, #1c1c1c); color: var(--primary-text-color); width: min(92%, 340px); max-height: calc(100% - 24px);
           box-sizing: border-box; border-radius: 14px; padding: 16px; box-shadow: 0 8px 30px rgba(0,0,0,.4); display: flex; flex-direction: column; gap: 12px; }
  .modal .msg { font-size: 14px; line-height: 1.4; }
  .modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
`;

export const FULL_STYLE = `
  .content { padding: 8px 12px 12px; display: flex; flex-direction: column; gap: 12px; }
  /* The stage: the print's picture in a rounded frame, the progress under it. */
  .stage { display: flex; flex-direction: column; gap: 10px; }
  .frame { position: relative; }
  .media { position: relative; display: grid; place-items: center; aspect-ratio: 16 / 9; max-height: 300px; width: 100%; overflow: hidden;
           border-radius: 12px; background: var(--secondary-background-color, rgba(127,127,127,.08)); }
  .media:focus-visible { outline-offset: 2px; border-radius: 12px; }
  .media { container-type: size; }
  .media .pic { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; display: block; }
  .pbox { position: relative; aspect-ratio: var(--ar); width: min(100cqw, 100cqh * var(--ar)); }
  .media.camera { background: #0e1013; }
  /* The preview filled up to the layer printed: what is left faded and grey, the printed part in color under a level
     line in the phase's color. */
  .media .pic.todo { opacity: .28; filter: grayscale(1); }
  .media .pic.done { clip-path: inset(var(--todo) 0 0 0); transition: clip-path .6s ease; }
  .media .level { position: absolute; left: -6px; right: -6px; top: var(--todo); height: 2px; margin-top: -1px; border-radius: 1px;
                  background: var(--c, var(--pc-accent)); box-shadow: 0 0 8px var(--c, var(--pc-accent)); transition: top .6s ease; }
  .anim-printing .media .level { animation: pc-fade 2s ease-in-out infinite; }
  .media.art .printer { position: relative; height: 82%; width: auto; aspect-ratio: 1; }
  .media ::slotted(ha-camera-stream) { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  .media .tag { position: absolute; z-index: 1; left: 8px; top: 8px; display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px;
                border-radius: 12px; font-size: 11px; font-weight: 500; color: #fff; background: rgba(0,0,0,.45);
                -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); }
  .media .rec { width: 7px; height: 7px; border-radius: 50%; background: #ff453a; animation: pc-fade 2s ease-in-out infinite; }
  .media .pbadge { z-index: 1; right: 8px; bottom: 8px; }
  /* Smoked-glass round buttons in the frame's top-right corner: switch the picture, open the camera. */
  .mbtns { position: absolute; z-index: 2; top: 8px; right: 8px; display: flex; gap: 6px; }
  .mbtn { all: unset; box-sizing: border-box; width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; cursor: pointer;
          color: var(--primary-text-color); background: color-mix(in srgb, var(--card-background-color, #fff) 72%, transparent);
          box-shadow: inset 0 0 0 1px rgba(127,127,127,.25); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); }
  .mbtn .icon { width: 18px; height: 18px; color: var(--pc-accent); }
  .mbtn:hover { background: color-mix(in srgb, var(--card-background-color, #fff) 90%, transparent); }
  .mbtn:focus-visible { outline: 2px solid var(--primary-color, var(--pc-accent)); outline-offset: 2px; }
  .progress { display: flex; flex-direction: column; gap: 6px; }
  .prow { display: flex; align-items: flex-end; gap: 12px; }
  .prow .big { flex: none; }
  .ptime { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 2px; text-align: right; }
  .ptime .remain { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
  .pbar { height: 6px; border-radius: 3px; background: var(--divider-color, rgba(127,127,127,.25)); overflow: hidden; }
  .pbar > div { position: relative; height: 100%; border-radius: 3px; background: var(--c, var(--pc-accent)); transition: width .6s ease; overflow: hidden; }
  /* Printing: a highlight runs along the bar. Preparing: stripes slide. Paused: the bar breathes. */
  .anim-printing .pbar > div::after { content: ""; position: absolute; inset: 0; width: 40%;
                                      background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent); animation: pc-sweep 2.2s ease-in-out infinite; }
  .anim-preparing .pbar > div { min-width: 100%; background: repeating-linear-gradient(-45deg, var(--c) 0 8px, color-mix(in srgb, var(--c) 45%, transparent) 8px 16px);
                                background-size: 22.6px 100%; animation: pc-stripes .8s linear infinite; }
  .anim-paused .pbar > div { animation: pc-fade 3s ease-in-out infinite; }
  .pmeta { display: flex; flex-wrap: wrap; gap: 4px 14px; }
  @keyframes pc-sweep { from { transform: translateX(-100%); } to { transform: translateX(250%); } }
  @keyframes pc-stripes { from { background-position: 0 0; } to { background-position: 22.6px 0; } }
  .big { font-size: 30px; font-weight: 400; line-height: 1; }
  .big small { font-size: 14px; margin-left: 2px; color: var(--secondary-text-color); }
  .big.word { font-size: 22px; }
  .remain { font-size: 13px; color: var(--primary-text-color); font-weight: 500; }
  .remain .muted { font-weight: 400; white-space: nowrap; }
  .controls { display: flex; flex-wrap: wrap; gap: 6px; }
  .controls .btn { flex: 1 1 auto; }
  .section-title { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase;
                   letter-spacing: .04em; color: var(--secondary-text-color); margin-bottom: 6px; }
  .section-title .icon { width: 16px; height: 16px; }
  .section-title span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .section-title.toggle { cursor: pointer; user-select: none; }
  .section-title.toggle[aria-expanded="false"] { margin-bottom: 0; }
  .section-title .chevron { margin-left: auto; width: 16px; height: 16px; transition: transform .2s ease; }
  .section-title.toggle[aria-expanded="false"] .chevron { transform: rotate(-90deg); }
  .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 6px; }
  .tile { display: flex; flex-direction: column; gap: 2px; padding: 6px 10px; border-radius: 10px; min-width: 0;
          background: var(--secondary-background-color, rgba(127,127,127,.08)); }
  .tile .k { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; }
  .tile .k span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .tile .k .icon { width: 14px; height: 14px; color: var(--c, var(--secondary-text-color)); }
  .tile .v { font-size: 14px; font-weight: 500; line-height: 1.3; overflow-wrap: anywhere; }
  .tile .v.ellipsis { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; overflow-wrap: normal; }
  .tile.wide { grid-column: span 2; }
  .tile .v small { font-size: 11px; font-weight: 400; color: var(--secondary-text-color); }
  .ams { display: flex; flex-direction: column; gap: 8px; }
  .unit-head { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--secondary-text-color); }
  .unit-head .unit-name { font-weight: 500; color: var(--primary-text-color); }
  .unit-head .hum { display: inline-flex; align-items: center; gap: 2px; }
  .unit-head .unit-name { margin-right: auto; }
  .unit-head .icon { width: 14px; height: 14px; }
  .slots { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
  .slot { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 4px 6px; border-radius: 10px; min-width: 0;
          background: var(--secondary-background-color, rgba(127,127,127,.08)); border: 1px solid transparent; box-sizing: border-box; }
  .slot.active { border-color: color-mix(in srgb, var(--pc-accent) 60%, transparent); background: color-mix(in srgb, var(--pc-accent) 10%, var(--secondary-background-color, transparent)); }
  /* The spool: flanges and core in the printer's greys, the filament in its color, as thick as what is left. */
  .spool-svg { width: 40px; height: 48px; margin-bottom: 2px; overflow: visible; }
  .spool-svg .flange { fill: var(--pc-frame); stroke: var(--pc-frame-edge); stroke-width: 1; }
  .spool-svg .core { fill: var(--pc-metal-light); }
  .spool-svg .fil-edge { fill: none; stroke: rgba(0,0,0,.18); stroke-width: .8; }
  .spool-svg .wind { fill: none; stroke: rgba(0,0,0,.16); stroke-width: 1; }
  .spool-svg .shine { fill: #fff; opacity: .22; }
  .spool-svg .ghost { fill: none; stroke: var(--secondary-text-color); stroke-width: 1.2; stroke-dasharray: 3 2.5; opacity: .6; }
  /* The spool in use while printing: its winding scrolls and a reflection runs across it. */
  .slot.feeding .wind { animation: pc-wind 1.2s linear infinite; }
  .slot.feeding .shine { animation: pc-shine 2.4s ease-in-out infinite; }
  @keyframes pc-wind { to { transform: translateX(3px); } }
  @keyframes pc-shine { from { transform: translateX(-6px); } to { transform: translateX(28px); } }
  .slot .ftype { font-size: 12px; font-weight: 500; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .slot .fname { font-size: 10px; color: var(--secondary-text-color); max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .slot .fleft { font-size: 11px; font-weight: 500; color: var(--secondary-text-color); }
  .slot .fleft.warn { color: color-mix(in srgb, var(--pc-warn) 55%, var(--primary-text-color)); }
  .slot .fleft.crit { color: color-mix(in srgb, var(--pc-crit) 55%, var(--primary-text-color)); }
  .slot.empty .ftype { color: var(--secondary-text-color); }
  @container (max-width: 340px) {
    .big { font-size: 26px; }
    .media { aspect-ratio: 4 / 3; }
  }
  @container (max-width: 270px) {
    .slots { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .prow { flex-wrap: wrap; }
    .ptime { align-items: flex-start; text-align: left; }
  }
  @container (max-width: 210px) {
    .big { font-size: 22px; }
  }
`;

// The illustrated header (the full and the mini card): the title on the workshop's wall at the left, the printer on
// its bench at the right, a 10 px bench strip under the whole banner. Day and night colors.
export const BANNER_STYLE = `
  .banner { position: relative; overflow: hidden; height: 90px; --pc-ground: 10px; --pc-scene-w: clamp(112px, 100cqw - 300px, 200px);
            background: #f1ece4; color: #0d2a45; --pc-sky-muted: #3b5b78;
            /* The printer keeps its light colors on the banner, day and night. */
            --pc-frame: #e6e9ee; --pc-frame-edge: #c9ced6; --pc-glass: #2a3038; --pc-metal: #8b95a1; --pc-metal-light: #c7ccd3; }
  .banner.night { background: #2a2a33; color: #fff; --pc-sky-muted: rgba(255,255,255,.78); }
  .banner .scene { position: absolute; right: 0; bottom: var(--pc-ground); width: var(--pc-scene-w); height: calc(100% - var(--pc-ground)); }
  .banner .ground { position: absolute; left: 0; right: 0; bottom: 0; height: var(--pc-ground);
                    background: repeating-linear-gradient(90deg, #c9a36f 0 60px, #b8925f 60px 62px); box-shadow: inset 0 2px 0 #dcb985; }
  .banner.night .ground { background: #4a3a2c; }
  .htext { position: absolute; z-index: 1; left: 0; top: 0; bottom: var(--pc-ground); right: var(--pc-scene-w); display: flex; align-items: center;
           gap: 10px; padding: 8px 8px 8px 14px; min-width: 0; box-sizing: border-box; container: pc-htext / inline-size; }
  .htext .titles { flex: 1 1 auto; min-width: 0; display: grid; grid-template-columns: minmax(0, 1fr); align-content: center; }
  .htext .sub { font-size: 13px; color: var(--pc-sky-muted); }
  /* The status pill right after the name, centred on it (placed by _fitPill). */
  .banner .chip { background: color-mix(in srgb, var(--c) 18%, rgba(255,255,255,.78)); color: color-mix(in srgb, var(--c) 45%, #0d2a45); }
  .banner.night .chip { background: color-mix(in srgb, var(--c) 30%, rgba(8,18,38,.55)); color: color-mix(in srgb, var(--c) 35%, #ffffff); }
  .banner .chip .dot { width: 7px; height: 7px; }
  /* The round icon: its color always tells the status (running: state color, idle: grey, warning: amber, error: red). */
  .banner .type-icon { background: rgba(255,255,255,.62); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--pc-tint) 30%, transparent); }
  .banner.night .type-icon { background: rgba(255,255,255,.12); }
  .banner .type-icon .icon.type, .banner .type-icon:is(.ok, .warn, .crit, .idle, .active) .icon.type { fill: color-mix(in srgb, var(--pc-tint) 82%, #0d2a45); }
  .banner.night .type-icon .icon.type, .banner.night .type-icon:is(.ok, .warn, .crit, .idle, .active) .icon.type { fill: color-mix(in srgb, var(--pc-tint) 80%, #fff); }
  .banner .type-icon .logo { padding: 2px; box-shadow: 0 0 0 1px rgba(13,42,69,.16), 0 1px 3px rgba(13,42,69,.18); }
  /* The mini card's expand / collapse button: a 24 px glass disc in the banner's top-right corner, the printer kept
     clear of it. */
  .banner .zoom { position: absolute; z-index: 2; top: 5px; right: 5px; margin: 0; color: #33506b; background: rgba(255,255,255,.55);
                  box-shadow: inset 0 0 0 1px rgba(255,255,255,.7); -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); }
  .banner.night .zoom { color: #fff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
  .banner .zoom:hover { color: #33506b; background: rgba(255,255,255,.75); }
  .banner.night .zoom:hover { color: #fff; background: rgba(255,255,255,.22); }
  .banner.has-zoom .scene { right: 30px; }
  .banner.has-zoom .htext { right: calc(var(--pc-scene-w) + 30px); padding-right: 2px; }
  /* Narrow card: the picture keeps its height and loses its left part, the printer stays. */
  @container (max-width: 300px) { .banner { --pc-scene-w: 84px; } .htext { padding-left: 10px; gap: 8px; } }
  /* Narrow mini card: a smaller printer under the corner button, its top below the button's line. */
  @container (max-width: 300px) {
    .banner.has-zoom .scene { right: 4px; height: calc(100% - var(--pc-ground) - 26px); }
    .banner.has-zoom .htext { right: calc(var(--pc-scene-w) + 4px); }
  }
  /* Very narrow card: the pill keeps its dot alone. */
  @container pc-card (max-width: 260px) { .htext { gap: 6px; } .banner .type-icon { width: 32px; height: 32px; } .banner .type-icon .icon.type { width: 20px; height: 20px; } }
  @container pc-card (max-width: 200px) { .htext .chip { padding: 4px; } .htext .chip-text { display: none; } }
  /* Very narrow card (mini card on a phone): the wall alone, the name and the status keep the room. */
  @container (max-width: 220px) { .banner { --pc-scene-w: 0px; } .banner .scene { display: none; } .htext { padding-right: 36px; } }
`;

export const MINI_STYLE = `
  :host { --pc-natural-width: 300px; }
  .content { padding: 8px 12px 12px; display: flex; align-items: center; gap: 12px; }
  .ring { width: 64px; height: 64px; }
  .ring-svg circle { stroke-width: 8; }
  .remain { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .info { gap: 4px; }
  .controls { display: flex; gap: 6px; flex: none; }
  .btn.round { width: 36px; height: 36px; padding: 0; border-radius: 50%; }
  @container (max-width: 260px) {
    .content { flex-wrap: wrap; row-gap: 8px; }
    .controls { flex-basis: 100%; justify-content: flex-end; }
  }
  @container (max-width: 200px) {
    .content { gap: 8px; }
    .ring { width: 52px; height: 52px; }
    .ring .pct-in { font-size: 13px; }
  }
`;

// Element names of Home Assistant dialogs (more-info opened from the card, among others).
export const DIALOG_TAGS = new Set(["HA-MORE-INFO-DIALOG", "HA-DIALOG", "DIALOG"]);
// The width of an element's whole text in fractional pixels, even while an ellipsis cuts it.
export const textWidth = (el) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  return range.getBoundingClientRect().width || el.scrollWidth;
};

export const isOutside = (card, ev) => {
  const path = ev.composedPath();
  return !path.includes(card) && !path.some((n) => DIALOG_TAGS.has(n?.tagName));
};
// "A click elsewhere" is caught on the pointer, not only on the click event: on iOS (Safari and the companion app)
// a tap on something that is not clickable (the background, an empty spot, a card with no action) sends no click to
// the page. It counts when the press and the release are both outside the card (a slider dragged out of the card
// does not fold it), and a scroll does not count (the browser cancels the pointer). Keyboard clicks still go through
// the click event. `tap(ev)` (press and release at the same spot) is for the tests.
export const watchOutside = (isOut, handler) => {
  let downOutside = false;
  const onDown = (ev) => {
    downOutside = isOut(ev);
  };
  const onUp = (ev) => {
    if (downOutside && isOut(ev)) handler(ev);
    downOutside = false;
  };
  const onClick = (ev) => {
    if (ev.detail === 0 && isOut(ev)) handler(ev);
  };
  return {
    on() {
      document.addEventListener("pointerdown", onDown, true);
      document.addEventListener("pointerup", onUp, true);
      document.addEventListener("click", onClick, true);
    },
    tap(ev) {
      onDown(ev);
      onUp(ev);
    },
    off() {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("click", onClick, true);
    },
  };
};
// After the confirmation popup closes, clicks on the card are ignored for this long (second click of a double click).
export const CONFIRM_GUARD_MS = 400;

// Inlined logos (data: URIs) get their src once, then the same node is moved into every later render.
export const DATA_IMGS = [];
export const DATA_IMG_IDS = new Map();
export const imgTag = (src, attrs) => {
  if (!String(src).startsWith("data:")) return `<img src="${esc(src)}" ${attrs}>`;
  let id = DATA_IMG_IDS.get(src);
  if (id === undefined) {
    id = DATA_IMGS.push(src) - 1;
    DATA_IMG_IDS.set(src, id);
  }
  return `<img data-img="${id}" ${attrs}>`;
};

// Elements a click acts on, and how one is told from the others across renders (focus kept on re-render).
export const FOCUS_SELECTOR = "[data-action], [data-entity]";
export const focusKey = (el) => {
  const data = Object.entries({ ...el.dataset });
  return data.length ? `${el.tagName}|${JSON.stringify(data)}` : "";
};

// Job commands: button entity key, confirmation text, icon, button style.
export const COMMANDS = {
  pause: { text: "confirm_pause", icon: "pause", cls: "" },
  resume: { text: "confirm_resume", icon: "play", cls: "primary" },
  stop: { text: "confirm_stop", icon: "stop", cls: "danger" },
};

// The stage's view chosen with its button (the print or the camera), kept per printer in this browser. The storage
// can be missing or refuse (private browsing): the view is then the configured one.
export const VIEW_KEY = "printer-3d-card.view.";
export const loadView = (id) => {
  try {
    const v = typeof localStorage === "undefined" ? null : localStorage.getItem(VIEW_KEY + id);
    return v === "print" || v === "camera" ? v : null;
  } catch (_e) {
    return null;
  }
};
export const saveView = (id, view) => {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(VIEW_KEY + id, view);
  } catch (_e) {
    /* storage refused: the view lasts as long as the card */
  }
};

export class PrinterBase extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._html = "";
    this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    // The print's preview, once loaded: its shape, for the box that holds it (see _media). Drawn again when it changes.
    this.shadowRoot.addEventListener(
      "load",
      (ev) => {
        const img = ev.target;
        if (!img?.classList?.contains("pic") || !img.closest?.(".pbox") || !img.naturalWidth || !img.naturalHeight) return;
        const r = Math.round((img.naturalWidth / img.naturalHeight) * 1000) / 1000;
        const src = img.getAttribute("src");
        if ((this._ratios ??= new Map()).get(src) === r) return;
        this._ratios.set(src, r);
        this._html = "";
        this._update();
      },
      true,
    );
    this.shadowRoot.addEventListener("pointerdown", () => {
      this._byPointer = true;
      // No rewrite of the card between the press and the release: Home Assistant updates the card several times a
      // second, and a rewrite under the pointer replaces the element pressed, so that the click lands on the card
      // itself and does nothing. The pending render is done once released (after the click).
      this._pressing = true;
      window.addEventListener("pointerup", this._onPressEnd, true);
      window.addEventListener("pointercancel", this._onPressEnd, true);
    });
    this._onPressEnd = () => {
      window.removeEventListener("pointerup", this._onPressEnd, true);
      window.removeEventListener("pointercancel", this._onPressEnd, true);
      // After the click (same task): a press with no click (released elsewhere) draws what it held back.
      setTimeout(() => {
        this._pressing = false;
        if (this._dirty) this._update();
      }, 0);
    };
    // Enter / Space on an element with the button role acts as a click, as on a <button>.
    this.shadowRoot.addEventListener("keydown", (ev) => {
      this._byPointer = false;
      if ((ev.key !== "Enter" && ev.key !== " ") || ev.target?.getAttribute?.("role") !== "button") return;
      ev.preventDefault();
      ev.target.click();
    });
    this._onKey = (ev) => {
      if (ev.key !== "Escape" || !this._confirm) return;
      ev.stopPropagation();
      this._closeConfirm();
    };
  }

  // Home Assistant pushes a new hass on every state change: the card is only rebuilt when something it shows changed.
  set hass(hass) {
    this._hass = hass;
    const deps = this._deps();
    const prev = this._lastDeps;
    if (deps && prev && deps.length === prev.length && deps.every((d, i) => d === prev[i])) return;
    this._lastDeps = deps;
    this._update();
  }

  get hass() {
    return this._hass;
  }

  // What a render reads from hass. The minute is part of it while a job runs or just ended: the remaining time
  // computed from the estimated end, and "finished 5 minutes ago", move on their own.
  _deps() {
    const h = this._hass;
    if (!h || !this._config) return null;
    const { dev } = findPrinter(h, this._config);
    if (!dev) return null;
    const ids = [...Object.values(dev.e), ...dev.trays, ...dev.spools, ...dev.ams.flatMap((u) => [...Object.values(u.e), ...u.trays])];
    const phase = phaseOf(dev, h.states);
    const minute = JOB_PHASES.has(phase) || phase === "finished" ? Math.floor(Date.now() / 60000) : 0;
    return [h.entities, h.devices, h.language, h.locale, h.formatEntityState, h.themes?.darkMode, minute, ...ids.map((id) => h.states[id])];
  }

  connectedCallback() {
    this._outside ??= watchOutside(
      (ev) => isOutside(this, ev),
      () => {
        if (!this._toggled?.size && !this._confirm) return;
        this._toggled = new Map();
        if (this._confirm) this._closeConfirm();
        else this._update();
      },
    );
    this._outside.on();
    // A new width (or the web font loaded): the status pill is fitted again, in the next frame.
    if (typeof ResizeObserver === "function") {
      this._resize ??= new ResizeObserver((entries) => {
        const w = Math.round(entries.at(-1).contentRect.width);
        if (w === this._fitWidth) return;
        this._fitWidth = w;
        cancelAnimationFrame(this._fitFrame);
        this._fitFrame = requestAnimationFrame(() => this._fitPill());
      });
      this._resize.observe(this);
    }
    document.fonts?.ready?.then(() => this._fitPill());
    // Back on the page after leaving it: rendered again in its default state.
    if (this._hass && this._config) this._update();
    if (this._confirm) window.addEventListener("keydown", this._onKey);
    clearInterval(this._tick);
    this._tick = setInterval(() => {
      if (this._hass) this.hass = this._hass;
    }, 30000);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    this._tick = null;
    this._resize?.disconnect();
    this._fitWidth = null;
    if (this._fitFrame) cancelAnimationFrame(this._fitFrame);
    this._outside?.off();
    window.removeEventListener("keydown", this._onKey);
    this._pressing = false;
    window.removeEventListener("pointerup", this._onPressEnd, true);
    window.removeEventListener("pointercancel", this._onPressEnd, true);
    // Left (another dashboard view, a conditional card hidden): back to the defaults, so that the card does not come
    // back unfolded or with its popup open.
    this._toggled = new Map();
    this._confirm = null;
    // Off the page: the live view stops (started again when the card comes back).
    this._stream?.remove();
    this._stream = null;
  }

  // The header's status pill goes right after the title, on its row, only while the title stays whole and the
  // pill's whole label fits beside it; otherwise it takes a line of its own under the subtitle (.below), the title
  // whole on its row (cut only when it does not fit alone). There, in the banner, the subtitle keeps one line; if the
  // text still does not fit above the ground strip, the pill keeps its dot alone (.dot-only, its label in its tooltip
  // and for screen readers). Measured after each render and on each new width, whatever the language: no fixed
  // width threshold.
  _fitPill() {
    if (!this.isConnected) return;
    for (const t of this.shadowRoot?.querySelectorAll?.(".titles") || []) {
      const row = t.querySelector(".tline");
      const pills = row ? [...row.children].filter((n) => n.matches(".chip")) : [];
      if (!pills.length || !pills[0].getBoundingClientRect) continue;
      t.classList.remove("below", "dot-only");
      const name = row.querySelector(".name");
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const title = name && getComputedStyle(name).display !== "none" ? textWidth(name) + gap : 0;
      const need = pills.reduce((w, p) => w + p.getBoundingClientRect().width + gap, title - gap);
      if (need > t.getBoundingClientRect().width - 0.5) {
        t.classList.add("below");
        const banner = t.closest(".banner");
        if (banner) {
          const b = banner.getBoundingClientRect();
          // Each element as it shows: its box cut by its ancestors that hide their overflow (a clamped line).
          const out = [...t.querySelectorAll("*")].some((n) => {
            let { top, bottom } = n.getBoundingClientRect();
            for (let p = n.parentElement; p && p !== t; p = p.parentElement) {
              if (getComputedStyle(p).overflowY === "visible") continue;
              top = Math.max(top, p.getBoundingClientRect().top);
              bottom = Math.min(bottom, p.getBoundingClientRect().bottom);
            }
            return bottom - top > 0.5 && (top < b.top - 0.5 || bottom > b.bottom - (parseFloat(getComputedStyle(banner).getPropertyValue("--pc-ground")) || 10) + 0.5);
          });
          if (out) t.classList.add("dot-only");
        }
      }
      // A subtitle cut by its ellipsis keeps its whole text in its tooltip.
      const s = t.querySelector(".sub");
      if (s && (!s.hasAttribute("title") || s.dataset.fit)) {
        const cut = s.scrollWidth > s.clientWidth + 1;
        s.toggleAttribute("data-fit", cut);
        if (cut) s.title = s.textContent.trim();
        else s.removeAttribute("title");
      }
    }
  }

  // Service call whose failure Home Assistant already reports (toast): handled here, no "Uncaught (in promise)".
  _call(domain, service, data) {
    return Promise.resolve(this._hass.callService(domain, service, data)).catch(() => {});
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = { ...config };
    this.toggleAttribute?.("hide-title", config.show_title === false);
    this.toggleAttribute?.("hide-subtitle", config.show_subtitle === false);
    this._html = "";
    this._lastDeps = null;
    this._update();
  }

  _t(key, vars) {
    return t(this._hass, this._config, key, vars);
  }

  _locale() {
    return intlLocale(this._hass, this._config);
  }

  _s(id) {
    return id ? this._hass.states[id] : undefined;
  }

  _update() {
    if (!this._hass || !this._config) return;
    // Not under a press either (see the pointerdown listener): drawn once released.
    if (this._pressing) {
      this._dirty = true;
      return;
    }
    this._dirty = false;
    this._live = null;
    let html = this._render();
    if (this._confirm) {
      html = html.replace(/<ha-card([^>]*)>([\s\S]*)<\/ha-card>\s*$/, (_, attrs, inner) => `<ha-card${attrs} class="dialog-open">${inner}${this._confirmHtml()}</ha-card>`);
    }
    if (html === this._html) return this._syncStream();
    const focused = this._confirm && this.shadowRoot.activeElement?.dataset?.action;
    // The focus is kept across a rewrite for the keyboard only: after a mouse click, it would draw the focus ring.
    const kept = this._confirm || this._byPointer ? null : this._focusedSpot();
    this._html = html;
    this.shadowRoot.innerHTML = html;
    this._placeImages();
    this._syncStream();
    this._fitPill();
    if (kept) this._focusables(kept.key)[kept.index]?.focus({ preventScroll: true });
    if (this._confirm) {
      const sel = focused === "confirm_cancel" ? '[data-action="confirm_cancel"]' : ".modal .primary";
      this.shadowRoot.querySelector(sel)?.focus({ preventScroll: true });
    }
  }

  // The camera's live view: Home Assistant's own player (WebRTC, HLS or MJPEG, whatever the camera offers), kept in
  // the card's light DOM and shown through the stage's <slot>, so that the rewrites of the card (several a second
  // while printing) never stop it. Started when the stage shows the camera, stopped as soon as it no longer does.
  _syncStream() {
    const id = this.isConnected === false ? null : this._live;
    let el = this._stream;
    if (el && (!id || el.dataset.entity !== id)) {
      el.remove();
      el = this._stream = null;
    }
    if (!id) return;
    if (!customElements.get("ha-camera-stream")) return this._loadStream();
    if (!el) {
      el = this._stream = document.createElement("ha-camera-stream");
      el.slot = "live";
      el.dataset.entity = id;
      el.muted = true;
      el.controls = false;
      el.allowExoPlayer = true;
      el.fitMode = "contain";
      el.setAttribute("fit-mode", "contain");
      el.hass = this._hass;
      el.stateObj = this._s(id);
      this.appendChild(el);
      return;
    }
    el.hass = this._hass;
    el.stateObj = this._s(id);
  }

  // Home Assistant loads its camera player with the cards that use it: a picture-entity card created (not shown)
  // brings it in. Until then the stage shows the camera's snapshot.
  _loadStream() {
    if (this._streamWait) return;
    this._streamWait = true;
    customElements.whenDefined?.("ha-camera-stream").then(() => {
      this._html = "";
      this._update();
    });
    Promise.resolve(window.loadCardHelpers?.())
      .then((h) => h?.createCardElement({ type: "picture-entity", entity: this._live, camera_view: "live" }))
      .catch(() => {});
  }

  _focusedSpot() {
    const el = this.shadowRoot.activeElement;
    if (!el?.dataset) return null;
    const key = focusKey(el);
    if (!key) return null;
    const index = this._focusables(key).indexOf(el);
    return index < 0 ? null : { key, index };
  }

  _focusables(key) {
    return [...this.shadowRoot.querySelectorAll(FOCUS_SELECTOR)].filter((n) => focusKey(n) === key);
  }

  _placeImages() {
    const kept = this._imgNodes || new Map();
    this._imgNodes = new Map();
    for (const img of this.shadowRoot.querySelectorAll("img[data-img]")) {
      const key = `${img.dataset.img}|${img.className}`;
      const old = kept.get(key);
      if (old) {
        kept.delete(key);
        img.replaceWith(old);
        this._imgNodes.set(key, old);
      } else {
        img.src = DATA_IMGS[img.dataset.img];
        this._imgNodes.set(key, img);
      }
    }
  }

  _onClick(ev) {
    this._pressing = false;
    if (ev.detail === 0) this._byPointer = false;
    const path = ev.composedPath();
    const el = path.find((n) => n?.dataset && (n.dataset.entity || n.dataset.action));
    if (!this._confirm && Date.now() - (this._confirmClosedAt ?? 0) < CONFIRM_GUARD_MS) {
      ev.stopPropagation();
      return;
    }
    // Confirmation popup open: only its buttons and the backdrop itself act.
    if (this._confirm) {
      ev.stopPropagation();
      const action = el?.dataset.action;
      if (action === "confirm_ok") {
        const { entity, domain = "button", service = "press" } = this._confirm;
        this._closeConfirm();
        this._call(domain, service, { entity_id: entity });
      } else if (action === "confirm_cancel" || (action === "confirm_backdrop" && path[0] === el)) {
        this._closeConfirm();
      }
      return;
    }
    if (!el) return;
    ev.stopPropagation();
    const { action, entity, cmd } = el.dataset;
    if (action === "zoom") return this._toggleZoom(ev);
    if (action === "media_view") {
      this._view = el.dataset.view;
      if (this._dev) saveView(this._dev.id, this._view);
      return this._update();
    }
    if (action === "toggle_section") {
      const key = el.dataset.section;
      this._toggled = new Map(this._toggled).set(key, !this._isCollapsed(key));
      return this._update();
    }
    if (action === "job" && COMMANDS[cmd] && entity) {
      if (this._cmdDisabled(entity)) return;
      const name = this._config.title || this._dev?.name || "";
      return this._openConfirm({ entity, text: this._t(COMMANDS[cmd].text, { name }), ok: this._t(cmd) });
    }
    // Power: on at once; off (the printer's plug, a print under way lost) only once confirmed.
    if (action === "power" && entity) {
      const domain = entity.split(".")[0];
      if (this._s(entity)?.state !== "on") return this._call(domain, "turn_on", { entity_id: entity });
      const name = this._config.title || this._dev?.name || "";
      const text = this._t(JOB_PHASES.has(this._phase) ? "confirm_power_off_job" : "confirm_power_off", { name });
      return this._openConfirm({ entity, domain, service: "turn_off", text, ok: this._t("turn_off") });
    }
    if (action === "light" && entity) {
      return this._call(entity.split(".")[0], "toggle", { entity_id: entity });
    }
    if (entity) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: entity }, bubbles: true, composed: true }));
  }

  _openConfirm(confirm) {
    this._confirm = confirm;
    window.addEventListener("keydown", this._onKey);
    this._update();
    this.shadowRoot.querySelector(".modal .primary")?.focus();
  }

  _closeConfirm() {
    this._confirm = null;
    this._confirmClosedAt = Date.now();
    window.removeEventListener("keydown", this._onKey);
    this._update();
  }

  _confirmHtml() {
    const c = this._confirm;
    return `<style>${DIALOG_STYLE}</style><div class="backdrop" data-action="confirm_backdrop">
      <div class="modal" role="dialog" aria-modal="true">
        <div class="msg">${esc(c.text)}</div>
        <div class="modal-actions">
          <button class="btn" data-action="confirm_cancel"><span>${esc(this._t("cancel"))}</span></button>
          <button class="btn primary" data-action="confirm_ok"><span>${esc(c.ok)}</span></button>
        </div>
      </div>
    </div>`;
  }

  // Home Assistant's own translation of an entity state, else a readable version of the raw value.
  _fmtState(s) {
    if (!valid(s)) return null;
    if (this._hass.formatEntityState) {
      try {
        return this._hass.formatEntityState(s);
      } catch (_e) {
        /* older Home Assistant */
      }
    }
    return pretty(s.state);
  }

  _offline() {
    return this._phase === "offline";
  }

  // Progress in percent, whole (floored while printing: never 100 % before the end).
  _progress(dev, phase) {
    if (phase === "finished") return 100;
    const v = num(this._s(dev.e.progress));
    if (v === null) return null;
    return clamp(JOB_PHASES.has(phase) ? Math.floor(v) : Math.round(v), 0, 100);
  }

  // Remaining time (hours) and estimated end (ms), each computed from the other when the integration gives only one.
  _times(dev) {
    let hours = hoursOf(this._s(dev.e.remaining));
    const endState = this._s(dev.e.end_time);
    let end = valid(endState) ? Date.parse(endState.state) : Number.NaN;
    if (!Number.isFinite(end)) end = hours !== null ? Date.now() + hours * 3600e3 : null;
    if (hours === null && end !== null) hours = Math.max(0, (end - Date.now()) / 3600e3);
    return { hours, end };
  }

  _layers(dev) {
    const n = num(this._s(dev.e.layer));
    const total = num(this._s(dev.e.total_layers));
    if (n === null || (n === 0 && this._phase === "preparing")) return "";
    return total ? this._t("layer", { n: Math.round(n), total: Math.round(total) }) : this._t("layer_n", { n: Math.round(n) });
  }

  // Name of the file being printed: the Bambu Lab task, else the file name without its extension.
  _fileName(dev) {
    for (const id of [dev.e.task, dev.e.file]) {
      const s = this._s(id);
      if (valid(s)) return String(s.state).replace(/\.(gcode|bgcode|3mf)(\.3mf)?$/i, "");
    }
    return "";
  }

  // Error reported by the printer: the first Bambu Lab HMS message, or a generic text.
  _error(dev, phase) {
    const hms = this._s(dev.e.hms);
    if (hms?.state === "on") {
      const msg = Object.entries(hms.attributes || {}).find(([k, v]) => /-Error$/i.test(k) && typeof v === "string");
      return msg ? msg[1] : this._t("error_reported");
    }
    if (this._s(dev.e.error)?.state === "on" || phase === "error" || phase === "failed") return this._t("error_reported");
    return "";
  }

  // Color of the drawn filament: the active Bambu Lab tray, else the accent color.
  _filament(dev) {
    const trays = [...dev.ams.flatMap((u) => u.trays), ...dev.spools].map((id) => this._s(id));
    const active = trays.find((s) => s?.attributes?.active && !s.attributes.empty);
    return filamentColor(active?.attributes?.color) || "var(--pc-accent)";
  }

  _header(dev, phase) {
    const b = BRANDS[dev.platform];
    const cls = this._iconState(dev, phase);
    const label = this._t(`s_${phase}`);
    const status = this._s(dev.e.status) ? dev.e.status : dev.e.printer_state;
    if (this._config.illustration !== false) return this._banner(dev, phase, { b, cls, label, status });
    const sub = this._fileName(dev) && (JOB_PHASES.has(phase) || phase === "finished") ? this._fileName(dev) : dev.model || b.name;
    return `
      <div class="header">
        <a class="logo-link type-icon ${cls}" href="${b.site}" target="_blank" rel="noopener noreferrer" title="${esc(b.name)}">${imgTag(b.logo, `class="logo" alt="${esc(b.name)}"`)}${svgIcon(ICONS.printer, "type")}</a>
        <div class="titles">
          <div class="tline">
            <div class="name">${esc(this._config.title || dev.name)}</div>
            <span class="chip clickable ${PHASE_CLASS[phase]}" role="button" tabindex="0" data-entity="${esc(status || "")}" title="${esc(label)}" aria-label="${esc(label)}"><span class="dot"></span><span class="chip-text">${esc(label)}</span></span>
          </div>
          <div class="sub">${esc(sub)}</div>
        </div>
        ${this._zoomButton()}
      </div>`;
  }

  // The illustrated header: the brand's icon, the name and the status (with the progress while a job runs) on the
  // workshop's wall, the card's printer on its bench, drawn in the phase (same animations as in the ring).
  _banner(dev, phase, { b, cls, label, status }) {
    const pct = this._progress(dev, phase);
    const zoom = this._zoomButton();
    const night = isNight(this._hass, this._config);
    const file = JOB_PHASES.has(phase) || phase === "finished" ? this._fileName(dev) : "";
    // The body's ring already shows the progress (full card, expanded mini card): the subtitle names the print
    // instead. The compact mini card has no room for the name: its subtitle keeps the progress.
    const sub = this._heroInBody() ? file || dev.model || b.name : JOB_PHASES.has(phase) && pct !== null ? `${pct} %` : dev.model || b.name;
    return `
      <div class="banner${night ? " night" : ""}${zoom ? " has-zoom" : ""} ph-${phase} ${RING_ANIM[phase] || ""}">
        <svg class="scene" viewBox="0 0 200 80" preserveAspectRatio="xMaxYMax slice" aria-hidden="true" focusable="false">${workshopSvg(night)}${bannerPrinterSvg(
          phase,
          pct,
          this._filament(dev),
        )}</svg>
        <div class="ground"></div>
        <div class="htext">
          <a class="logo-link type-icon ${cls}" href="${b.site}" target="_blank" rel="noopener noreferrer" title="${esc(b.name)}">${imgTag(b.logo, `class="logo" alt="${esc(b.name)}"`)}${svgIcon(ICONS.printer_3d, "type")}</a>
          <div class="titles">
            <div class="tline">
              <div class="name">${esc(this._config.title || dev.name)}</div>
              <span class="chip clickable ${cls}" role="button" tabindex="0" data-entity="${esc(status || "")}" title="${esc(label)}" aria-label="${esc(label)}"><span class="dot"></span><span class="chip-text">${esc(label)}</span></span>
            </div>
            <div class="sub"${file ? ` title="${esc(file)}"` : ""}>${esc(sub)}</div>
          </div>
        </div>
        ${zoom}
      </div>`;
  }

  // Whether the body shows the big progress (hero): always on the full card, only expanded on the mini card.
  _heroInBody() {
    return true;
  }

  // Header icon color: the phase, red when the printer reports an error.
  _iconState(dev, phase) {
    return this._error(dev, phase) ? "crit" : PHASE_CLASS[phase];
  }

  _zoomButton() {
    return "";
  }

  // The illustration's styles, only when it is shown.
  _bannerStyle() {
    return this._config.illustration === false ? "" : BANNER_STYLE;
  }

  _toggleZoom() {}

  _errorCard(key) {
    return `<style>${BASE_STYLE}</style><ha-card><div class="warning">${esc(key === "unknown_device" ? `${this._t(key)}: ${this._config.device}` : this._t(key))}</div></ha-card>`;
  }

  _accentStyle(dev) {
    const dark = this._hass.themes?.darkMode;
    return `:host { --pc-accent: ${BRANDS[dev.platform].accent}; --pc-filament: ${this._filament(dev)}; } ${THEME_STYLE[dark ? "dark" : "light"]}`;
  }

  // The job buttons of the phase: Pause and Stop while printing, Resume and Stop while paused.
  _commands(dev, phase) {
    if (!JOB_PHASES.has(phase)) return [];
    const paused = phase === "paused" || phase === "attention";
    return [paused ? "resume" : "pause", "stop"].filter((cmd) => this._cmdEntity(dev, cmd));
  }

  // Button entity of a command. PrusaLink resumes a printer that needs attention with its own Continue button.
  _cmdEntity(dev, cmd) {
    return cmd === "resume" && this._phase === "attention" && dev.e.continue ? dev.e.continue : dev.e[cmd];
  }

  // Bambu Lab and PrusaLink make a button unavailable when the printer cannot take it (Pause while heating…).
  _cmdDisabled(id) {
    return this._offline() || this._s(id)?.state === "unavailable";
  }

  _cmdButton(dev, cmd, round = false) {
    const c = COMMANDS[cmd];
    const label = esc(this._t(cmd));
    const id = this._cmdEntity(dev, cmd);
    const disabled = this._cmdDisabled(id) ? " disabled" : "";
    return `<button class="btn ${c.cls}${round ? " round" : ""}" data-action="job" data-cmd="${cmd}" data-entity="${esc(id)}" title="${label}" aria-label="${label}"${disabled}>${svgIcon(ICONS[c.icon])}${round ? "" : `<span>${label}</span>`}</button>`;
  }

  _lightButton(dev, round = false) {
    const id = dev.e.light;
    const s = this._s(id);
    if (!id || this._config.show_light === false || !s) return "";
    const on = s.state === "on";
    const label = esc(this._t("light"));
    const disabled = s.state === "unavailable" ? " disabled" : "";
    return `<button class="btn${on ? " on" : ""}${round ? " round" : ""}" data-action="light" data-entity="${esc(id)}" title="${label}" aria-label="${label}" aria-pressed="${on}"${disabled}>${svgIcon(on ? ICONS.light_on : ICONS.light_off)}${round ? "" : `<span>${label}</span>`}</button>`;
  }

  // The printer's power (its smart plug): set by `power_entity`, shown even while the printer is off or offline.
  _powerButton(dev, round = false) {
    const id = dev.e.power;
    const s = this._s(id);
    if (!id || !s) return "";
    const on = s.state === "on";
    const label = esc(this._t("power"));
    const disabled = s.state === "unavailable" ? " disabled" : "";
    return `<button class="btn${on ? " on" : ""}${round ? " round" : ""}" data-action="power" data-entity="${esc(id)}" title="${label}" aria-label="${label}" aria-pressed="${on}"${disabled}>${svgIcon(ICONS.power)}${round ? "" : `<span>${label}</span>`}</button>`;
  }

  // The remaining-time line: "1 h 23 min · Ends 14:35" while a job runs, "Finished 5 minutes ago" after.
  // `split` (mini card): the estimated end on a line of its own.
  _timeLine(dev, phase, split = false) {
    const locale = this._locale();
    if (JOB_PHASES.has(phase)) {
      const { hours, end } = this._times(dev);
      if (hours === null && end === null) return "";
      const ends = end !== null ? esc(this._t("ends", { time: fmtClock(end, locale) })) : "";
      if (split) {
        return `${hours !== null ? `<div class="remain">${esc(fmtHours(hours, locale))}</div>` : ""}${ends ? `<div class="line">${svgIcon(ICONS.clock)}<span>${ends}</span></div>` : ""}`;
      }
      return `<div class="remain">${hours !== null ? esc(fmtHours(hours, locale)) : ""}${ends ? ` <span class="muted">· ${ends}</span>` : ""}</div>`;
    }
    if (phase === "finished") {
      const s = this._s(dev.e.end_time);
      const at = valid(s) ? Date.parse(s.state) : Number.NaN;
      return Number.isFinite(at) && at <= Date.now() ? `<div class="line">${svgIcon(ICONS.flag)}<span>${esc(this._t("finished_ago", { when: ago(locale, at) }))}</span></div>` : "";
    }
    return "";
  }

  _ring(dev, phase, pct, inner) {
    const label = `${this._t("progress")} ${pct === null ? "—" : `${pct} %`}`;
    const badge = BADGES[phase] ? `<span class="pbadge ${PHASE_CLASS[phase]}">${BADGES[phase]}</span>` : "";
    return `<div class="ring clickable ${PHASE_CLASS[phase]} ${RING_ANIM[phase] || ""} ph-${phase}" role="button" tabindex="0" aria-label="${esc(label)}" data-entity="${esc(dev.e.progress || dev.e.status || "")}">${ringSvg(
      JOB_PHASES.has(phase) || phase === "finished" ? pct : 0,
    )}${inner}${badge}</div>`;
  }
}

export class PrinterCard extends PrinterBase {
  static getConfigElement() {
    return document.createElement("printer-3d-card-editor");
  }

  static getStubConfig(hass) {
    const p = resolve(hass)?.printers?.[0];
    return p ? { device: p.id } : {};
  }

  getCardSize() {
    return 7;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  _render() {
    const { dev, error } = findPrinter(this._hass, this._config);
    if (error) return this._errorCard(error);
    this._dev = dev;
    const c = this._config;
    const phase = phaseOf(dev, this._hass.states);
    this._phase = phase;
    const parts = [this._stage(dev, phase)];
    const buttons = c.show_controls !== false ? this._commands(dev, phase).map((cmd) => this._cmdButton(dev, cmd)) : [];
    const toggles = this._powerButton(dev) + this._lightButton(dev);
    if (buttons.length || toggles) parts.push(`<div class="controls">${buttons.join("")}${toggles}</div>`);
    if (c.show_temperatures !== false) parts.push(this._temperatures(dev));
    if (c.show_ams !== false) parts.push(this._ams(dev));
    if (c.show_job !== false) parts.push(this._job(dev, phase));
    return `<style>${BASE_STYLE}${FULL_STYLE}${this._bannerStyle()}${this._accentStyle(dev)}</style>
      <ha-card>
        ${this._header(dev, phase)}
        <div class="content">${parts.filter(Boolean).join("")}</div>
      </ha-card>`;
  }

  // The print's stage: its picture, the preview filling up layer by layer or the camera (live while Home Assistant
  // can stream it), switched by the round button in its corner; under it, the progress and the remaining time.
  _stage(dev, phase) {
    const pct = this._progress(dev, phase);
    return `<div class="stage ${PHASE_CLASS[phase]} ${RING_ANIM[phase] || ""} ph-${phase}">${this._media(dev, phase, pct)}${this._progressBlock(dev, phase, pct)}</div>`;
  }

  // The pictures the stage can show: the print's preview (cover image, job preview, thumbnail) and the camera.
  _views(dev) {
    const c = this._config;
    const shown = (id) => {
      const s = this._s(id);
      return s && s.state !== "unavailable" && s.attributes?.entity_picture ? id : null;
    };
    return { print: c.show_thumbnail !== false ? shown(dev.e.cover) : null, camera: c.show_camera !== false ? shown(dev.e.camera) : null };
  }

  // The view on screen: the last one chosen with the button (kept for this printer in the browser), else
  // `media_view`, else the print; the other one when it has no picture.
  _mediaView(dev, views) {
    let v = this._view ?? loadView(dev.id) ?? this._config.media_view ?? "print";
    if (!views[v]) v = v === "print" ? "camera" : "print";
    return views[v] ? v : null;
  }

  // How much of the print is done, 0 to 1, to fill its preview: by layer, else by progress. Nothing outside a job.
  _done(dev, phase, pct) {
    if (phase === "finished") return 1;
    if (!JOB_PHASES.has(phase)) return null;
    const n = num(this._s(dev.e.layer));
    const total = num(this._s(dev.e.total_layers));
    if (n !== null && total) return clamp(n / total, 0, 1);
    return pct === null ? null : pct / 100;
  }

  _media(dev, phase, pct) {
    const views = this._views(dev);
    const view = this._mediaView(dev, views);
    const badge = BADGES[phase] ? `<span class="pbadge ${PHASE_CLASS[phase]}">${BADGES[phase]}</span>` : "";
    // No picture: the drawn printer, animated by the phase.
    if (!view) {
      const id = dev.e.progress || dev.e.status || "";
      return `<div class="frame"><div class="media art clickable" role="button" tabindex="0" data-entity="${esc(id)}" aria-label="${esc(this._t("s_" + phase))}">${printerSvg(
        phase,
        pct,
        this._filament(dev),
      )}${badge}</div></div>`;
    }
    const id = views[view];
    const url = esc(this._s(id).attributes.entity_picture);
    let body;
    if (view === "print") {
      // In a box of the picture's own shape (measured once loaded), so that the level line spans the picture alone.
      const done = this._done(dev, phase, pct);
      const ar = this._ratios?.get(this._s(id).attributes.entity_picture) ?? 1;
      const todo = done === null ? 0 : Math.round((1 - done) * 1000) / 10;
      body = `<div class="pbox" style="--ar:${ar};--todo:${todo}%">${
        done === null || todo === 0
          ? `<img class="pic" src="${url}" alt="">`
          : `<img class="pic todo" src="${url}" alt=""><img class="pic done" src="${url}" alt=""><span class="level"></span>`
      }</div>`;
    } else {
      const live = id.startsWith("camera.") && this._config.camera_view !== "auto" && !this.preview;
      if (live) this._live = id;
      // The "Live" tag only once Home Assistant's player is there: until then the snapshot shows.
      const tag = live && customElements.get("ha-camera-stream") ? `<span class="tag"><span class="rec"></span>${esc(this._t("live"))}</span>` : "";
      body = `<img class="pic" src="${url}" alt="">${live ? `<slot name="live"></slot>${tag}` : ""}`;
    }
    const other = view === "print" ? "camera" : "print";
    const btn = (attrs, icon, label) => `<button class="mbtn" ${attrs} title="${esc(label)}" aria-label="${esc(label)}">${svgIcon(icon)}</button>`;
    const btns = [];
    if (views[other]) btns.push(btn(`data-action="media_view" data-view="${other}"`, other === "camera" ? ICONS.video : ICONS.cube, this._t(other === "camera" ? "view_camera" : "view_print")));
    if (view === "camera") btns.push(btn(`data-entity="${esc(id)}"`, ICONS.expand, this._t("open_camera")));
    return `<div class="frame"><div class="media ${view} clickable" role="button" tabindex="0" data-entity="${esc(id)}" aria-label="${esc(
      this._t(view === "print" ? "thumbnail" : "camera"),
    )}">${body}${badge}</div>${btns.length ? `<div class="mbtns">${btns.join("")}</div>` : ""}</div>`;
  }

  // The progress under the picture: the big percentage (or the state), the remaining time and the estimated end, the
  // bar in the phase's color, and the layer and the stage.
  _progressBlock(dev, phase, pct) {
    const job = JOB_PHASES.has(phase);
    const shown = job || (phase === "finished" && pct !== null);
    const label = `${this._t("progress")} ${pct === null ? "—" : `${pct} %`}`;
    const big = shown
      ? `<div class="big clickable" role="button" tabindex="0" data-entity="${esc(dev.e.progress || dev.e.status || "")}" aria-label="${esc(label)}">${pct === null ? "—" : `${pct}<small>%</small>`}</div>`
      : `<div class="big word">${esc(phase === "finished" ? this._t("done") : phase === "idle" ? this._t("ready") : this._t(`s_${phase}`))}</div>`;
    const err = this._error(dev, phase);
    const meta = [];
    const layers = job || phase === "finished" ? this._layers(dev) : "";
    if (layers) meta.push(`<div class="line clickable" role="button" tabindex="0" data-entity="${esc(dev.e.layer)}">${svgIcon(ICONS.layers)}<span>${esc(layers)}</span></div>`);
    const stage = job && dev.e.stage ? this._fmtState(this._s(dev.e.stage)) : null;
    if (stage && stage.toLowerCase() !== this._t(`s_${phase}`).toLowerCase()) meta.push(`<div class="line clickable" role="button" tabindex="0" data-entity="${esc(dev.e.stage)}">${svgIcon(ICONS.info)}<span>${esc(stage)}</span></div>`);
    const bar = shown ? `<div class="pbar"><div style="width:${pct ?? 0}%"></div></div>` : "";
    return `<div class="progress">
      ${err ? `<div class="alert-line">${svgIcon(ICONS.alert)}<span>${esc(err)}</span></div>` : ""}
      <div class="prow">${big}<div class="ptime">${this._timeLine(dev, phase, true)}</div></div>
      ${bar}${meta.length ? `<div class="pmeta">${meta.join("")}</div>` : ""}
    </div>`;
  }

  _isCollapsed(key) {
    if (this._toggled?.has(key)) return this._toggled.get(key);
    const c = this._config.collapsed ?? DEFAULT_COLLAPSED;
    return (Array.isArray(c) ? c : [c]).includes(key);
  }

  _section(key, icon, label, body) {
    const closed = this._isCollapsed(key);
    return `<div class="section"><div class="section-title toggle" role="button" tabindex="0" data-action="toggle_section" data-section="${key}" aria-expanded="${!closed}">${svgIcon(icon)}<span>${esc(
      label,
    )}</span>${svgIcon(ICONS.chevron_down, "chevron")}</div>${closed ? "" : body}</div>`;
  }

  _tile(id, icon, label, value, cls = "", title = "") {
    const v = title ? `<div class="v ellipsis" title="${esc(title)}">${value}</div>` : `<div class="v">${value}</div>`;
    return `<div class="tile clickable ${cls}" role="button" tabindex="0" data-entity="${esc(id || "")}"><div class="k">${svgIcon(icon)}<span>${esc(label)}</span></div>${v}</div>`;
  }

  _temperatures(dev) {
    const locale = this._locale();
    const tiles = [];
    const nozzles = dev.e.nozzle ? [["nozzle", "nozzle_target", "nozzle"]] : [
      ["nozzle_left", "nozzle_left_target", "nozzle_left"],
      ["nozzle_right", "nozzle_right_target", "nozzle_right"],
    ];
    for (const [cur, target, label, icon] of [...nozzles.map((n) => [...n, ICONS.nozzle_heat]), ["bed", "bed_target", "bed", ICONS.bed], ["chamber", "chamber_target", "chamber", ICONS.chamber]]) {
      const s = this._s(dev.e[cur]);
      if (!s) continue;
      const tg = this._s(dev.e[target]);
      const tv = num(tg);
      const heating = tv !== null && tv > 0;
      tiles.push(this._tile(dev.e[cur], icon, this._t(label), `${esc(fmtTemp(s, locale))}${heating ? ` <small>/ ${esc(fmtTemp(tg, locale))}</small>` : ""}`, heating ? "active" : ""));
    }
    return tiles.length ? `<div class="tiles">${tiles.join("")}</div>` : "";
  }

  // One AMS slot or external spool: the spool drawn in its filament's color, as full as what is left, then the type,
  // the name and the percentage left. The slot in use is outlined; its spool turns while printing.
  _slot(id) {
    const s = this._s(id);
    if (!s) return "";
    const a = s.attributes || {};
    const empty = a.empty === true || (!valid(s) && !a.type) || String(s.state).toLowerCase() === "empty";
    const remain = Number(a.remain);
    const known = !empty && Number.isFinite(remain) && remain >= 0;
    const level = known ? remain / 100 : 1;
    const color = empty ? null : filamentColor(a.color) || "var(--pc-idle)";
    const clip = `pc-spool-${id.replace(/[^a-z0-9_]/gi, "_")}`;
    const label = empty ? this._t("empty") : [a.type, valid(s) ? s.state : "", known ? `${Math.round(remain)} %` : ""].filter(Boolean).join(", ");
    const feeding = a.active && this._phase === "printing" ? " feeding" : "";
    return `<div class="slot clickable${empty ? " empty" : ""}${a.active ? " active" : ""}${feeding}" role="button" tabindex="0" data-entity="${esc(id)}" aria-label="${esc(label)}" title="${esc(label)}">
      ${spoolSvg(color, level, clip)}
      <span class="ftype">${esc(empty ? this._t("empty") : a.type || "—")}</span>
      <span class="fname">${esc(empty ? "" : valid(s) ? s.state : "")}</span>${
        known ? `<span class="fleft${remain <= 10 ? " crit" : remain <= 25 ? " warn" : ""}">${Math.round(remain)} %</span>` : ""
      }</div>`;
  }

  _ams(dev) {
    const locale = this._locale();
    const units = dev.ams.map((u) => {
      const hum = num(this._s(u.e.humidity));
      const idx = num(this._s(u.e.humidity_index));
      const temp = this._s(u.e.ams_temp);
      const meta = [
        hum !== null ? `<span class="hum clickable" role="button" tabindex="0" data-entity="${esc(u.e.humidity)}" title="${esc(this._t("humidity"))}">${svgIcon(ICONS.humidity)}${Math.round(hum)} %</span>` : idx !== null ? `<span class="hum clickable" role="button" tabindex="0" data-entity="${esc(u.e.humidity_index)}" title="${esc(this._t("humidity"))}">${svgIcon(ICONS.humidity)}${Math.round(idx)}/5</span>` : "",
        valid(temp) ? `<span class="hum">${svgIcon(ICONS.thermometer)}${esc(fmtTemp(temp, locale))}</span>` : "",
      ].join("");
      return `<div class="unit"><div class="unit-head"><span class="unit-name">${esc(u.name)}</span>${meta}</div><div class="slots">${u.trays.map((id) => this._slot(id)).join("")}</div></div>`;
    });
    if (dev.spools.length) {
      units.push(`<div class="unit"><div class="unit-head"><span class="unit-name">${esc(this._t("external_spool"))}</span></div><div class="slots">${dev.spools.map((id) => this._slot(id)).join("")}</div></div>`);
    }
    return units.length ? this._section("ams", ICONS.ams, this._t("ams"), `<div class="ams">${units.join("")}</div>`) : "";
  }

  _job(dev, phase) {
    const locale = this._locale();
    const tiles = [];
    const start = this._s(dev.e.start_time);
    const at = valid(start) ? Date.parse(start.state) : Number.NaN;
    if (Number.isFinite(at) && (JOB_PHASES.has(phase) || phase === "finished")) tiles.push(this._tile(dev.e.start_time, ICONS.start, this._t("started"), esc(fmtClock(at, locale))));
    const weight = num(this._s(dev.e.weight));
    if (weight !== null) tiles.push(this._tile(dev.e.weight, ICONS.weight, this._t("weight"), esc(fmtUnit(weight, "gram", locale, 1))));
    const len = this._s(dev.e.length);
    const lv = num(len);
    if (lv !== null) {
      const unit = len.attributes?.unit_of_measurement === "mm" ? "millimeter" : "meter";
      tiles.push(this._tile(dev.e.length, ICONS.length, this._t("length"), esc(fmtUnit(lv, unit, locale, 2))));
    }
    const speed = this._s(dev.e.speed);
    if (valid(speed)) {
      const u = speed.attributes?.unit_of_measurement;
      const v = num(speed);
      const text = u === "%" && v !== null ? `${Math.round(v)} %` : u && v !== null ? `${fmtUnit(Math.round(v), "millimeter-per-second", locale)}` : this._fmtState(speed);
      tiles.push(this._tile(dev.e.speed, ICONS.speed, this._t("speed"), esc(u === "mm/s" || u === "%" || !u ? text : `${Math.round(v ?? 0)} ${u}`)));
    }
    const material = this._s(dev.e.material);
    if (valid(material)) tiles.push(this._tile(dev.e.material, ICONS.nozzle, this._t("material"), esc(material.state)));
    const file = this._s(dev.e.file);
    if (valid(file)) tiles.push(this._tile(dev.e.file, ICONS.file, this._t("file"), esc(file.state), "wide", file.state));
    return tiles.length ? this._section("job", ICONS.timer, this._t("job"), `<div class="tiles">${tiles.join("")}</div>`) : "";
  }
}

// The mini card is a full card drawn compact: its detail button (top right, `zoom: false` removes it) switches it
// to the full card's content and back, and a click anywhere else on the page brings the compact view back.
export class PrinterMiniCard extends PrinterCard {
  constructor() {
    super();
    this._unzoom = watchOutside(
      (ev) => isOutside(this, ev),
      () => {
        if (this._zoomed) this._setZoom(false);
      },
    );
  }

  static getConfigElement() {
    return document.createElement("printer-3d-mini-card-editor");
  }

  connectedCallback() {
    super.connectedCallback();
    this._unzoom.on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unzoom.off();
    // Back to the compact view once off the screen (see the full card).
    this._zoomed = false;
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 3;
  }

  getGridOptions() {
    return { ...(this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 6 }), rows: "auto" };
  }

  _heroInBody() {
    return !!this._zoomed;
  }

  _zoomButton() {
    if (this._config.zoom === false) return "";
    const z = this._zoomed;
    const label = esc(this._t(z ? "zoom_out" : "zoom_in"));
    return `<button class="zoom" data-action="zoom" title="${label}" aria-label="${label}">${svgIcon(z ? ICONS.collapse : ICONS.expand)}</button>`;
  }

  _setZoom(on) {
    this._zoomed = on;
    this._update();
    this.dispatchEvent(new CustomEvent("iron-resize", { bubbles: true, composed: true }));
  }

  _toggleZoom(ev) {
    this._setZoom(!this._zoomed);
    if (ev?.detail === 0) this.shadowRoot.querySelector(".zoom")?.focus({ preventScroll: true });
  }

  _render() {
    if (this._zoomed) return super._render();
    const { dev, error } = findPrinter(this._hass, this._config);
    if (error) return this._errorCard(error);
    this._dev = dev;
    const phase = phaseOf(dev, this._hass.states);
    this._phase = phase;
    const pct = this._progress(dev, phase);
    const shown = JOB_PHASES.has(phase) || phase === "finished";
    const inner = `<span class="pct-in">${shown && pct !== null ? `${pct}<small>%</small>` : "—"}</span>`;
    const lines = [];
    const err = this._error(dev, phase);
    if (err) lines.push(`<div class="alert-line">${svgIcon(ICONS.alert)}<span>${esc(err)}</span></div>`);
    lines.push(this._timeLine(dev, phase, true) || (shown ? "" : `<div class="remain">${esc(phase === "idle" ? this._t("ready") : this._t(`s_${phase}`))}</div>`));
    const layers = shown ? this._layers(dev) : "";
    if (layers) lines.push(`<div class="line">${svgIcon(ICONS.layers)}<span>${esc(layers)}</span></div>`);
    const buttons = this._config.show_controls !== false ? this._commands(dev, phase).map((cmd) => this._cmdButton(dev, cmd, true)) : [];
    const toggles = this._powerButton(dev, true) + this._lightButton(dev, true);
    return `<style>${BASE_STYLE}${MINI_STYLE}${this._bannerStyle()}${this._accentStyle(dev)}</style>
      <ha-card>
        ${this._header(dev, phase)}
        <div class="content">
          ${this._ring(dev, phase, pct, inner)}
          <div class="info">${lines.filter(Boolean).join("")}</div>
          ${buttons.length || toggles ? `<div class="controls">${buttons.join("")}${toggles}</div>` : ""}
        </div>
      </ha-card>`;
  }
}
