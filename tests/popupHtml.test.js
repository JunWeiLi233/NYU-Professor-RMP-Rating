import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("extension popup markup", () => {
  it("hides the decorative status dot from assistive technology", async () => {
    const popup = await readFile(new URL("../src/popup.html", import.meta.url), "utf8");

    expect(popup).toContain('<span class="dot" aria-hidden="true"></span>');
  });

  it("respects reduced-motion preferences for popup animations", async () => {
    const popup = await readFile(new URL("../src/popup.html", import.meta.url), "utf8");

    expect(popup).toContain("@media (prefers-reduced-motion: reduce)");
    expect(popup).toContain("animation: none");
    expect(popup).toContain("transition: none");
  });

  it("summarizes the Albert rating overlay features in the popup", async () => {
    const popup = await readFile(new URL("../src/popup.html", import.meta.url), "utf8");

    expect(popup).toContain('<ul class="feature-list" aria-label="Albert rating overlay features">');
    expect(popup).toContain("Rating, difficulty, take-again, and fit recommendation");
    expect(popup).toContain("Course-aware matching with risk/support context");
    expect(popup).toContain("Recent RMP comments and radar map on demand");
  });

  it("keeps the cache action visually secondary to copying diagnostics", async () => {
    const popup = await readFile(new URL("../src/popup.html", import.meta.url), "utf8");

    expect(popup).toContain('<button id="copy-diagnostics" type="button">Copy diagnostics</button>');
    expect(popup).toContain('<button id="clear-cache" class="secondary-button" type="button">Clear cache</button>');
  });

  it("tells students to refresh Albert after updating the extension", async () => {
    const popup = await readFile(new URL("../src/popup.html", import.meta.url), "utf8");

    expect(popup).toContain("Refresh Albert after loading or updating the extension.");
    expect(popup).toContain('class="notice"');
  });

  it("renders a dedicated active Albert page connection status", async () => {
    const popup = await readFile(new URL("../src/popup.html", import.meta.url), "utf8");

    expect(popup).toContain('id="page-status"');
    expect(popup).toContain('class="page-status"');
    expect(popup).toContain('aria-live="polite"');
    expect(popup).toContain("Checking active Albert page");
  });

  it("renders a dedicated popup build version target", async () => {
    const popup = await readFile(new URL("../src/popup.html", import.meta.url), "utf8");

    expect(popup).toContain('id="build-version"');
    expect(popup).toContain('class="build-version"');
    expect(popup).toContain('aria-label="Extension build version"');
  });

  it("renders a privacy-safe Albert diagnostic summary target", async () => {
    const popup = await readFile(new URL("../src/popup.html", import.meta.url), "utf8");

    expect(popup).toContain('id="diagnostic-summary"');
    expect(popup).toContain('class="diagnostic-summary"');
    expect(popup).toContain('aria-label="Privacy-safe Albert diagnostic summary"');
  });

  it("renders a compact copy diagnostics control beside cache clearing", async () => {
    const popup = await readFile(new URL("../src/popup.html", import.meta.url), "utf8");

    expect(popup).toContain('class="button-row"');
    expect(popup).toContain('id="copy-diagnostics"');
    expect(popup).toContain("Copy diagnostics");
    expect(popup).toContain("Clear cache");
  });

  it("marks the overlay toggle as an accessible switch with visible keyboard focus", async () => {
    const popup = await readFile(new URL("../src/popup.html", import.meta.url), "utf8");

    expect(popup).toContain('id="enable-overlay" type="checkbox" role="switch"');
    expect(popup).toContain('aria-describedby="overlay-helper"');
    expect(popup).toContain('id="overlay-helper"');
    expect(popup).toContain(".toggle-switch input:focus-visible + .toggle-track");
    expect(popup).toContain("outline: 2px solid var(--nyu-violet)");
    expect(popup).toMatch(/\.toggle-track\s*\{[^}]*display: block;/s);
    expect(popup).toMatch(/\.toggle-track\s*\{[^}]*position: relative;/s);
  });

  it("uses NYU branding with Albert's flat teal control language", async () => {
    const popup = await readFile(new URL("../src/popup.html", import.meta.url), "utf8");

    expect(popup).toContain("--nyu-violet: #57068c");
    expect(popup).toContain("--albert-teal: #00866e");
    expect(popup).toContain('font-family: Arial, "Helvetica Neue", sans-serif');
    expect(popup).toMatch(/\.panel\s*\{[^}]*border-radius: 0;[^}]*box-shadow: none;/s);
    expect(popup).toMatch(/button\s*\{[^}]*border: 2px solid var\(--albert-teal\);[^}]*border-radius: 0;/s);
    expect(popup).toContain("border-bottom: 4px solid var(--nyu-violet)");
    expect(popup).toContain("background: var(--albert-teal)");
  });
});
