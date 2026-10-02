import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { PilotCta } from "@/components/sections/PilotCta";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pilot" });
  return pageMetadata({ locale, path: "/pilot", title: t("eyebrow"), description: t("intro") });
}

export default async function PilotPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pilot");

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("submit")} className="pb-0" />
      <PilotCta location="pilot_page" />
    </>
  );
}
