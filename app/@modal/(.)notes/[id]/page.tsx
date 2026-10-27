import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { redirect } from "next/navigation";
import { fetchNoteById, getMe } from "@/lib/api/serverApi";
import NotePreviewClient from "./NotePreview.client";

interface NotePreviewProps {
  params: Promise<{ id: string }>;
}

export default async function NotePreview({ params }: NotePreviewProps) {
  try {
    await getMe();
  } catch (error) {
    if (isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0))
      redirect("/sign-in");
    throw error;
  }
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient />
    </HydrationBoundary>
  );
}
