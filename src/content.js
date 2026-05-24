import { extractInstructorNamesFromText, normalizeInstructorName, splitInstructorList } from "./shared/albertParser.js";

const ROOT_CLASS = "nyu-rmp-rating-root";
const STYLE_ID = "nyu-rmp-rating-styles";

injectStyles();
scanAlbertPage();

const observer = new MutationObserver(() => {
  window.clearTimeout(observer.scanTimer);
  observer.scanTimer = window.setTimeout(scanAlbertPage, 300);
});

observer.observe(document.body, { childList: true, subtree: true });

function scanAlbertPage() {
  const targets = findInstructorTargets();
  for (const target of targets) {
    mountRatings(target);
  }
}

function findInstructorTargets() {
  const blocks = Array.from(document.querySelectorAll("td, th, div, span, li, p"))
    .filter((element) => {
      if (element.dataset.nyuRmpProcessed === "true") {
        return false;
      }
      const text = element.textContent ?? "";
      return /\binstructor(?:\(s\)|s)?\s*:/i.test(text) && text.length < 700;
    });

  return blocks.map((element) => {
    const names = extractInstructorNamesFromText(element.textContent ?? "");
    return { element, names };
  }).filter((target) => target.names.length > 0);
}

function mountRatings({ element, names }) {
  element.dataset.nyuRmpProcessed = "true";
  const container = document.createElement("div");
  container.className = ROOT_CLASS;

  for (const name of names.flatMap(splitInstructorList).map(normalizeInstructorName).filter(Boolean)) {
    const card = createRatingShell(name);
    container.append(card);
    lookupProfessor(name).then((result) => updateRatingCard(card, result)).catch((error) => {
      card.classList.add("is-error");
      card.querySelector(".nyu-rmp-status").textContent = error.message;
    });
  }

  element.insertAdjacentElement("afterend", container);
}

function createRatingShell(name) {
  const card = document.createElement("article");
  card.className = "nyu-rmp-card is-loading";
  card.innerHTML = `
    <div class="nyu-rmp-card-head">
      <strong></strong>
      <span class="nyu-rmp-status">Checking RMP</span>
    </div>
    <div class="nyu-rmp-skeleton"></div>
  `;
  card.querySelector("strong").textContent = name;
  return card;
}

function updateRatingCard(card, result) {
  card.classList.remove("is-loading");
  if (!result) {
    card.classList.add("is-empty");
    card.innerHTML = `
      <div class="nyu-rmp-card-head">
        <strong>${escapeHtml(card.querySelector("strong")?.textContent ?? "Professor")}</strong>
        <span class="nyu-rmp-status">No RMP match</span>
      </div>
    `;
    return;
  }

  const ratingClass = result.rating >= 4 ? "good" : result.rating >= 3 ? "mixed" : "weak";
  const comments = result.topComments
    .map((comment) => `<li>${escapeHtml(comment)}</li>`)
    .join("");
  const tags = result.tags
    .map((tag) => `<span>${escapeHtml(tag)}</span>`)
    .join("");

  card.classList.add(`rating-${ratingClass}`);
  card.innerHTML = `
    <div class="nyu-rmp-card-head">
      <strong>${escapeHtml(result.name)}</strong>
      <a href="${result.url}" target="_blank" rel="noreferrer">RMP</a>
    </div>
    <div class="nyu-rmp-score-row">
      <span class="nyu-rmp-score">${formatScore(result.rating)}</span>
      <span>${result.ratingsCount} ratings</span>
      <span>Difficulty ${formatScore(result.difficulty)}</span>
      ${result.wouldTakeAgain == null ? "" : `<span>${Math.round(result.wouldTakeAgain)}% take again</span>`}
    </div>
    ${tags ? `<div class="nyu-rmp-tags">${tags}</div>` : ""}
    ${comments ? `<ul class="nyu-rmp-comments">${comments}</ul>` : ""}
  `;
}

function lookupProfessor(name) {
  return chrome.runtime.sendMessage({
    type: "NYU_RMP_FIND_PROFESSOR",
    name,
  }).then((response) => {
    if (!response?.ok) {
      throw new Error(response?.error ?? "RMP lookup failed");
    }
    return response.result;
  });
}

function injectStyles() {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .${ROOT_CLASS} {
      display: grid;
      gap: 8px;
      margin: 8px 0 12px;
      font-family: "Aptos", "Segoe UI", sans-serif;
    }
    .nyu-rmp-card {
      border: 1px solid #d9dee7;
      border-left: 4px solid #6b7280;
      border-radius: 8px;
      background: #fbfcfe;
      color: #172033;
      padding: 10px 12px;
      box-shadow: 0 8px 24px rgba(18, 31, 53, 0.08);
    }
    .nyu-rmp-card-head,
    .nyu-rmp-score-row,
    .nyu-rmp-tags {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .nyu-rmp-card-head {
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .nyu-rmp-card strong {
      font-size: 13px;
      letter-spacing: 0;
    }
    .nyu-rmp-card a,
    .nyu-rmp-status {
      color: #334155;
      font-size: 11px;
      text-transform: uppercase;
    }
    .nyu-rmp-score {
      color: #111827;
      font-size: 20px;
      font-weight: 800;
      line-height: 1;
    }
    .nyu-rmp-score-row span:not(.nyu-rmp-score),
    .nyu-rmp-comments {
      color: #475569;
      font-size: 12px;
    }
    .nyu-rmp-tags span {
      background: #eef2f7;
      border: 1px solid #d8e0ea;
      border-radius: 999px;
      color: #334155;
      font-size: 11px;
      padding: 3px 7px;
    }
    .nyu-rmp-comments {
      margin: 8px 0 0;
      padding-left: 16px;
    }
    .nyu-rmp-skeleton {
      animation: nyu-rmp-shimmer 1.2s infinite linear;
      background: linear-gradient(90deg, #e8edf3, #f7f9fc, #e8edf3);
      background-size: 220% 100%;
      border-radius: 6px;
      height: 18px;
    }
    .nyu-rmp-card.rating-good { border-left-color: #1f8a5b; }
    .nyu-rmp-card.rating-mixed { border-left-color: #b7791f; }
    .nyu-rmp-card.rating-weak,
    .nyu-rmp-card.is-error { border-left-color: #b42318; }
    @keyframes nyu-rmp-shimmer {
      to { background-position: -220% 0; }
    }
  `;
  document.documentElement.append(style);
}

function formatScore(value) {
  return value == null ? "N/A" : Number(value).toFixed(1);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
