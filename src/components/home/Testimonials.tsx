import { Quote } from "lucide-react";
import { strings } from "../../data/strings";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { useAppData } from "../../lib/DataProvider";

export function Testimonials() {
  const { testimonials } = useAppData();

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading title={strings.home.testimonialsHeading} align="center" />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.author} delayMs={index * 60}>
              <figure className="flex h-full flex-col rounded-sm border border-brand-gray-200 bg-brand-cream p-7">
                <Quote className="h-7 w-7 text-brand-gold" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-brand-gray-600">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-brand-gray-200 pt-4">
                  <p className="font-semibold text-brand-navy">{testimonial.author}</p>
                  <p className="text-sm text-brand-gray-500">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
