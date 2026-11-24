// Entry point: the card's modules in their original order. scripts/bundle.mjs concatenates them in this order into the
// single classic script the card ships as.
import "./card-picker.js";
import "./core.js";
import "./integrations.js";
import "./i18n/strings.js";
import "./translations.js";
import "./helpers.js";
import "./registry-based-resolution.js";
import "./printer-picture.js";
import "./header-illustration.js";
import "./styles.js";
import "./visual-editors.js";
import "./register.js";
