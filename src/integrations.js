// ---------------------------------------------------------------------------
// Integrations
// ---------------------------------------------------------------------------
import { IMG_LOGO_BAMBU, IMG_LOGO_MOONRAKER, IMG_LOGO_OCTOPRINT, IMG_LOGO_PRUSALINK } from "./core.js";

// Brand of each supported integration (platform): name, site, logo and accent color of the buttons.
export const BRANDS = {
  bambu_lab: { name: "Bambu Lab", site: "https://bambulab.com", logo: IMG_LOGO_BAMBU, accent: "#00ae42" },
  octoprint: { name: "OctoPrint", site: "https://octoprint.org", logo: IMG_LOGO_OCTOPRINT, accent: "#13a538" },
  moonraker: { name: "Moonraker", site: "https://moonraker.readthedocs.io", logo: IMG_LOGO_MOONRAKER, accent: "#d32f2f" },
  prusalink: { name: "PrusaLink", site: "https://www.prusa3d.com", logo: IMG_LOGO_PRUSALINK, accent: "#fa6831" },
};

// translation_key of an entity → what the card calls it. Bambu Lab trays and external spools share one
// translation key per kind: they are collected in lists (see resolve).
export const KEYS = {
  bambu_lab: {
    print_status: "status",
    stage: "stage",
    print_progress: "progress",
    remaining_time: "remaining",
    end_time: "end_time",
    start_time: "start_time",
    current_layer: "layer",
    total_layers: "total_layers",
    nozzle_temp: "nozzle",
    target_nozzle_temp: "nozzle_target",
    left_nozzle_temp: "nozzle_left",
    left_target_nozzle_temp: "nozzle_left_target",
    right_nozzle_temp: "nozzle_right",
    right_target_nozzle_temp: "nozzle_right_target",
    bed_temp: "bed",
    target_bed_temp: "bed_target",
    chamber_temp: "chamber",
    target_chamber_temp: "chamber_target",
    subtask_name: "task",
    gcode_file: "file",
    cover_image: "cover",
    camera: "camera",
    p1p_camera: "camera",
    pause: "pause",
    resume: "resume",
    stop: "stop",
    chamber_light: "light",
    camera_light: "light",
    print_error: "error",
    hms_errors: "hms",
    print_weight: "weight",
    print_length: "length",
    speed_profile: "speed",
    humidity_index: "humidity_index",
    humidity: "humidity",
    ams_temp: "ams_temp",
  },
  octoprint: { status: "status", file_name: "file" },
  moonraker: {},
  prusalink: {
    printer_state: "status",
    progress: "progress",
    print_start: "start_time",
    print_finish: "end_time",
    nozzle_temperature: "nozzle",
    nozzle_target_temperature: "nozzle_target",
    heatbed_temperature: "bed",
    heatbed_target_temperature: "bed_target",
    filename: "file",
    job_preview: "cover",
    pause_job: "pause",
    resume_job: "resume",
    cancel_job: "stop",
    continue_job: "continue",
    print_speed: "speed",
    material: "material",
  },
};

// OctoPrint and Moonraker give most of their entities no translation key: they are told apart by their name (the
// end of the friendly name, or of the entity id), which these integrations write in English.
// [domain, pattern, key]
export const NAMES = {
  octoprint: [
    ["sensor", /current state$/, "status"],
    ["sensor", /job percentage$/, "progress"],
    ["sensor", /estimated finish time$/, "end_time"],
    ["sensor", /start time$/, "start_time"],
    ["sensor", /file name$/, "file"],
    ["sensor", /actual tool0 temp$/, "nozzle"],
    ["sensor", /target tool0 temp$/, "nozzle_target"],
    ["sensor", /actual bed temp$/, "bed"],
    ["sensor", /target bed temp$/, "bed_target"],
    ["sensor", /actual chamber temp$/, "chamber"],
    ["sensor", /target chamber temp$/, "chamber_target"],
    ["button", /pause job$/, "pause"],
    ["button", /resume job$/, "resume"],
    ["button", /stop job$/, "stop"],
    ["binary_sensor", /printing error$/, "error"],
    ["camera", /./, "camera"],
  ],
  moonraker: [
    ["sensor", /current print state$/, "status"],
    ["sensor", /printer state$/, "printer_state"],
    ["sensor", /(^| )progress$/, "progress"],
    ["sensor", /(^| )print time left$/, "remaining"],
    ["sensor", /print eta$/, "end_time"],
    ["sensor", /current layer$/, "layer"],
    ["sensor", /total layer$/, "total_layers"],
    ["sensor", /extruder temperature$/, "nozzle"],
    ["number", /extruder target$/, "nozzle_target"],
    ["sensor", /bed temperature$/, "bed"],
    ["number", /bed target$/, "bed_target"],
    ["sensor", /chamber temp(erature)?$/, "chamber"],
    ["number", /chamber target$/, "chamber_target"],
    ["sensor", /(^| )filename$/, "file"],
    ["sensor", /filament used$/, "length"],
    ["sensor", /print speed$/, "speed"],
    ["button", /pause print$/, "pause"],
    ["button", /resume print$/, "resume"],
    ["button", /cancel print$/, "stop"],
    ["camera", /thumbnail$/, "cover"],
    ["camera", /./, "camera"],
  ],
};

// Domains each key may come from: a key found on another domain is left out.
export const KEY_DOMAINS = { cover: ["image", "camera"], camera: ["camera", "image"], light: ["light", "switch"], pause: ["button"], resume: ["button"], stop: ["button"], continue: ["button"] };

// State of the status entity → phase of the printer, per integration.
export const PHASES = {
  bambu_lab: { running: "printing", pause: "paused", prepare: "preparing", slicing: "preparing", init: "preparing", finish: "finished", failed: "failed", idle: "idle", offline: "offline" },
  octoprint: {
    printing: "printing",
    printing_sd: "printing",
    printing_streaming: "printing",
    finishing: "printing",
    resuming: "printing",
    starting: "preparing",
    starting_sd: "preparing",
    starting_streaming: "preparing",
    transferring_file: "preparing",
    connecting: "preparing",
    open_serial: "preparing",
    detect_serial: "preparing",
    pausing: "paused",
    paused: "paused",
    cancelling: "stopping",
    operational: "idle",
    offline: "offline",
    offline_after_error: "error",
    error: "error",
  },
  moonraker: { standby: "idle", printing: "printing", paused: "paused", complete: "finished", cancelled: "cancelled", error: "error" },
  prusalink: { idle: "idle", ready: "idle", busy: "preparing", printing: "printing", paused: "paused", finished: "finished", stopped: "cancelled", error: "error", attention: "attention" },
};
// Moonraker's printer state (Klipper itself): used when there is no print state, and over it when Klipper is shut down
// or in error (the print state then still shows the job it stopped).
export const KLIPPER_PHASES = { ready: "idle", startup: "preparing", shutdown: "offline", error: "error" };
export const KLIPPER_OVER = new Set(["offline", "error"]);

export const PHASE_CLASS = {
  printing: "active",
  preparing: "active",
  paused: "warn",
  attention: "warn",
  stopping: "warn",
  finished: "ok",
  idle: "idle",
  cancelled: "idle",
  unknown: "idle",
  failed: "crit",
  error: "crit",
  offline: "crit",
};
// Phases with a print job under way: progress, remaining time and the pause / resume / stop buttons.
export const JOB_PHASES = new Set(["printing", "preparing", "paused", "attention", "stopping"]);
// Animation of the progress ring, per phase (see RING_CSS).
export const RING_ANIM = { printing: "anim-printing", preparing: "anim-preparing", paused: "anim-paused", attention: "anim-paused" };

export const DEFAULT_COLLAPSED = ["job"];
export const SECTIONS = ["ams", "job", "camera"];
