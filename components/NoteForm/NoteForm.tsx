"use client";

import { useRouter } from "next/navigation";
import css from "./NoteForm.module.css";
import { useEffect, useState } from "react";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      clearDraft();
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes/filter/all");
    },
  });
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    async function restoreDraft() {
      await useNoteStore.persist.rehydrate();
      setIsHydrated(true);
    }

    void restoreDraft();
  }, []);
  async function formAction(formData: FormData) {
    try {
      await mutation.mutateAsync({
        title: String(formData.get("title") ?? ""),
        content: String(formData.get("content") ?? ""),
        tag: String(formData.get("tag")) as NoteTag,
      });
    } catch {
      return;
    }
  }
  if (!isHydrated) {
    return <p>Loading draft...</p>;
  }
  return (
    <form className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          required
          minLength={3}
          maxLength={50}
          defaultValue={draft.title}
          onChange={(event) => setDraft({ title: event.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          maxLength={500}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={(event) => setDraft({ content: event.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          defaultValue={draft.tag}
          onChange={(event) => setDraft({ tag: event.target.value as NoteTag })}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>
      {mutation.isError && (
        <p className={css.error}>
          Could not create the note. Please try again.
        </p>
      )}
      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button
          type="submit"
          formAction={formAction}
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
