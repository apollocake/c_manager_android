const LONG_PRESS_DURATION = 500; // ms before popup appears

let longPressTimer = null;
let activeInput = null;
let popupEl = null;

debugger;
console.log("Injector script loaded");
// --- Popup ---

function createPopup(input) {
  debugger;
  removePopup();
  activeInput = input;

  const rect = input.getBoundingClientRect();

  // Outer wrapper uses fixed positioning so it stays near the input on scroll
  popupEl = document.createElement("div");
  Object.assign(popupEl.style, {
    position: "fixed",
    top: `${rect.bottom + 6}px`,
    left: `${Math.max(4, rect.left)}px`,
    zIndex: "2147483647",
  });

  // Shadow DOM isolates popup styles from the host page
  const shadow = popupEl.attachShadow({ mode: "closed" });

  const style = document.createElement("style");
  style.textContent = `
    .popup {
      background: #ffffff;
      border: 1px solid #d0d0d0;
      border-radius: 8px;
      padding: 8px 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      display: flex;
      align-items: center;
    }
    button {
      background: #ff9500;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      padding: 8px 14px;
      font-size: 14px;
      font-family: sans-serif;
      cursor: pointer;
      white-space: nowrap;
      -webkit-tap-highlight-color: transparent;
    }
    button:active {
      background: #cc7700;
    }
  `;

  const container = document.createElement("div");
  container.className = "popup";

  const btn = document.createElement("button");
  btn.textContent = "Insert Hello World";
  debugger;
  btn.addEventListener("click", (e) => {
  debugger;
    e.stopPropagation();
    injectText(activeInput);
    removePopup();
  });

  container.appendChild(btn);
  shadow.appendChild(style);
  shadow.appendChild(container);
  document.body.appendChild(popupEl);

  // Dismiss on any interaction outside the popup
  setTimeout(() => {
    document.addEventListener("touchstart", handleOutside, true);
    document.addEventListener("mousedown", handleOutside, true);
  }, 0);
}

function handleOutside(e) {
  if (popupEl && !popupEl.contains(e.target)) {
    removePopup();
  }
}

function removePopup() {
  if (popupEl) {
    popupEl.remove();
    popupEl = null;
  }
  document.removeEventListener("touchstart", handleOutside, true);
  document.removeEventListener("mousedown", handleOutside, true);
  activeInput = null;
}

// --- Text injection ---

function injectText(input) {
  if (!input) return;
  input.focus();

  // contenteditable elements (e.g. rich text editors)
  if (input.isContentEditable) {
    document.execCommand("insertText", false, "Hello World");
    return;
  }

  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  const newValue =
    input.value.slice(0, start) + "Hello World" + input.value.slice(end);

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

  input.selectionStart = input.selectionEnd = start + "Hello World".length;
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
