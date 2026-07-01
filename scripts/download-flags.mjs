import fs from "fs";
import path from "path";
import https from "https";

const codes = [
  "dz", "ar", "au", "at", "be", "ba", "br", "ca", "cv", "co", "cd", "ci", "hr", "cw", "cz",
  "ec", "eg", "fr", "de", "gh", "ht", "ir", "iq", "jp", "jo", "kr", "mx", "ma", "nl", "nz",
  "no", "pa", "py", "pt", "qa", "sn", "za", "es", "se", "ch", "tn", "tr", "us", "uy", "uz",
  "gb-eng", "gb-sct", "sa",
];

const dir = path.join("public", "flags");
fs.mkdirSync(dir, { recursive: true });

function download(url, out) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(res.headers.location, out).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`${res.statusCode} ${url}`));
          return;
        }
        const file = fs.createWriteStream(out);
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
        file.on("error", reject);
      })
      .on("error", reject);
  });
}

for (const code of codes) {
  const isSub = code.includes("-");
  const url = isSub
    ? `https://flagcdn.com/w160/${code}.png`
    : `https://hatscripts.github.io/circle-flags/flags/${code}.svg`;
  const ext = isSub ? "png" : "svg";
  const out = path.join(dir, `${code}.${ext}`);
  try {
    await download(url, out);
    console.log("ok", code);
  } catch (e) {
    console.log("fail", code, e.message);
  }
}
