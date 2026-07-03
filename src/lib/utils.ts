export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Safely parse a fetch Response as JSON. Returns an empty object if the body
 * is empty or not valid JSON (e.g. a 500 error page), so callers never throw
 * "Unexpected end of JSON input".
 */
export async function safeJson<T = Record<string, unknown>>(res: Response): Promise<T> {
  try {
    const text = await res.text();
    if (!text) return {} as T;
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}
