import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { verifyExtensionPackage } from "../scripts/verify-extension-package.js";

describe("extension package verifier", () => {
  it("fails when the built manifest is missing", async () => {
    const emptyDist = await mkdtemp(join(tmpdir(), "nyu-rmp-empty-dist-"));

    await expect(verifyExtensionPackage(emptyDist)).rejects.toThrow("dist manifest is missing");

    await rm(emptyDist, { recursive: true, force: true });
  });
});
