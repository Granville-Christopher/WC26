import { FifaHero } from "@/components/home/FifaHero";
import { FifaTrustStrip } from "@/components/home/FifaTrustStrip";
import { MatchOfferingsSection } from "@/components/home/MatchOfferingsSection";
import { SingleMatchesSection } from "@/components/home/SingleMatchesSection";
import {
  LoungeShowcase,
  PrivateSuitesSection,
  AdditionalOfferings,
  OnLocationStats,
} from "@/components/home/LoungeShowcase";
import { HomeFaqPreview } from "@/components/home/HomeFaqPreview";
import { getLiveMatches } from "@/lib/fixtures";

export const revalidate = 3600;

export default async function HomePage() {
  const { matches } = await getLiveMatches();

  return (
    <>
      <FifaHero />
      <FifaTrustStrip />
      <MatchOfferingsSection />
      <SingleMatchesSection matches={matches} />
      <PrivateSuitesSection />
      <AdditionalOfferings />
      <LoungeShowcase />
      <OnLocationStats />
      <HomeFaqPreview />
    </>
  );
}
