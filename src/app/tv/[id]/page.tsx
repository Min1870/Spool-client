import { redirect } from "next/navigation";

// Series aren't on MSW (only movies uploaded to Spool are). Old series links go home.
export default function SeriesDetailPage() {
  redirect("/");
}
