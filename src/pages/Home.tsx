import { Seo } from "../components/seo/Seo";
import { Hero } from "../components/home/Hero";
import { TrustBar } from "../components/home/TrustBar";
import { SwooshDivider } from "../components/ui/SwooshDivider";
import { ServiceCards } from "../components/home/ServiceCards";
import { WhyUs } from "../components/home/WhyUs";
import { Testimonials } from "../components/home/Testimonials";
import { InsightsPreview } from "../components/home/InsightsPreview";
import { CtaBand } from "../components/home/CtaBand";
import { NextPageTeaser } from "../components/ui/NextPageTeaser";
import { ServicesHero } from "../components/heroes/ServicesHero";
import { useAppData } from "../lib/DataProvider";

export function Home() {
  const { firm } = useAppData();

  return (
    <>
      <Seo
        title={firm.name}
        description={firm.positioning}
        path="/"
        includeLocalBusinessSchema
      />
      <Hero />
      <SwooshDivider />
      <TrustBar />
      <ServiceCards />
      <WhyUs />
      <Testimonials />
      <InsightsPreview />
      <CtaBand />

      <NextPageTeaser nextPath="/services">
        <ServicesHero />
      </NextPageTeaser>
    </>
  );
}
