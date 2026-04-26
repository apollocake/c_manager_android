// Desktop: clicking the pinned extension icon opens the popup in the active tab.
browser.action.onClicked.addListener((tab) => {
  if (tab.id != null) {
    browser.tabs.sendMessage(tab.id, { type: "injector-open" }).catch(() => {
      // Content script may not be present on this page (e.g. about: or privileged pages).
    });
  }
});
