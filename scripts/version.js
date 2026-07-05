const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const VERSION = Date.now().toString();

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {

        if (
            entry.name === "node_modules" ||
            entry.name === ".git"
        ) {
            continue;
        }

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            walk(fullPath);
            continue;
        }

        if (!entry.name.endsWith(".html")) {
            continue;
        }

        let html = fs.readFileSync(fullPath, "utf8");

        // Remove old version if already present
        html = html.replace(
            /\?v=\d+|\?v=\{\{VERSION\}\}/g,
            "?v={{VERSION}}"
        );

        // Insert new version
        html = html.replace(
            /\{\{VERSION\}\}/g,
            VERSION
        );

        fs.writeFileSync(fullPath, html);

        console.log("✔ Updated:", path.relative(ROOT, fullPath));
    }
}

walk(ROOT);

console.log("\nVersion:", VERSION);
console.log("Done.");