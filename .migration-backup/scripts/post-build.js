// Post-build script for Vercel static deployment
// This script generates index.html for SPA deployment
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// Copy CSS from server to client assets
const serverCssDir = path.join(rootDir, "dist/server/assets");
const clientAssetsDir = path.join(rootDir, "dist/client/assets");

if (fs.existsSync(serverCssDir)) {
  const cssFiles = fs.readdirSync(serverCssDir).filter(f => f.endsWith(".css"));
  for (const file of cssFiles) {
    const src = path.join(serverCssDir, file);
    const dest = path.join(clientAssetsDir, file);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
  }
}

// Dynamically find the main JS and CSS entry files with content hashes
// The main JS bundle is the largest index-*.js file (contains all router code)
const jsFiles = fs.readdirSync(clientAssetsDir)
  .filter(f => f.startsWith("index-") && f.endsWith(".js"))
  .map(f => ({
    name: f,
    path: path.join(clientAssetsDir, f),
    size: fs.statSync(path.join(clientAssetsDir, f)).size
  }))
  .sort((a, b) => b.size - a.size);

const mainJsFile = jsFiles[0]?.name;
const mainCssFile = fs.readdirSync(clientAssetsDir)
  .filter(f => f.startsWith("styles-") && f.endsWith(".css"))
  .sort()
  .pop();

if (!mainJsFile) {
  console.error("ERROR: Could not find main JavaScript entry file in dist/client/assets");
  process.exit(1);
}

if (!mainCssFile) {
  console.error("ERROR: Could not find main CSS file in dist/client/assets");
  process.exit(1);
}

console.log(`Found entry files: ${mainJsFile} (${jsFiles[0]?.size} bytes), ${mainCssFile}`);

// Create index.html for SPA with loading state
const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tenderbox — Government Procurement Platform</title>
    <meta name="description" content="Tenderbox automates government tendering for South African municipalities and public sector entities." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
    <link rel="stylesheet" href="./assets/${mainCssFile}" />
    <style>
      #app:empty { display: flex; align-items: center; justify-content: center; height: 100vh; background: oklch(98.4% .003 247.858); font-family: Inter, system-ui, sans-serif; }
      #app:empty::after { content: "Loading Tenderbox..."; color: oklch(40.2% .084 250); }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" crossorigin src="./assets/${mainJsFile}"></script>
  </body>
</html>
`;

const indexPath = path.join(rootDir, "dist/client/index.html");
fs.writeFileSync(indexPath, indexHtml);

console.log("Post-build completed: index.html created with correct asset hashes");
