const url = "https://fifaworldcup26.hospitality.fifa.com/us/en/choose-matches?scheduleView=true";
const res = await fetch(url, {
  headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" },
});
const html = await res.text();
console.log("status", res.status, "length", html.length);
const prices = [...html.matchAll(/\$([0-9,]+)/g)].map((m) => m[1]).slice(0, 30);
console.log("prices", prices);
const idx = html.indexOf("Argentina");
if (idx >= 0) console.log("arg", html.slice(idx, idx + 400));
const amounts = [...html.matchAll(/(\d{3,5})\s*USD/gi)].map((m) => m[1]).slice(0, 20);
console.log("usd amounts", amounts);
