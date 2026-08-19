// Minimal static file server for previewing the project.
// Serves the project root (parent of .claude) on PORT (default 8765).
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8765;
const ROOT = path.resolve(__dirname, "..");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".md": "text/plain; charset=utf-8",
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/";

  let filePath = path.join(ROOT, urlPath);
  // Prevent path traversal outside ROOT.
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(filePath);
      const links = entries
        .map((e) => {
          const href = path.posix.join(urlPath, encodeURIComponent(e));
          return `<li><a href="${href}">${e}</a></li>`;
        })
        .join("");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<!doctype html><meta charset="utf-8"><h1>${urlPath}</h1><ul>${links}</ul>`);
      return;
    }
    const type = TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}/ (root: ${ROOT})`);
});
