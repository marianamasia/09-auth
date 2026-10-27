import type { ReactNode } from "react";
import { isAxiosError } from "axios";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/serverApi";

export default async function PrivateLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  try {
    await getMe();
  } catch (error) {
    if (isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0))
      redirect("/sign-in");
    throw error;
  }
  return (
    <>
      {children}
      {modal}
    </>
  );
}
