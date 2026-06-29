const url = "https://fifaworldcup26.hospitality.fifa.com/us/en/choose-matches?scheduleView=true";
const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
const html = await res.text();
const urls = [...html.matchAll(/https?:\/\/[^"'\s]+/g)].map((m) => m[0]);
const apis = urls.filter((u) => u.includes("api") || u.includes("tnwr") || u.includes(".json"));
console.log("api urls", [...new Set(apis)].slice(0, 30));
const scripts = [...html.matchAll(/src="([^"]+\.js[^"]*)"/g)].map((m) => m[1]);
console.log("scripts", scripts.slice(0, 10));
