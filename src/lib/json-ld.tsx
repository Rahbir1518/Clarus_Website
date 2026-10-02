import { site } from "@/content/site";

/** Structured data. `<` is escaped so the JSON can't close the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Clarus",
  url: site.url,
  logo: `${site.url}/brand/logo-mark.svg`,
  email: site.contactEmail,
  founder: [
    { "@type": "Person", name: "Mohammed Faraz Kabbo" },
    { "@type": "Person", name: "Rubaiya Hassin Farheen" },
    { "@type": "Person", name: "MD Rahbir Mahdi" },
  ],
};

export const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Clarus",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: site.url,
  description:
    "AI-assisted patient follow-up for clinics: WhatsApp, SMS and AI voice follow-ups that book the next visit into the clinic's calendar.",
  offers: site.showPricing
    ? {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "249",
        highPrice: "1249",
        offerCount: 3,
      }
    : undefined,
};
