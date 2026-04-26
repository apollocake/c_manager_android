// --- Desktop trigger ---
// Tracks the last focused editable element so the popup knows where to inject
// when the user clicks the pinned extension icon rather than using long-press.

let lastFocusedInput = null;

document.addEventListener(
  "focusin",
  (e) => {
    const t = e.target;
    if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) {
      lastFocusedInput = t;
    }
  },
  true
);

browser.runtime.onMessage.addListener((message) => {
  if (message?.type === "injector-open") {
    createPopup(lastFocusedInput);
  }
});
