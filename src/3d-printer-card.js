/*
 * 3D Printer Card for Home Assistant
 * https://github.com/juju35/ha-3d-printer-card
 *
 * Lovelace cards for 3D printers, whatever the integration: Bambu Lab (https://github.com/greghesp/ha-bambulab),
 * OctoPrint (https://www.home-assistant.io/integrations/octoprint/), Moonraker / Klipper
 * (https://github.com/marcolivierarsenault/moonraker-home-assistant) or PrusaLink
 * (https://www.home-assistant.io/integrations/prusalink/).
 * Entities are resolved through the entity and device registries (platform, translation_key or, for the
 * integrations without translation keys, the entity name), so they work whatever the entity ids.
 */

const VERSION = "__VERSION__";
const IMG_LOGO_BAMBU = "__IMG_LOGO_BAMBU__";
const IMG_LOGO_OCTOPRINT = "__IMG_LOGO_OCTOPRINT__";
const IMG_LOGO_MOONRAKER = "__IMG_LOGO_MOONRAKER__";
const IMG_LOGO_PRUSALINK = "__IMG_LOGO_PRUSALINK__";

// Material Design Icons (https://pictogrammers.com/library/mdi/), Apache 2.0.
const ICONS = {
  printer: "M19,6A1,1 0 0,0 20,5A1,1 0 0,0 19,4A1,1 0 0,0 18,5A1,1 0 0,0 19,6M19,2A3,3 0 0,1 22,5V11H18V7H6V11H2V5A3,3 0 0,1 5,2H19M18,18.25C18,18.63 17.79,18.96 17.47,19.13L12.57,21.82C12.4,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L6.53,19.13C6.21,18.96 6,18.63 6,18.25V13C6,12.62 6.21,12.29 6.53,12.12L11.43,9.68C11.59,9.56 11.79,9.5 12,9.5C12.21,9.5 12.4,9.56 12.57,9.68L17.47,12.12C17.79,12.29 18,12.62 18,13V18.25M12,11.65L9.04,13L12,14.6L14.96,13L12,11.65M8,17.66L11,19.29V16.33L8,14.71V17.66M16,17.66V14.71L13,16.33V19.29L16,17.66Z",
  nozzle: "M7,2H17V8H19V13H16.5L13,17H11L7.5,13H5V8H7V2M10,22H2V20H10A1,1 0 0,0 11,19V18H13V19A3,3 0 0,1 10,22Z",
  nozzle_heat: "M4 2H14V7H16V13H13.5L10 17H8L4.5 13H2V7H4V2M23 14.5L21.6 16.7L23 18.9L21 22L19.2 21.1L20.7 18.9L19.2 16.7L21.2 13.6L23 14.5M18.7 14.5L17.2 16.7L18.7 18.9L16.7 22L14.9 21.1L16.3 18.9L14.9 16.7L16.9 13.6L18.7 14.5",
  bed: "M7.95,3L6.53,5.19L7.95,7.4H7.94L5.95,10.5L4.22,9.6L5.64,7.39L4.22,5.19L6.22,2.09L7.95,3M13.95,2.89L12.53,5.1L13.95,7.3L13.94,7.31L11.95,10.4L10.22,9.5L11.64,7.3L10.22,5.1L12.22,2L13.95,2.89M20,2.89L18.56,5.1L20,7.3V7.31L18,10.4L16.25,9.5L17.67,7.3L16.25,5.1L18.25,2L20,2.89M2,22V14A2,2 0 0,1 4,12H20A2,2 0 0,1 22,14V22H20V20H4V22H2M6,14A1,1 0 0,0 5,15V17A1,1 0 0,0 6,18A1,1 0 0,0 7,17V15A1,1 0 0,0 6,14M10,14A1,1 0 0,0 9,15V17A1,1 0 0,0 10,18A1,1 0 0,0 11,17V15A1,1 0 0,0 10,14M14,14A1,1 0 0,0 13,15V17A1,1 0 0,0 14,18A1,1 0 0,0 15,17V15A1,1 0 0,0 14,14M18,14A1,1 0 0,0 17,15V17A1,1 0 0,0 18,18A1,1 0 0,0 19,17V15A1,1 0 0,0 18,14Z",
  chamber: "M19 8C20.11 8 21 8.9 21 10V16.76C21.61 17.31 22 18.11 22 19C22 20.66 20.66 22 19 22C17.34 22 16 20.66 16 19C16 18.11 16.39 17.31 17 16.76V10C17 8.9 17.9 8 19 8M19 9C18.45 9 18 9.45 18 10V11H20V10C20 9.45 19.55 9 19 9M12 5.69L7 10.19V18H14.1L14 19L14.1 20H5V12H2L12 3L16.4 6.96C15.89 7.4 15.5 7.97 15.25 8.61L12 5.69Z",
  pause: "M14,19H18V5H14M6,19H10V5H6V19Z",
  play: "M8,5.14V19.14L19,12.14L8,5.14Z",
  stop: "M18,18H6V6H18V18Z",
  light_on: "M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63Z",
  light_off: "M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z",
  clock: "M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z",
  flag: "M14.4,6H20V16H13L12.6,14H7V21H5V4H14L14.4,6M14,14H16V12H18V10H16V8H14V10L13,8V6H11V8H9V6H7V8H9V10H7V12H9V10H11V12H13V10L14,12V14M11,10V8H13V10H11M14,10H16V12H14V10Z",
  layers: "M12 0L3 7L4.63 8.27L12 14L19.36 8.27L21 7L12 0M19.37 10.73L12 16.47L4.62 10.74L3 12L12 19L21 12L19.37 10.73M19.37 15.73L12 21.47L4.62 15.74L3 17L12 24L21 17L19.37 15.73Z",
  chevron_down: "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",
  expand: "M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z",
  collapse: "M19.5,3.09L15,7.59V4H13V11H20V9H16.41L20.91,4.5L19.5,3.09M4,13V15H7.59L3.09,19.5L4.5,20.91L9,16.41V20H11V13H4Z",
  camera: "M6.03 12.03L8.03 15.5L5.5 18.68L2 12.62L6.03 12.03M17 18V15.29C17.88 14.9 18.5 14.03 18.5 13C18.5 12.43 18.3 11.9 17.97 11.5L19.94 10.35C20.95 9.76 21.3 8.47 20.71 7.46L19.33 5.06C18.74 4.05 17.45 3.7 16.44 4.28L8.31 9C7.36 9.53 7.03 10.75 7.58 11.71L9.08 14.31C9.63 15.26 10.86 15.59 11.81 15.04L13.69 13.96C13.94 14.55 14.41 15.03 15 15.29V18C15 19.1 15.9 20 17 20H22V18H17Z",
  file: "M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2M18 20H6V4H13V9H18V20M9.54 15.65L11.63 17.74L10.35 19L7 15.65L10.35 12.3L11.63 13.56L9.54 15.65M17 15.65L13.65 19L12.38 17.74L14.47 15.65L12.38 13.56L13.65 12.3L17 15.65Z",
  humidity: "M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z",
  spool: "M7,2H17V7H19V13H16.5L13,17H11L7.5,13H5V7H7V2M10,22H2V20H10A1,1 0 0,0 11,19V18H13V19A3,3 0 0,1 10,22M7,9V11H8.5L12,15L15.5,11H17V9H15V4H9V9H7Z",
  ams: "M18 5H6V7H18M6 9H18V11H6M2 12H4V17H20V12H22V17A2 2 0 0 1 20 19H4A2 2 0 0 1 2 17M18 13H6V15H18Z",
  alert: "M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
  timer: "M18 22H6V16L10 12L6 8V2H18V8L14 12L18 16M8 7.5L12 11.5L16 7.5V4H8M12 12.5L8 16.5V20H16V16.5M14 18H10V17.2L12 15.2L14 17.2Z",
  weight: "M19.95,10.56C19.75,9.67 18.95,9 18,9H15.46C15.81,8.41 16,7.73 16,7A4,4 0 0,0 12,3A4,4 0 0,0 8,7C8,7.73 8.19,8.41 8.54,9H6C5.05,9 4.25,9.67 4.05,10.56C2.04,18.57 2,18.78 2,19A2,2 0 0,0 4,21H20A2,2 0 0,0 22,19C22,18.78 21.96,18.57 19.95,10.56M12,5A2,2 0 0,1 14,7A2,2 0 0,1 12,9A2,2 0 0,1 10,7A2,2 0 0,1 12,5M15,13H11V17H13V14H15V19H11C9.89,19 9,18.11 9,17V13C9,11.89 9.89,11 11,11H15V13Z",
  length: "M9,5A7,7 0 0,1 16,12H17V15H16V19H9A7,7 0 0,1 2,12A7,7 0 0,1 9,5M9,8A4,4 0 0,0 5,12A4,4 0 0,0 9,16A4,4 0 0,0 13,12A4,4 0 0,0 9,8M17,17H22V19L22,21H20V19H17V17Z",
  speed: "M12,16A3,3 0 0,1 9,13C9,11.88 9.61,10.9 10.5,10.39L20.21,4.77L14.68,14.35C14.18,15.33 13.17,16 12,16M12,3C13.81,3 15.5,3.5 16.97,4.32L14.87,5.53C14,5.19 13,5 12,5A8,8 0 0,0 4,13C4,15.21 4.89,17.21 6.34,18.65H6.35C6.74,19.04 6.74,19.67 6.35,20.06C5.96,20.45 5.32,20.45 4.93,20.07V20.07C3.12,18.26 2,15.76 2,13A10,10 0 0,1 12,3M22,13C22,15.76 20.88,18.26 19.07,20.07V20.07C18.68,20.45 18.05,20.45 17.66,20.06C17.27,19.67 17.27,19.04 17.66,18.65V18.65C19.11,17.2 20,15.21 20,13C20,12 19.81,11 19.46,10.1L20.67,8C21.5,9.5 22,11.18 22,13Z",
  start: "M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z",
  info: "M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z",
  thermometer: "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z",
};

// ---------------------------------------------------------------------------
// Integrations
// ---------------------------------------------------------------------------

// Brand of each supported integration (platform): name, site, logo and accent color of the buttons.
const BRANDS = {
  bambu_lab: { name: "Bambu Lab", site: "https://bambulab.com", logo: IMG_LOGO_BAMBU, accent: "#00ae42" },
  octoprint: { name: "OctoPrint", site: "https://octoprint.org", logo: IMG_LOGO_OCTOPRINT, accent: "#13a538" },
  moonraker: { name: "Moonraker", site: "https://moonraker.readthedocs.io", logo: IMG_LOGO_MOONRAKER, accent: "#d32f2f" },
  prusalink: { name: "PrusaLink", site: "https://www.prusa3d.com", logo: IMG_LOGO_PRUSALINK, accent: "#fa6831" },
};

// translation_key of an entity → what the card calls it. Bambu Lab trays and external spools share one
// translation key per kind: they are collected in lists (see resolve).
const KEYS = {
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
const NAMES = {
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
const KEY_DOMAINS = { cover: ["image", "camera"], camera: ["camera", "image"], light: ["light", "switch"], pause: ["button"], resume: ["button"], stop: ["button"], continue: ["button"] };

// State of the status entity → phase of the printer, per integration.
const PHASES = {
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
const KLIPPER_PHASES = { ready: "idle", startup: "preparing", shutdown: "offline", error: "error" };
const KLIPPER_OVER = new Set(["offline", "error"]);

const PHASE_CLASS = {
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
const JOB_PHASES = new Set(["printing", "preparing", "paused", "attention", "stopping"]);
// Animation of the progress ring, per phase (see RING_CSS).
const RING_ANIM = { printing: "anim-printing", preparing: "anim-preparing", paused: "anim-paused", attention: "anim-paused" };

const DEFAULT_COLLAPSED = ["job"];
const SECTIONS = ["ams", "job", "camera"];

// ---------------------------------------------------------------------------
// Translations (English stays in the bundle; the build moves every other language to its own file)
// ---------------------------------------------------------------------------

const STRINGS = {
  en: {
    s_printing: "Printing",
    s_preparing: "Preparing",
    s_paused: "Paused",
    s_attention: "Needs attention",
    s_stopping: "Stopping",
    s_finished: "Finished",
    s_failed: "Failed",
    s_cancelled: "Cancelled",
    s_error: "Error",
    s_idle: "Idle",
    s_offline: "Offline",
    s_unknown: "Unknown",
    pause: "Pause",
    resume: "Resume",
    stop: "Stop",
    cancel: "Cancel",
    light: "Light",
    progress: "Progress",
    remaining: "Remaining",
    ends: "Ends {time}",
    finished_ago: "Finished {when}",
    layer: "Layer {n} / {total}",
    layer_n: "Layer {n}",
    ready: "Ready to print",
    done: "Done",
    temperatures: "Temperatures",
    nozzle: "Nozzle",
    nozzle_left: "Left nozzle",
    nozzle_right: "Right nozzle",
    bed: "Bed",
    chamber: "Chamber",
    ams: "Filaments",
    external_spool: "External spool",
    empty: "Empty",
    humidity: "Humidity",
    job: "Print job",
    started: "Started",
    weight: "Weight",
    length: "Filament",
    speed: "Speed",
    file: "File",
    material: "Material",
    camera: "Camera",
    thumbnail: "Thumbnail of the print",
    confirm_pause: "Pause the print on {name}?",
    confirm_resume: "Resume the print on {name}?",
    confirm_stop: "Stop the print on {name}? It cannot be resumed afterwards.",
    error_reported: "The printer reports an error",
    zoom_in: "Show details",
    zoom_out: "Compact view",
    no_device: "No 3D printer found. Is a supported integration (Bambu Lab, OctoPrint, Moonraker, PrusaLink) installed?",
    unknown_device: "3D printer not found",
    no_registry: "This card needs Home Assistant 2024.8 or later.",
    // Editor
    device: "3D printer",
    title: "Title (optional, defaults to the device name)",
    show_title: "Show title",
    show_subtitle: "Show subtitle",
    show_controls: "Show pause / resume / stop buttons",
    show_light: "Show light button",
    show_thumbnail: "Show the print thumbnail",
    show_temperatures: "Show temperatures",
    show_ams: "Show filaments (AMS)",
    show_job: "Show print job details",
    show_camera: "Show camera",
    collapsed: "Sections folded by default",
    camera_entity: "Camera entity (optional)",
    light_entity: "Light entity (optional)",
    zoom: "Detail button",
    zoom_helper: "Switches the mini card to the full card's content and back",
    language: "Language",
    lang_auto: "Automatic (Home Assistant)",
  },
  fr: {
    s_printing: "Impression",
    s_preparing: "Préparation",
    s_paused: "En pause",
    s_attention: "Intervention requise",
    s_stopping: "Arrêt en cours",
    s_finished: "Terminée",
    s_failed: "Échec",
    s_cancelled: "Annulée",
    s_error: "Erreur",
    s_idle: "Inactive",
    s_offline: "Hors ligne",
    s_unknown: "Inconnu",
    pause: "Pause",
    resume: "Reprendre",
    stop: "Arrêter",
    cancel: "Annuler",
    light: "Lumière",
    progress: "Progression",
    remaining: "Restant",
    ends: "Fin {time}",
    finished_ago: "Terminée {when}",
    layer: "Couche {n} / {total}",
    layer_n: "Couche {n}",
    ready: "Prête à imprimer",
    done: "Terminé",
    temperatures: "Températures",
    nozzle: "Buse",
    nozzle_left: "Buse gauche",
    nozzle_right: "Buse droite",
    bed: "Plateau",
    chamber: "Caisson",
    ams: "Filaments",
    external_spool: "Bobine externe",
    empty: "Vide",
    humidity: "Humidité",
    job: "Impression en cours",
    started: "Début",
    weight: "Poids",
    length: "Filament",
    speed: "Vitesse",
    file: "Fichier",
    material: "Matériau",
    camera: "Caméra",
    thumbnail: "Vignette de l'impression",
    confirm_pause: "Mettre en pause l'impression sur {name} ?",
    confirm_resume: "Reprendre l'impression sur {name} ?",
    confirm_stop: "Arrêter l'impression sur {name} ? Elle ne pourra pas être reprise.",
    error_reported: "L'imprimante signale une erreur",
    zoom_in: "Afficher le détail",
    zoom_out: "Vue compacte",
    no_device: "Aucune imprimante 3D trouvée. Une intégration compatible (Bambu Lab, OctoPrint, Moonraker, PrusaLink) est-elle installée ?",
    unknown_device: "Imprimante 3D introuvable",
    no_registry: "Cette carte nécessite Home Assistant 2024.8 ou plus récent.",
    device: "Imprimante 3D",
    title: "Titre (facultatif, nom de l'appareil par défaut)",
    show_title: "Afficher le titre",
    show_subtitle: "Afficher le sous-titre",
    show_controls: "Afficher les boutons pause / reprise / arrêt",
    show_light: "Afficher le bouton lumière",
    show_thumbnail: "Afficher la vignette de l'impression",
    show_temperatures: "Afficher les températures",
    show_ams: "Afficher les filaments (AMS)",
    show_job: "Afficher le détail de l'impression",
    show_camera: "Afficher la caméra",
    collapsed: "Sections repliées par défaut",
    camera_entity: "Entité caméra (facultatif)",
    light_entity: "Entité lumière (facultatif)",
    zoom: "Bouton de détail",
    zoom_helper: "Bascule la mini-carte vers le contenu de la carte complète, et retour",
    language: "Langue",
    lang_auto: "Automatique (Home Assistant)",
  },
  de: {
    s_printing: "Druckt",
    s_preparing: "Vorbereitung",
    s_paused: "Pausiert",
    s_attention: "Eingriff erforderlich",
    s_stopping: "Wird gestoppt",
    s_finished: "Fertig",
    s_failed: "Fehlgeschlagen",
    s_cancelled: "Abgebrochen",
    s_error: "Fehler",
    s_idle: "Leerlauf",
    s_offline: "Offline",
    s_unknown: "Unbekannt",
    pause: "Pause",
    resume: "Fortsetzen",
    stop: "Stopp",
    cancel: "Abbrechen",
    light: "Licht",
    progress: "Fortschritt",
    remaining: "Verbleibend",
    ends: "Ende {time}",
    finished_ago: "Fertig {when}",
    layer: "Schicht {n} / {total}",
    layer_n: "Schicht {n}",
    ready: "Bereit zum Drucken",
    done: "Fertig",
    temperatures: "Temperaturen",
    nozzle: "Düse",
    nozzle_left: "Linke Düse",
    nozzle_right: "Rechte Düse",
    bed: "Druckbett",
    chamber: "Bauraum",
    ams: "Filamente",
    external_spool: "Externe Spule",
    empty: "Leer",
    humidity: "Luftfeuchtigkeit",
    job: "Druckauftrag",
    started: "Gestartet",
    weight: "Gewicht",
    length: "Filament",
    speed: "Geschwindigkeit",
    file: "Datei",
    material: "Material",
    camera: "Kamera",
    thumbnail: "Vorschau des Drucks",
    confirm_pause: "Druck auf {name} pausieren?",
    confirm_resume: "Druck auf {name} fortsetzen?",
    confirm_stop: "Druck auf {name} stoppen? Er kann danach nicht fortgesetzt werden.",
    error_reported: "Der Drucker meldet einen Fehler",
    zoom_in: "Details anzeigen",
    zoom_out: "Kompakte Ansicht",
    no_device: "Kein 3D-Drucker gefunden. Ist eine unterstützte Integration (Bambu Lab, OctoPrint, Moonraker, PrusaLink) installiert?",
    unknown_device: "3D-Drucker nicht gefunden",
    no_registry: "Diese Karte benötigt Home Assistant 2024.8 oder neuer.",
    device: "3D-Drucker",
    title: "Titel (optional, standardmäßig der Gerätename)",
    show_title: "Titel anzeigen",
    show_subtitle: "Untertitel anzeigen",
    show_controls: "Pause- / Fortsetzen- / Stopp-Tasten anzeigen",
    show_light: "Licht-Taste anzeigen",
    show_thumbnail: "Vorschau des Drucks anzeigen",
    show_temperatures: "Temperaturen anzeigen",
    show_ams: "Filamente (AMS) anzeigen",
    show_job: "Details des Druckauftrags anzeigen",
    show_camera: "Kamera anzeigen",
    collapsed: "Standardmäßig eingeklappte Bereiche",
    camera_entity: "Kamera-Entität (optional)",
    light_entity: "Licht-Entität (optional)",
    zoom: "Detail-Taste",
    zoom_helper: "Schaltet die Mini-Karte auf den Inhalt der vollständigen Karte um und zurück",
    language: "Sprache",
    lang_auto: "Automatisch (Home Assistant)",
  },
  es: {
    s_printing: "Imprimiendo",
    s_preparing: "Preparando",
    s_paused: "En pausa",
    s_attention: "Requiere atención",
    s_stopping: "Deteniendo",
    s_finished: "Terminada",
    s_failed: "Fallida",
    s_cancelled: "Cancelada",
    s_error: "Error",
    s_idle: "Inactiva",
    s_offline: "Sin conexión",
    s_unknown: "Desconocido",
    pause: "Pausar",
    resume: "Reanudar",
    stop: "Detener",
    cancel: "Cancelar",
    light: "Luz",
    progress: "Progreso",
    remaining: "Restante",
    ends: "Fin {time}",
    finished_ago: "Terminada {when}",
    layer: "Capa {n} / {total}",
    layer_n: "Capa {n}",
    ready: "Lista para imprimir",
    done: "Hecho",
    temperatures: "Temperaturas",
    nozzle: "Boquilla",
    nozzle_left: "Boquilla izquierda",
    nozzle_right: "Boquilla derecha",
    bed: "Cama",
    chamber: "Cámara",
    ams: "Filamentos",
    external_spool: "Bobina externa",
    empty: "Vacío",
    humidity: "Humedad",
    job: "Trabajo de impresión",
    started: "Inicio",
    weight: "Peso",
    length: "Filamento",
    speed: "Velocidad",
    file: "Archivo",
    material: "Material",
    camera: "Cámara web",
    thumbnail: "Miniatura de la impresión",
    confirm_pause: "¿Pausar la impresión en {name}?",
    confirm_resume: "¿Reanudar la impresión en {name}?",
    confirm_stop: "¿Detener la impresión en {name}? No se podrá reanudar después.",
    error_reported: "La impresora informa de un error",
    zoom_in: "Mostrar detalles",
    zoom_out: "Vista compacta",
    no_device: "No se encontró ninguna impresora 3D. ¿Está instalada una integración compatible (Bambu Lab, OctoPrint, Moonraker, PrusaLink)?",
    unknown_device: "Impresora 3D no encontrada",
    no_registry: "Esta tarjeta necesita Home Assistant 2024.8 o posterior.",
    device: "Impresora 3D",
    title: "Título (opcional, por defecto el nombre del dispositivo)",
    show_title: "Mostrar título",
    show_subtitle: "Mostrar subtítulo",
    show_controls: "Mostrar los botones pausar / reanudar / detener",
    show_light: "Mostrar el botón de luz",
    show_thumbnail: "Mostrar la miniatura de la impresión",
    show_temperatures: "Mostrar temperaturas",
    show_ams: "Mostrar filamentos (AMS)",
    show_job: "Mostrar detalles del trabajo",
    show_camera: "Mostrar cámara",
    collapsed: "Secciones plegadas por defecto",
    camera_entity: "Entidad de cámara (opcional)",
    light_entity: "Entidad de luz (opcional)",
    zoom: "Botón de detalle",
    zoom_helper: "Cambia la mini tarjeta al contenido de la tarjeta completa y viceversa",
    language: "Idioma",
    lang_auto: "Automático (Home Assistant)",
  },
  sr: {
    s_printing: "Штампа",
    s_preparing: "Припрема",
    s_paused: "Паузирано",
    s_attention: "Потребна пажња",
    s_stopping: "Заустављање",
    s_finished: "Завршено",
    s_failed: "Неуспешно",
    s_cancelled: "Отказано",
    s_error: "Грешка",
    s_idle: "Неактиван",
    s_offline: "Ван мреже",
    s_unknown: "Непознато",
    pause: "Пауза",
    resume: "Настави",
    stop: "Заустави",
    cancel: "Откажи",
    light: "Светло",
    progress: "Напредак",
    remaining: "Преостало",
    ends: "Крај {time}",
    finished_ago: "Завршено {when}",
    layer: "Слој {n} / {total}",
    layer_n: "Слој {n}",
    ready: "Спреман за штампу",
    done: "Готово",
    temperatures: "Температуре",
    nozzle: "Млазница",
    nozzle_left: "Лева млазница",
    nozzle_right: "Десна млазница",
    bed: "Подлога",
    chamber: "Комора",
    ams: "Филаменти",
    external_spool: "Спољни калем",
    empty: "Празно",
    humidity: "Влажност",
    job: "Задатак штампе",
    started: "Почетак",
    weight: "Тежина",
    length: "Филамент",
    speed: "Брзина",
    file: "Датотека",
    material: "Материјал",
    camera: "Камера",
    thumbnail: "Сличица отиска",
    confirm_pause: "Паузирати штампу на {name}?",
    confirm_resume: "Наставити штампу на {name}?",
    confirm_stop: "Зауставити штампу на {name}? Након тога се не може наставити.",
    error_reported: "Штампач пријављује грешку",
    zoom_in: "Прикажи детаље",
    zoom_out: "Сажети приказ",
    no_device: "Није пронађен ниједан 3D штампач. Да ли је инсталирана подржана интеграција (Bambu Lab, OctoPrint, Moonraker, PrusaLink)?",
    unknown_device: "3D штампач није пронађен",
    no_registry: "Ова картица захтева Home Assistant 2024.8 или новији.",
    device: "3D штампач",
    title: "Наслов (опционо, подразумевано назив уређаја)",
    show_title: "Прикажи наслов",
    show_subtitle: "Прикажи поднаслов",
    show_controls: "Прикажи дугмад пауза / настави / заустави",
    show_light: "Прикажи дугме за светло",
    show_thumbnail: "Прикажи сличицу отиска",
    show_temperatures: "Прикажи температуре",
    show_ams: "Прикажи филаменте (AMS)",
    show_job: "Прикажи детаље задатка штампе",
    show_camera: "Прикажи камеру",
    collapsed: "Одељци подразумевано скупљени",
    camera_entity: "Ентитет камере (опционо)",
    light_entity: "Ентитет светла (опционо)",
    zoom: "Дугме за детаље",
    zoom_helper: "Пребацује мини картицу на садржај пуне картице и назад",
    language: "Језик",
    lang_auto: "Аутоматски (Home Assistant)",
  },
  "sr-Latn": {
    s_printing: "Štampa",
    s_preparing: "Priprema",
    s_paused: "Pauzirano",
    s_attention: "Potrebna pažnja",
    s_stopping: "Zaustavljanje",
    s_finished: "Završeno",
    s_failed: "Neuspešno",
    s_cancelled: "Otkazano",
    s_error: "Greška",
    s_idle: "Neaktivan",
    s_offline: "Van mreže",
    s_unknown: "Nepoznato",
    pause: "Pauza",
    resume: "Nastavi",
    stop: "Zaustavi",
    cancel: "Otkaži",
    light: "Svetlo",
    progress: "Napredak",
    remaining: "Preostalo",
    ends: "Kraj {time}",
    finished_ago: "Završeno {when}",
    layer: "Sloj {n} / {total}",
    layer_n: "Sloj {n}",
    ready: "Spreman za štampu",
    done: "Gotovo",
    temperatures: "Temperature",
    nozzle: "Mlaznica",
    nozzle_left: "Leva mlaznica",
    nozzle_right: "Desna mlaznica",
    bed: "Podloga",
    chamber: "Komora",
    ams: "Filamenti",
    external_spool: "Spoljni kalem",
    empty: "Prazno",
    humidity: "Vlažnost",
    job: "Zadatak štampe",
    started: "Početak",
    weight: "Težina",
    length: "Filament",
    speed: "Brzina",
    file: "Datoteka",
    material: "Materijal",
    camera: "Kamera",
    thumbnail: "Sličica otiska",
    confirm_pause: "Pauzirati štampu na {name}?",
    confirm_resume: "Nastaviti štampu na {name}?",
    confirm_stop: "Zaustaviti štampu na {name}? Nakon toga se ne može nastaviti.",
    error_reported: "Štampač prijavljuje grešku",
    zoom_in: "Prikaži detalje",
    zoom_out: "Sažeti prikaz",
    no_device: "Nije pronađen nijedan 3D štampač. Da li je instalirana podržana integracija (Bambu Lab, OctoPrint, Moonraker, PrusaLink)?",
    unknown_device: "3D štampač nije pronađen",
    no_registry: "Ova kartica zahteva Home Assistant 2024.8 ili noviji.",
    device: "3D štampač",
    title: "Naslov (opciono, podrazumevano naziv uređaja)",
    show_title: "Prikaži naslov",
    show_subtitle: "Prikaži podnaslov",
    show_controls: "Prikaži dugmad pauza / nastavi / zaustavi",
    show_light: "Prikaži dugme za svetlo",
    show_thumbnail: "Prikaži sličicu otiska",
    show_temperatures: "Prikaži temperature",
    show_ams: "Prikaži filamente (AMS)",
    show_job: "Prikaži detalje zadatka štampe",
    show_camera: "Prikaži kameru",
    collapsed: "Odeljci podrazumevano skupljeni",
    camera_entity: "Entitet kamere (opciono)",
    light_entity: "Entitet svetla (opciono)",
    zoom: "Dugme za detalje",
    zoom_helper: "Prebacuje mini karticu na sadržaj pune kartice i nazad",
    language: "Jezik",
    lang_auto: "Automatski (Home Assistant)",
  },
  it: {
    s_printing: "In stampa",
    s_preparing: "Preparazione",
    s_paused: "In pausa",
    s_attention: "Richiede attenzione",
    s_stopping: "Arresto in corso",
    s_finished: "Completata",
    s_failed: "Non riuscita",
    s_cancelled: "Annullata",
    s_error: "Errore",
    s_idle: "Inattiva",
    s_offline: "Non in linea",
    s_unknown: "Sconosciuto",
    pause: "Pausa",
    resume: "Riprendi",
    stop: "Ferma",
    cancel: "Annulla",
    light: "Luce",
    progress: "Avanzamento",
    remaining: "Rimanente",
    ends: "Fine {time}",
    finished_ago: "Completata {when}",
    layer: "Strato {n} / {total}",
    layer_n: "Strato {n}",
    ready: "Pronta per stampare",
    done: "Fatto",
    temperatures: "Temperature",
    nozzle: "Ugello",
    nozzle_left: "Ugello sinistro",
    nozzle_right: "Ugello destro",
    bed: "Piatto",
    chamber: "Camera",
    ams: "Filamenti",
    external_spool: "Bobina esterna",
    empty: "Vuoto",
    humidity: "Umidità",
    job: "Lavoro di stampa",
    started: "Inizio",
    weight: "Peso",
    length: "Filamento",
    speed: "Velocità",
    file: "File",
    material: "Materiale",
    camera: "Telecamera",
    thumbnail: "Anteprima della stampa",
    confirm_pause: "Mettere in pausa la stampa su {name}?",
    confirm_resume: "Riprendere la stampa su {name}?",
    confirm_stop: "Fermare la stampa su {name}? Non potrà essere ripresa.",
    error_reported: "La stampante segnala un errore",
    zoom_in: "Mostra dettagli",
    zoom_out: "Vista compatta",
    no_device: "Nessuna stampante 3D trovata. È installata un'integrazione supportata (Bambu Lab, OctoPrint, Moonraker, PrusaLink)?",
    unknown_device: "Stampante 3D non trovata",
    no_registry: "Questa scheda richiede Home Assistant 2024.8 o successivo.",
    device: "Stampante 3D",
    title: "Titolo (facoltativo, predefinito il nome del dispositivo)",
    show_title: "Mostra titolo",
    show_subtitle: "Mostra sottotitolo",
    show_controls: "Mostra i pulsanti pausa / riprendi / ferma",
    show_light: "Mostra il pulsante luce",
    show_thumbnail: "Mostra l'anteprima della stampa",
    show_temperatures: "Mostra temperature",
    show_ams: "Mostra filamenti (AMS)",
    show_job: "Mostra i dettagli del lavoro",
    show_camera: "Mostra telecamera",
    collapsed: "Sezioni chiuse per impostazione predefinita",
    camera_entity: "Entità telecamera (facoltativa)",
    light_entity: "Entità luce (facoltativa)",
    zoom: "Pulsante dettagli",
    zoom_helper: "Passa la mini scheda al contenuto della scheda completa e viceversa",
    language: "Lingua",
    lang_auto: "Automatica (Home Assistant)",
  },
  nl: {
    s_printing: "Bezig met printen",
    s_preparing: "Voorbereiden",
    s_paused: "Gepauzeerd",
    s_attention: "Actie vereist",
    s_stopping: "Wordt gestopt",
    s_finished: "Voltooid",
    s_failed: "Mislukt",
    s_cancelled: "Geannuleerd",
    s_error: "Fout",
    s_idle: "Inactief",
    s_offline: "Offline",
    s_unknown: "Onbekend",
    pause: "Pauzeren",
    resume: "Hervatten",
    stop: "Stoppen",
    cancel: "Annuleren",
    light: "Licht",
    progress: "Voortgang",
    remaining: "Resterend",
    ends: "Klaar {time}",
    finished_ago: "Voltooid {when}",
    layer: "Laag {n} / {total}",
    layer_n: "Laag {n}",
    ready: "Klaar om te printen",
    done: "Klaar",
    temperatures: "Temperaturen",
    nozzle: "Nozzle",
    nozzle_left: "Linker nozzle",
    nozzle_right: "Rechter nozzle",
    bed: "Bed",
    chamber: "Behuizing",
    ams: "Filamenten",
    external_spool: "Externe spoel",
    empty: "Leeg",
    humidity: "Luchtvochtigheid",
    job: "Printopdracht",
    started: "Gestart",
    weight: "Gewicht",
    length: "Filament",
    speed: "Snelheid",
    file: "Bestand",
    material: "Materiaal",
    camera: "Camera",
    thumbnail: "Voorbeeld van de print",
    confirm_pause: "De print op {name} pauzeren?",
    confirm_resume: "De print op {name} hervatten?",
    confirm_stop: "De print op {name} stoppen? Hij kan daarna niet worden hervat.",
    error_reported: "De printer meldt een fout",
    zoom_in: "Details tonen",
    zoom_out: "Compacte weergave",
    no_device: "Geen 3D-printer gevonden. Is een ondersteunde integratie (Bambu Lab, OctoPrint, Moonraker, PrusaLink) geïnstalleerd?",
    unknown_device: "3D-printer niet gevonden",
    no_registry: "Deze kaart vereist Home Assistant 2024.8 of nieuwer.",
    device: "3D-printer",
    title: "Titel (optioneel, standaard de apparaatnaam)",
    show_title: "Titel tonen",
    show_subtitle: "Ondertitel tonen",
    show_controls: "Knoppen pauzeren / hervatten / stoppen tonen",
    show_light: "Lichtknop tonen",
    show_thumbnail: "Voorbeeld van de print tonen",
    show_temperatures: "Temperaturen tonen",
    show_ams: "Filamenten (AMS) tonen",
    show_job: "Details van de printopdracht tonen",
    show_camera: "Camera tonen",
    collapsed: "Standaard ingeklapte secties",
    camera_entity: "Camera-entiteit (optioneel)",
    light_entity: "Licht-entiteit (optioneel)",
    zoom: "Detailknop",
    zoom_helper: "Schakelt de minikaart naar de inhoud van de volledige kaart en terug",
    language: "Taal",
    lang_auto: "Automatisch (Home Assistant)",
  },
  pt: {
    s_printing: "A imprimir",
    s_preparing: "A preparar",
    s_paused: "Em pausa",
    s_attention: "Requer atenção",
    s_stopping: "A parar",
    s_finished: "Concluída",
    s_failed: "Falhou",
    s_cancelled: "Cancelada",
    s_error: "Erro",
    s_idle: "Inativa",
    s_offline: "Offline",
    s_unknown: "Desconhecido",
    pause: "Pausar",
    resume: "Retomar",
    stop: "Parar",
    cancel: "Cancelar",
    light: "Luz",
    progress: "Progresso",
    remaining: "Restante",
    ends: "Fim {time}",
    finished_ago: "Concluída {when}",
    layer: "Camada {n} / {total}",
    layer_n: "Camada {n}",
    ready: "Pronta para imprimir",
    done: "Concluído",
    temperatures: "Temperaturas",
    nozzle: "Bico",
    nozzle_left: "Bico esquerdo",
    nozzle_right: "Bico direito",
    bed: "Base",
    chamber: "Câmara",
    ams: "Filamentos",
    external_spool: "Bobina externa",
    empty: "Vazio",
    humidity: "Humidade",
    job: "Trabalho de impressão",
    started: "Início",
    weight: "Peso",
    length: "Filamento",
    speed: "Velocidade",
    file: "Ficheiro",
    material: "Material",
    camera: "Câmara de vídeo",
    thumbnail: "Miniatura da impressão",
    confirm_pause: "Pausar a impressão em {name}?",
    confirm_resume: "Retomar a impressão em {name}?",
    confirm_stop: "Parar a impressão em {name}? Não poderá ser retomada depois.",
    error_reported: "A impressora reporta um erro",
    zoom_in: "Mostrar detalhes",
    zoom_out: "Vista compacta",
    no_device: "Nenhuma impressora 3D encontrada. Está instalada uma integração compatível (Bambu Lab, OctoPrint, Moonraker, PrusaLink)?",
    unknown_device: "Impressora 3D não encontrada",
    no_registry: "Este cartão requer o Home Assistant 2024.8 ou posterior.",
    device: "Impressora 3D",
    title: "Título (opcional, por omissão o nome do dispositivo)",
    show_title: "Mostrar título",
    show_subtitle: "Mostrar subtítulo",
    show_controls: "Mostrar os botões pausar / retomar / parar",
    show_light: "Mostrar o botão de luz",
    show_thumbnail: "Mostrar a miniatura da impressão",
    show_temperatures: "Mostrar temperaturas",
    show_ams: "Mostrar filamentos (AMS)",
    show_job: "Mostrar detalhes do trabalho",
    show_camera: "Mostrar câmara",
    collapsed: "Secções recolhidas por omissão",
    camera_entity: "Entidade de câmara (opcional)",
    light_entity: "Entidade de luz (opcional)",
    zoom: "Botão de detalhe",
    zoom_helper: "Alterna o mini cartão para o conteúdo do cartão completo e vice-versa",
    language: "Idioma",
    lang_auto: "Automático (Home Assistant)",
  },
  pl: {
    s_printing: "Drukowanie",
    s_preparing: "Przygotowanie",
    s_paused: "Wstrzymano",
    s_attention: "Wymaga uwagi",
    s_stopping: "Zatrzymywanie",
    s_finished: "Zakończono",
    s_failed: "Niepowodzenie",
    s_cancelled: "Anulowano",
    s_error: "Błąd",
    s_idle: "Bezczynna",
    s_offline: "Offline",
    s_unknown: "Nieznany",
    pause: "Wstrzymaj",
    resume: "Wznów",
    stop: "Zatrzymaj",
    cancel: "Anuluj",
    light: "Światło",
    progress: "Postęp",
    remaining: "Pozostało",
    ends: "Koniec {time}",
    finished_ago: "Zakończono {when}",
    layer: "Warstwa {n} / {total}",
    layer_n: "Warstwa {n}",
    ready: "Gotowa do druku",
    done: "Gotowe",
    temperatures: "Temperatury",
    nozzle: "Dysza",
    nozzle_left: "Lewa dysza",
    nozzle_right: "Prawa dysza",
    bed: "Stół",
    chamber: "Komora",
    ams: "Filamenty",
    external_spool: "Szpula zewnętrzna",
    empty: "Pusty",
    humidity: "Wilgotność",
    job: "Zadanie druku",
    started: "Rozpoczęto",
    weight: "Waga",
    length: "Filament",
    speed: "Prędkość",
    file: "Plik",
    material: "Materiał",
    camera: "Kamera",
    thumbnail: "Miniatura wydruku",
    confirm_pause: "Wstrzymać drukowanie na {name}?",
    confirm_resume: "Wznowić drukowanie na {name}?",
    confirm_stop: "Zatrzymać drukowanie na {name}? Nie będzie można go potem wznowić.",
    error_reported: "Drukarka zgłasza błąd",
    zoom_in: "Pokaż szczegóły",
    zoom_out: "Widok kompaktowy",
    no_device: "Nie znaleziono drukarki 3D. Czy zainstalowano obsługiwaną integrację (Bambu Lab, OctoPrint, Moonraker, PrusaLink)?",
    unknown_device: "Nie znaleziono drukarki 3D",
    no_registry: "Ta karta wymaga Home Assistant 2024.8 lub nowszego.",
    device: "Drukarka 3D",
    title: "Tytuł (opcjonalny, domyślnie nazwa urządzenia)",
    show_title: "Pokaż tytuł",
    show_subtitle: "Pokaż podtytuł",
    show_controls: "Pokaż przyciski wstrzymaj / wznów / zatrzymaj",
    show_light: "Pokaż przycisk światła",
    show_thumbnail: "Pokaż miniaturę wydruku",
    show_temperatures: "Pokaż temperatury",
    show_ams: "Pokaż filamenty (AMS)",
    show_job: "Pokaż szczegóły zadania druku",
    show_camera: "Pokaż kamerę",
    collapsed: "Sekcje domyślnie zwinięte",
    camera_entity: "Encja kamery (opcjonalna)",
    light_entity: "Encja światła (opcjonalna)",
    zoom: "Przycisk szczegółów",
    zoom_helper: "Przełącza mini kartę na zawartość pełnej karty i z powrotem",
    language: "Język",
    lang_auto: "Automatycznie (Home Assistant)",
  },
  ro: {
    s_printing: "Imprimă",
    s_preparing: "Pregătire",
    s_paused: "În pauză",
    s_attention: "Necesită atenție",
    s_stopping: "Se oprește",
    s_finished: "Finalizată",
    s_failed: "Eșuată",
    s_cancelled: "Anulată",
    s_error: "Eroare",
    s_idle: "Inactivă",
    s_offline: "Offline",
    s_unknown: "Necunoscut",
    pause: "Pauză",
    resume: "Reia",
    stop: "Oprește",
    cancel: "Anulează",
    light: "Lumină",
    progress: "Progres",
    remaining: "Rămas",
    ends: "Sfârșit {time}",
    finished_ago: "Finalizată {when}",
    layer: "Strat {n} / {total}",
    layer_n: "Strat {n}",
    ready: "Gata de imprimare",
    done: "Gata",
    temperatures: "Temperaturi",
    nozzle: "Duză",
    nozzle_left: "Duza stângă",
    nozzle_right: "Duza dreaptă",
    bed: "Pat",
    chamber: "Incintă",
    ams: "Filamente",
    external_spool: "Bobină externă",
    empty: "Gol",
    humidity: "Umiditate",
    job: "Lucrare de imprimare",
    started: "Început",
    weight: "Greutate",
    length: "Filament",
    speed: "Viteză",
    file: "Fișier",
    material: "Material",
    camera: "Cameră",
    thumbnail: "Miniatura imprimării",
    confirm_pause: "Puneți în pauză imprimarea pe {name}?",
    confirm_resume: "Reluați imprimarea pe {name}?",
    confirm_stop: "Opriți imprimarea pe {name}? Nu va mai putea fi reluată.",
    error_reported: "Imprimanta raportează o eroare",
    zoom_in: "Afișează detalii",
    zoom_out: "Vizualizare compactă",
    no_device: "Nu s-a găsit nicio imprimantă 3D. Este instalată o integrare compatibilă (Bambu Lab, OctoPrint, Moonraker, PrusaLink)?",
    unknown_device: "Imprimanta 3D nu a fost găsită",
    no_registry: "Acest card necesită Home Assistant 2024.8 sau mai nou.",
    device: "Imprimantă 3D",
    title: "Titlu (opțional, implicit numele dispozitivului)",
    show_title: "Afișează titlul",
    show_subtitle: "Afișează subtitlul",
    show_controls: "Afișează butoanele pauză / reia / oprește",
    show_light: "Afișează butonul de lumină",
    show_thumbnail: "Afișează miniatura imprimării",
    show_temperatures: "Afișează temperaturile",
    show_ams: "Afișează filamentele (AMS)",
    show_job: "Afișează detaliile lucrării",
    show_camera: "Afișează camera",
    collapsed: "Secțiuni pliate implicit",
    camera_entity: "Entitate cameră (opțional)",
    light_entity: "Entitate lumină (opțional)",
    zoom: "Buton de detalii",
    zoom_helper: "Comută mini cardul la conținutul cardului complet și înapoi",
    language: "Limbă",
    lang_auto: "Automat (Home Assistant)",
  },
  da: {
    s_printing: "Printer",
    s_preparing: "Forbereder",
    s_paused: "Sat på pause",
    s_attention: "Kræver opmærksomhed",
    s_stopping: "Stopper",
    s_finished: "Færdig",
    s_failed: "Mislykkedes",
    s_cancelled: "Annulleret",
    s_error: "Fejl",
    s_idle: "Inaktiv",
    s_offline: "Offline",
    s_unknown: "Ukendt",
    pause: "Pause",
    resume: "Genoptag",
    stop: "Stop",
    cancel: "Annuller",
    light: "Lys",
    progress: "Fremskridt",
    remaining: "Tilbage",
    ends: "Slut {time}",
    finished_ago: "Færdig {when}",
    layer: "Lag {n} / {total}",
    layer_n: "Lag {n}",
    ready: "Klar til print",
    done: "Færdig",
    temperatures: "Temperaturer",
    nozzle: "Dyse",
    nozzle_left: "Venstre dyse",
    nozzle_right: "Højre dyse",
    bed: "Plade",
    chamber: "Kammer",
    ams: "Filamenter",
    external_spool: "Ekstern spole",
    empty: "Tom",
    humidity: "Luftfugtighed",
    job: "Printjob",
    started: "Startet",
    weight: "Vægt",
    length: "Filament",
    speed: "Hastighed",
    file: "Fil",
    material: "Materiale",
    camera: "Kamera",
    thumbnail: "Miniature af printet",
    confirm_pause: "Sæt printet på {name} på pause?",
    confirm_resume: "Genoptag printet på {name}?",
    confirm_stop: "Stop printet på {name}? Det kan ikke genoptages bagefter.",
    error_reported: "Printeren rapporterer en fejl",
    zoom_in: "Vis detaljer",
    zoom_out: "Kompakt visning",
    no_device: "Ingen 3D-printer fundet. Er en understøttet integration (Bambu Lab, OctoPrint, Moonraker, PrusaLink) installeret?",
    unknown_device: "3D-printer ikke fundet",
    no_registry: "Dette kort kræver Home Assistant 2024.8 eller nyere.",
    device: "3D-printer",
    title: "Titel (valgfri, enhedens navn som standard)",
    show_title: "Vis titel",
    show_subtitle: "Vis undertitel",
    show_controls: "Vis knapperne pause / genoptag / stop",
    show_light: "Vis lysknap",
    show_thumbnail: "Vis miniature af printet",
    show_temperatures: "Vis temperaturer",
    show_ams: "Vis filamenter (AMS)",
    show_job: "Vis detaljer om printjobbet",
    show_camera: "Vis kamera",
    collapsed: "Sektioner foldet sammen som standard",
    camera_entity: "Kamera-entitet (valgfri)",
    light_entity: "Lys-entitet (valgfri)",
    zoom: "Detaljeknap",
    zoom_helper: "Skifter minikortet til det fulde korts indhold og tilbage",
    language: "Sprog",
    lang_auto: "Automatisk (Home Assistant)",
  },
  sv: {
    s_printing: "Skriver ut",
    s_preparing: "Förbereder",
    s_paused: "Pausad",
    s_attention: "Kräver åtgärd",
    s_stopping: "Stoppar",
    s_finished: "Klar",
    s_failed: "Misslyckades",
    s_cancelled: "Avbruten",
    s_error: "Fel",
    s_idle: "Inaktiv",
    s_offline: "Offline",
    s_unknown: "Okänd",
    pause: "Pausa",
    resume: "Återuppta",
    stop: "Stoppa",
    cancel: "Avbryt",
    light: "Ljus",
    progress: "Förlopp",
    remaining: "Kvar",
    ends: "Klar {time}",
    finished_ago: "Klar {when}",
    layer: "Lager {n} / {total}",
    layer_n: "Lager {n}",
    ready: "Redo att skriva ut",
    done: "Klart",
    temperatures: "Temperaturer",
    nozzle: "Munstycke",
    nozzle_left: "Vänster munstycke",
    nozzle_right: "Höger munstycke",
    bed: "Bädd",
    chamber: "Kammare",
    ams: "Filament",
    external_spool: "Extern spole",
    empty: "Tom",
    humidity: "Luftfuktighet",
    job: "Utskriftsjobb",
    started: "Startad",
    weight: "Vikt",
    length: "Filament",
    speed: "Hastighet",
    file: "Fil",
    material: "Material",
    camera: "Kamera",
    thumbnail: "Miniatyr av utskriften",
    confirm_pause: "Pausa utskriften på {name}?",
    confirm_resume: "Återuppta utskriften på {name}?",
    confirm_stop: "Stoppa utskriften på {name}? Den kan inte återupptas efteråt.",
    error_reported: "Skrivaren rapporterar ett fel",
    zoom_in: "Visa detaljer",
    zoom_out: "Kompakt vy",
    no_device: "Ingen 3D-skrivare hittades. Är en integration som stöds (Bambu Lab, OctoPrint, Moonraker, PrusaLink) installerad?",
    unknown_device: "3D-skrivaren hittades inte",
    no_registry: "Det här kortet kräver Home Assistant 2024.8 eller senare.",
    device: "3D-skrivare",
    title: "Titel (valfri, enhetens namn som standard)",
    show_title: "Visa titel",
    show_subtitle: "Visa undertitel",
    show_controls: "Visa knapparna pausa / återuppta / stoppa",
    show_light: "Visa ljusknapp",
    show_thumbnail: "Visa miniatyr av utskriften",
    show_temperatures: "Visa temperaturer",
    show_ams: "Visa filament (AMS)",
    show_job: "Visa detaljer om utskriftsjobbet",
    show_camera: "Visa kamera",
    collapsed: "Avsnitt hopfällda som standard",
    camera_entity: "Kameraentitet (valfri)",
    light_entity: "Ljusentitet (valfri)",
    zoom: "Detaljknapp",
    zoom_helper: "Växlar minikortet till det fullständiga kortets innehåll och tillbaka",
    language: "Språk",
    lang_auto: "Automatiskt (Home Assistant)",
  },
  bg: {
    s_printing: "Печата",
    s_preparing: "Подготовка",
    s_paused: "На пауза",
    s_attention: "Изисква внимание",
    s_stopping: "Спиране",
    s_finished: "Завършено",
    s_failed: "Неуспешно",
    s_cancelled: "Отменено",
    s_error: "Грешка",
    s_idle: "Неактивен",
    s_offline: "Офлайн",
    s_unknown: "Неизвестно",
    pause: "Пауза",
    resume: "Продължи",
    stop: "Спри",
    cancel: "Отказ",
    light: "Светлина",
    progress: "Напредък",
    remaining: "Оставащо",
    ends: "Край {time}",
    finished_ago: "Завършено {when}",
    layer: "Слой {n} / {total}",
    layer_n: "Слой {n}",
    ready: "Готов за печат",
    done: "Готово",
    temperatures: "Температури",
    nozzle: "Дюза",
    nozzle_left: "Лява дюза",
    nozzle_right: "Дясна дюза",
    bed: "Плоча",
    chamber: "Камера (корпус)",
    ams: "Филаменти",
    external_spool: "Външна макара",
    empty: "Празно",
    humidity: "Влажност",
    job: "Задача за печат",
    started: "Начало",
    weight: "Тегло",
    length: "Филамент",
    speed: "Скорост",
    file: "Файл",
    material: "Материал",
    camera: "Камера",
    thumbnail: "Миниатюра на печата",
    confirm_pause: "Пауза на печата на {name}?",
    confirm_resume: "Продължаване на печата на {name}?",
    confirm_stop: "Спиране на печата на {name}? След това не може да бъде продължен.",
    error_reported: "Принтерът съобщава за грешка",
    zoom_in: "Покажи подробности",
    zoom_out: "Компактен изглед",
    no_device: "Не е намерен 3D принтер. Инсталирана ли е поддържана интеграция (Bambu Lab, OctoPrint, Moonraker, PrusaLink)?",
    unknown_device: "3D принтерът не е намерен",
    no_registry: "Тази карта изисква Home Assistant 2024.8 или по-нов.",
    device: "3D принтер",
    title: "Заглавие (по избор, по подразбиране името на устройството)",
    show_title: "Покажи заглавието",
    show_subtitle: "Покажи подзаглавието",
    show_controls: "Покажи бутоните пауза / продължи / спри",
    show_light: "Покажи бутона за светлина",
    show_thumbnail: "Покажи миниатюрата на печата",
    show_temperatures: "Покажи температурите",
    show_ams: "Покажи филаментите (AMS)",
    show_job: "Покажи подробности за задачата",
    show_camera: "Покажи камерата",
    collapsed: "Секции, свити по подразбиране",
    camera_entity: "Обект камера (по избор)",
    light_entity: "Обект светлина (по избор)",
    zoom: "Бутон за подробности",
    zoom_helper: "Превключва мини картата към съдържанието на пълната карта и обратно",
    language: "Език",
    lang_auto: "Автоматично (Home Assistant)",
  },
  ru: {
    s_printing: "Печать",
    s_preparing: "Подготовка",
    s_paused: "Пауза",
    s_attention: "Требуется вмешательство",
    s_stopping: "Остановка",
    s_finished: "Завершено",
    s_failed: "Сбой",
    s_cancelled: "Отменено",
    s_error: "Ошибка",
    s_idle: "Простой",
    s_offline: "Не в сети",
    s_unknown: "Неизвестно",
    pause: "Пауза",
    resume: "Продолжить",
    stop: "Стоп",
    cancel: "Отмена",
    light: "Свет",
    progress: "Прогресс",
    remaining: "Осталось",
    ends: "Окончание {time}",
    finished_ago: "Завершено {when}",
    layer: "Слой {n} / {total}",
    layer_n: "Слой {n}",
    ready: "Готов к печати",
    done: "Готово",
    temperatures: "Температуры",
    nozzle: "Сопло",
    nozzle_left: "Левое сопло",
    nozzle_right: "Правое сопло",
    bed: "Стол",
    chamber: "Камера (корпус)",
    ams: "Филаменты",
    external_spool: "Внешняя катушка",
    empty: "Пусто",
    humidity: "Влажность",
    job: "Задание печати",
    started: "Начало",
    weight: "Вес",
    length: "Филамент",
    speed: "Скорость",
    file: "Файл",
    material: "Материал",
    camera: "Камера",
    thumbnail: "Миниатюра печати",
    confirm_pause: "Приостановить печать на {name}?",
    confirm_resume: "Продолжить печать на {name}?",
    confirm_stop: "Остановить печать на {name}? Её нельзя будет продолжить.",
    error_reported: "Принтер сообщает об ошибке",
    zoom_in: "Показать подробности",
    zoom_out: "Компактный вид",
    no_device: "3D-принтер не найден. Установлена ли поддерживаемая интеграция (Bambu Lab, OctoPrint, Moonraker, PrusaLink)?",
    unknown_device: "3D-принтер не найден",
    no_registry: "Для этой карточки нужен Home Assistant 2024.8 или новее.",
    device: "3D-принтер",
    title: "Заголовок (необязательно, по умолчанию имя устройства)",
    show_title: "Показывать заголовок",
    show_subtitle: "Показывать подзаголовок",
    show_controls: "Показывать кнопки пауза / продолжить / стоп",
    show_light: "Показывать кнопку света",
    show_thumbnail: "Показывать миниатюру печати",
    show_temperatures: "Показывать температуры",
    show_ams: "Показывать филаменты (AMS)",
    show_job: "Показывать подробности задания",
    show_camera: "Показывать камеру",
    collapsed: "Разделы, свёрнутые по умолчанию",
    camera_entity: "Объект камеры (необязательно)",
    light_entity: "Объект света (необязательно)",
    zoom: "Кнопка подробностей",
    zoom_helper: "Переключает мини-карточку на содержимое полной карточки и обратно",
    language: "Язык",
    lang_auto: "Автоматически (Home Assistant)",
  },
  uk: {
    s_printing: "Друкує",
    s_preparing: "Підготовка",
    s_paused: "Призупинено",
    s_attention: "Потрібне втручання",
    s_stopping: "Зупинка",
    s_finished: "Завершено",
    s_failed: "Збій",
    s_cancelled: "Скасовано",
    s_error: "Помилка",
    s_idle: "Простій",
    s_offline: "Не в мережі",
    s_unknown: "Невідомо",
    pause: "Пауза",
    resume: "Продовжити",
    stop: "Стоп",
    cancel: "Скасувати",
    light: "Світло",
    progress: "Прогрес",
    remaining: "Залишилось",
    ends: "Завершення {time}",
    finished_ago: "Завершено {when}",
    layer: "Шар {n} / {total}",
    layer_n: "Шар {n}",
    ready: "Готовий до друку",
    done: "Готово",
    temperatures: "Температури",
    nozzle: "Сопло",
    nozzle_left: "Ліве сопло",
    nozzle_right: "Праве сопло",
    bed: "Стіл",
    chamber: "Камера (корпус)",
    ams: "Філаменти",
    external_spool: "Зовнішня котушка",
    empty: "Порожньо",
    humidity: "Вологість",
    job: "Завдання друку",
    started: "Початок",
    weight: "Вага",
    length: "Філамент",
    speed: "Швидкість",
    file: "Файл",
    material: "Матеріал",
    camera: "Камера",
    thumbnail: "Мініатюра друку",
    confirm_pause: "Призупинити друк на {name}?",
    confirm_resume: "Продовжити друк на {name}?",
    confirm_stop: "Зупинити друк на {name}? Його не можна буде продовжити.",
    error_reported: "Принтер повідомляє про помилку",
    zoom_in: "Показати подробиці",
    zoom_out: "Компактний вигляд",
    no_device: "3D-принтер не знайдено. Чи встановлено підтримувану інтеграцію (Bambu Lab, OctoPrint, Moonraker, PrusaLink)?",
    unknown_device: "3D-принтер не знайдено",
    no_registry: "Ця картка потребує Home Assistant 2024.8 або новішого.",
    device: "3D-принтер",
    title: "Заголовок (необов'язково, типово назва пристрою)",
    show_title: "Показувати заголовок",
    show_subtitle: "Показувати підзаголовок",
    show_controls: "Показувати кнопки пауза / продовжити / стоп",
    show_light: "Показувати кнопку світла",
    show_thumbnail: "Показувати мініатюру друку",
    show_temperatures: "Показувати температури",
    show_ams: "Показувати філаменти (AMS)",
    show_job: "Показувати подробиці завдання",
    show_camera: "Показувати камеру",
    collapsed: "Розділи, згорнуті типово",
    camera_entity: "Сутність камери (необов'язково)",
    light_entity: "Сутність світла (необов'язково)",
    zoom: "Кнопка подробиць",
    zoom_helper: "Перемикає міні-картку на вміст повної картки і назад",
    language: "Мова",
    lang_auto: "Автоматично (Home Assistant)",
  },
  hu: {
    s_printing: "Nyomtat",
    s_preparing: "Előkészítés",
    s_paused: "Szüneteltetve",
    s_attention: "Beavatkozás szükséges",
    s_stopping: "Leállítás",
    s_finished: "Kész",
    s_failed: "Sikertelen",
    s_cancelled: "Megszakítva",
    s_error: "Hiba",
    s_idle: "Tétlen",
    s_offline: "Offline",
    s_unknown: "Ismeretlen",
    pause: "Szünet",
    resume: "Folytatás",
    stop: "Leállítás",
    cancel: "Mégse",
    light: "Világítás",
    progress: "Előrehaladás",
    remaining: "Hátralévő",
    ends: "Vége {time}",
    finished_ago: "Kész {when}",
    layer: "Réteg {n} / {total}",
    layer_n: "Réteg {n}",
    ready: "Nyomtatásra kész",
    done: "Kész",
    temperatures: "Hőmérsékletek",
    nozzle: "Fúvóka",
    nozzle_left: "Bal fúvóka",
    nozzle_right: "Jobb fúvóka",
    bed: "Tálca",
    chamber: "Kamra",
    ams: "Filamentek",
    external_spool: "Külső tekercs",
    empty: "Üres",
    humidity: "Páratartalom",
    job: "Nyomtatási feladat",
    started: "Kezdés",
    weight: "Tömeg",
    length: "Filament",
    speed: "Sebesség",
    file: "Fájl",
    material: "Anyag",
    camera: "Kamera",
    thumbnail: "A nyomat előnézete",
    confirm_pause: "Szünetelteti a nyomtatást ezen: {name}?",
    confirm_resume: "Folytatja a nyomtatást ezen: {name}?",
    confirm_stop: "Leállítja a nyomtatást ezen: {name}? Utána nem folytatható.",
    error_reported: "A nyomtató hibát jelez",
    zoom_in: "Részletek",
    zoom_out: "Kompakt nézet",
    no_device: "Nem található 3D nyomtató. Telepítve van egy támogatott integráció (Bambu Lab, OctoPrint, Moonraker, PrusaLink)?",
    unknown_device: "A 3D nyomtató nem található",
    no_registry: "Ehhez a kártyához Home Assistant 2024.8 vagy újabb szükséges.",
    device: "3D nyomtató",
    title: "Cím (nem kötelező, alapértelmezés szerint az eszköz neve)",
    show_title: "Cím megjelenítése",
    show_subtitle: "Alcím megjelenítése",
    show_controls: "Szünet / folytatás / leállítás gombok megjelenítése",
    show_light: "Világítás gomb megjelenítése",
    show_thumbnail: "A nyomat előnézetének megjelenítése",
    show_temperatures: "Hőmérsékletek megjelenítése",
    show_ams: "Filamentek (AMS) megjelenítése",
    show_job: "A nyomtatási feladat részleteinek megjelenítése",
    show_camera: "Kamera megjelenítése",
    collapsed: "Alapértelmezetten összecsukott szakaszok",
    camera_entity: "Kamera entitás (nem kötelező)",
    light_entity: "Világítás entitás (nem kötelező)",
    zoom: "Részletek gomb",
    zoom_helper: "A mini kártyát a teljes kártya tartalmára váltja, és vissza",
    language: "Nyelv",
    lang_auto: "Automatikus (Home Assistant)",
  },
  sk: {
    s_printing: "Tlačí",
    s_preparing: "Príprava",
    s_paused: "Pozastavené",
    s_attention: "Vyžaduje pozornosť",
    s_stopping: "Zastavuje sa",
    s_finished: "Dokončené",
    s_failed: "Zlyhalo",
    s_cancelled: "Zrušené",
    s_error: "Chyba",
    s_idle: "Nečinná",
    s_offline: "Offline",
    s_unknown: "Neznáme",
    pause: "Pozastaviť",
    resume: "Pokračovať",
    stop: "Zastaviť",
    cancel: "Zrušiť",
    light: "Svetlo",
    progress: "Priebeh",
    remaining: "Zostáva",
    ends: "Koniec {time}",
    finished_ago: "Dokončené {when}",
    layer: "Vrstva {n} / {total}",
    layer_n: "Vrstva {n}",
    ready: "Pripravená na tlač",
    done: "Hotovo",
    temperatures: "Teploty",
    nozzle: "Tryska",
    nozzle_left: "Ľavá tryska",
    nozzle_right: "Pravá tryska",
    bed: "Podložka",
    chamber: "Komora",
    ams: "Filamenty",
    external_spool: "Externá cievka",
    empty: "Prázdne",
    humidity: "Vlhkosť",
    job: "Tlačová úloha",
    started: "Začiatok",
    weight: "Hmotnosť",
    length: "Filament",
    speed: "Rýchlosť",
    file: "Súbor",
    material: "Materiál",
    camera: "Kamera",
    thumbnail: "Náhľad výtlačku",
    confirm_pause: "Pozastaviť tlač na {name}?",
    confirm_resume: "Pokračovať v tlači na {name}?",
    confirm_stop: "Zastaviť tlač na {name}? Potom ju už nebude možné obnoviť.",
    error_reported: "Tlačiareň hlási chybu",
    zoom_in: "Zobraziť podrobnosti",
    zoom_out: "Kompaktné zobrazenie",
    no_device: "Nenašla sa žiadna 3D tlačiareň. Je nainštalovaná podporovaná integrácia (Bambu Lab, OctoPrint, Moonraker, PrusaLink)?",
    unknown_device: "3D tlačiareň sa nenašla",
    no_registry: "Táto karta vyžaduje Home Assistant 2024.8 alebo novší.",
    device: "3D tlačiareň",
    title: "Názov (voliteľný, predvolene názov zariadenia)",
    show_title: "Zobraziť názov",
    show_subtitle: "Zobraziť podnázov",
    show_controls: "Zobraziť tlačidlá pozastaviť / pokračovať / zastaviť",
    show_light: "Zobraziť tlačidlo svetla",
    show_thumbnail: "Zobraziť náhľad výtlačku",
    show_temperatures: "Zobraziť teploty",
    show_ams: "Zobraziť filamenty (AMS)",
    show_job: "Zobraziť podrobnosti tlačovej úlohy",
    show_camera: "Zobraziť kameru",
    collapsed: "Predvolene zbalené sekcie",
    camera_entity: "Entita kamery (voliteľná)",
    light_entity: "Entita svetla (voliteľná)",
    zoom: "Tlačidlo podrobností",
    zoom_helper: "Prepne mini kartu na obsah úplnej karty a späť",
    language: "Jazyk",
    lang_auto: "Automaticky (Home Assistant)",
  },
  cs: {
    s_printing: "Tiskne",
    s_preparing: "Příprava",
    s_paused: "Pozastaveno",
    s_attention: "Vyžaduje pozornost",
    s_stopping: "Zastavuje se",
    s_finished: "Dokončeno",
    s_failed: "Selhalo",
    s_cancelled: "Zrušeno",
    s_error: "Chyba",
    s_idle: "Nečinná",
    s_offline: "Offline",
    s_unknown: "Neznámé",
    pause: "Pozastavit",
    resume: "Pokračovat",
    stop: "Zastavit",
    cancel: "Zrušit",
    light: "Světlo",
    progress: "Průběh",
    remaining: "Zbývá",
    ends: "Konec {time}",
    finished_ago: "Dokončeno {when}",
    layer: "Vrstva {n} / {total}",
    layer_n: "Vrstva {n}",
    ready: "Připravena k tisku",
    done: "Hotovo",
    temperatures: "Teploty",
    nozzle: "Tryska",
    nozzle_left: "Levá tryska",
    nozzle_right: "Pravá tryska",
    bed: "Podložka",
    chamber: "Komora",
    ams: "Filamenty",
    external_spool: "Externí cívka",
    empty: "Prázdné",
    humidity: "Vlhkost",
    job: "Tisková úloha",
    started: "Začátek",
    weight: "Hmotnost",
    length: "Filament",
    speed: "Rychlost",
    file: "Soubor",
    material: "Materiál",
    camera: "Kamera",
    thumbnail: "Náhled výtisku",
    confirm_pause: "Pozastavit tisk na {name}?",
    confirm_resume: "Pokračovat v tisku na {name}?",
    confirm_stop: "Zastavit tisk na {name}? Poté jej už nebude možné obnovit.",
    error_reported: "Tiskárna hlásí chybu",
    zoom_in: "Zobrazit podrobnosti",
    zoom_out: "Kompaktní zobrazení",
    no_device: "Nebyla nalezena žádná 3D tiskárna. Je nainstalována podporovaná integrace (Bambu Lab, OctoPrint, Moonraker, PrusaLink)?",
    unknown_device: "3D tiskárna nebyla nalezena",
    no_registry: "Tato karta vyžaduje Home Assistant 2024.8 nebo novější.",
    device: "3D tiskárna",
    title: "Název (volitelný, výchozí je název zařízení)",
    show_title: "Zobrazit název",
    show_subtitle: "Zobrazit podnázev",
    show_controls: "Zobrazit tlačítka pozastavit / pokračovat / zastavit",
    show_light: "Zobrazit tlačítko světla",
    show_thumbnail: "Zobrazit náhled výtisku",
    show_temperatures: "Zobrazit teploty",
    show_ams: "Zobrazit filamenty (AMS)",
    show_job: "Zobrazit podrobnosti tiskové úlohy",
    show_camera: "Zobrazit kameru",
    collapsed: "Ve výchozím stavu sbalené sekce",
    camera_entity: "Entita kamery (volitelná)",
    light_entity: "Entita světla (volitelná)",
    zoom: "Tlačítko podrobností",
    zoom_helper: "Přepne mini kartu na obsah úplné karty a zpět",
    language: "Jazyk",
    lang_auto: "Automaticky (Home Assistant)",
  },
  sl: {
    s_printing: "Tiska",
    s_preparing: "Priprava",
    s_paused: "Zaustavljeno",
    s_attention: "Potrebna pozornost",
    s_stopping: "Ustavljanje",
    s_finished: "Končano",
    s_failed: "Neuspešno",
    s_cancelled: "Preklicano",
    s_error: "Napaka",
    s_idle: "Nedejaven",
    s_offline: "Brez povezave",
    s_unknown: "Neznano",
    pause: "Premor",
    resume: "Nadaljuj",
    stop: "Ustavi",
    cancel: "Prekliči",
    light: "Luč",
    progress: "Napredek",
    remaining: "Preostalo",
    ends: "Konec {time}",
    finished_ago: "Končano {when}",
    layer: "Plast {n} / {total}",
    layer_n: "Plast {n}",
    ready: "Pripravljen za tiskanje",
    done: "Končano",
    temperatures: "Temperature",
    nozzle: "Šoba",
    nozzle_left: "Leva šoba",
    nozzle_right: "Desna šoba",
    bed: "Plošča",
    chamber: "Komora",
    ams: "Filamenti",
    external_spool: "Zunanja tuljava",
    empty: "Prazno",
    humidity: "Vlažnost",
    job: "Tiskalno opravilo",
    started: "Začetek",
    weight: "Teža",
    length: "Filament",
    speed: "Hitrost",
    file: "Datoteka",
    material: "Material",
    camera: "Kamera",
    thumbnail: "Predogled odtisa",
    confirm_pause: "Začasno ustavim tiskanje na {name}?",
    confirm_resume: "Nadaljujem tiskanje na {name}?",
    confirm_stop: "Ustavim tiskanje na {name}? Pozneje ga ne bo mogoče nadaljevati.",
    error_reported: "Tiskalnik poroča o napaki",
    zoom_in: "Pokaži podrobnosti",
    zoom_out: "Strnjen pogled",
    no_device: "Ni najdenega 3D-tiskalnika. Ali je nameščena podprta integracija (Bambu Lab, OctoPrint, Moonraker, PrusaLink)?",
    unknown_device: "3D-tiskalnika ni mogoče najti",
    no_registry: "Ta kartica zahteva Home Assistant 2024.8 ali novejši.",
    device: "3D-tiskalnik",
    title: "Naslov (neobvezno, privzeto ime naprave)",
    show_title: "Pokaži naslov",
    show_subtitle: "Pokaži podnaslov",
    show_controls: "Pokaži gumbe premor / nadaljuj / ustavi",
    show_light: "Pokaži gumb za luč",
    show_thumbnail: "Pokaži predogled odtisa",
    show_temperatures: "Pokaži temperature",
    show_ams: "Pokaži filamente (AMS)",
    show_job: "Pokaži podrobnosti tiskalnega opravila",
    show_camera: "Pokaži kamero",
    collapsed: "Privzeto strnjeni razdelki",
    camera_entity: "Entiteta kamere (neobvezno)",
    light_entity: "Entiteta luči (neobvezno)",
    zoom: "Gumb za podrobnosti",
    zoom_helper: "Preklopi mini kartico na vsebino celotne kartice in nazaj",
    language: "Jezik",
    lang_auto: "Samodejno (Home Assistant)",
  },
  lv: {
    s_printing: "Drukā",
    s_preparing: "Sagatavošana",
    s_paused: "Pauzēts",
    s_attention: "Nepieciešama uzmanība",
    s_stopping: "Aptur",
    s_finished: "Pabeigts",
    s_failed: "Neizdevās",
    s_cancelled: "Atcelts",
    s_error: "Kļūda",
    s_idle: "Dīkstāvē",
    s_offline: "Bezsaistē",
    s_unknown: "Nezināms",
    pause: "Pauze",
    resume: "Turpināt",
    stop: "Apturēt",
    cancel: "Atcelt",
    light: "Gaisma",
    progress: "Progress",
    remaining: "Atlicis",
    ends: "Beigas {time}",
    finished_ago: "Pabeigts {when}",
    layer: "Slānis {n} / {total}",
    layer_n: "Slānis {n}",
    ready: "Gatavs drukāšanai",
    done: "Gatavs",
    temperatures: "Temperatūras",
    nozzle: "Sprausla",
    nozzle_left: "Kreisā sprausla",
    nozzle_right: "Labā sprausla",
    bed: "Galds",
    chamber: "Kamera (korpuss)",
    ams: "Filamenti",
    external_spool: "Ārējā spole",
    empty: "Tukšs",
    humidity: "Mitrums",
    job: "Drukas darbs",
    started: "Sākums",
    weight: "Svars",
    length: "Filaments",
    speed: "Ātrums",
    file: "Fails",
    material: "Materiāls",
    camera: "Kamera",
    thumbnail: "Drukas sīktēls",
    confirm_pause: "Pauzēt drukāšanu printerī {name}?",
    confirm_resume: "Turpināt drukāšanu printerī {name}?",
    confirm_stop: "Apturēt drukāšanu printerī {name}? Pēc tam to nevarēs turpināt.",
    error_reported: "Printeris ziņo par kļūdu",
    zoom_in: "Rādīt detaļas",
    zoom_out: "Kompakts skats",
    no_device: "3D printeris nav atrasts. Vai ir instalēta atbalstīta integrācija (Bambu Lab, OctoPrint, Moonraker, PrusaLink)?",
    unknown_device: "3D printeris nav atrasts",
    no_registry: "Šai kartītei nepieciešams Home Assistant 2024.8 vai jaunāks.",
    device: "3D printeris",
    title: "Virsraksts (neobligāts, pēc noklusējuma ierīces nosaukums)",
    show_title: "Rādīt virsrakstu",
    show_subtitle: "Rādīt apakšvirsrakstu",
    show_controls: "Rādīt pogas pauze / turpināt / apturēt",
    show_light: "Rādīt gaismas pogu",
    show_thumbnail: "Rādīt drukas sīktēlu",
    show_temperatures: "Rādīt temperatūras",
    show_ams: "Rādīt filamentus (AMS)",
    show_job: "Rādīt drukas darba detaļas",
    show_camera: "Rādīt kameru",
    collapsed: "Pēc noklusējuma sakļautās sadaļas",
    camera_entity: "Kameras entītija (neobligāti)",
    light_entity: "Gaismas entītija (neobligāti)",
    zoom: "Detaļu poga",
    zoom_helper: "Pārslēdz mini kartīti uz pilnās kartītes saturu un atpakaļ",
    language: "Valoda",
    lang_auto: "Automātiski (Home Assistant)",
  },
  el: {
    s_printing: "Εκτύπωση",
    s_preparing: "Προετοιμασία",
    s_paused: "Σε παύση",
    s_attention: "Απαιτεί προσοχή",
    s_stopping: "Διακοπή",
    s_finished: "Ολοκληρώθηκε",
    s_failed: "Απέτυχε",
    s_cancelled: "Ακυρώθηκε",
    s_error: "Σφάλμα",
    s_idle: "Αδρανής",
    s_offline: "Εκτός σύνδεσης",
    s_unknown: "Άγνωστο",
    pause: "Παύση",
    resume: "Συνέχεια",
    stop: "Διακοπή",
    cancel: "Άκυρο",
    light: "Φως",
    progress: "Πρόοδος",
    remaining: "Απομένει",
    ends: "Λήξη {time}",
    finished_ago: "Ολοκληρώθηκε {when}",
    layer: "Στρώση {n} / {total}",
    layer_n: "Στρώση {n}",
    ready: "Έτοιμος για εκτύπωση",
    done: "Έγινε",
    temperatures: "Θερμοκρασίες",
    nozzle: "Ακροφύσιο",
    nozzle_left: "Αριστερό ακροφύσιο",
    nozzle_right: "Δεξί ακροφύσιο",
    bed: "Πλατφόρμα",
    chamber: "Θάλαμος",
    ams: "Νήματα",
    external_spool: "Εξωτερικό καρούλι",
    empty: "Κενό",
    humidity: "Υγρασία",
    job: "Εργασία εκτύπωσης",
    started: "Έναρξη",
    weight: "Βάρος",
    length: "Νήμα",
    speed: "Ταχύτητα",
    file: "Αρχείο",
    material: "Υλικό",
    camera: "Κάμερα",
    thumbnail: "Μικρογραφία της εκτύπωσης",
    confirm_pause: "Παύση της εκτύπωσης στο {name};",
    confirm_resume: "Συνέχεια της εκτύπωσης στο {name};",
    confirm_stop: "Διακοπή της εκτύπωσης στο {name}; Δεν θα μπορεί να συνεχιστεί.",
    error_reported: "Ο εκτυπωτής αναφέρει σφάλμα",
    zoom_in: "Εμφάνιση λεπτομερειών",
    zoom_out: "Συμπαγής προβολή",
    no_device: "Δεν βρέθηκε τρισδιάστατος εκτυπωτής. Είναι εγκατεστημένη μια υποστηριζόμενη ενσωμάτωση (Bambu Lab, OctoPrint, Moonraker, PrusaLink);",
    unknown_device: "Ο τρισδιάστατος εκτυπωτής δεν βρέθηκε",
    no_registry: "Αυτή η κάρτα απαιτεί Home Assistant 2024.8 ή νεότερο.",
    device: "Τρισδιάστατος εκτυπωτής",
    title: "Τίτλος (προαιρετικός, από προεπιλογή το όνομα της συσκευής)",
    show_title: "Εμφάνιση τίτλου",
    show_subtitle: "Εμφάνιση υπότιτλου",
    show_controls: "Εμφάνιση κουμπιών παύση / συνέχεια / διακοπή",
    show_light: "Εμφάνιση κουμπιού φωτός",
    show_thumbnail: "Εμφάνιση μικρογραφίας της εκτύπωσης",
    show_temperatures: "Εμφάνιση θερμοκρασιών",
    show_ams: "Εμφάνιση νημάτων (AMS)",
    show_job: "Εμφάνιση λεπτομερειών εργασίας",
    show_camera: "Εμφάνιση κάμερας",
    collapsed: "Ενότητες συμπτυγμένες από προεπιλογή",
    camera_entity: "Οντότητα κάμερας (προαιρετική)",
    light_entity: "Οντότητα φωτός (προαιρετική)",
    zoom: "Κουμπί λεπτομερειών",
    zoom_helper: "Εναλλάσσει τη μίνι κάρτα στο περιεχόμενο της πλήρους κάρτας και πίσω",
    language: "Γλώσσα",
    lang_auto: "Αυτόματα (Home Assistant)",
  },
};

const LANGUAGES = [
  ["en", "English"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["es", "Español"],
  ["sr", "Српски"],
  ["sr-Latn", "Srpski (latinica)"],
  ["it", "Italiano"],
  ["nl", "Nederlands"],
  ["pt", "Português (Portugal)"],
  ["pl", "Polski"],
  ["ro", "Română"],
  ["da", "Dansk"],
  ["sv", "Svenska"],
  ["bg", "Български"],
  ["ru", "Русский"],
  ["uk", "Українська"],
  ["hu", "Magyar"],
  ["sk", "Slovenčina"],
  ["cs", "Čeština"],
  ["sl", "Slovenščina"],
  ["lv", "Latviešu"],
  ["el", "Ελληνικά"],
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const lang = (hass, config) => {
  const l = config?.language || (hass && (hass.locale?.language || hass.language)) || "en";
  return STRINGS[l] ? l : STRINGS[l.split("-")[0]] ? l.split("-")[0] : "en";
};

// Locale for Intl: the card's language option, else Home Assistant's full locale (keeps its region, e.g. pt-BR,
// de-CH) when its base matches the card language, else that language. A bare "pt" becomes "pt-PT".
const intlLocale = (hass, config) => {
  const l = lang(hass, config);
  const src = config?.language || (hass && (hass.locale?.language || hass.language)) || "";
  const out = src && src.split("-")[0] === l.split("-")[0] ? src : l;
  return out === "pt" ? "pt-PT" : out;
};

const t = (hass, config, key, vars = {}) =>
  String(STRINGS[lang(hass, config)][key] ?? STRINGS.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

const valid = (s) => !!s && !["unknown", "unavailable", ""].includes(s.state);
const num = (s) => {
  if (!valid(s)) return null;
  const v = parseFloat(s.state);
  return Number.isFinite(v) ? v : null;
};
const pretty = (v) => {
  const s = String(v ?? "").replace(/_/g, " ").trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";
};
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const NUM_FMT = {};
const fmtUnit = (v, unit, locale, digits = 0) =>
  (NUM_FMT[`${locale}|${unit}|${digits}`] ??= new Intl.NumberFormat(locale, { style: "unit", unit, unitDisplay: "short", maximumFractionDigits: digits })).format(v);

// A duration in hours, as "1 h 23 min", "45 min" or "12 h".
const fmtHours = (h, locale) => {
  if (h === null || h === undefined || !Number.isFinite(h)) return "—";
  if (h <= 0) return fmtUnit(0, "minute", locale);
  const total = Math.round(h * 60);
  if (total < 60) return fmtUnit(Math.max(1, total), "minute", locale);
  const m = total % 60;
  const H = fmtUnit(Math.floor(total / 60), "hour", locale);
  return m && total < 6000 ? `${H} ${fmtUnit(m, "minute", locale)}` : H;
};

// Duration sensor in hours, whatever its unit.
const TO_HOURS = { s: 1 / 3600, sec: 1 / 3600, min: 1 / 60, h: 1, hr: 1, d: 24 };
const hoursOf = (s) => {
  const v = num(s);
  if (v === null) return null;
  return v * (TO_HOURS[s.attributes?.unit_of_measurement] ?? 1 / 60);
};

const RTF = {};
const ago = (locale, ms) => {
  const diff = (ms - Date.now()) / 1000;
  const rtf = (RTF[locale] ??= new Intl.RelativeTimeFormat(locale, { numeric: "auto" }));
  const abs = Math.abs(diff);
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  return rtf.format(Math.round(diff / 86400), "day");
};

const DTF = {};
// Clock time of a moment, with the weekday when it is not today.
const fmtClock = (ms, locale) => {
  const d = new Date(ms);
  const today = new Date().toDateString() === d.toDateString();
  const key = `${locale}|${today}`;
  DTF[key] ??= new Intl.DateTimeFormat(locale, today ? { hour: "2-digit", minute: "2-digit" } : { weekday: "short", hour: "2-digit", minute: "2-digit" });
  return DTF[key].format(d);
};

// Temperature value, rounded, in the unit of its sensor.
const fmtTemp = (s, locale) => {
  const v = num(s);
  if (v === null) return "—";
  const u = s.attributes?.unit_of_measurement;
  if (u === "°F") return fmtUnit(Math.round(v), "fahrenheit", locale);
  return fmtUnit(Math.round(v), "celsius", locale);
};

// "#RRGGBBAA" (Bambu Lab) or "#RRGGBB" → a CSS color, null when it is not one.
const filamentColor = (c) => {
  const m = /^#?([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(String(c ?? "").trim());
  if (!m) return null;
  const alpha = m[2] ? parseInt(m[2], 16) / 255 : 1;
  return alpha >= 0.99 ? `#${m[1].toLowerCase()}` : `rgba(${parseInt(m[1].slice(0, 2), 16)}, ${parseInt(m[1].slice(2, 4), 16)}, ${parseInt(m[1].slice(4), 16)}, ${alpha.toFixed(2)})`;
};

const svgIcon = (path, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;

// ---------------------------------------------------------------------------
// Registry-based resolution
// ---------------------------------------------------------------------------

// The text an entity is recognized by: its friendly name and its entity id, lower case, words apart.
const namesOf = (hass, e) => {
  const fn = hass.states?.[e.entity_id]?.attributes?.friendly_name;
  return [fn, e.entity_id.split(".")[1]].filter(Boolean).map((n) => String(n).toLowerCase().replace(/[_\s]+/g, " ").trim());
};

const keyOf = (hass, e, domain) => {
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

const _cache = new WeakMap();

/**
 * The printers of hass.entities / hass.devices: [{ id, name, model, platform, e: { key: entity_id }, ams: [{ id, name,
 * e, trays: [entity_id] }], spools: [entity_id] }]. Bambu Lab AMS units are devices of their own, linked to their
 * printer (via_device_id): their trays and humidity are merged into it, as are the external spools (devices too).
 */
const resolve = (hass) => {
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

const listPrinters = (hass) => (resolve(hass)?.printers || []).map((p) => ({ value: p.id, label: p.name }));

// The printer of a config, with the entities set by hand (`entities`, `camera_entity`, `light_entity`) on top.
const findPrinter = (hass, config) => {
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
const phaseOf = (dev, states) => {
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

// ---------------------------------------------------------------------------
// Printer picture: a drawn enclosed printer, animated by its phase
// ---------------------------------------------------------------------------

// Status badge of the picture (bottom right), per phase.
const BADGES = {
  paused: `<svg viewBox="0 0 24 24"><path d="M8 6.5h2.6v11H8zM13.4 6.5H16v11h-2.6z" fill="#fff"/></svg>`,
  attention: `<svg viewBox="0 0 24 24"><path d="M8 6.5h2.6v11H8zM13.4 6.5H16v11h-2.6z" fill="#fff"/></svg>`,
  finished: `<svg viewBox="0 0 24 24"><path class="check" d="M6.5 12.5l3.6 3.6 7.4-8" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  failed: `<svg viewBox="0 0 24 24"><path d="M10.6 5.5h2.8v8.5h-2.8zM10.6 15.8h2.8v2.7h-2.8z" fill="#fff"/></svg>`,
  error: `<svg viewBox="0 0 24 24"><path d="M10.6 5.5h2.8v8.5h-2.8zM10.6 15.8h2.8v2.7h-2.8z" fill="#fff"/></svg>`,
};

// The printer in a 80 × 80 box: frame, glass door, gantry with its toolhead, a spool, the bed and the part being
// printed, as high as the progress. Printing: the toolhead sweeps across, the spool turns and the top layer glows;
// preparing: heat rises from the bed and the nozzle glows; paused: the toolhead is parked; finished: the part is
// complete and sparkles.
const printerSvg = (phase, pct, filament) => {
  const job = JOB_PHASES.has(phase);
  const h = phase === "finished" ? 24 : job ? Math.round(2 + (22 * clamp(pct ?? 0, 0, 100)) / 100) : 0;
  const top = 56 - h;
  const lines = [];
  for (let y = 56 - 4; y > top + 1; y -= 4) lines.push(`<path d="M30 ${y}h20"/>`);
  const part = h
    ? `<g class="part"><rect x="30" y="${top}" width="20" height="${h}" rx="1.5" style="fill:${esc(filament)}"/><g class="lines">${lines.join("")}</g>${
        phase === "printing" ? `<rect class="layer" x="30" y="${top}" width="20" height="1.4" rx=".7"/>` : ""
      }</g>`
    : "";
  return `<svg class="printer" viewBox="0 0 80 80" aria-hidden="true">
    <rect class="frame" x="8" y="6" width="64" height="68" rx="7"/>
    <rect class="glass" x="13" y="12" width="54" height="52" rx="3.5"/>
    <g class="spool"><circle cx="22" cy="40" r="6"/><circle class="hub" cx="22" cy="40" r="2"/><path d="M22 34.5v3M22 42.5v3M16.5 40h3M24.5 40h3"/></g>
    <g class="heat"><path d="M31 54c2-2.5-2-5 0-7.5s-2-5 0-7.5"/><path d="M40 54c2-2.5-2-5 0-7.5s-2-5 0-7.5"/><path d="M49 54c2-2.5-2-5 0-7.5s-2-5 0-7.5"/></g>
    <rect class="bed" x="16" y="56" width="48" height="3" rx="1.2"/>
    ${part}
    <rect class="rail" x="13" y="18" width="54" height="2.6" rx="1"/>
    <g class="head"><rect class="carriage" x="34" y="16" width="12" height="10" rx="2"/><path class="nozzle" d="M38 26h4l-2 4z"/><circle class="tip" cx="40" cy="30.6" r="1.3"/></g>
    <g class="sparkles"><path d="M20 22l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z"/><path d="M58 30l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8z"/><path d="M56 46l.7 1.5 1.5.7-1.5.7-.7 1.5-.7-1.5-1.5-.7 1.5-.7z"/></g>
    <rect class="foot" x="14" y="73" width="52" height="2" rx="1"/>
  </svg>`;
};

// Progress ring around the picture: the track, the progress arc, and the moving highlight of the phase.
const ringSvg = (pct) => {
  const v = clamp(pct ?? 0, 0, 100);
  return `<svg class="ring-svg" viewBox="0 0 100 100" aria-hidden="true"><circle class="track" cx="50" cy="50" r="45"/>${
    v > 0 ? `<circle class="val" cx="50" cy="50" r="45" pathLength="100" stroke-dasharray="${v} 100"/>` : ""
  }<circle class="fx" cx="50" cy="50" r="45" pathLength="100"/></svg>`;
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const BASE_STYLE = `
  :host { --pc-accent: #00ae42; --pc-ok: var(--success-color, #43a047); --pc-warn: var(--warning-color, #ffa600);
          --pc-crit: var(--error-color, #db4437); --pc-idle: var(--disabled-text-color, #9e9e9e); --pc-active: var(--info-color, #039be5);
          /* Text in a state or brand color is mixed with the text color so that it reads at 4.5:1 at least. */
          --pc-accent-text: color-mix(in srgb, var(--pc-accent) 50%, var(--primary-text-color)); }
  ha-card { overflow: hidden; container-type: inline-size; }
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
  :host([hide-title]) .titles > .name, :host([hide-subtitle]) .titles > .sub { display: none; }
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
  .printer { width: 64%; height: 64%; overflow: visible; filter: drop-shadow(0 3px 6px rgba(0,0,0,.18)); }
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
  @container (max-width: 230px) {
    .chip { padding: 4px; flex: none; }
    .chip-text { display: none; }
  }
  @container (max-width: 200px) {
    .header { gap: 6px; }
  }
`;

// Colors of the drawn printer, readable on the light and the dark theme.
const THEME_STYLE = {
  light: ":host { --pc-frame: #e6e9ee; --pc-frame-edge: #c9ced6; --pc-glass: #2a3038; --pc-metal: #8b95a1; --pc-metal-light: #c7ccd3; }",
  dark: ":host { --pc-frame: #3b4149; --pc-frame-edge: #4c535d; --pc-glass: #15191e; --pc-metal: #7d8793; --pc-metal-light: #b9bfc7; }",
};

// In-card confirmation popup at the top of the card, as in the other cards: it stays in view when the card is long.
const DIALOG_STYLE = `
  ha-card.dialog-open { position: relative; min-height: 160px; }
  .backdrop { position: absolute; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: flex-start; justify-content: center;
              padding-top: 12px; box-sizing: border-box; z-index: 9; border-radius: inherit; }
  .modal { background: var(--card-background-color, #1c1c1c); color: var(--primary-text-color); width: min(92%, 340px); max-height: calc(100% - 24px);
           box-sizing: border-box; border-radius: 14px; padding: 16px; box-shadow: 0 8px 30px rgba(0,0,0,.4); display: flex; flex-direction: column; gap: 12px; }
  .modal .msg { font-size: 14px; line-height: 1.4; }
  .modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
`;

const FULL_STYLE = `
  .content { padding: 8px 12px 12px; display: flex; flex-direction: column; gap: 12px; }
  .hero { display: flex; gap: 14px; align-items: center; }
  .big { font-size: 30px; font-weight: 400; line-height: 1; }
  .big small { font-size: 14px; margin-left: 2px; color: var(--secondary-text-color); }
  .big.word { font-size: 22px; }
  .remain { font-size: 13px; color: var(--primary-text-color); font-weight: 500; }
  .remain .muted { font-weight: 400; white-space: nowrap; }
  .thumb { flex: none; width: 76px; height: 76px; border-radius: 12px; overflow: hidden; background: var(--secondary-background-color, rgba(127,127,127,.08)); }
  .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
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
  .unit-head .hum { margin-left: auto; display: inline-flex; align-items: center; gap: 2px; }
  .unit-head .icon { width: 14px; height: 14px; }
  .slots { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
  .slot { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 4px 6px; border-radius: 10px; min-width: 0;
          background: var(--secondary-background-color, rgba(127,127,127,.08)); border: 1px solid transparent; box-sizing: border-box; }
  .slot.active { border-color: color-mix(in srgb, var(--pc-accent) 60%, transparent); background: color-mix(in srgb, var(--pc-accent) 10%, var(--secondary-background-color, transparent)); }
  .swatch { width: 26px; height: 26px; border-radius: 50%; background: var(--sw); box-shadow: inset 0 0 0 1px rgba(127,127,127,.35); position: relative; }
  .swatch::after { content: ""; position: absolute; inset: 9px; border-radius: 50%; background: var(--card-background-color, #fff); opacity: .9; }
  .slot.empty .swatch { background: none; box-shadow: none; border: 1.5px dashed var(--secondary-text-color); box-sizing: border-box; opacity: .7; }
  .slot.empty .swatch::after { display: none; }
  .slot .ftype { font-size: 12px; font-weight: 500; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .slot .fname { font-size: 10px; color: var(--secondary-text-color); max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .slot .bar { width: 80%; }
  .camera img { width: 100%; max-height: 260px; object-fit: cover; border-radius: 10px; display: block; background: var(--secondary-background-color, rgba(127,127,127,.08)); }
  @container (max-width: 340px) {
    .ring { width: 96px; height: 96px; }
    .hero { gap: 10px; }
    .thumb { width: 60px; height: 60px; }
    .big { font-size: 26px; }
  }
  @container (max-width: 270px) {
    .thumb { display: none; }
    .slots { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @container (max-width: 210px) {
    .ring { width: 76px; height: 76px; }
    .big { font-size: 22px; }
  }
`;

const MINI_STYLE = `
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
const DIALOG_TAGS = new Set(["HA-MORE-INFO-DIALOG", "HA-DIALOG", "DIALOG"]);
const isOutside = (card, ev) => {
  const path = ev.composedPath();
  return !path.includes(card) && !path.some((n) => DIALOG_TAGS.has(n?.tagName));
};
// "A click elsewhere" is caught on the pointer, not only on the click event: on iOS (Safari and the companion app)
// a tap on something that is not clickable (the background, an empty spot, a card with no action) sends no click to
// the page. It counts when the press and the release are both outside the card (a slider dragged out of the card
// does not fold it), and a scroll does not count (the browser cancels the pointer). Keyboard clicks still go through
// the click event. `tap(ev)` (press and release at the same spot) is for the tests.
const watchOutside = (isOut, handler) => {
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
const CONFIRM_GUARD_MS = 400;

// Inlined logos (data: URIs) get their src once, then the same node is moved into every later render.
const DATA_IMGS = [];
const DATA_IMG_IDS = new Map();
const imgTag = (src, attrs) => {
  if (!String(src).startsWith("data:")) return `<img src="${esc(src)}" ${attrs}>`;
  let id = DATA_IMG_IDS.get(src);
  if (id === undefined) {
    id = DATA_IMGS.push(src) - 1;
    DATA_IMG_IDS.set(src, id);
  }
  return `<img data-img="${id}" ${attrs}>`;
};

// Elements a click acts on, and how one is told from the others across renders (focus kept on re-render).
const FOCUS_SELECTOR = "[data-action], [data-entity]";
const focusKey = (el) => {
  const data = Object.entries({ ...el.dataset });
  return data.length ? `${el.tagName}|${JSON.stringify(data)}` : "";
};

// Job commands: button entity key, confirmation text, icon, button style.
const COMMANDS = {
  pause: { text: "confirm_pause", icon: "pause", cls: "" },
  resume: { text: "confirm_resume", icon: "play", cls: "primary" },
  stop: { text: "confirm_stop", icon: "stop", cls: "danger" },
};

class PrinterBase extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._html = "";
    this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
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
    this._outside?.off();
    window.removeEventListener("keydown", this._onKey);
    this._pressing = false;
    window.removeEventListener("pointerup", this._onPressEnd, true);
    window.removeEventListener("pointercancel", this._onPressEnd, true);
    // Left (another dashboard view, a conditional card hidden): back to the defaults, so that the card does not come
    // back unfolded or with its popup open.
    this._toggled = new Map();
    this._confirm = null;
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
    let html = this._render();
    if (this._confirm) {
      html = html.replace(/<ha-card([^>]*)>([\s\S]*)<\/ha-card>\s*$/, (_, attrs, inner) => `<ha-card${attrs} class="dialog-open">${inner}${this._confirmHtml()}</ha-card>`);
    }
    if (html === this._html) return;
    const focused = this._confirm && this.shadowRoot.activeElement?.dataset?.action;
    // The focus is kept across a rewrite for the keyboard only: after a mouse click, it would draw the focus ring.
    const kept = this._confirm || this._byPointer ? null : this._focusedSpot();
    this._html = html;
    this.shadowRoot.innerHTML = html;
    this._placeImages();
    if (kept) this._focusables(kept.key)[kept.index]?.focus({ preventScroll: true });
    if (this._confirm) {
      const sel = focused === "confirm_cancel" ? '[data-action="confirm_cancel"]' : ".modal .primary";
      this.shadowRoot.querySelector(sel)?.focus({ preventScroll: true });
    }
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
        const { entity } = this._confirm;
        this._closeConfirm();
        this._call("button", "press", { entity_id: entity });
      } else if (action === "confirm_cancel" || (action === "confirm_backdrop" && path[0] === el)) {
        this._closeConfirm();
      }
      return;
    }
    if (!el) return;
    ev.stopPropagation();
    const { action, entity, cmd } = el.dataset;
    if (action === "zoom") return this._toggleZoom(ev);
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
    const sub = this._fileName(dev) && (JOB_PHASES.has(phase) || phase === "finished") ? this._fileName(dev) : dev.model || b.name;
    return `
      <div class="header">
        <a class="logo-link type-icon ${cls}" href="${b.site}" target="_blank" rel="noopener noreferrer" title="${esc(b.name)}">${imgTag(b.logo, `class="logo" alt="${esc(b.name)}"`)}${svgIcon(ICONS.printer, "type")}</a>
        <div class="titles">
          <div class="name">${esc(this._config.title || dev.name)}</div>
          <div class="sub">${esc(sub)}</div>
        </div>
        <span class="chip clickable ${PHASE_CLASS[phase]}" role="button" tabindex="0" data-entity="${esc(status || "")}" title="${esc(label)}" aria-label="${esc(label)}"><span class="dot"></span><span class="chip-text">${esc(label)}</span></span>
        ${this._zoomButton()}
      </div>`;
  }

  // Header icon color: the phase, red when the printer reports an error.
  _iconState(dev, phase) {
    return this._error(dev, phase) ? "crit" : PHASE_CLASS[phase];
  }

  _zoomButton() {
    return "";
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

class PrinterCard extends PrinterBase {
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
    const parts = [this._hero(dev, phase)];
    const buttons = c.show_controls !== false ? this._commands(dev, phase).map((cmd) => this._cmdButton(dev, cmd)) : [];
    const light = this._lightButton(dev);
    if (buttons.length || light) parts.push(`<div class="controls">${buttons.join("")}${light}</div>`);
    if (c.show_temperatures !== false) parts.push(this._temperatures(dev));
    if (c.show_ams !== false) parts.push(this._ams(dev));
    if (c.show_job !== false) parts.push(this._job(dev, phase));
    if (c.show_camera !== false) parts.push(this._camera(dev));
    return `<style>${BASE_STYLE}${FULL_STYLE}${this._accentStyle(dev)}</style>
      <ha-card>
        ${this._header(dev, phase)}
        <div class="content">${parts.filter(Boolean).join("")}</div>
      </ha-card>`;
  }

  _hero(dev, phase) {
    const pct = this._progress(dev, phase);
    const job = JOB_PHASES.has(phase);
    const big =
      job || (phase === "finished" && pct !== null)
        ? `<div class="big">${pct === null ? "—" : `${pct}<small>%</small>`}</div>`
        : `<div class="big word">${esc(phase === "finished" ? this._t("done") : phase === "idle" ? this._t("ready") : this._t(`s_${phase}`))}</div>`;
    const lines = [];
    const err = this._error(dev, phase);
    if (err) lines.push(`<div class="alert-line">${svgIcon(ICONS.alert)}<span>${esc(err)}</span></div>`);
    lines.push(this._timeLine(dev, phase));
    const layers = job || phase === "finished" ? this._layers(dev) : "";
    if (layers) lines.push(`<div class="line clickable" role="button" tabindex="0" data-entity="${esc(dev.e.layer)}">${svgIcon(ICONS.layers)}<span>${esc(layers)}</span></div>`);
    const stage = job && dev.e.stage ? this._fmtState(this._s(dev.e.stage)) : null;
    if (stage && stage.toLowerCase() !== this._t(`s_${phase}`).toLowerCase()) lines.push(`<div class="line clickable" role="button" tabindex="0" data-entity="${esc(dev.e.stage)}">${svgIcon(ICONS.info)}<span>${esc(stage)}</span></div>`);
    return `<div class="hero">
      ${this._ring(dev, phase, pct, printerSvg(phase, pct, this._filament(dev)))}
      <div class="info">${big}${lines.filter(Boolean).join("")}</div>
      ${this._thumb(dev)}
    </div>`;
  }

  // Thumbnail of the print: the integration's cover image (Bambu Lab, PrusaLink, Moonraker), else the camera.
  _thumb(dev) {
    if (this._config.show_thumbnail === false) return "";
    for (const id of [dev.e.cover, this._config.show_camera === false ? dev.e.camera : null]) {
      const url = this._s(id)?.attributes?.entity_picture;
      if (url && this._s(id).state !== "unavailable") {
        return `<div class="thumb clickable" role="button" tabindex="0" data-entity="${esc(id)}" aria-label="${esc(this._t("thumbnail"))}"><img src="${esc(url)}" alt=""></div>`;
      }
    }
    return "";
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

  _slot(id) {
    const s = this._s(id);
    if (!s) return "";
    const a = s.attributes || {};
    const empty = a.empty === true || (!valid(s) && !a.type) || String(s.state).toLowerCase() === "empty";
    const color = filamentColor(a.color);
    const remain = Number(a.remain);
    const bar = !empty && Number.isFinite(remain) && remain >= 0 ? `<div class="bar ${remain <= 10 ? "crit" : remain <= 25 ? "warn" : "ok"}"><div style="width:${clamp(Math.round(remain), 0, 100)}%"></div></div>` : "";
    const label = empty ? this._t("empty") : [a.type, valid(s) ? s.state : "", Number.isFinite(remain) && remain >= 0 ? `${Math.round(remain)} %` : ""].filter(Boolean).join(", ");
    return `<div class="slot clickable${empty ? " empty" : ""}${a.active ? " active" : ""}" role="button" tabindex="0" data-entity="${esc(id)}" aria-label="${esc(label)}" title="${esc(label)}">
      <span class="swatch" style="--sw:${esc(color || "transparent")}"></span>
      <span class="ftype">${esc(empty ? this._t("empty") : a.type || "—")}</span>
      <span class="fname">${esc(empty ? "" : valid(s) ? s.state : "")}</span>${bar}</div>`;
  }

  _ams(dev) {
    const locale = this._locale();
    const units = dev.ams.map((u) => {
      const hum = num(this._s(u.e.humidity));
      const idx = num(this._s(u.e.humidity_index));
      const temp = this._s(u.e.ams_temp);
      const meta = [
        hum !== null ? `<span class="hum clickable" role="button" tabindex="0" data-entity="${esc(u.e.humidity)}" title="${esc(this._t("humidity"))}">${svgIcon(ICONS.humidity)}${Math.round(hum)} %</span>` : idx !== null ? `<span class="hum clickable" role="button" tabindex="0" data-entity="${esc(u.e.humidity_index)}" title="${esc(this._t("humidity"))}">${svgIcon(ICONS.humidity)}${Math.round(idx)}/5</span>` : "",
        valid(temp) ? `<span>${esc(fmtTemp(temp, locale))}</span>` : "",
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

  _camera(dev) {
    const id = dev.e.camera;
    const s = this._s(id);
    const url = s?.attributes?.entity_picture;
    if (!url || s.state === "unavailable") return "";
    return this._section("camera", ICONS.camera, this._t("camera"), `<div class="camera clickable" role="button" tabindex="0" data-entity="${esc(id)}" aria-label="${esc(this._t("camera"))}"><img src="${esc(url)}" alt=""></div>`);
  }
}

// The mini card is a full card drawn compact: its detail button (top right, `zoom: false` removes it) switches it
// to the full card's content and back, and a click anywhere else on the page brings the compact view back.
class PrinterMiniCard extends PrinterCard {
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
    const light = this._lightButton(dev, true);
    return `<style>${BASE_STYLE}${MINI_STYLE}${this._accentStyle(dev)}</style>
      <ha-card>
        ${this._header(dev, phase)}
        <div class="content">
          ${this._ring(dev, phase, pct, inner)}
          <div class="info">${lines.filter(Boolean).join("")}</div>
          ${buttons.length || light ? `<div class="controls">${buttons.join("")}${light}</div>` : ""}
        </div>
      </ha-card>`;
  }
}

// ---------------------------------------------------------------------------
// Visual editors (ha-form)
// ---------------------------------------------------------------------------

class PrinterEditorBase extends HTMLElement {
  static get toggles() {
    return [];
  }

  static extraFields() {
    return [];
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _schema() {
    const tr = (k) => t(this._hass, this._config, k);
    return [
      { name: "device", selector: { select: { mode: "dropdown", options: listPrinters(this._hass) } } },
      { name: "title", selector: { text: {} } },
      ...this.constructor.extraFields(tr),
      { type: "grid", name: "", schema: this.constructor.toggles.map(([name]) => ({ name, selector: { boolean: {} } })) },
      { name: "light_entity", selector: { entity: { domain: ["light", "switch"] } } },
      {
        name: "language",
        selector: { select: { mode: "dropdown", options: [{ value: "", label: tr("lang_auto") }, ...LANGUAGES.map(([value, label]) => ({ value, label }))] } },
      },
    ];
  }

  _render() {
    if (!this._hass || !this._config) return;
    const toggles = this.constructor.toggles;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => t(this._hass, this._config, s.name);
      this._form.computeHelper = (s) => (s.name === "zoom" ? t(this._hass, this._config, "zoom_helper") : undefined);
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        const config = { ...ev.detail.value };
        const defaults = { ...Object.fromEntries(toggles), ...this.constructor.defaults };
        // Keep the YAML minimal: drop empty values and options left at their default.
        for (const [k, v] of Object.entries(config)) {
          if (v === "" || v === undefined || v === null || (k in defaults && JSON.stringify(v) === JSON.stringify(defaults[k]))) delete config[k];
        }
        this._config = config;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    const data = { ...this.constructor.defaults, ...this._config };
    for (const [name, def] of toggles) if (data[name] === undefined) data[name] = def;
    if (!data.device) data.device = PrinterCard.getStubConfig(this._hass).device;
    this._form.hass = this._hass;
    const h = this._hass;
    const deps = [this._config, h.entities, h.devices, lang(h, this._config)];
    if (this._deps && deps.every((d, i) => d === this._deps[i])) return;
    this._deps = deps;
    this._form.data = data;
    this._form.schema = this._schema();
  }
}

class PrinterCardEditor extends PrinterEditorBase {
  static get toggles() {
    return [
      ["show_title", true],
      ["show_subtitle", true],
      ["show_controls", true],
      ["show_light", true],
      ["show_thumbnail", true],
      ["show_temperatures", true],
      ["show_ams", true],
      ["show_job", true],
      ["show_camera", true],
    ];
  }

  static get defaults() {
    return { collapsed: DEFAULT_COLLAPSED };
  }

  static extraFields(tr) {
    return [
      {
        name: "collapsed",
        selector: { select: { multiple: true, mode: "list", options: SECTIONS.map((value) => ({ value, label: tr(value) })) } },
      },
      { name: "camera_entity", selector: { entity: { domain: ["camera", "image"] } } },
    ];
  }
}

class PrinterMiniCardEditor extends PrinterEditorBase {
  static get toggles() {
    return [
      ["show_title", true],
      ["show_subtitle", true],
      ["show_controls", true],
      ["show_light", true],
      ["zoom", true],
    ];
  }

  static get defaults() {
    return {};
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

const define = (name, cls) => {
  if (!customElements.get(name)) customElements.define(name, cls);
};
define("printer-3d-card", PrinterCard);
define("printer-3d-mini-card", PrinterMiniCard);
define("printer-3d-card-editor", PrinterCardEditor);
define("printer-3d-mini-card-editor", PrinterMiniCardEditor);

window.customCards = window.customCards || [];
for (const card of [
  {
    type: "printer-3d-card",
    name: "3D Printer Card",
    description: "Monitor and control a Bambu Lab, OctoPrint, Moonraker (Klipper) or PrusaLink 3D printer: progress, remaining time, layers, temperatures, AMS filaments, camera and pause / resume / stop.",
  },
  {
    type: "printer-3d-mini-card",
    name: "3D Printer Mini Card",
    description: "Compact 3D printer progress: ring, remaining time, end time and layers, with a detail view.",
  },
]) {
  if (!window.customCards.some((c) => c.type === card.type)) window.customCards.push({ ...card, preview: true, documentationURL: "https://github.com/juju35/ha-3d-printer-card" });
}

console.info(`%c 3D-PRINTER-CARD %c v${VERSION} `, "color: white; background: #00ae42; font-weight: 700;", "color: #00ae42; background: white; font-weight: 700;");
