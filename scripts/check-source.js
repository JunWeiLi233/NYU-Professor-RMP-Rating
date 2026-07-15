import { readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const DEFAULT_DIRECTORIES = ["src", "scripts", "tests"];

export async function checkJavaScriptSyntax({ directories = DEFAULT_DIRECTORIES } = {}) {
  const files = (await Promise.all(directories.map(collectJavaScriptFiles))).flat().sort();
  const failures = [];
  for (const file of files) {
    const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (result.status !== 0) {
      failures.push([file, result.stderr || result.stdout].filter(Boolean).join("\n"));
    }
  }
  if (failures.length > 0) {
    throw new Error(`JavaScript syntax checks failed:\n${failures.join("\n")}`);
  }
  return { checkedFileCount: files.length };
}

async function collectJavaScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return collectJavaScriptFiles(path);
    }
    return entry.isFile() && extname(entry.name) === ".js" ? [path] : [];
  }));
  return files.flat();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await checkJavaScriptSyntax();
  console.log(`Checked JavaScript syntax in ${result.checkedFileCount} files`);
}
