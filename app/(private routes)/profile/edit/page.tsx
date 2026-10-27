"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { updateMe } from "@/lib/api/clientApi";
import { getApiError } from "@/lib/api/errors";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

export default function EditProfile() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const mutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      router.push("/profile");
      router.refresh();
    },
  });
  async function formAction(data: FormData) {
    try {
      await mutation.mutateAsync({
        username: String(data.get("username") ?? "").trim(),
      });
    } catch {
      return;
    }
  }
  if (!user) return <p>Loading profile...</p>;
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        <Image
          src={
            user.avatar ||
            "https://ac.goit.global/fullstack/react/default-avatar.jpg"
          }
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />
        <form className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={user.username}
              required
              maxLength={100}
              className={css.input}
            />
          </div>
          <p>Email: {user.email}</p>
          {mutation.isError && (
            <p role="alert">
              {getApiError(mutation.error, "Could not update your profile.")}
            </p>
          )}
          <div className={css.actions}>
            <button
              type="submit"
              formAction={formAction}
              className={css.saveButton}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              disabled={mutation.isPending}
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
