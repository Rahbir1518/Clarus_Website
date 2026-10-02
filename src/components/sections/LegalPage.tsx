import type { LegalDoc } from "@/content/legal";
import { PageHeader } from "./PageHeader";

export function LegalPage({ doc, eyebrow }: { doc: LegalDoc; eyebrow: string }) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={doc.title} sub={doc.intro}>
        <p className="mt-6 font-mono text-xs text-ink-muted">Last updated {doc.updated}</p>
      </PageHeader>
      <div className="px-4 pt-6 pb-10 sm:px-6">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-2xl space-y-10 rounded-panel bg-white/55 p-6 ring-1 ring-white/80 sm:p-10">
            {doc.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-h3">{s.heading}</h2>
                <div className="mt-3 space-y-3 leading-relaxed text-ink-muted">
                  {s.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
