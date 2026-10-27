import type { Note, NoteTag } from "@/types/note";

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
export interface SessionResponse {
  success: boolean;
}
