const res = await fetch("https://fifaworldcup26.hospitality.fifa.com/us/en/", {
  headers: { "User-Agent": "Mozilla/5.0" },
});
const html = await res.text();
const urls = [...html.matchAll(/https?:\/\/[^"'\s)]+/g)].map((m) => m[0]);
const hits = urls.filter(
  (u) =>
    /logo|emblem|fwc|wordmark|brand|header/i.test(u) &&
    /\.(svg|png|webp|jpg)/i.test(u)
);
console.log([...new Set(hits)].join("\n"));
