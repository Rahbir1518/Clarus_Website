import { GradientScene } from "@/components/glass/GradientScene";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { home } from "@/content/copy";
import { site } from "@/content/site";
import { JsonLd } from "@/lib/json-ld";
import { Section, SectionHeader } from "./SectionHeader";

export function Faq({
  items,
  title = home.faq.title,
}: {
  items: { q: string; a: string }[];
  title?: string;
}) {
  return (
    <Section id="faq">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeader eyebrow={home.faq.eyebrow} title={title}>
          <p className="mt-6 text-ink-muted">
            {home.faq.more}{" "}
            <a
              href={`mailto:${site.contactEmail}`}
              className="font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
            >
              {site.contactEmail}
            </a>
          </p>
        </SectionHeader>
        <GradientScene scene="violet" className="rounded-panel p-2 sm:p-3">
          <Accordion type="single" collapsible className="space-y-2">
            {items.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </GradientScene>
      </div>
    </Section>
  );
}
