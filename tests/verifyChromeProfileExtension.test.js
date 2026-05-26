import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { verifyChromeProfileExtension } from "../scripts/verify-chrome-profile-extension.js";

describe("Chrome profile extension verifier", () => {
  it("reports an enabled unpacked NYU RMP extension loaded from the expected dist path", async () => {
    const profile = await createProfile({
      extensions: {
        abcdefghijklmnopabcdefghijklmnop: {
          manifest: { name: "NYU Albert RMP Ratings", version: "0.1.0" },
          path: resolve("dist"),
          state: 1,
          from_webstore: false,
        },
      },
    });

    await expect(verifyChromeProfileExtension({ profileDir: profile, extensionPath: "dist" })).resolves.toMatchObject({
      id: "abcdefghijklmnopabcdefghijklmnop",
      enabled: true,
      installedFromExpectedPath: true,
    });

    await rm(profile, { recursive: true, force: true });
  });

  it("fails when the NYU RMP extension is not installed in the Chrome profile", async () => {
    const profile = await createProfile({
      extensions: {
        zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz: {
          manifest: { name: "Other Extension", version: "1.0.0" },
          path: resolve("other"),
          state: 1,
          from_webstore: false,
        },
      },
    });

    await expect(verifyChromeProfileExtension({ profileDir: profile, extensionPath: "dist" })).rejects.toThrow(
      "NYU Albert RMP Ratings is not installed in this Chrome profile",
    );

    await rm(profile, { recursive: true, force: true });
  });

  it("fails when the NYU RMP extension is installed from a different path", async () => {
    const profile = await createProfile({
      extensions: {
        abcdefghijklmnopabcdefghijklmnop: {
          manifest: { name: "NYU Albert RMP Ratings", version: "0.1.0" },
          path: resolve("old-dist"),
          state: 1,
          from_webstore: false,
        },
      },
    });

    await expect(verifyChromeProfileExtension({ profileDir: profile, extensionPath: "dist" })).rejects.toThrow(
      "NYU Albert RMP Ratings is installed from a different path",
    );

    await rm(profile, { recursive: true, force: true });
  });
});

async function createProfile({ extensions }) {
  const profile = await mkdtemp(join(tmpdir(), "nyu-rmp-chrome-profile-"));
  await mkdir(profile, { recursive: true });
  await writeFile(
    join(profile, "Preferences"),
    JSON.stringify({
      extensions: {
        settings: extensions,
      },
    }),
    "utf8",
  );
  return profile;
}
