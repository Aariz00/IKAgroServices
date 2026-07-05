const fs = require("fs");
const path = require("path");

const VERSION = Date.now();

const ROOT = process.cwd();

const IGNORE = new Set([
  "node_modules",
  ".git",
  "scripts"
]);

function updateAssets(html) {

  // CSS
  html = html.replace(
    /(href="[^"]+\.css)(\?v=\d+)?(")/g,
    `$1?v=${VERSION}$3`
  );

  // JS
  html = html.replace(
    /(src="[^"]+\.js)(\?v=\d+)?(")/g,
    `$1?v=${VERSION}$3`
  );

  return html;
}

function walk(folder) {

  const files = fs.readdirSync(folder);

  for (const file of files) {

    const fullPath = path.join(folder, file);

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {

      if (!IGNORE.has(file)) {
        walk(fullPath);
      }

      continue;
    }

    if (!file.endsWith(".html")) {
      continue;
    }

    const oldHtml = fs.readFileSync(fullPath, "utf8");

    const newHtml = updateAssets(oldHtml);

    if (oldHtml !== newHtml) {

      fs.writeFileSync(fullPath, newHtml);

      console.log("✔ Updated:", path.relative(ROOT, fullPath));

    } else {

      console.log("• No change:", path.relative(ROOT, fullPath));

    }

  }

}

console.log("\nUpdating asset versions...\n");

walk(ROOT);

console.log("\nVersion:", VERSION);

console.log("\nDone.\n");