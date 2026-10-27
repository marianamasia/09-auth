import { siteUrl } from "@/lib/metadata";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { fetchNotes } from "@/lib/api/serverApi";
import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const selectedTag = slug[0];

  if (
    slug.length !== 1 ||
    (selectedTag !== "all" && !tags.some((tag) => tag === selectedTag))
  ) {
    notFound();
  }

  const filterName = selectedTag === "all" ? "All notes" : selectedTag;
  const title = `${filterName} | NoteHub`;
  const description =
    selectedTag === "all"
      ? "Browse and search all your notes in NoteHub."
      : `Browse and search notes tagged ${selectedTag} in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/notes/filter/${selectedTag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub — filtered notes",
        },
      ],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;
  const selectedTag = slug[0];
  const tag = tags.find((item) => item === selectedTag);

  if (slug.length !== 1 || (selectedTag !== "all" && !tag)) {
    notFound();
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={selectedTag} tag={tag} />
    </HydrationBoundary>
  );
}
