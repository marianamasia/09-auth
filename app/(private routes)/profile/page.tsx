import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getMe } from "@/lib/api/serverApi";
import { pageMetadata } from "@/lib/metadata";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  ...pageMetadata(
    "Profile | NoteHub",
    "View your NoteHub profile and account details.",
    "/profile",
  ),
  robots: { index: false, follow: false },
};

export default async function Profile() {
  const user = await getMe();
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link
            href="/profile/edit"
            prefetch={false}
            className={css.editProfileButton}
          >
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
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
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
