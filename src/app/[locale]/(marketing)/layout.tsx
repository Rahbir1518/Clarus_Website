import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { PilotDialogProvider } from "@/components/pilot/PilotDialog";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Layouts render in parallel with pages, so the footer's translations need
  // the locale set here too; without it next-intl reads headers and every page
  // turns dynamic.
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PilotDialogProvider>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </PilotDialogProvider>
  );
}
