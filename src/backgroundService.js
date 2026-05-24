import { findProfessorRating as defaultFindProfessorRating } from "./shared/rmpClient.js";

export const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function createProfessorLookupService({
  storage,
  findProfessorRating = defaultFindProfessorRating,
  now = Date.now,
} = {}) {
  if (!storage) {
    throw new Error("storage is required");
  }

  const memoryCache = new Map();

  return {
    async lookup(name) {
      const key = professorCacheKey(name);
      if (memoryCache.has(key)) {
        return memoryCache.get(key);
      }

      const cached = await readStoredRating(storage, key, now());
      if (cached.status === "fresh") {
        memoryCache.set(key, cached.value);
        return cached.value;
      }

      if (cached.status === "legacy") {
        memoryCache.set(key, cached.value);
        return cached.value;
      }

      const result = await findProfessorRating(name);
      memoryCache.set(key, result);
      await storage.set({ [key]: createStoredRating(result, now()) });
      return result;
    },
  };
}

export function professorCacheKey(name) {
  return `professor:${String(name).trim().toLowerCase()}`;
}

async function readStoredRating(storage, key, currentTime) {
  const result = await storage.get(key);
  if (!Object.prototype.hasOwnProperty.call(result, key) || result[key] === undefined) {
    return { status: "missing" };
  }

  const stored = result[key];
  if (isTimestampedCacheEntry(stored)) {
    return currentTime - stored.cachedAt <= CACHE_TTL_MS
      ? { status: "fresh", value: stored.value }
      : { status: "stale" };
  }

  return { status: "legacy", value: stored };
}

function createStoredRating(value, cachedAt) {
  return { cachedAt, value };
}

function isTimestampedCacheEntry(value) {
  return value && typeof value === "object" && "cachedAt" in value && "value" in value;
}
