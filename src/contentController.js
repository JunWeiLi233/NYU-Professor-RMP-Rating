export async function initContentScript({
  chrome = globalThis.chrome,
  startAlbertRmpEnhancer,
  removeAlbertRmpEnhancements,
  lookupProfessor,
} = {}) {
  const settings = await chrome.storage.local.get("settings:overlayEnabled");
  let observer = startOverlay(settings["settings:overlayEnabled"] !== false);

  chrome.storage.onChanged?.addListener((changes, areaName) => {
    if (areaName !== "local" || !changes["settings:overlayEnabled"]) {
      return;
    }

    const enabled = changes["settings:overlayEnabled"].newValue !== false;
    if (enabled && !observer) {
      observer = startOverlay(true);
      return;
    }

    if (!enabled) {
      observer?.disconnect?.();
      observer = null;
      removeAlbertRmpEnhancements();
    }
  });

  function startOverlay(enabled) {
    return startAlbertRmpEnhancer({
      lookupProfessor,
      enabled,
    });
  }
}
