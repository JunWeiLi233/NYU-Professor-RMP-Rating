import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("extension popup markup", () => {
  it("hides the decorative status dot from assistive technology", async () => {
    const popup = await readFile(new URL("../src/popup.html", import.meta.url), "utf8");

    expect(popup).toContain('<span class="dot" aria-hidden="true"></span>');
  });
});
