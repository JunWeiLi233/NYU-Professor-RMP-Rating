import { findProfessorRating } from "./shared/rmpClient.js";

const cache = new Map();

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "NYU_RMP_FIND_PROFESSOR") {
    return false;
  }

  handleProfessorLookup(message.name)
    .then((result) => sendResponse({ ok: true, result }))
    .catch((error) => sendResponse({ ok: false, error: error.message }));

  return true;
});

async function handleProfessorLookup(name) {
  const key = name.trim().toLowerCase();
  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = await findProfessorRating(name);
  cache.set(key, result);
  await chrome.storage.local.set({ [`professor:${key}`]: result });
  return result;
}
