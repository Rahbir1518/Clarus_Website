import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { GradientScene } from "@/components/glass/GradientScene";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-[1180px] flex-col px-4 py-6 sm:px-6">
      <Link href="/" className="self-start">
        <Logo />
      </Link>
      <GradientScene
        scene="violet"
        className="my-auto grid place-items-center rounded-panel px-6 py-24 text-center"
      >
        <p className="font-mono text-sm text-ink-muted">404</p>
        <h1 className="mt-4 text-h2">This page isn&apos;t on the calendar.</h1>
        <p className="mt-4 max-w-md text-ink-muted">
          The link may be old, or the page may have moved.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">
            <ArrowLeft className="rtl:rotate-180" /> Back to Clarus
          </Link>
        </Button>
      </GradientScene>
    </main>
  );
}
