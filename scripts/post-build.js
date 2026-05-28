// Post-build script for Vercel static deployment
// This script generates index.html from dist/server for SPA deployment
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

// Create index.html for SPA
const timestamp = new Date().toISOString();
const indexHtml = `<!DOCTYPE html>
<!-- Generated: ${timestamp} -->
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tenderbox — Government Procurement Platform</title>
    <meta name="description" content="Tenderbox automates government tendering for South African municipalities and public sector entities." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
    <link rel="stylesheet" href="./assets/styles-C5oLp3le.css" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" crossorigin src="./assets/index-BGjskeWy.js"></script>
  </body>
</html>
`;

const indexPath = path.join(rootDir, "dist/client/index.html");
fs.writeFileSync(indexPath, indexHtml);

console.log("Post-build completed: index.html created");
