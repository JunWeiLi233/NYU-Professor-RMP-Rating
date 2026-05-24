const STAFF_TERMS = new Set([
  "staff",
  "tba",
  "to be announced",
  "department",
  "no instructor assigned",
]);
const NAME_SUFFIXES = new Set(["jr", "jr.", "sr", "sr.", "ii", "iii", "iv", "v"]);

export function normalizeInstructorName(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  const withoutLabel = value
    .replace(/\((primary instructor|instructor|lecture|recitation)\)/gi, "")
    .replace(/^(?:instructor\(s\)|instructors?|professor|prof)\s*[:.]?\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!withoutLabel) {
    return "";
  }

  const normalized = titleCaseName(withoutLabel.replace(/[;|]+$/g, "").trim());
  if (!normalized || STAFF_TERMS.has(normalized.toLowerCase())) {
    return "";
  }

  return normalized;
}

export function extractInstructorNamesFromText(text) {
  if (!text || typeof text !== "string") {
    return [];
  }

  const names = [];
  const seen = new Set();
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    const match = line.match(/\binstructor(?:\(s\)|s)?\s*:\s*(.+)$/i);
    if (!match) {
      continue;
    }

    for (const piece of splitInstructorList(match[1])) {
      const name = normalizeInstructorName(piece);
      const key = name.toLowerCase();
      if (name && !seen.has(key)) {
        seen.add(key);
        names.push(name);
      }
    }
  }

  return names;
}

export function splitInstructorList(value) {
  const semicolonParts = value
    .split(/\s*(?:;|\/|\band\b)\s*/i)
    .map((part) => part.trim())
    .filter(Boolean);

  if (semicolonParts.length > 1) {
    return semicolonParts.flatMap(splitInstructorList);
  }

  const commaParts = value.split(/\s*,\s*/).map((part) => part.trim()).filter(Boolean);
  if (commaParts.length === 2 && looksLikeAlbertLastFirst(commaParts[0], commaParts[1])) {
    return [`${commaParts[1]} ${commaParts[0]}`];
  }

  return value
    .split(/\s*,\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function looksLikeAlbertLastFirst(lastName, firstNames) {
  return /^[A-Z][A-Z'-]+$/.test(lastName) && /^[A-Z][A-Z'. -]+$/.test(firstNames);
}

function titleCaseName(value) {
  return value
    .split(" ")
    .map((token) => {
      if (NAME_SUFFIXES.has(token.toLowerCase())) {
        return token.replace(/\.$/, "").toUpperCase() + (token.endsWith(".") ? "." : "");
      }
      if (/^[A-Z]\.$/.test(token)) {
        return token;
      }
      if (token.includes("-")) {
        return token
          .split("-")
          .map(capitalizeToken)
          .join("-");
      }
      if (token.includes("'")) {
        return token
          .split("'")
          .map(capitalizeToken)
          .join("'");
      }
      return capitalizeToken(token);
    })
    .join(" ");
}

function capitalizeToken(token) {
  if (!token) {
    return token;
  }
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}
