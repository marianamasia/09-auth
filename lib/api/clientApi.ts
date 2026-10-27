import { api } from "./api";
import type { Note, NoteDraft } from "@/types/note";
import type { User } from "@/types/user";
import type {
  FetchNotesParams,
  FetchNotesResponse,
  SessionResponse,
} from "./types";

interface AuthCredentials {
  email: string;
  password: string;
}
interface UpdateUserParams {
  username: string;
}

export async function fetchNotes(
  params: FetchNotesParams,
): Promise<FetchNotesResponse> {
  return (await api.get<FetchNotesResponse>("/notes", { params })).data;
}
export async function fetchNoteById(id: string): Promise<Note> {
  return (await api.get<Note>(`/notes/${id}`)).data;
}
export async function createNote(note: NoteDraft): Promise<Note> {
  return (await api.post<Note>("/notes", note)).data;
}
export async function deleteNote(id: string): Promise<Note> {
  return (await api.delete<Note>(`/notes/${id}`)).data;
}
export async function register(credentials: AuthCredentials): Promise<User> {
  return (await api.post<User>("/auth/register", credentials)).data;
}
export async function login(credentials: AuthCredentials): Promise<User> {
  return (await api.post<User>("/auth/login", credentials)).data;
}
export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
export async function checkSession(signal?: AbortSignal): Promise<boolean> {
  return (await api.get<SessionResponse>("/auth/session", { signal })).data
    .success;
}
export async function getMe(signal?: AbortSignal): Promise<User> {
  return (await api.get<User>("/users/me", { signal })).data;
}
export async function updateMe(user: UpdateUserParams): Promise<User> {
  return (await api.patch<User>("/users/me", user)).data;
}
