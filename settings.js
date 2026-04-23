"use strict";

const DEFAULT_DURATION = 1100;

let snippets = [];

const snippetList = document.getElementById("snippet-list");
const addSnippetBtn = document.getElementById("add-snippet-btn");
const saveBtn = document.getElementById("save-btn");
const longPressInput = document.getElementById("long-press-input");
const statusEl = document.getElementById("status");

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

async function load() {
  const data = await browser.storage.local.get(["resources", "longPressDuration"]);

  if (Array.isArray(data.resources) && data.resources.length > 0) {
    snippets = data.resources.map(normalizeSnippet);
  } else {
    snippets = (window.INJECTOR_RESOURCES || []).map(normalizeSnippet);
  }

  longPressInput.value =
    typeof data.longPressDuration === "number" ? data.longPressDuration : DEFAULT_DURATION;

  renderAll();
}

function normalizeSnippet(item) {
  return {
    label: String(item.label || ""),
    text: Array.isArray(item.text)
      ? item.text.map(String)
      : [String(item.text || "")],
  };
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

function renderAll() {
  snippetList.innerHTML = "";
  snippets.forEach((snippet, index) => {
    snippetList.appendChild(buildSnippetCard(snippet, index));
  });
}

function buildSnippetCard(snippet, index) {
  const card = document.createElement("div");
  card.className = "snippet-card";

  // --- Header row ---
  const header = document.createElement("div");
  header.className = "snippet-header";

  const labelInput = document.createElement("input");
  labelInput.type = "text";
  labelInput.className = "snippet-label-input";
  labelInput.value = snippet.label;
  labelInput.placeholder = "Label";
  labelInput.setAttribute("aria-label", "Snippet label");
  labelInput.addEventListener("input", () => {
    snippets[index].label = labelInput.value;
  });

  const upBtn = iconButton("▲", "Move up", () => moveSnippet(index, -1));
  const downBtn = iconButton("▼", "Move down", () => moveSnippet(index, 1));
  const delBtn = iconButton("✕", "Delete snippet", () => deleteSnippet(index));
  delBtn.classList.add("danger-btn");

  if (index === 0) upBtn.disabled = true;
  if (index === snippets.length - 1) downBtn.disabled = true;

  header.appendChild(labelInput);
  header.appendChild(upBtn);
  header.appendChild(downBtn);
  header.appendChild(delBtn);
  card.appendChild(header);

  // --- Text lines ---
  const linesWrap = document.createElement("div");
  linesWrap.className = "lines-wrap";

  snippet.text.forEach((line, lineIndex) => {
    linesWrap.appendChild(buildLineRow(index, lineIndex, line, snippet.text.length));
  });

  const addLineBtn = document.createElement("button");
  addLineBtn.type = "button";
  addLineBtn.className = "add-line-btn";
  addLineBtn.textContent = "+ Add Line";
  addLineBtn.addEventListener("click", () => addLine(index));

  linesWrap.appendChild(addLineBtn);
  card.appendChild(linesWrap);

  return card;
}

function buildLineRow(snippetIndex, lineIndex, value, totalLines) {
  const row = document.createElement("div");
  row.className = "line-row";

  const num = document.createElement("span");
  num.className = "line-num";
  num.textContent = lineIndex + 1;
  num.setAttribute("aria-hidden", "true");

  const textarea = document.createElement("textarea");
  textarea.className = "line-input";
  textarea.value = value;
  textarea.rows = 2;
  textarea.setAttribute("aria-label", `Line ${lineIndex + 1}`);
  textarea.addEventListener("input", () => {
    snippets[snippetIndex].text[lineIndex] = textarea.value;
  });

  const removeBtn = iconButton("✕", "Remove line", () => removeLine(snippetIndex, lineIndex));
  removeBtn.classList.add("remove-line-btn");
  if (totalLines <= 1) removeBtn.disabled = true;

  row.appendChild(num);
  row.appendChild(textarea);
  row.appendChild(removeBtn);
  return row;
}

function iconButton(label, title, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "icon-btn";
  btn.title = title;
  btn.setAttribute("aria-label", title);
  btn.textContent = label;
  btn.addEventListener("click", onClick);
  return btn;
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

function moveSnippet(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= snippets.length) return;
  [snippets[index], snippets[target]] = [snippets[target], snippets[index]];
  renderAll();
}

function deleteSnippet(index) {
  snippets.splice(index, 1);
  renderAll();
}

function addLine(snippetIndex) {
  snippets[snippetIndex].text.push("");
  renderAll();
}

function removeLine(snippetIndex, lineIndex) {
  if (snippets[snippetIndex].text.length <= 1) return;
  snippets[snippetIndex].text.splice(lineIndex, 1);
  renderAll();
}

addSnippetBtn.addEventListener("click", () => {
  snippets.push({ label: "", text: [""] });
  renderAll();
  snippetList.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "start" });
});

// ---------------------------------------------------------------------------
// Save
// ---------------------------------------------------------------------------

saveBtn.addEventListener("click", async () => {
  const duration = parseInt(longPressInput.value, 10);
  const longPressDuration = Number.isFinite(duration) ? duration : DEFAULT_DURATION;

  const validSnippets = snippets.filter(
    (s) => s.label.trim() !== "" || s.text.some((t) => t.trim() !== "")
  );

  await browser.storage.local.set({ resources: validSnippets, longPressDuration });
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
