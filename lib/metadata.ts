import type { Metadata } from "next";

export const siteUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
export function pageMetadata(
  title: string,
  description: string,
  path = "/",
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: new URL(path, siteUrl).toString(),
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub — personal notes application",
        },
      ],
    },
  };
}
