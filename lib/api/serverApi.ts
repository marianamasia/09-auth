import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type {
  FetchNotesParams,
  FetchNotesResponse,
  SessionResponse,
} from "./types";

async function cookieHeaders(cookieHeader?: string) {
  return { Cookie: cookieHeader ?? (await cookies()).toString() };
}
export async function fetchNotes(
  params: FetchNotesParams,
): Promise<FetchNotesResponse> {
  return (
    await api.get<FetchNotesResponse>("/notes", {
      params,
      headers: await cookieHeaders(),
    })
  ).data;
}
export const fetchNoteById = cache(async (id: string): Promise<Note> => {
  return (
    await api.get<Note>(`/notes/${id}`, { headers: await cookieHeaders() })
  ).data;
});
export const getMe = cache(async (cookieHeader?: string): Promise<User> => {
  return (
    await api.get<User>("/users/me", {
      headers: await cookieHeaders(cookieHeader),
    })
  ).data;
});
// Keep the response headers: Proxy must forward refreshed session cookies.
export async function checkSession(cookieHeader?: string) {
  return api.get<SessionResponse>("/auth/session", {
    headers: await cookieHeaders(cookieHeader),
  });
}
