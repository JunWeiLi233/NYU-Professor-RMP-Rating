// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { initPopup } from "../src/popupController.js";

describe("extension popup controller", () => {
  it("shows the professor cache count on load", async () => {
    document.body.innerHTML = `
      <p id="status"></p>
      <button id="clear-cache"></button>
    `;
    const storage = createStorageMock({
      "professor:ada lovelace": { value: { name: "Ada Lovelace" } },
      "professor:grace hopper": { value: { name: "Grace Hopper" } },
      "settings:theme": "system",
    });

    await initPopup({ document, storage });

    expect(document.getElementById("status").textContent).toBe("2 professors cached");
  });

  it("clears only cached professor lookups when the popup clear button is clicked", async () => {
    document.body.innerHTML = `
      <p id="status"></p>
      <button id="clear-cache"></button>
    `;
    const storage = createStorageMock({
      "professor:ada lovelace": { value: { name: "Ada Lovelace" } },
      "professor:grace hopper": { value: { name: "Grace Hopper" } },
      "settings:theme": "system",
    });

    await initPopup({ document, storage });
    document.getElementById("clear-cache").click();
    await flushPromises();

    expect(storage.remove).toHaveBeenCalledWith(["professor:ada lovelace", "professor:grace hopper"]);
    expect(storage.data).toEqual({ "settings:theme": "system" });
    expect(document.getElementById("status").textContent).toBe("Cache cleared");
  });
});

function createStorageMock(initialData = {}) {
  return {
    data: { ...initialData },
    async get() {
      return { ...this.data };
    },
    remove: vi.fn(async function remove(keys) {
      for (const key of keys) {
        delete this.data[key];
      }
    }),
  };
}

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}
