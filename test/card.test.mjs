import assert from "node:assert/strict";
import { test } from "node:test";
import { devices, entities, failed, finished, NOW, paused, preparing, states } from "../scripts/mock-states.mjs";
import { load } from "./load.mjs";

const pc = load();
// Objects made in the sandbox compared by value.
const plain = (x) => JSON.parse(JSON.stringify(x));

const makeHass = (overrides = {}) => {
  const calls = [];
  const st = { ...states };
  for (const [id, o] of Object.entries(overrides)) st[id] = { ...st[id], ...o };
  return { calls, entities, devices, states: st, language: "en", callService: (...a) => calls.push(JSON.parse(JSON.stringify(a))) };
};

const newCard = (config = {}, hass = makeHass(), Card = pc.PrinterCard) => {
  const card = new Card();
  card.setConfig({ device: "X1 Carbon", ...config });
  card.hass = hass;
  return card;
};
const html = (card) => card.shadowRoot.innerHTML;

// A click on an element of the card, as composedPath() would report it.
const click = (card, dataset, extra = []) => card._onClick({ composedPath: () => [{ dataset }, ...extra], stopPropagation() {} });

test("every supported integration is found, with its main entities", () => {
  const m = pc.resolve(makeHass());
  const by = Object.fromEntries(m.printers.map((p) => [p.platform, p]));
  assert.deepEqual(Object.keys(by).sort(), ["bambu_lab", "moonraker", "octoprint", "prusalink"]);
  for (const p of Object.values(by)) {
    for (const key of ["status", "progress", "nozzle", "bed", "pause", "resume", "stop"]) assert.ok(p.e[key], `${p.platform}: ${key}`);
  }
  assert.equal(by.octoprint.e.progress, "sensor.octoprint_job_percentage");
  assert.equal(by.octoprint.e.start_time, "sensor.octoprint_start_time");
  assert.equal(by.octoprint.e.end_time, "sensor.octoprint_estimated_finish_time");
  assert.equal(by.moonraker.e.nozzle_target, "number.voron_2_4_extruder_target");
  assert.equal(by.moonraker.e.cover, "camera.voron_2_4_thumbnail");
  assert.equal(by.moonraker.e.camera, undefined, "the thumbnail is not taken as the camera");
  assert.equal(by.moonraker.e.light, "light.voron_2_4_caselight");
  assert.equal(by.prusalink.e.cover, "camera.prusa_mk4_preview");
});

test("the Bambu Lab AMS is merged into its printer, with its trays in order", () => {
  const x1 = pc.resolve(makeHass()).printers.find((p) => p.platform === "bambu_lab");
  assert.equal(x1.ams.length, 1);
  assert.equal(x1.ams[0].name, "AMS 1");
  assert.equal(x1.ams[0].trays.length, 4);
  assert.equal(x1.ams[0].e.humidity, "sensor.x1_carbon_ams_1_humidity");
  assert.deepEqual(plain(x1.spools), ["sensor.x1_carbon_external_spool"]);
});

test("each integration's states map to the card's phases", () => {
  const phase = (platform, state) => pc.phaseOf({ platform, e: { status: "s" } }, { s: { state } });
  assert.equal(phase("bambu_lab", "running"), "printing");
  assert.equal(phase("bambu_lab", "prepare"), "preparing");
  assert.equal(phase("bambu_lab", "pause"), "paused");
  assert.equal(phase("bambu_lab", "finish"), "finished");
  assert.equal(phase("bambu_lab", "failed"), "failed");
  assert.equal(phase("octoprint", "printing_sd"), "printing");
  assert.equal(phase("octoprint", "operational"), "idle");
  assert.equal(phase("octoprint", "cancelling"), "stopping");
  assert.equal(phase("moonraker", "complete"), "finished");
  assert.equal(phase("moonraker", "standby"), "idle");
  assert.equal(phase("prusalink", "attention"), "attention");
  assert.equal(phase("prusalink", "stopped"), "cancelled");
  assert.equal(phase("prusalink", "unavailable"), "offline");
  assert.equal(phase("prusalink", "something_new"), "unknown");
  // Moonraker without a print state: Klipper's own state.
  assert.equal(pc.phaseOf({ platform: "moonraker", e: { printer_state: "k" } }, { k: { state: "shutdown" } }), "offline");
});

test("the full card shows progress, remaining time, layers, temperatures and filaments", () => {
  const h = html(newCard({ collapsed: [] }));
  assert.match(h, /aria-label="Progress 47 %"/);
  assert.match(h, /47<small>%<\/small>/);
  assert.match(h, /1 hr 23 min/);
  assert.match(h, /Layer 112 \/ 238/);
  assert.match(h, /Nozzle/);
  assert.match(h, /220°C <small>\/ 220°C<\/small>/);
  assert.match(h, /Chamber/);
  assert.match(h, /AMS 1/);
  assert.match(h, /Bambu PETG HF/);
  assert.match(h, /class="slot clickable active feeding"/);
  assert.match(h, /class="slot clickable empty"/);
  assert.match(h, /External spool/);
  assert.match(h, /Desk organizer/);
  assert.match(h, /class="media print clickable"/);
  // The spools: drawn in their color, as full as what is left; the one in use turns while printing.
  assert.match(h, /<span class="fleft warn">18 %<\/span>/);
  assert.match(h, /class="ghost"/);
  assert.match(h, /anim-printing/);
  // Percentages are whole numbers.
  assert.doesNotMatch(h, /\d+\.\d+ %/);
});

test("OctoPrint's remaining time comes from its estimated finish time", () => {
  const card = newCard({ device: "Workshop printer" });
  const { hours } = card._times(card._dev);
  const expected = (Date.parse(states["sensor.octoprint_estimated_finish_time"].state) - Date.now()) / 3600e3;
  assert.ok(Math.abs(hours - Math.max(0, expected)) < 0.01);
  assert.match(html(card), /72<small>%<\/small>/, "72.4 % shows as 72 %");
});

test("Moonraker's remaining time in hours and its layers", () => {
  const h = html(newCard({ device: "Voron 2.4" }));
  assert.match(h, /2 hr 36 min/);
  assert.match(h, /Layer 41 \/ 180/);
  assert.match(h, /fan_duct_v3/);
});

test("pause asks for confirmation at the top of the card, Cancel does nothing", () => {
  const hass = makeHass();
  const card = newCard({}, hass);
  click(card, { action: "job", cmd: "pause", entity: "button.x1_carbon_pause_printing" });
  assert.equal(hass.calls.length, 0);
  assert.match(html(card), /class="dialog-open"/);
  assert.match(html(card), /Pause the print on X1 Carbon\?/);
  click(card, { action: "confirm_cancel" });
  assert.equal(hass.calls.length, 0);
  assert.doesNotMatch(html(card), /dialog-open/);
});

test("confirming stop presses the stop button once; other clicks wait while the popup is open", () => {
  const hass = makeHass();
  const card = newCard({}, hass);
  click(card, { action: "job", cmd: "stop", entity: "button.x1_carbon_stop_printing" });
  assert.match(html(card), /It cannot be resumed afterwards/);
  click(card, { action: "light", entity: "light.x1_carbon_chamber_light" });
  assert.equal(hass.calls.length, 0);
  click(card, { action: "confirm_ok" });
  assert.deepEqual(hass.calls, [["button", "press", { entity_id: "button.x1_carbon_stop_printing" }]]);
  assert.doesNotMatch(html(card), /dialog-open/);
});

test("the buttons follow the phase: Pause while printing, Resume while paused, none when idle", () => {
  assert.match(html(newCard()), /data-cmd="pause"/);
  const p = html(newCard({}, makeHass(paused)));
  assert.match(p, /data-cmd="resume"/);
  assert.doesNotMatch(p, /data-cmd="pause"/);
  assert.match(p, /anim-paused/);
  const f = html(newCard({}, makeHass(finished)));
  assert.doesNotMatch(f, /data-cmd=/);
  assert.match(f, /Finished [^<]*ago/);
  assert.match(f, /ph-finished/);
  assert.match(html(newCard({ show_controls: false })), /^(?![\s\S]*data-cmd=)/);
});

test("a button the integration made unavailable is disabled and asks nothing", () => {
  const hass = makeHass(preparing);
  const card = newCard({}, hass);
  assert.match(html(card), /data-cmd="pause"[^>]*disabled/);
  assert.match(html(card), /data-cmd="stop"[^>]*disabled/);
  click(card, { action: "job", cmd: "stop", entity: "button.x1_carbon_stop_printing" });
  assert.doesNotMatch(html(card), /dialog-open/);
  assert.equal(hass.calls.length, 0);
  // PrusaLink: paused, Pause is unavailable but Resume and Stop are not.
  const mk4 = html(newCard({ device: "Prusa MK4" }));
  assert.match(mk4, /data-cmd="resume" data-entity="button.prusa_mk4_resume_job"(?![^>]*disabled)/);
  assert.match(mk4, /data-cmd="stop"(?![^>]*disabled)/);
});

test("a PrusaLink printer that needs attention resumes with its Continue button", () => {
  const card = newCard(
    { device: "Prusa MK4" },
    makeHass({ "sensor.prusa_mk4": { state: "attention" }, "button.prusa_mk4_continue_job": { state: "unknown" }, "button.prusa_mk4_resume_job": { state: "unavailable" } }),
  );
  assert.match(html(card), /data-cmd="resume" data-entity="button.prusa_mk4_continue_job"(?![^>]*disabled)/);
});

test("Bambu Lab: the external spool device joins its printer; the named light wins over other lights", () => {
  const ents = {
    ...entities,
    "light.x1_carbon_heatbed_light": { entity_id: "light.x1_carbon_heatbed_light", device_id: "x1c", platform: "bambu_lab", translation_key: "heatbed_light" },
  };
  // The heatbed light listed before the chamber light.
  const ordered = Object.fromEntries([["light.x1_carbon_heatbed_light", ents["light.x1_carbon_heatbed_light"]], ...Object.entries(entities)]);
  const x1 = pc.resolve({ ...makeHass(), entities: ordered }).printers.find((p) => p.platform === "bambu_lab");
  assert.equal(x1.e.light, "light.x1_carbon_chamber_light");
  assert.deepEqual(plain(x1.spools), ["sensor.x1_carbon_external_spool"]);
  assert.equal(x1.ams.length, 1, "the external spool is not an AMS unit");
});

test("Moonraker: a Klipper shutdown or error wins over the print state", () => {
  const dev = { platform: "moonraker", e: { status: "s", printer_state: "k" } };
  assert.equal(pc.phaseOf(dev, { s: { state: "printing" }, k: { state: "shutdown" } }), "offline");
  assert.equal(pc.phaseOf(dev, { s: { state: "printing" }, k: { state: "error" } }), "error");
  assert.equal(pc.phaseOf(dev, { s: { state: "printing" }, k: { state: "ready" } }), "printing");
});

test("an offline printer gets no command", () => {
  const hass = makeHass({ "sensor.x1_carbon_print_status": { state: "unavailable" } });
  const card = newCard({}, hass);
  assert.match(html(card), /Offline/);
  click(card, { action: "job", cmd: "stop", entity: "button.x1_carbon_stop_printing" });
  assert.doesNotMatch(html(card), /dialog-open/);
});

test("the light button toggles the light, with no confirmation", () => {
  const hass = makeHass();
  const card = newCard({}, hass);
  assert.match(html(card), /data-action="light" data-entity="light.x1_carbon_chamber_light"[^>]*aria-pressed="true"/);
  click(card, { action: "light", entity: "light.x1_carbon_chamber_light" });
  assert.deepEqual(hass.calls, [["light", "toggle", { entity_id: "light.x1_carbon_chamber_light" }]]);
  assert.doesNotMatch(html(newCard({ show_light: false })), /data-action="light"/);
});

test("preparing spins the ring and shows the stage; a failed print shows the HMS message", () => {
  const p = html(newCard({}, makeHass(preparing)));
  assert.match(p, /anim-preparing/);
  assert.match(p, /Heatbed preheating/);
  const f = html(newCard({}, makeHass(failed)));
  assert.match(f, /AMS slot 3 ran out of filament/);
  assert.match(f, /type-icon crit/);
  assert.match(f, /ph-failed/);
});

test("sections fold and unfold, and fold back on a click elsewhere", () => {
  const card = newCard();
  card.connectedCallback();
  assert.match(html(card), /data-section="job" aria-expanded="false"/);
  assert.match(html(card), /data-section="ams" aria-expanded="true"/);
  click(card, { action: "toggle_section", section: "job" });
  assert.match(html(card), /data-section="job" aria-expanded="true"/);
  card._outside.tap({ composedPath: () => [{ tagName: "HA-MORE-INFO-DIALOG" }] });
  assert.match(html(card), /data-section="job" aria-expanded="true"/, "a click in the more-info dialog keeps it");
  card._outside.tap({ composedPath: () => [{ tagName: "DIV" }] });
  assert.match(html(card), /data-section="job" aria-expanded="false"/);
  card.disconnectedCallback();
});

test("folding: a tap elsewhere (pointer), not a press inside released outside; leaving the page folds back", () => {
  const card = newCard();
  card.connectedCallback();
  click(card, { action: "toggle_section", section: "job" });
  // Pressed in the card (a slider dragged out of it): nothing folds.
  card._outside.tap({ composedPath: () => [card] });
  assert.match(html(card), /data-section="job" aria-expanded="true"/);
  // A tap on a spot that sends no click (iOS): the pointer alone folds it.
  card._outside.tap({ composedPath: () => [] });
  assert.match(html(card), /data-section="job" aria-expanded="false"/);
  // Left with a section open and back: folded.
  click(card, { action: "toggle_section", section: "job" });
  card.disconnectedCallback();
  card.connectedCallback();
  assert.match(html(card), /data-section="job" aria-expanded="false"/);
  card.disconnectedCallback();
  // The mini card comes back compact.
  const mini = newCard({}, makeHass(), pc.PrinterMiniCard);
  mini.connectedCallback();
  click(mini, { action: "zoom" });
  assert.match(html(mini), /class="tiles"/);
  mini.disconnectedCallback();
  mini.connectedCallback();
  assert.doesNotMatch(html(mini), /class="tiles"/);
  mini.disconnectedCallback();
});

test("no rewrite under a press: the click renders at once, a release without a click draws what was held", async () => {
  const hass = makeHass();
  const card = newCard({}, hass);
  card.connectedCallback();
  const id = "sensor.x1_carbon_print_progress";
  const before = html(card);
  card.shadowRoot.listeners.pointerdown({});
  card.hass = { ...hass, states: { ...hass.states, [id]: { ...hass.states[id], state: "48" } } };
  assert.equal(html(card), before, "no rewrite under the pointer");
  pc.window.fire("pointerup", {});
  click(card, { action: "toggle_section", section: "job" });
  assert.match(html(card), /48<small>%<\/small>/, "the click renders at once");
  assert.match(html(card), /data-section="job" aria-expanded="true"/);
  // Pressed and released elsewhere (no click): the held update is drawn after the release.
  card.shadowRoot.listeners.pointerdown({});
  card.hass = { ...hass, states: { ...hass.states, [id]: { ...hass.states[id], state: "49" } } };
  assert.doesNotMatch(html(card), /49<small>%/);
  pc.window.fire("pointerup", {});
  await new Promise((r) => setTimeout(r, 0));
  assert.match(html(card), /49<small>%<\/small>/);
  card.disconnectedCallback();
});

test("an unrelated state change does not rebuild the card", () => {
  const hass = makeHass();
  const card = newCard({}, hass);
  let renders = 0;
  const render = card._render.bind(card);
  card._render = () => {
    renders++;
    return render();
  };
  card.hass = { ...hass, states: { ...hass.states, "light.elsewhere": { entity_id: "light.elsewhere", state: "on", attributes: {} } } };
  assert.equal(renders, 0);
  const id = "sensor.x1_carbon_print_progress";
  card.hass = { ...hass, states: { ...hass.states, [id]: { ...hass.states[id], state: "48" } } };
  assert.equal(renders, 1);
  assert.match(html(card), /48<small>%<\/small>/);
});

test("the mini card shows a compact ring and switches to the full card and back", () => {
  const card = newCard({}, makeHass(), pc.PrinterMiniCard);
  card.connectedCallback();
  assert.match(html(card), /class="pct-in">47<small>%<\/small>/);
  assert.match(html(card), /data-action="zoom"/);
  assert.doesNotMatch(html(card), /class="tiles"/);
  click(card, { action: "zoom" });
  assert.match(html(card), /class="tiles"/);
  card._unzoom.tap({ composedPath: () => [{ tagName: "DIV" }] });
  assert.doesNotMatch(html(card), /class="tiles"/);
  assert.doesNotMatch(html(newCard({ zoom: false }, makeHass(), pc.PrinterMiniCard)), /data-action="zoom"/);
  card.disconnectedCallback();
});

test("entities set by hand replace the ones found", () => {
  const card = newCard({ camera_entity: "camera.octoprint_camera", light_entity: "light.voron_2_4_caselight", entities: { chamber: "sensor.voron_2_4_chamber_temperature" } });
  assert.equal(card._dev.e.camera, "camera.octoprint_camera");
  assert.equal(card._dev.e.light, "light.voron_2_4_caselight");
  assert.match(html(card), /47°C/);
});

test("errors: no registry, no printer, unknown printer", () => {
  const none = new pc.PrinterCard();
  none.setConfig({});
  none.hass = { states: {}, language: "en" };
  assert.match(html(none), /Home Assistant 2024.8/);
  const empty = new pc.PrinterCard();
  empty.setConfig({});
  empty.hass = { states: {}, entities: {}, devices: {}, language: "en" };
  assert.match(html(empty), /No 3D printer found/);
  assert.match(html(newCard({ device: "Nope" })), /3D printer not found: Nope/);
});

test("stub config and card size for the dashboard", () => {
  assert.ok(pc.PrinterCard.getStubConfig(makeHass()).device);
  assert.deepEqual(plain(pc.PrinterCard.getStubConfig({ states: {} })), {});
  assert.equal(newCard().getGridOptions().columns, 12);
  assert.equal(newCard({}, makeHass(), pc.PrinterMiniCard).getGridOptions().columns, 6);
});

test("the editor keeps the YAML minimal", () => {
  const ed = new pc.PrinterCardEditor();
  ed.setConfig({ type: "custom:printer-3d-card" });
  ed.hass = makeHass();
  const events = [];
  ed.dispatchEvent = (ev) => events.push(ev);
  ed._form.listeners["value-changed"]({ stopPropagation() {}, detail: { value: { type: "custom:printer-3d-card", device: "x1c", show_ams: true, show_job: false, title: "", collapsed: ["job"] } } });
  assert.deepEqual(plain(events[0].detail.config), { type: "custom:printer-3d-card", device: "x1c", show_job: false });
});

test("the mini card editor offers the options of its detail view", () => {
  const names = (schema) => schema.flatMap((s) => (s.schema ? names(s.schema) : [s.name]));
  const full = new pc.PrinterCardEditor();
  full.setConfig({ type: "custom:printer-3d-card" });
  full.hass = makeHass();
  const mini = new pc.PrinterMiniCardEditor();
  mini.setConfig({ type: "custom:printer-3d-mini-card" });
  mini.hass = makeHass();
  const miniNames = names(mini._form.schema);
  for (const name of names(full._form.schema)) assert.ok(miniNames.includes(name), `mini editor misses ${name}`);
  assert.ok(miniNames.includes("zoom"));
  assert.ok(!miniNames.includes("entities"));
  assert.deepEqual(plain(mini._form.data.collapsed), ["job"]);
});

test("every language has every text, and the language list matches the translations", () => {
  const keys = Object.keys(pc.STRINGS.en);
  for (const [l, table] of Object.entries(pc.STRINGS)) {
    assert.deepEqual(plain(Object.keys(table).filter((k) => !keys.includes(k))), [], `${l}: extra keys`);
    assert.deepEqual(plain(keys.filter((k) => !(k in table))), [], `${l}: missing keys`);
    for (const k of keys) {
      const vars = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      assert.deepEqual(plain(vars(table[k])), plain(vars(pc.STRINGS.en[k])), `${l}.${k}: placeholders`);
    }
  }
  assert.deepEqual(plain(pc.LANGUAGES.map(([l]) => l).sort()), plain(Object.keys(pc.STRINGS).sort()));
  assert.equal(Object.keys(pc.STRINGS).length, 22);
});

test("the card follows the configured language", () => {
  const h = html(newCard({ language: "fr", collapsed: [] }));
  assert.match(h, /Buse/);
  assert.match(h, /Couche 112 \/ 238/);
  assert.equal(pc.lang({ language: "pt-BR" }, {}), "pt");
  assert.equal(pc.lang({ language: "sr-Latn" }, {}), "sr-Latn");
  assert.equal(pc.intlLocale({ language: "pt" }, {}), "pt-PT");
});

test("helpers: filament colors, durations and temperatures", () => {
  assert.equal(pc.filamentColor("#2E9E5BFF"), "#2e9e5b");
  assert.equal(pc.filamentColor("#00000000"), "rgba(0, 0, 0, 0.00)");
  assert.equal(pc.filamentColor("nope"), null);
  assert.equal(pc.hoursOf({ state: "90", attributes: { unit_of_measurement: "min" } }), 1.5);
  assert.equal(pc.hoursOf({ state: "2", attributes: { unit_of_measurement: "h" } }), 2);
  assert.equal(pc.hoursOf({ state: "unknown", attributes: {} }), null);
  assert.equal(pc.fmtHours(1.5, "en"), "1 hr 30 min");
  assert.equal(pc.fmtTemp({ state: "212.6", attributes: { unit_of_measurement: "°C" } }, "en"), "213°C");
  assert.equal(pc.esc('<a href="x">'), "&lt;a href=&quot;x&quot;&gt;");
  assert.ok(NOW > 0);
});

test("the drawn printer's part grows with the progress", () => {
  const h = (pct) => Number(pc.printerSvg("printing", pct, "#fff").match(/<rect x="30" y="[\d.]+" width="20" height="(\d+)"/)[1]);
  assert.ok(h(10) < h(50) && h(50) < h(100));
  assert.doesNotMatch(pc.printerSvg("idle", 0, "#fff"), /class="part"/);
});

test("the illustrated header: printer on its bench, status and progress, brand badge, classic header with illustration: false", () => {
  const h = html(newCard());
  assert.match(h, /class="banner ph-printing anim-printing"/);
  assert.match(h, /<svg class="printer" x="126.4" y="8"/);
  assert.match(h, /class="ground"/);
  // The status pill on the title's line, in the icon's color; the ring shows the progress, so the subtitle names the
  // print (not the progress or the status again).
  assert.match(h, /<div class="tline">\s*<div class="name">X1 Carbon<\/div>\s*<span class="chip clickable active"[^>]*><span class="dot"><\/span><span class="chip-text">Printing<\/span>/);
  assert.match(h, /<div class="sub"[^>]*>Desk organizer<\/div>/);
  assert.doesNotMatch(h, /<div class="sub"[^>]*>47 %<\/div>/);
  assert.doesNotMatch(h, /Printing · 47 %/);
  assert.equal(h.match(/Desk organizer/g).length, 2, "the print's name once in the subtitle (text and tooltip), not again in the body");
  assert.match(h, /class="logo-link type-icon active"/);
  assert.match(h, /class="logo"/);
  assert.doesNotMatch(h, /class="header"/);
  assert.match(html(newCard({}, makeHass({ "sensor.x1_carbon_print_status": { state: "idle" } }))), /type-icon idle"/);
  const classic = html(newCard({ illustration: false }));
  assert.match(classic, /class="header"/);
  assert.doesNotMatch(classic, /class="banner/);
  const mini = html(newCard({}, makeHass(), pc.PrinterMiniCard));
  assert.match(mini, /class="banner has-zoom ph-printing/);
  assert.match(mini, /class="chip clickable active"/);
  // The compact mini card has no body for the print's name: its subtitle keeps the progress; expanded, it names the print.
  assert.match(mini, /<div class="sub"[^>]*>47 %<\/div>/);
  const zoomed = newCard({}, makeHass(), pc.PrinterMiniCard);
  zoomed._setZoom(true);
  assert.match(html(zoomed), /<div class="sub"[^>]*>Desk organizer<\/div>/);
});

test("the illustration's night: illustration_theme, else the dark mode alone", () => {
  const sun = (state) => ({ states: { "sun.sun": { state } }, themes: { darkMode: false } });
  assert.equal(pc.isNight(sun("below_horizon"), {}), false, "light theme after sunset: day");
  assert.equal(pc.isNight(sun("above_horizon"), {}), false);
  assert.equal(pc.isNight(sun("below_horizon"), { illustration_theme: "day" }), false);
  assert.equal(pc.isNight(sun("above_horizon"), { illustration_theme: "night" }), true);
  assert.equal(pc.isNight({ states: {}, themes: { darkMode: true } }, {}), true);
  const sunDark = (state) => ({ states: { "sun.sun": { state } }, themes: { darkMode: true } });
  assert.equal(pc.isNight(sunDark("above_horizon"), {}), true, "dark theme while the sun is up: night");
  assert.equal(pc.isNight(sunDark("below_horizon"), {}), true);
  assert.equal(pc.isNight(sun("above_horizon"), { illustration_theme: "auto" }), false, "light theme while the sun is up: day");
  assert.equal(pc.isNight(sunDark("above_horizon"), { illustration_theme: "day" }), false);
  assert.equal(pc.isNight(sun("above_horizon"), { illustration_theme: "night" }), true);
  assert.equal(pc.isNight({ states: { "sun.sun": { state: "unavailable" } }, themes: { darkMode: false } }, {}), false);
  assert.match(html(newCard({ illustration_theme: "night" })), /class="banner night /);
});

test("the power button turns the plug on at once, off only once confirmed, and stays while the printer is offline", () => {
  const plug = (state) => ({ "switch.printer_plug": { entity_id: "switch.printer_plug", state, attributes: {} } });
  assert.doesNotMatch(html(newCard()), /data-action="power"/, "no power_entity: no button");
  const hass = makeHass(plug("on"));
  const card = newCard({ power_entity: "switch.printer_plug" }, hass);
  assert.match(html(card), /data-action="power" data-entity="switch.printer_plug"[^>]*aria-pressed="true"/);
  click(card, { action: "power", entity: "switch.printer_plug" });
  assert.equal(hass.calls.length, 0);
  assert.match(html(card), /Turn X1 Carbon off\? The print under way will be lost\./);
  click(card, { action: "confirm_ok" });
  assert.deepEqual(hass.calls, [["switch", "turn_off", { entity_id: "switch.printer_plug" }]]);
  const off = makeHass({ ...plug("off"), "sensor.x1_carbon_print_status": { state: "unavailable" } });
  const mini = newCard({ power_entity: "switch.printer_plug" }, off, pc.PrinterMiniCard);
  assert.match(html(mini), /data-action="power"[^>]*aria-pressed="false"/);
  click(mini, { action: "power", entity: "switch.printer_plug" });
  assert.deepEqual(off.calls, [["switch", "turn_on", { entity_id: "switch.printer_plug" }]]);
});

test("the stage: the preview filled up to the layer printed, the camera at the button, live through Home Assistant's player", () => {
  const card = newCard();
  let h = html(card);
  // Layer 112 of 238: 52.9 % of the preview still to print, faded, under the level line.
  assert.match(h, /class="pbox" data-ratio="image.x1_carbon_cover_image" style="--ar:1;--todo:52.9%"/);
  assert.match(h, /class="pic todo"[\s\S]*class="pic done"[\s\S]*class="level"/);
  assert.match(h, /data-action="media_view" data-view="camera"[^>]*aria-label="Show the camera"/);
  assert.doesNotMatch(h, /<slot name="live">/);
  // The camera, at the button: its snapshot until Home Assistant's player is there, then the player in the slot.
  click(card, { action: "media_view", view: "camera" });
  h = html(card);
  assert.match(h, /class="media camera clickable"/);
  assert.match(h, /<slot name="live"><\/slot>/);
  assert.doesNotMatch(h, /class="tag"/, "no Live tag while only the snapshot shows");
  assert.match(h, /data-view="print"[^>]*aria-label="Show the print"/);
  assert.match(h, /data-entity="camera.x1_carbon_camera" title="Open the camera"/);
  // Snapshots only: no slot.
  assert.doesNotMatch(html(newCard({ media_view: "camera", camera_view: "auto" })), /<slot name="live">/);
  // Finished: the whole preview, no level line.
  const done = html(newCard({ show_camera: false }, makeHass(finished)));
  assert.match(done, /--todo:0%"><img class="pic"/);
  assert.doesNotMatch(done, /class="level"/);
  // No picture at all: the drawn printer, animated by the phase.
  assert.match(html(newCard({ show_camera: false, show_thumbnail: false })), /class="media art clickable"[^>]*><svg class="printer"/);
});

test("the live view is Home Assistant's camera player, kept in the light DOM and stopped once off the page", () => {
  const added = [];
  class Stream {
    constructor() {
      this.dataset = {};
      this.attributes = {};
    }
    setAttribute(k, v) {
      this.attributes[k] = v;
    }
    remove() {
      this.removed = true;
    }
  }
  // A sandbox of its own: the player defined here stays out of the other tests.
  const own = load();
  own.window.customElements.define("ha-camera-stream", Stream);
  const card = new own.PrinterCard();
  card.appendChild = (el) => added.push(el);
  card.setConfig({ device: "X1 Carbon", media_view: "camera" });
  card.hass = makeHass();
  assert.equal(added.length, 1);
  const el = added[0];
  assert.equal(el.slot, "live");
  assert.equal(el.stateObj.entity_id, "camera.x1_carbon_camera");
  assert.equal(el.muted, true);
  assert.match(html(card), /class="tag"><span class="rec"><\/span>Live/);
  click(card, { action: "media_view", view: "print" });
  assert.equal(el.removed, true, "back to the print: the player stops");
  click(card, { action: "media_view", view: "camera" });
  assert.equal(added.length, 2);
  card.disconnectedCallback();
  assert.equal(added[1].removed, true, "off the page: the player stops");
});

test("the snapshot refreshes every 10 s while it shows, and stops with the player or off the page", () => {
  const sb = load();
  const card = new sb.PrinterCard();
  card.setConfig({ device: "X1 Carbon", media_view: "camera", camera_view: "auto" });
  card.hass = makeHass();
  assert.ok(card._snapTimer, "camera_view: auto starts the refresh");
  assert.equal(sb.window.intervals.has(card._snapTimer), true);
  click(card, { action: "media_view", view: "print" });
  assert.equal(card._snapTimer, null, "back to the print: no refresh");
  click(card, { action: "media_view", view: "camera" });
  const timer = card._snapTimer;
  card.disconnectedCallback();
  assert.equal(sb.window.intervals.has(timer), false, "off the page: no refresh");
});

test("the preview's shape is kept per entity, whatever its access token", () => {
  const card = newCard({ show_camera: false });
  const listener = card.shadowRoot.listeners.load;
  const img = { classList: { contains: (c) => c === "pic" }, closest: () => ({ dataset: { ratio: "image.x1_carbon_cover_image" } }), naturalWidth: 160, naturalHeight: 90 };
  listener({ target: img });
  assert.match(html(card), /data-ratio="image.x1_carbon_cover_image" style="--ar:1.778;/);
  const id = "image.x1_carbon_cover_image";
  const hass = makeHass();
  card.hass = { ...hass, states: { ...hass.states, [id]: { ...hass.states[id], attributes: { entity_picture: "/api/image_proxy/x?token=new" } } } };
  assert.match(html(card), /--ar:1.778;/, "a new token keeps the shape");
});

test("a config still folding the former camera section works, and preparing before the first percent waits", () => {
  const card = newCard({ collapsed: ["camera", "job"] });
  assert.deepEqual(plain(card._config.collapsed), ["job"]);
  assert.deepEqual(plain(newCard({ collapsed: "camera" })._config.collapsed), []);
  const prep = html(newCard({}, makeHass({ ...preparing, "sensor.x1_carbon_print_progress": { state: "0" } })));
  assert.match(prep, /<div class="big word">Preparing<\/div>/);
  assert.match(prep, /class="pbar waiting"><div style="width:100%">/);
});
