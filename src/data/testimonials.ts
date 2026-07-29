// REPLACE: Testimonials are fictional placeholders. Swap in real client
// quotes (with permission) before launch.

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Demo & Partners guided us through a complex joint venture with a level of clarity we hadn't experienced with counsel before. They anticipated issues before they became problems.",
    author: "Sarah K.",
    role: "Chief Executive Officer",
    company: "A regional logistics company",
  },
  {
    quote:
      "Responsive, precise and genuinely invested in our outcome. Their real estate team caught a title issue that would have cost us significantly down the line.",
    author: "Emmanuel R.",
    role: "Managing Director",
    company: "A property development firm",
  },
  {
    quote:
      "We've used the firm for employment matters across three years of rapid hiring. Their advice is always practical, not just technically correct.",
    author: "Grace N.",
    role: "Head of People",
    company: "A fintech startup",
  },
];
