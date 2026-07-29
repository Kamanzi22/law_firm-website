import { useEffect } from "react";
import { useAppData } from "../../lib/DataProvider";

interface SeoProps {
  title: string;
  description: string;
  path?: string; // e.g. "/services/corporate-commercial"
  includeLocalBusinessSchema?: boolean;
}

// REPLACE: set to the real production domain before launch.
const SITE_URL = "https://www.karisimbipartners.example";
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og/default-og.svg`;

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Sets per-page title, meta description, Open Graph tags, and (optionally)
 * LegalService JSON-LD structured data. No head-management library needed
 * for a site this size — this runs once per route change.
 */
export function Seo({ title, description, path = "/", includeLocalBusinessSchema = false }: SeoProps) {
  const { firm } = useAppData();

  useEffect(() => {
    const fullTitle = title.includes(firm.name) ? title : `${title} | ${firm.name}`;
    document.title = fullTitle;

    setMetaTag("name", "description", description);
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:url", `${SITE_URL}${path}`);
    setMetaTag("property", "og:image", DEFAULT_OG_IMAGE);
    setMetaTag("property", "og:site_name", firm.name);
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", DEFAULT_OG_IMAGE);

    if (includeLocalBusinessSchema) {
      setJsonLd("ld-legalservice", {
        "@context": "https://schema.org",
        "@type": "LegalService",
        name: firm.name,
        image: DEFAULT_OG_IMAGE,
        url: SITE_URL,
        telephone: firm.phone,
        email: firm.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: `${firm.address.line1}, ${firm.address.line2}`,
          addressLocality: firm.address.city,
          addressCountry: firm.address.country,
        },
        areaServed: "Rwanda",
        priceRange: "$$",
      });
    }
  }, [title, description, path, includeLocalBusinessSchema, firm]);

  return null;
}
