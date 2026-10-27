import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAxiosError } from "axios";
import { getMe } from "@/lib/api/serverApi";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  if (cookieStore.has("accessToken")) {
    let signedIn = false;
    try {
      await getMe();
      signedIn = true;
    } catch (error) {
      if (
        !isAxiosError(error) ||
        ![401, 403].includes(error.response?.status ?? 0)
      )
        throw error;
    }
    if (signedIn) redirect("/profile");
  }
  return <>{children}</>;
}
