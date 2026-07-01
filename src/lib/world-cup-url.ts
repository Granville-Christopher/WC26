export function worldCupFilterUrl(params: {
  country?: string;
  stage?: string;
  q?: string;
}): string {
  const search = new URLSearchParams();
  if (params.country && params.country !== "all") search.set("country", params.country);
  if (params.stage && params.stage !== "all") search.set("stage", params.stage);
  if (params.q?.trim()) search.set("q", params.q.trim());
  const qs = search.toString();
  return qs ? `/world-cup?${qs}` : "/world-cup";
}
