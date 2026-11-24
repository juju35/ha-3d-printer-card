// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
import { STRINGS } from "./i18n/strings.js";

export const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const lang = (hass, config) => {
  const l = config?.language || (hass && (hass.locale?.language || hass.language)) || "en";
  return STRINGS[l] ? l : STRINGS[l.split("-")[0]] ? l.split("-")[0] : "en";
};

// Locale for Intl: the card's language option, else Home Assistant's full locale (keeps its region, e.g. pt-BR,
// de-CH) when its base matches the card language, else that language. A bare "pt" becomes "pt-PT".
export const intlLocale = (hass, config) => {
  const l = lang(hass, config);
  const src = config?.language || (hass && (hass.locale?.language || hass.language)) || "";
  const out = src && src.split("-")[0] === l.split("-")[0] ? src : l;
  return out === "pt" ? "pt-PT" : out;
};

export const t = (hass, config, key, vars = {}) =>
  String(STRINGS[lang(hass, config)][key] ?? STRINGS.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

export const valid = (s) => !!s && !["unknown", "unavailable", ""].includes(s.state);
export const num = (s) => {
  if (!valid(s)) return null;
  const v = parseFloat(s.state);
  return Number.isFinite(v) ? v : null;
};
export const pretty = (v) => {
  const s = String(v ?? "").replace(/_/g, " ").trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";
};
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export const NUM_FMT = {};
export const fmtUnit = (v, unit, locale, digits = 0) =>
  (NUM_FMT[`${locale}|${unit}|${digits}`] ??= new Intl.NumberFormat(locale, { style: "unit", unit, unitDisplay: "short", maximumFractionDigits: digits })).format(v);

// A duration in hours, as "1 h 23 min", "45 min" or "12 h".
export const fmtHours = (h, locale) => {
  if (h === null || h === undefined || !Number.isFinite(h)) return "—";
  if (h <= 0) return fmtUnit(0, "minute", locale);
  const total = Math.round(h * 60);
  if (total < 60) return fmtUnit(Math.max(1, total), "minute", locale);
  const m = total % 60;
  const H = fmtUnit(Math.floor(total / 60), "hour", locale);
  return m && total < 6000 ? `${H} ${fmtUnit(m, "minute", locale)}` : H;
};

// Duration sensor in hours, whatever its unit.
export const TO_HOURS = { s: 1 / 3600, sec: 1 / 3600, min: 1 / 60, h: 1, hr: 1, d: 24 };
export const hoursOf = (s) => {
  const v = num(s);
  if (v === null) return null;
  return v * (TO_HOURS[s.attributes?.unit_of_measurement] ?? 1 / 60);
};

export const RTF = {};
export const ago = (locale, ms) => {
  const diff = (ms - Date.now()) / 1000;
  const rtf = (RTF[locale] ??= new Intl.RelativeTimeFormat(locale, { numeric: "auto" }));
  const abs = Math.abs(diff);
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  return rtf.format(Math.round(diff / 86400), "day");
};

export const DTF = {};
// Clock time of a moment, with the weekday when it is not today.
export const fmtClock = (ms, locale) => {
  const d = new Date(ms);
  const today = new Date().toDateString() === d.toDateString();
  const key = `${locale}|${today}`;
  DTF[key] ??= new Intl.DateTimeFormat(locale, today ? { hour: "2-digit", minute: "2-digit" } : { weekday: "short", hour: "2-digit", minute: "2-digit" });
  return DTF[key].format(d);
};

// Temperature value, rounded, in the unit of its sensor.
export const fmtTemp = (s, locale) => {
  const v = num(s);
  if (v === null) return "—";
  const u = s.attributes?.unit_of_measurement;
  if (u === "°F") return fmtUnit(Math.round(v), "fahrenheit", locale);
  return fmtUnit(Math.round(v), "celsius", locale);
};

// "#RRGGBBAA" (Bambu Lab) or "#RRGGBB" → a CSS color, null when it is not one.
export const filamentColor = (c) => {
  const m = /^#?([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(String(c ?? "").trim());
  if (!m) return null;
  const alpha = m[2] ? parseInt(m[2], 16) / 255 : 1;
  return alpha >= 0.99 ? `#${m[1].toLowerCase()}` : `rgba(${parseInt(m[1].slice(0, 2), 16)}, ${parseInt(m[1].slice(2, 4), 16)}, ${parseInt(m[1].slice(4), 16)}, ${alpha.toFixed(2)})`;
};

export const svgIcon = (path, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
