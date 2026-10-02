import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/brand/Logo";
import { markets, site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function Footer() {
  const t = await getTranslations("footer");
  const n = await getTranslations("nav");

  const columns = [
    {
      title: t("product"),
      links: [
        { label: n("howItWorks"), href: "/how-it-works" },
        { label: n("safety"), href: "/safety" },
        { label: n("pricing"), href: "/pricing" },
        { label: t("pilot"), href: "/pilot" },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: n("about"), href: "/about" },
        { label: t("contact"), href: `mailto:${site.contactEmail}` },
        { label: t("careers"), href: `mailto:${site.contactEmail}?subject=Careers%20at%20Clarus` },
      ],
    },
    {
      title: t("markets"),
      links: markets.map((m) => ({ label: m.name, href: `/pricing?market=${m.id}` })),
    },
    {
      title: t("legal"),
      links: [
        { label: t("privacy"), href: "/privacy" },
        { label: t("terms"), href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-line bg-canvas-deep/40">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_2fr]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm text-ink-muted">{t("tagline")}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="text-eyebrow text-ink-muted">{col.title}</h2>
              <ul className="mt-3 space-y-0.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith("mailto:") ? (
                      <a
                        href={l.href}
                        className="inline-block py-1.5 text-ink hover:text-brand-ink"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="inline-block py-1.5 text-ink hover:text-brand-ink"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-ink-muted sm:px-6">
          <span>© {site.year} Clarus</span>
          <a href={`mailto:${site.contactEmail}`} className="hover:text-ink">
            {site.contactEmail}
          </a>
          <LanguageSwitcher side="top" />
        </div>
      </div>
    </footer>
  );
}
