"use client";

import { useParams } from "next/navigation";
import TitleDetails from "@/components/TitleDetails";

export default function SeriesDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <TitleDetails mediaType="tv" id={Number(id)} />;
}
