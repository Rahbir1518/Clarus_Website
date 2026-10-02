import { notFound } from "next/navigation";

// Any path under a locale that isn't a page renders the localized 404.
export default function CatchAll() {
  notFound();
}
