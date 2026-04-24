"use strict";

const DEFAULT_DURATION = 1100;
const saveBtn = document.getElementById("save-btn");
const longPressInput = document.getElementById("long-press-input");
const resourcesUrlInput = document.getElementById("resources-url-input");
const statusEl = document.getElementById("status");

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

async function load() {
  const data = await browser.storage.local.get(["longPressDuration", "resourcesJsonUrl"]);

  longPressInput.value =
    typeof data.longPressDuration === "number" ? data.longPressDuration : DEFAULT_DURATION;
  resourcesUrlInput.value = typeof data.resourcesJsonUrl === "string" ? data.resourcesJsonUrl : "";
}

// ---------------------------------------------------------------------------
// Save
// ---------------------------------------------------------------------------

saveBtn.addEventListener("click", async () => {
  const duration = parseInt(longPressInput.value, 10);
  const longPressDuration = Number.isFinite(duration) ? duration : DEFAULT_DURATION;
  const resourcesJsonUrl = resourcesUrlInput.value.trim();

  if (resourcesJsonUrl) {
    try {
      const parsedUrl = new URL(resourcesJsonUrl);
      if (!/^https?:$/.test(parsedUrl.protocol)) {
        showStatus("Only http/https URLs are supported.");
        return;
      }
    } catch (error) {
      showStatus("Enter a valid URL.");
      return;
    }
  }

  await browser.storage.local.set({
    longPressDuration,
    resourcesJsonUrl,
  });

  // Runtime hydration now fetches from URL and does not persist imported resource payloads.
  await browser.storage.local.remove("resources");

  if (!resourcesJsonUrl) {
    await browser.storage.local.remove("resourcesJsonUrl");
  }
  showStatus("Saved!");
});

function showStatus(msg) {
  statusEl.textContent = msg;
  statusEl.classList.add("visible");
  setTimeout(() => statusEl.classList.remove("visible"), 2000);
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

load();
