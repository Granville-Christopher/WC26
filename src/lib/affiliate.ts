/**
 * FIFA ticket purchase URL. Set NEXT_PUBLIC_FIFA_TICKET_URL in .env.local
 * to your partner/affiliate link — the site routes buyers there without
 * displaying affiliate branding in the UI.
 */
export function getTicketPurchaseUrl(matchSlug: string, tierId?: string): string {
  const base =
    process.env.NEXT_PUBLIC_FIFA_TICKET_URL ??
    "https://www.fifa.com/fifaplus/en/tickets";

  const url = new URL(base);
  url.searchParams.set("event", matchSlug);
  if (tierId) url.searchParams.set("tier", tierId);
  return url.toString();
}
