"use client";

import { useParams } from "next/navigation";
import TitleDetails from "@/components/TitleDetails";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <TitleDetails mediaType="movie" id={Number(id)} />;
}
