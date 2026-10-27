"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "@/lib/api/clientApi";
import { getApiError } from "@/lib/api/errors";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: async (user) => {
      await queryClient.cancelQueries();
      queryClient.clear();
      setUser(user);
      router.replace("/profile");
      router.refresh();
    },
  });
  async function formAction(data: FormData) {
    try {
      await mutation.mutateAsync({
        email: String(data.get("email") ?? "").trim(),
        password: String(data.get("password") ?? ""),
      });
    } catch {
      return;
    }
  }
  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={css.input}
            required
          />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            className={css.input}
            required
          />
        </div>
        <div className={css.actions}>
          <button
            type="submit"
            formAction={formAction}
            className={css.submitButton}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Please wait..." : "Register"}
          </button>
        </div>
        {mutation.isError && (
          <p className={css.error} role="alert">
            {getApiError(
              mutation.error,
              "Could not create your account. Please try again.",
            )}
          </p>
        )}
      </form>
    </main>
  );
}
