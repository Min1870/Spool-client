import { redirect } from "next/navigation";

// MSW only shows what's uploaded to Spool, and Spool links uploads to MOVIES for now.
// Old links to the series section go to the home page.
export default function SeriesPage() {
  redirect("/");
}
