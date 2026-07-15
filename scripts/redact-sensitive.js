import { homedir } from "node:os";

export function redactHomePath(path, { home = homedir() } = {}) {
  const value = String(path ?? "");
  const normalizedHome = String(home ?? "").replace(/[\\/]+$/, "");
  if (!normalizedHome || value.slice(0, normalizedHome.length).toLowerCase() !== normalizedHome.toLowerCase()) {
    return value;
  }
  const suffix = value.slice(normalizedHome.length);
  return !suffix || /^[\\/]/.test(suffix) ? `<home>${suffix}` : value;
}
