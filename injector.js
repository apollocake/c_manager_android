let LONG_PRESS_DURATION = 1100; // ms before popup appears — may be overridden from storage

let longPressTimer = null;
let activeInput = null;
let popupEl = null;
let popupRepositionRaf = null;

const DEFAULT_RESOURCES = [
  {
    label: "Error: No resources provided",
    text: ["Please define window.INJECTOR_RESOURCES as an array of { label, text } objects where text is an array of strings."]
  }
];

let RESOURCES = Array.isArray(window.INJECTOR_RESOURCES)
  ? window.INJECTOR_RESOURCES
  : DEFAULT_RESOURCES;

// Override defaults with any settings persisted via the settings page.
browser.storage.local.get(["resources", "longPressDuration"]).then((data) => {
  if (Array.isArray(data.resources) && data.resources.length > 0) {
    RESOURCES = data.resources;
  }
  if (typeof data.longPressDuration === "number") {
    LONG_PRESS_DURATION = data.longPressDuration;
  }
});
// --- Popup ---

function createPopup(input) {
  removePopup();
  activeInput = input;

  // Outer wrapper uses fixed positioning so it stays near the input on scroll
  popupEl = document.createElement("div");
  Object.assign(popupEl.style, {
    position: "fixed",
    top: "0px",
    left: "0px",
    zIndex: "2147483647",
  });

  const container = document.createElement("div");
  container.className = "injector-popup";

  const validItems = RESOURCES.filter(
    (item) =>
      item &&
      typeof item.label === "string" &&
      Array.isArray(item.text) &&
      item.text.length > 0 &&
      item.text.every((part) => typeof part === "string")
  );

  validItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "injector-row";

    const label = document.createElement("span");
    label.className = "injector-label";
    label.textContent = item.label;

    const insertBtn = document.createElement("button");
    insertBtn.className = "injector-insert-button";
    insertBtn.type = "button";
    insertBtn.textContent = "Insert";
    insertBtn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      injectText(activeInput, item.text);
      removePopup();
    });

    row.appendChild(label);
    row.appendChild(insertBtn);
    container.appendChild(row);
  });

  popupEl.appendChild(container);
  document.body.appendChild(popupEl);

  // Blur after capturing the insertion target so Android can dismiss the keyboard.
  if (typeof activeInput?.blur === "function") {
    activeInput.blur();
  }

  positionPopup();
  addRepositionListeners();

  // Dismiss on any interaction outside the popup
  setTimeout(() => {
    document.addEventListener("pointerdown", handleOutside, true);
    document.addEventListener("touchstart", handleOutside, true);
    document.addEventListener("mousedown", handleOutside, true);
  }, 0);
}

function positionPopup() {
  if (!popupEl || !activeInput) {
    return;
  }

  const rect = activeInput.getBoundingClientRect();
  const viewportWidth = window.visualViewport?.width || window.innerWidth;
  const popupWidth = popupEl.offsetWidth || 170;

  const top = Math.max(4, rect.bottom + 6);
  const left = Math.min(
    Math.max(4, rect.left),
    Math.max(4, viewportWidth - popupWidth - 4)
  );

  popupEl.style.top = `${top}px`;
  popupEl.style.left = `${left}px`;
}

function schedulePositionPopup() {
  if (!popupEl) {
    return;
  }

  if (popupRepositionRaf) {
    cancelAnimationFrame(popupRepositionRaf);
  }

  popupRepositionRaf = requestAnimationFrame(() => {
    popupRepositionRaf = null;
    positionPopup();
  });
}

function addRepositionListeners() {
  window.addEventListener("scroll", schedulePositionPopup, true);
  window.addEventListener("resize", schedulePositionPopup, true);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", schedulePositionPopup);
    window.visualViewport.addEventListener("scroll", schedulePositionPopup);
  }
}

function removeRepositionListeners() {
  window.removeEventListener("scroll", schedulePositionPopup, true);
  window.removeEventListener("resize", schedulePositionPopup, true);
  if (window.visualViewport) {
    window.visualViewport.removeEventListener("resize", schedulePositionPopup);
    window.visualViewport.removeEventListener("scroll", schedulePositionPopup);
  }
  if (popupRepositionRaf) {
    cancelAnimationFrame(popupRepositionRaf);
    popupRepositionRaf = null;
  }
}

function handleOutside(e) {
  if (!popupEl) {
    return;
  }

  const path = typeof e.composedPath === "function" ? e.composedPath() : [];
  const clickedInsidePopup = path.includes(popupEl) || popupEl.contains(e.target);

  if (!clickedInsidePopup) {
    removePopup();
  }
}

function removePopup() {
  removeRepositionListeners();
  if (popupEl) {
    popupEl.remove();
    popupEl = null;
  }
  document.removeEventListener("pointerdown", handleOutside, true);
  document.removeEventListener("touchstart", handleOutside, true);
  document.removeEventListener("mousedown", handleOutside, true);
  activeInput = null;
}

// --- Text injection ---

function resolveInsertText(rawTextParts, input) {
  const joinedText = rawTextParts
    .map((part) => String(part))
    .join("\n");

  const isMultilineTarget = input?.isContentEditable || input?.tagName === "TEXTAREA";
  if (isMultilineTarget) {
    return joinedText;
  }

  // Single-line controls cannot hold line breaks, so flatten them.
  return joinedText.replace(/\n/g, " ");
}

function injectText(input, textParts) {
  if (!input) return;
  if (!Array.isArray(textParts) || textParts.length === 0) return;
  const resolvedText = resolveInsertText(textParts, input);

  // contenteditable elements (e.g. rich text editors)
  if (input.isContentEditable) {
    input.textContent = `${input.textContent || ""}${resolvedText}`;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return;
  }

  const newValue = `${input.value}${resolvedText}`;

  // Use the native value setter so React-style frameworks detect the change
  const proto =
    input.tagName === "TEXTAREA"
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  if (setter) {
    setter.call(input, newValue);
  } else {
    input.value = newValue;
  }

  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

// --- Long-press detection ---

function handleTouchStart(e) {
  const t = e.target;
  const isInput =
    t.tagName === "INPUT" ||
    t.tagName === "TEXTAREA" ||
    t.isContentEditable;

  if (!isInput) return;

  longPressTimer = setTimeout(() => {
    createPopup(t);
  }, LONG_PRESS_DURATION);
}

function cancelLongPress() {
  clearTimeout(longPressTimer);
  longPressTimer = null;
}

document.addEventListener("touchstart", handleTouchStart, { passive: true });
document.addEventListener("touchend", cancelLongPress, { passive: true });
document.addEventListener("touchmove", cancelLongPress, { passive: true });
