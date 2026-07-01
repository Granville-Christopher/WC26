import fs from "fs";
import path from "path";
import https from "https";

const sources = [
  "https://static.cdnlogo.com/logos/2/19/2026-fifa-world-cup.svg",
  "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/689fd0a66c26ce8fe1446c4f_fwc26-logo.svg",
];

const outDir = path.join("public", "images");
const outFile = path.join(outDir, "wc26-logo.svg");
fs.mkdirSync(outDir, { recursive: true });

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const mod = res.headers.location.startsWith("https") ? https : require("http");
          mod.get(res.headers.location, (r) => {
            if (r.statusCode !== 200) return reject(new Error(String(r.statusCode)));
            const chunks = [];
            r.on("data", (c) => chunks.push(c));
            r.on("end", () => resolve(Buffer.concat(chunks)));
          }).on("error", reject);
          return;
        }
        if (res.statusCode !== 200) return reject(new Error(`${res.statusCode} ${url}`));
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

for (const url of sources) {
  try {
    const buf = await download(url);
    if (buf.length < 500) throw new Error("too small");
    fs.writeFileSync(outFile, buf);
    console.log("saved", outFile, buf.length, "from", url);
    process.exit(0);
  } catch (e) {
    console.log("skip", url, e.message);
  }
}
process.exit(1);
