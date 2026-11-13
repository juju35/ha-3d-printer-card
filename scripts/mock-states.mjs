// Mock Home Assistant registries and states shaped like the Bambu Lab (an X1 Carbon with its AMS), OctoPrint,
// Moonraker (a Klipper printer) and PrusaLink integrations, used by the tests and to render the screenshots.
// Every time is relative to NOW, the moment the screenshot harness freezes the page clock at, so the captures do not
// change from one run to the next. Names are neutral.
export const NOW = Date.parse("2026-06-12T13:05:00Z");
export const states = {};
export const entities = {};
export const devices = {};

const device = (id, name, model, platform, via = null) =>
  (devices[id] = { id, name, model, identifiers: [[platform, id]], name_by_user: null, via_device_id: via });
const entity = (entity_id, device_id, platform, translation_key, state, attributes = {}) => {
  entities[entity_id] = { entity_id, device_id, platform, translation_key: translation_key || null };
  states[entity_id] = { entity_id, state: String(state), attributes };
};
const at = (minutes) => new Date(NOW + minutes * 60e3).toISOString();
const svg = (body) => `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${body}</svg>`).toString("base64")}`;

// Plate previews of the print files, as the integrations show them.
const PREVIEW_ORGANIZER = svg(`<rect width="120" height="120" fill="#2c3440"/><ellipse cx="60" cy="92" rx="44" ry="12" fill="#1f252e"/>
  <path d="M24 52l36-18 36 18v30l-36 18-36-18z" fill="#2e9e5b"/><path d="M24 52l36 18 36-18-36-18z" fill="#4cc27c"/><path d="M60 70v30l36-18V52z" fill="#25834b"/>
  <path d="M38 52l22 11 22-11-22-11z" fill="#1b5e36"/><path d="M47 47l13 6.5 13-6.5" fill="none" stroke="#4cc27c" stroke-width="2"/>`);
const PREVIEW_DUCT = svg(`<rect width="120" height="120" fill="#2c3440"/><ellipse cx="60" cy="94" rx="40" ry="10" fill="#1f252e"/>
  <path d="M30 88V46q0-14 14-14h32q14 0 14 14v42z" fill="#d84a3a"/><path d="M40 88V50q0-8 8-8h24q8 0 8 8v38z" fill="#9e2f24"/><rect x="30" y="84" width="60" height="6" rx="2" fill="#f06a55"/>`);
const PREVIEW_CLIP = svg(`<rect width="120" height="120" fill="#2c3440"/><ellipse cx="60" cy="90" rx="38" ry="10" fill="#1f252e"/>
  <path d="M34 84V54a26 26 0 0 1 52 0v30H74V54a14 14 0 0 0-28 0v30z" fill="#f28b30"/><path d="M34 84h12v4H34zM74 84h12v4H74z" fill="#c86a1c"/>`);
// Camera picture of the build plate, 16:9.
const CAMERA_VIEW = `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90"><rect width="160" height="90" fill="#1b1f24"/>
  <path d="M0 72h160v18H0z" fill="#2a3038"/><rect x="18" y="68" width="124" height="6" rx="1" fill="#4a525c"/>
  <rect x="66" y="46" width="28" height="22" rx="2" fill="#2e9e5b"/><path d="M66 50h28M66 55h28M66 60h28" stroke="#4cc27c" stroke-width=".8"/>
  <rect x="10" y="14" width="140" height="4" fill="#5d6670"/><rect x="88" y="12" width="14" height="14" rx="2" fill="#8a949f"/><path d="M93 26h4l-2 5z" fill="#cfd4da"/>
  <circle cx="8" cy="8" r="2.4" fill="#e5484d"/></svg>`).toString("base64")}`;

// Bambu Lab X1 Carbon with an AMS (ha-bambulab)
device("x1c", "X1 Carbon", "X1C", "bambu_lab");
const bambu = (id, key, state, attributes) => entity(id, "x1c", "bambu_lab", key, state, attributes);
bambu("sensor.x1_carbon_print_status", "print_status", "running");
bambu("sensor.x1_carbon_current_stage", "stage", "printing");
bambu("sensor.x1_carbon_print_progress", "print_progress", "47", { unit_of_measurement: "%" });
bambu("sensor.x1_carbon_remaining_time", "remaining_time", "83", { unit_of_measurement: "min", device_class: "duration" });
bambu("sensor.x1_carbon_end_time", "end_time", at(83), { device_class: "timestamp" });
bambu("sensor.x1_carbon_start_time", "start_time", at(-74), { device_class: "timestamp" });
bambu("sensor.x1_carbon_current_layer", "current_layer", "112");
bambu("sensor.x1_carbon_total_layer_count", "total_layers", "238");
bambu("sensor.x1_carbon_nozzle_temperature", "nozzle_temp", "220", { unit_of_measurement: "°C" });
bambu("sensor.x1_carbon_nozzle_target_temperature", "target_nozzle_temp", "220", { unit_of_measurement: "°C" });
bambu("sensor.x1_carbon_bed_temperature", "bed_temp", "55", { unit_of_measurement: "°C" });
bambu("sensor.x1_carbon_target_bed_temperature", "target_bed_temp", "55", { unit_of_measurement: "°C" });
bambu("sensor.x1_carbon_chamber_temperature", "chamber_temp", "38", { unit_of_measurement: "°C" });
bambu("sensor.x1_carbon_task_name", "subtask_name", "Desk organizer");
bambu("sensor.x1_carbon_gcode_filename", "gcode_file", "desk_organizer.gcode.3mf");
bambu("sensor.x1_carbon_speed_profile", "speed_profile", "standard");
bambu("sensor.x1_carbon_print_weight", "print_weight", "86.4", { unit_of_measurement: "g" });
bambu("sensor.x1_carbon_print_length", "print_length", "28.91", { unit_of_measurement: "m" });
bambu("binary_sensor.x1_carbon_print_error", "print_error", "off");
bambu("binary_sensor.x1_carbon_hms_errors", "hms_errors", "off");
bambu("button.x1_carbon_pause_printing", "pause", "unknown");
// Bambu Lab makes a button unavailable when the printer cannot take it: no Resume while running.
bambu("button.x1_carbon_resume_printing", "resume", "unavailable");
bambu("button.x1_carbon_stop_printing", "stop", "unknown");
bambu("light.x1_carbon_chamber_light", "chamber_light", "on");
bambu("image.x1_carbon_cover_image", "cover_image", at(-74), { entity_picture: PREVIEW_ORGANIZER });
bambu("camera.x1_carbon_camera", "camera", "idle", { entity_picture: CAMERA_VIEW });
// The external spool is a device of its own, linked to the printer, like the AMS.
device("x1c_spool", "X1 Carbon External Spool", "External Spool", "bambu_lab", "x1c");
entity("sensor.x1_carbon_external_spool", "x1c_spool", "bambu_lab", "external_spool", "Generic TPU", {
  active: false, color: "#3A3A3AFF", empty: false, remain: -1, type: "TPU", name: "Generic TPU",
});
device("ams1", "AMS 1", "AMS", "bambu_lab", "x1c");
const ams = (id, key, state, attributes) => entity(id, "ams1", "bambu_lab", key, state, attributes);
ams("sensor.x1_carbon_ams_1_humidity_index", "humidity_index", "2");
ams("sensor.x1_carbon_ams_1_humidity", "humidity", "18", { unit_of_measurement: "%" });
ams("sensor.x1_carbon_ams_1_temperature", "ams_temp", "27", { unit_of_measurement: "°C" });
for (const [n, name, type, color, remain, active, empty] of [
  [1, "Bambu PLA Basic", "PLA", "#2E9E5BFF", 64, true, false],
  [2, "Bambu PLA Matte", "PLA", "#F4F1EAFF", 92, false, false],
  [3, "Bambu PETG HF", "PETG", "#F28B30FF", 18, false, false],
  [4, "Empty", "", "#00000000", 0, false, true],
]) ams(`sensor.x1_carbon_ams_1_tray_${n}`, "tray", name, { slot: n, name, type, color, remain, active, empty });

// OctoPrint (core): most entities have no translation key, and are known by their name
device("octo", "Workshop printer", "OctoPrint", "octoprint");
const octo = (id, key, state, attributes = {}) =>
  entity(id, "octo", "octoprint", key, state, { friendly_name: `OctoPrint ${id.split(".")[1].replace(/^octoprint_/, "").replace(/_/g, " ")}`, ...attributes });
octo("sensor.octoprint_current_state", "status", "printing");
octo("sensor.octoprint_job_percentage", null, "72.4", { unit_of_measurement: "%" });
octo("sensor.octoprint_estimated_finish_time", null, at(38), { device_class: "timestamp" });
octo("sensor.octoprint_start_time", null, at(-98), { device_class: "timestamp" });
octo("sensor.octoprint_actual_tool0_temp", null, "212.3", { unit_of_measurement: "°C" });
octo("sensor.octoprint_target_tool0_temp", null, "215", { unit_of_measurement: "°C" });
octo("sensor.octoprint_actual_bed_temp", null, "59.8", { unit_of_measurement: "°C" });
octo("sensor.octoprint_target_bed_temp", null, "60", { unit_of_measurement: "°C" });
octo("sensor.octoprint_current_file", "file_name", "phone_stand.gcode");
octo("button.octoprint_pause_job", null, "unknown");
octo("button.octoprint_resume_job", null, "unknown");
octo("button.octoprint_stop_job", null, "unknown");
octo("binary_sensor.octoprint_printing_error", null, "off");
octo("camera.octoprint_camera", null, "idle", { entity_picture: CAMERA_VIEW });

// Moonraker / Klipper (custom): entity names under the printer's device name
device("voron", "Voron 2.4", "Klipper", "moonraker");
const moon = (suffix, domain, name, state, attributes = {}) =>
  entity(`${domain}.voron_2_4_${suffix}`, "voron", "moonraker", null, state, { friendly_name: `Voron 2.4 ${name}`, ...attributes });
moon("current_print_state", "sensor", "Current Print State", "printing");
moon("printer_state", "sensor", "Printer State", "ready");
moon("progress", "sensor", "Progress", "23", { unit_of_measurement: "%" });
moon("print_time_left", "sensor", "Print Time Left", "2.6", { unit_of_measurement: "h", device_class: "duration" });
moon("print_eta", "sensor", "Print ETA", at(156), { device_class: "timestamp" });
moon("current_layer", "sensor", "Current Layer", "41");
moon("total_layer", "sensor", "Total Layer", "180");
moon("extruder_temperature", "sensor", "Extruder Temperature", "245.1", { unit_of_measurement: "°C" });
moon("extruder_target", "number", "Extruder Target", "245", { unit_of_measurement: "°C" });
moon("bed_temperature", "sensor", "Bed Temperature", "99.6", { unit_of_measurement: "°C" });
moon("bed_target", "number", "Bed Target", "100", { unit_of_measurement: "°C" });
moon("chamber_temperature", "sensor", "Chamber Temperature", "47.2", { unit_of_measurement: "°C" });
moon("filename", "sensor", "Filename", "fan_duct_v3.gcode");
moon("filament_used", "sensor", "Filament Used", "4.21", { unit_of_measurement: "m" });
moon("print_speed", "sensor", "Print Speed", "150", { unit_of_measurement: "mm/s" });
moon("pause_print", "button", "Pause Print", "unknown");
moon("resume_print", "button", "Resume Print", "unknown");
moon("cancel_print", "button", "Cancel Print", "unknown");
moon("caselight", "light", "Caselight", "off");
moon("thumbnail", "camera", "Thumbnail", "idle", { entity_picture: PREVIEW_DUCT });

// PrusaLink (core)
device("mk4", "Prusa MK4", "MK4", "prusalink");
const prusa = (id, key, state, attributes) => entity(id, "mk4", "prusalink", key, state, attributes);
prusa("sensor.prusa_mk4", "printer_state", "paused");
prusa("sensor.prusa_mk4_progress", "progress", "61", { unit_of_measurement: "%" });
prusa("sensor.prusa_mk4_print_start", "print_start", at(-64), { device_class: "timestamp" });
prusa("sensor.prusa_mk4_print_finish", "print_finish", at(52), { device_class: "timestamp" });
prusa("sensor.prusa_mk4_nozzle_temperature", "nozzle_temperature", "215", { unit_of_measurement: "°C" });
prusa("sensor.prusa_mk4_nozzle_target_temperature", "nozzle_target_temperature", "215", { unit_of_measurement: "°C" });
prusa("sensor.prusa_mk4_heatbed_temperature", "heatbed_temperature", "60", { unit_of_measurement: "°C" });
prusa("sensor.prusa_mk4_heatbed_target_temperature", "heatbed_target_temperature", "60", { unit_of_measurement: "°C" });
prusa("sensor.prusa_mk4_filename", "filename", "cable_clip.bgcode");
prusa("sensor.prusa_mk4_material", "material", "PETG");
prusa("sensor.prusa_mk4_print_speed", "print_speed", "100", { unit_of_measurement: "%" });
prusa("button.prusa_mk4_pause_job", "pause_job", "unavailable");
prusa("button.prusa_mk4_resume_job", "resume_job", "unknown");
prusa("button.prusa_mk4_cancel_job", "cancel_job", "unknown");
prusa("button.prusa_mk4_continue_job", "continue_job", "unavailable");
prusa("camera.prusa_mk4_preview", "job_preview", "idle", { entity_picture: PREVIEW_CLIP });

// State overrides for the animated states of the X1 Carbon (one GIF each).
const s = (id, state, attributes) => ({ [id]: { ...states[id], state: String(state), ...(attributes ? { attributes: { ...states[id].attributes, ...attributes } } : {}) } });
export const printing = {};
export const preparing = {
  ...s("sensor.x1_carbon_print_status", "prepare"),
  ...s("sensor.x1_carbon_current_stage", "heatbed_preheating"),
  ...s("sensor.x1_carbon_print_progress", "0"),
  ...s("sensor.x1_carbon_current_layer", "0"),
  ...s("sensor.x1_carbon_remaining_time", "157"),
  ...s("sensor.x1_carbon_end_time", at(157)),
  ...s("sensor.x1_carbon_nozzle_temperature", "142"),
  ...s("sensor.x1_carbon_bed_temperature", "41"),
  ...s("sensor.x1_carbon_chamber_temperature", "29"),
  // Neither Pause nor Stop while heating and levelling.
  ...s("button.x1_carbon_pause_printing", "unavailable"),
  ...s("button.x1_carbon_stop_printing", "unavailable"),
};
export const paused = {
  ...s("sensor.x1_carbon_print_status", "pause"),
  ...s("sensor.x1_carbon_current_stage", "paused_user"),
  ...s("button.x1_carbon_pause_printing", "unavailable"),
  ...s("button.x1_carbon_resume_printing", "unknown"),
};
export const finished = {
  ...s("sensor.x1_carbon_print_status", "finish"),
  ...s("sensor.x1_carbon_current_stage", "idle"),
  ...s("sensor.x1_carbon_print_progress", "100"),
  ...s("sensor.x1_carbon_current_layer", "238"),
  ...s("sensor.x1_carbon_remaining_time", "0"),
  ...s("sensor.x1_carbon_end_time", at(-25)),
  ...s("sensor.x1_carbon_nozzle_target_temperature", "0"),
  ...s("sensor.x1_carbon_target_bed_temperature", "0"),
  ...s("sensor.x1_carbon_nozzle_temperature", "64"),
  ...s("sensor.x1_carbon_bed_temperature", "41"),
};
export const failed = {
  ...s("sensor.x1_carbon_print_status", "failed"),
  ...s("binary_sensor.x1_carbon_hms_errors", "on", { "1-Error": "AMS slot 3 ran out of filament", "1-Severity": "serious" }),
  ...s("binary_sensor.x1_carbon_print_error", "on"),
};
