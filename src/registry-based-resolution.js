// ---------------------------------------------------------------------------
// Registry-based resolution
// ---------------------------------------------------------------------------
import { BRANDS, KEYS, KEY_DOMAINS, KLIPPER_OVER, KLIPPER_PHASES, NAMES, PHASES } from "./integrations.js";
import { valid } from "./helpers.js";

// The text an entity is recognized by: its friendly name and its entity id, lower case, words apart.
export const namesOf = (hass, e) => {
  const fn = hass.states?.[e.entity_id]?.attributes?.friendly_name;
  return [fn, e.entity_id.split(".")[1]].filter(Boolean).map((n) => String(n).toLowerCase().replace(/[_\s]+/g, " ").trim());
};

export const keyOf = (hass, e, domain) => {
  const byKey = KEYS[e.platform]?.[e.translation_key];
  if (byKey) return byKey;
  if (e.platform === "bambu_lab" && e.translation_key === "tray") return "#tray";
  if (e.platform === "bambu_lab" && e.translation_key === "external_spool") return "#spool";
  for (const [d, re, key] of NAMES[e.platform] || []) {
    if (d === domain && namesOf(hass, e).some((n) => re.test(n))) return key;
  }
  // Any other light of the printer (Moonraker LEDs, Bambu Lab heatbed light) only when it names none of its own.
  if (domain === "light") return "#light";
  return null;
};

export const _cache = new WeakMap();

/**
 * The printers of hass.entities / hass.devices: [{ id, name, model, platform, e: { key: entity_id }, ams: [{ id, name,
 * e, trays: [entity_id] }], spools: [entity_id] }]. Bambu Lab AMS units are devices of their own, linked to their
 * printer (via_device_id): their trays and humidity are merged into it, as are the external spools (devices too).
 */
export const resolve = (hass) => {
  if (!hass?.entities || !hass.devices) return null;
  const cached = _cache.get(hass.entities);
  if (cached && cached.devices === hass.devices) return cached.model;
  const byDevice = new Map();
  for (const e of Object.values(hass.entities)) {
    if (!(e.platform in BRANDS) || !e.device_id || e.hidden) continue;
    const domain = e.entity_id.split(".")[0];
    const key = keyOf(hass, e, domain);
    if (!key || (KEY_DOMAINS[key] && !KEY_DOMAINS[key].includes(domain))) continue;
    const item = byDevice.get(e.device_id) || { platform: e.platform, e: {}, trays: [], spools: [] };
    if (key === "#tray") item.trays.push(e.entity_id);
    else if (key === "#spool") item.spools.push(e.entity_id);
    else if (key === "#light") item.light ??= e.entity_id;
    else if (!(key in item.e)) item.e[key] = e.entity_id;
    byDevice.set(e.device_id, item);
  }
  const devName = (d) => d.name_by_user || d.name || "";
  const printers = [];
  const units = [];
  for (const [id, item] of byDevice) {
    const d = hass.devices[id];
    if (!d) continue;
    if (item.light && !item.e.light) item.e.light = item.light;
    if (item.e.status || item.e.progress || item.e.printer_state) {
      printers.push({ id, name: devName(d), model: d.model || "", platform: item.platform, e: item.e, trays: item.trays, spools: item.spools, ams: [] });
    } else if (item.trays.length || item.spools.length) {
      units.push({ id, name: devName(d), via: d.via_device_id, platform: item.platform, e: item.e, trays: item.trays, spools: item.spools });
    }
  }
  printers.sort((a, b) => a.name.localeCompare(b.name));
  for (const u of units.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))) {
    const owner = printers.find((p) => p.id === u.via) || printers.find((p) => p.platform === u.platform);
    if (!owner) continue;
    // Bambu Lab external spools are devices of their own too (no tray): they join the printer's spools.
    owner.spools.push(...u.spools);
    if (u.trays.length) owner.ams.push(u);
  }
  const model = { printers };
  _cache.set(hass.entities, { devices: hass.devices, model });
  return model;
};

export const listPrinters = (hass) => (resolve(hass)?.printers || []).map((p) => ({ value: p.id, label: p.name }));

// The printer of a config, with the entities set by hand (`entities`, `camera_entity`, `light_entity`) on top.
export const findPrinter = (hass, config) => {
  const m = resolve(hass);
  if (!m) return { error: "no_registry" };
  if (!m.printers.length) return { error: "no_device" };
  const base = config.device ? m.printers.find((p) => p.id === config.device || p.name === config.device) : m.printers[0];
  if (!base) return { error: "unknown_device" };
  const extra = { ...(config.entities && typeof config.entities === "object" ? config.entities : {}) };
  if (config.camera_entity) extra.camera = config.camera_entity;
  if (config.light_entity) extra.light = config.light_entity;
  return { dev: Object.keys(extra).length ? { ...base, e: { ...base.e, ...extra } } : base };
};

// Phase of the printer: printing, preparing, paused, attention, stopping, finished, failed, cancelled, error, idle,
// offline or unknown.
export const phaseOf = (dev, states) => {
  const s = states[dev.e.status];
  const table = PHASES[dev.platform] || {};
  const k = states[dev.e.printer_state];
  const klipper = valid(k) ? KLIPPER_PHASES[String(k.state).toLowerCase()] : undefined;
  if (s?.state === "unavailable") return "offline";
  if (KLIPPER_OVER.has(klipper)) return klipper;
  if (valid(s)) return table[String(s.state).toLowerCase()] ?? "unknown";
  if (k?.state === "unavailable") return "offline";
  return klipper ?? "unknown";
};
