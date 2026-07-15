import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { JSDOM } from "jsdom";
import { EXTENSION_VERSION } from "../src/shared/version.js";

export function verifyAlbertRenderedShape(html, { expectedVersion = EXTENSION_VERSION } = {}) {
  const document = typeof html === "string"
    ? new JSDOM(html).window.document
    : html;
  const contentVersion = String(document?.documentElement?.dataset?.nyuRmpVersion ?? "").trim();
  const contentScript = String(document?.documentElement?.dataset?.nyuRmpContentScript ?? "").trim();
  const cardCount = document?.querySelectorAll?.(".nyu-rmp-card").length ?? 0;
  const quickGridCount = document?.querySelectorAll?.(".nyu-rmp-quick-grid").length ?? 0;
  const processedCellCount = document?.querySelectorAll?.("[data-nyu-rmp-processed='true']").length ?? 0;
  const ratingCellCount = document?.querySelectorAll?.("[data-nyu-rmp-rating-cell='true']").length ?? 0;
  const trailingRatingRootCount = document?.querySelectorAll?.("[data-nyu-rmp-rating-cell='true'] > .nyu-rmp-rating-root").length ?? 0;
  const inlineProcessedRatingRootCount = document?.querySelectorAll?.("[data-nyu-rmp-processed='true'] > .nyu-rmp-rating-root").length ?? 0;
  const selectButtonRatingRootCount = document?.querySelectorAll?.("[data-nyu-rmp-processed='true'][data-nyu-rmp-select-button-rating='true'] > .nyu-rmp-rating-root").length ?? 0;
  const unexpectedInlineRatingRootCount = Math.max(0, inlineProcessedRatingRootCount - selectButtonRatingRootCount);
  const migrationCount = nonNegativeInteger(document?.documentElement?.dataset?.nyuRmpStaleCardLayoutMigrationCount);
  const staleVisibleChildClasses = firstVisibleCardChildClasses(document);
  const result = {
    ok: true,
    contentScript,
    contentVersion,
    expectedVersion,
    cardCount,
    quickGridCount,
    processedCellCount,
    ratingCellCount,
    trailingRatingRootCount,
    inlineProcessedRatingRootCount,
    selectButtonRatingRootCount,
    staleCardLayoutMigrationCount: migrationCount,
    firstCardVisibleChildClasses: staleVisibleChildClasses,
  };

  const failures = [];
  if (contentScript !== "loaded") {
    failures.push("current content script marker is missing");
  }
  if (contentVersion !== expectedVersion) {
    failures.push(`content script version ${contentVersion || "missing"} does not match expected ${expectedVersion}`);
  }
  if (cardCount > 0 && quickGridCount < cardCount) {
    const staleCardCount = cardCount - quickGridCount;
    failures.push(`${staleCardCount} rendered RMP card${staleCardCount === 1 ? " still lacks" : "s still lack"} segmented quick views`);
  }
  if (cardCount > 0 && processedCellCount > 0 && ratingCellCount === 0 && selectButtonRatingRootCount === 0) {
    failures.push("rendered Albert RMP cards are missing a trailing rating column or under-button rating root");
  }
  if (cardCount > 0 && ratingCellCount > 0 && trailingRatingRootCount < ratingCellCount) {
    failures.push("one or more trailing rating columns do not contain an RMP rating root");
  }
  if (unexpectedInlineRatingRootCount > 0) {
    failures.push(`${unexpectedInlineRatingRootCount} RMP rating root${unexpectedInlineRatingRootCount === 1 ? " is" : "s are"} still mounted unexpectedly inside processed Albert cells`);
  }
  if (failures.length > 0) {
    const error = new Error([
      "Albert page is not rendering the current segmented RMP layout.",
      ...failures.map((failure) => `- ${failure}`),
      "Reload the unpacked extension from this repository's dist folder, refresh Albert, then verify the page again.",
    ].join("\n"));
    error.result = { ...result, ok: false, failures };
    throw error;
  }
  return result;
}

function firstVisibleCardChildClasses(document) {
  const card = document?.querySelector?.(".nyu-rmp-card");
  return Array.from(card?.children ?? [])
    .filter((node) => !node.hidden)
    .map((node) => node.className);
}

function nonNegativeInteger(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const htmlPath = process.argv[2];
  if (!htmlPath) {
    throw new Error("Usage: node scripts/verify-albert-rendered-shape.js <albert-page-snapshot.html>");
  }
  const result = verifyAlbertRenderedShape(await readFile(htmlPath, "utf8"));
  console.log(JSON.stringify(result, null, 2));
}
