// ---------------------------------------------------------------------------
// Visual editors (ha-form)
// ---------------------------------------------------------------------------
import { DEFAULT_COLLAPSED, SECTIONS } from "./integrations.js";
import { LANGUAGES } from "./translations.js";
import { lang, t } from "./helpers.js";
import { listPrinters } from "./registry-based-resolution.js";
import { PrinterCard } from "./styles.js";

export class PrinterEditorBase extends HTMLElement {
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
      { name: "power_entity", selector: { entity: { domain: ["switch", "light", "input_boolean"] } } },
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
    if (Array.isArray(data.collapsed)) data.collapsed = data.collapsed.filter((k) => SECTIONS.includes(k));
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

export class PrinterCardEditor extends PrinterEditorBase {
  static get toggles() {
    return [
      ["illustration", true],
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
    return { collapsed: DEFAULT_COLLAPSED, illustration_theme: "auto", media_view: "print", camera_view: "live" };
  }

  static extraFields(tr) {
    return [
      { name: "illustration_theme", selector: { select: { mode: "dropdown", options: ["auto", "day", "night"].map((value) => ({ value, label: tr(`theme_${value}`) })) } } },
      {
        name: "collapsed",
        selector: { select: { multiple: true, mode: "list", options: SECTIONS.map((value) => ({ value, label: tr(value) })) } },
      },
      { name: "media_view", selector: { select: { mode: "dropdown", options: ["print", "camera"].map((value) => ({ value, label: tr(`media_${value}`) })) } } },
      { name: "camera_view", selector: { select: { mode: "dropdown", options: ["live", "auto"].map((value) => ({ value, label: tr(`camera_${value}`) })) } } },
      { name: "camera_entity", selector: { entity: { domain: ["camera", "image"] } } },
    ];
  }
}

// The mini card's detail view is the full card: its editor offers the full card's options, plus the detail button.
export class PrinterMiniCardEditor extends PrinterCardEditor {
  static get toggles() {
    return [...PrinterCardEditor.toggles, ["zoom", true]];
  }
}
