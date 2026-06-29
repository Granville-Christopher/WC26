import { notFound } from "next/navigation";
import { getMatchBySlug } from "@/lib/fixtures";
import { CheckoutForm } from "@/components/CheckoutForm";
import type { TierId } from "@/types";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tier?: string }>;
}) {
  const { slug } = await params;
  const { tier: tierId } = await searchParams;
  const match = await getMatchBySlug(slug);

  if (!match || !tierId) notFound();

  const tier = match.tickets.find((t) => t.id === tierId);
  if (!tier) notFound();

  return <CheckoutForm match={match} tierId={tierId as TierId} />;
}
