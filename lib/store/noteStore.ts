import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoteDraft } from "@/types/note";

interface NoteStore {
  draft: NoteDraft;
  setDraft: (note: Partial<NoteDraft>) => void;
  clearDraft: () => void;
}

const initialDraft: NoteDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (note) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...note,
          },
        })),

      clearDraft: () => set({ draft: { ...initialDraft } }),
    }),
    {
      name: "notehub-draft",
      partialize: (state) => ({ draft: state.draft }),
      skipHydration: true,
    },
  ),
);
