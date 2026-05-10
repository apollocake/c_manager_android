// Desktop: clicking the pinned extension icon opens the popup in the active tab.
const lastFocusedFrameByTab = new Map();

browser.action.onClicked.addListener((tab) => {
  if (tab.id != null) {
    const targetFrameId = lastFocusedFrameByTab.get(tab.id) ?? 0;
    browser.tabs.sendMessage(tab.id, { type: "injector-open", targetFrameId }, { frameId: 0 }).catch(() => {
      // Content script may not be present on this page (e.g. about: or privileged pages).
    });
  }
});

// Mobile/content-script path: content script requests opening the same popup flow.
browser.runtime.onMessage.addListener((message, sender) => {
  if (message?.type === "injector-focus") {
    const senderTabId = sender?.tab?.id;
    const senderFrameId = typeof sender?.frameId === "number" ? sender.frameId : 0;
    if (senderTabId != null) {
      lastFocusedFrameByTab.set(senderTabId, senderFrameId);
    }
    return;
  }

  if (message?.type === "injector-insert") {
    const senderTabId = sender?.tab?.id;
    if (senderTabId == null) {
      return;
    }

    const targetFrameId = typeof message?.targetFrameId === "number"
      ? message.targetFrameId
      : typeof sender?.frameId === "number"
      ? sender.frameId
      : 0;

    return browser.tabs
      .sendMessage(senderTabId, { type: "injector-insert", textParts: message.textParts }, { frameId: targetFrameId })
      .catch(() => {
        // Content script may not be present on this page (e.g. about: or privileged pages).
      });
  }

  if (message?.type !== "injector-open") {
    return;
  }

  const senderTabId = sender?.tab?.id;
  if (senderTabId == null) {
    return;
  }

  const senderFrameId = typeof sender?.frameId === "number" ? sender.frameId : 0;

  return browser.tabs.sendMessage(senderTabId, { type: "injector-open", targetFrameId: senderFrameId }, { frameId: 0 }).catch(() => {
    // Content script may not be present on this page (e.g. about: or privileged pages).
  });
});

browser.tabs.onRemoved.addListener((tabId) => {
  lastFocusedFrameByTab.delete(tabId);
});
