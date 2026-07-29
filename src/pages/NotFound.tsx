import { Seo } from "../components/seo/Seo";
import { Button } from "../components/ui/Button";
import { strings } from "../data/strings";

export function NotFound() {
  return (
    <>
      <Seo title={strings.common.notFoundTitle} description={strings.common.notFoundBody} path="/404" />
      <section className="flex min-h-[60svh] flex-col items-center justify-center bg-brand-cream px-4 text-center">
        <h1 className="font-display text-4xl font-semibold text-brand-navy">{strings.common.notFoundTitle}</h1>
        <p className="mt-3 max-w-md text-brand-gray-500">{strings.common.notFoundBody}</p>
        <Button to="/" size="lg" className="mt-8">
          {strings.common.notFoundCta}
        </Button>
      </section>
    </>
  );
}
