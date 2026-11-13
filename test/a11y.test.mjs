// Keyboard access, names of the elements without text, and reduced motion.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { devices, entities, states } from "../scripts/mock-states.mjs";
import { load } from "./load.mjs";

const pc = load();
const makeHass = () => ({ entities, devices, states, language: "en", callService() {} });

const newCard = (config = {}, Card = pc.PrinterCard) => {
  const card = new Card();
  card.setConfig({ device: "X1 Carbon", collapsed: [], ...config });
  card.hass = makeHass();
  return card;
};

// Opening tags of the elements a click acts on: an entity (more-info) or an action.
const clickables = (html) => html.match(/<[a-z-]+\b[^>]*\bdata-(?:entity|action)="[^"]*"[^>]*>/g) || [];

test("every clickable element of the full and mini cards can be reached and used from the keyboard", () => {
  const mini = newCard({}, pc.PrinterMiniCard);
  const pages = [newCard(), newCard({ device: "Voron 2.4" }), mini];
  for (const card of pages) {
    const tags = clickables(card.shadowRoot.innerHTML).filter((tag) => !/data-action="confirm_backdrop"/.test(tag));
    assert.ok(tags.length > 3, "the card has clickable elements");
    for (const tag of tags) {
      if (tag.startsWith("<button") || tag.startsWith("<a ")) continue;
      assert.match(tag, /\brole="button"/, tag);
      assert.match(tag, /\btabindex="0"/, tag);
    }
  }
});

test("icon-only buttons, the ring and the thumbnail have a name", () => {
  const mini = newCard({}, pc.PrinterMiniCard).shadowRoot.innerHTML;
  for (const tag of mini.match(/<button class="btn[^"]*round[^>]*>/g)) assert.match(tag, /aria-label="[^"]+"/);
  const full = newCard().shadowRoot.innerHTML;
  assert.match(full, /<div class="ring [^"]*"[^>]*aria-label="Progress 47 %"/);
  assert.match(full, /class="thumb clickable"[^>]*aria-label="Thumbnail of the print"/);
});

test("the section titles are buttons that tell whether they are unfolded", () => {
  const html = newCard({ collapsed: ["camera"] }).shadowRoot.innerHTML;
  assert.match(html, /role="button" tabindex="0" data-action="toggle_section" data-section="camera" aria-expanded="false"/);
  assert.match(html, /data-section="ams" aria-expanded="true"/);
});

test("Enter and Space act on an element with the button role", () => {
  const card = newCard();
  let clicks = 0;
  let prevented = 0;
  const target = { getAttribute: (a) => (a === "role" ? "button" : null), click: () => clicks++ };
  for (const key of ["Enter", " ", "a"]) card.shadowRoot.listeners.keydown({ key, target, preventDefault: () => prevented++ });
  assert.equal(clicks, 2);
  assert.equal(prevented, 2);
});

test("Escape closes the confirmation popup", () => {
  const card = newCard();
  card._onClick({ composedPath: () => [{ dataset: { action: "job", cmd: "pause", entity: "button.x1_carbon_pause_printing" } }], stopPropagation() {} });
  assert.match(card.shadowRoot.innerHTML, /dialog-open/);
  card._onKey({ key: "Escape", stopPropagation() {} });
  assert.doesNotMatch(card.shadowRoot.innerHTML, /dialog-open/);
});

test("every animation stops for prefers-reduced-motion", () => {
  const src = readFileSync(new URL("../src/3d-printer-card.js", import.meta.url), "utf8");
  assert.match(src, /@media \(prefers-reduced-motion: reduce\) \{ \*, \*::before, \*::after \{ transition: none !important; animation: none !important; \} \}/);
});
