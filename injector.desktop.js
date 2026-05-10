// --- Desktop trigger ---
// Uses shared `lastFocusedInput` from injector.js and reports focused frame
// so toolbar-open can target the right insertion context.

document.addEventListener(
  "focusin",
  (e) => {
    const t = e.target;
    if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) {
      lastFocusedInput = t;
      browser.runtime.sendMessage({ type: "injector-focus" }).catch(() => {
        // Ignore pages where extension messaging is unavailable.
      });
    }
  },
  true
);

browser.runtime.onMessage.addListener((message) => {
  if (message?.type === "injector-open") {
    if (window.top !== window.self) {
      return;
    }

    const targetFrameId = typeof message?.targetFrameId === "number" ? message.targetFrameId : 0;
    const activeEl = document.activeElement;
    const isEditableActive =
      activeEl &&
      (activeEl.tagName === "INPUT" ||
        activeEl.tagName === "TEXTAREA" ||
        activeEl.isContentEditable);

    const localTarget = lastFocusedInput || (isEditableActive ? activeEl : null);
    const popupInput = targetFrameId === 0 ? localTarget : null;

    createPopup(popupInput, { targetFrameId });
  }
});
